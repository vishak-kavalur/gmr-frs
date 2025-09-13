import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { oneToNMatch } from "../utils";

const uri = process.env.MONGODB_URI || "";
const client = new MongoClient(uri);

async function runWithDb(callback, context) {
  try {
    await client.connect();
    const db = client.db("gmr");
    const collection = db.collection("employees");
    return await callback(db, collection, context);
  } catch (error) {
    console.error("Database operation error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
        data: null,
      },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

const processTransaction = async (
  db,
  collection,
  employee,
  result,
  liveImage,
  touchPoint,
  entryType,
  attendanceType
) => {
  console.log('employee', employee);
  if (!employee) {
    return NextResponse.json(
      { status: "error", message: "Record not found", data: null },
      { status: 404 }
    );
  }

  console.log("@@@@@@@: 1");
  const authorised = employee.touchpoints.search(touchPoint) !== -1;
  console.log("@@@@@@@: 2", authorised);
  const date = new Date(Date.now());
  const isoString = date.toISOString();
  const timestamp = isoString.replace("Z", "+00:00");
  if (!authorised) {
    console.log("@@@@@@@: 2", authorised);
    await db.collection("unauthorised").insertOne({
      empId: employee.empId,
      empName: employee.empName,
      department: employee.department,
      entityName: employee.entityName,
      livePhoto: liveImage,
      touchPoint,
      entryType,
      attendanceType,
      similarity: result.similarity,
      createdAt: timestamp,
    });

    return NextResponse.json(
      {
        status: "error",
        message: "Unauthorised access detected",
        data: {
          empId: employee.empId,
          empName: employee.empName,
          department: employee.department,
          entityName: employee.entityName,
          empImage: employee.empImage,
          touchPoint,
          entryType,
          attendanceType,
          similarity: result.similarity,
          createdAt: timestamp,
        },
      },
      { status: 403 }
    );
  }

  


  // const timestamp = Date.now();
  const transaction = await db.collection("transactions").insertOne({
    empId: employee.empId,
    empName: employee.empName,
    department: employee.department,
    entityName: employee.entityName,
    livePhoto: liveImage,
    touchPoint,
    entryType,
    attendanceType,
    similarity: result.similarity,
    createdAt: timestamp,
  });
  const createdTransaction = await collection.findOne({
    _id: transaction.insertedId,
  });

  let score = result.similarity;

  return NextResponse.json(
    {
      status: "success",
      message: "Record fetched successfully",
      similarity: score,
      data: {
        empId: employee.empId,
        empName: employee.empName,
        department: employee.department,
        entityName: employee.entityName,
        empImage: employee.empImage,
        touchPoint,
        entryType,
        attendanceType,
        similarity: result.similarity,
        createdAt: timestamp,
      },
    },
    { status: 200 }
  );

};



export async function POST(request) {
  const body = await request.json();
  const { liveImage, touchPoint } = body;
  console.log("body", body);

  // Check if image is present in the request body
  if (!liveImage || !touchPoint) {
    return NextResponse.json(
      {
        status: "error",
        message: "Either Live image or Touch Point is required",
        data: null,
      },
      { status: 400 }
    );
  }

  // Determine entryType
  const entryType = touchPoint.includes("_IN") ? "IN" : "OUT";
  const attendanceType = "FACE";

  const result = await oneToNMatch(liveImage);
  console.log("result", result);

  return await runWithDb(
    async (db, collection, { result, body }) => {
      if (!result.result[0].subjects[0].subject || result.result[0].subjects[0].similarity < 0.9) {
        await db.collection("transactions").insertOne({
          empId: "NA",
          empName: "NA",
          department: "NA",
          entityName: "NA",
          livePhoto: liveImage,
          touchPoint: touchPoint,
          entryType,
          attendanceType,
        });
        return NextResponse.json(
          { status: "error", message: "Record not found", data: null },
          { status: 500 }
        );
      }

      console.log("Subject ID:", result.result[0].subjects[0]);
      let id = new ObjectId(result.result[0].subjects[0].subject);
      const employee = await collection.findOne({ _id: id });
      

      return await processTransaction(
        db,
        collection,
        employee,
        result.result[0].subjects[0].similarity,
        liveImage,
        touchPoint,
        entryType,
        attendanceType
      );
    },
    { result: result, body: body }
  );
}

