import mongoose from "mongoose";
import { NextResponse } from "next/server";
import moment from "moment";

// MongoDB connection
const uri = process.env.MONGODB_URI + "/gmr" || "";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  empId: { type: String, required: true },
  empName: { type: String, required: true },
  department: { type: String, required: true },
  entityName: { type: String, required: true },
  livePhoto: { type: String, required: true },
  touchPoint: { type: String, required: true }, //Possible values: APOC_IN, APOC_OUT, NOB_IN, NOB_OUT, PTB_IN, PTB_OUT
  entryType: { type: String, required: true },
  attendanceType: { type: String, default: "QR" }, // Possible values: QR, FACE
  similarity: { type: String, default: 999 }, // Used for face recognition
  createdAt: { type: Date, default: Date.now },
});

// Employee Schema
const employeeSchema = new mongoose.Schema({
  empId: { type: String, unique: true, required: true },
  empName: { type: String, required: true },
  phNo: { type: String, required: true },
  email: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  emergencyContact: { type: String, required: true },
  department: { type: String, required: true },
  entityName: { type: String, required: true }, //Possible values: GMR, Innovex, Aero, GID, WAISL, SSC
  empImage: { type: String, required: true },
  qr: { type: String, required: true },
  managerName: { type: String, required: true },
  managerPhone: { type: String, required: true },
  managerEmail: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  touchpoints: { type: String, required: true },
  gender: { type: String, required: true }, //M, F
});

const Transaction =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

// POST: Create a new transaction
export async function POST(request) {
  try {
    const body = await request.json();
    const { empId, liveImage, touchPoint } = body;

    // Fetch employee details
    const employee = await Employee.findOne({ empId });
    if (!employee) {
      return NextResponse.json(
        { status: "error", message: "Employee not found", data: null },
        { status: 404 }
      );
    }

    // Determine entryType
    const entryType = touchPoint.includes("_IN") ? "IN" : "OUT";
    const attendanceType = 'QR';

    // Create new transaction
    const newTransaction = new Transaction({
      empId: employee.empId,
      empName: employee.empName,
      department: employee.department,
      entityName: employee.entityName,
      livePhoto: liveImage,
      touchPoint,
      entryType,
      attendanceType,
      similarity: "999",
    });

    const createdTransaction = await newTransaction.save();

    return NextResponse.json(
      {
        status: "success",
        message: "Transaction created successfully",
        data: {
          empId: employee.empId,
          empName: employee.empName,
          department: employee.department,
          entityName: employee.entityName,
          empImage: employee.empImage,
          touchPoint,
          entryType,
          attendanceType,
          similarity: "999",
          createdAt: createdTransaction.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
        data: null,
      },
      { status: 500 }
    );
  }
}

// GET: Retrieve transactions based on search parameters
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const empId = searchParams.get("empId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  const query = {};
  if (empId) query.empId = empId;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      // const start = new Date(Number(startDate));
      const start = new Date(parseInt(startDate))
        .toISOString()
        .replace("Z", "+00:00");
      console.log("Parsed startDate:", start);
      if (moment(start).isValid()) {
        query.createdAt.$gte = start;
      } else {
        console.error("Invalid startDate:", startDate);
        return NextResponse.json(
          {
            status: "error",
            message: "Invalid startDate format",
            data: null,
          },
          { status: 400 }
        );
      }
    }
    if (endDate) {
      // const end = new Date(Number(endDate));
      let endPlusOne = new Date(parseInt(endDate)).getTime() + 24 * 60 * 60 * 1000 - 1;
      console.log("end", endPlusOne);
      const end = new Date(parseInt(endPlusOne))
        .toISOString()
        .replace("Z", "+00:00");
      console.log("Parsed endDate:", end);
      if (moment(end).isValid()) {
        query.createdAt.$lte = end;
      } else {
        console.error("Invalid endDate:", endDate);
        return NextResponse.json(
          {
            status: "error",
            message: "Invalid endDate format",
            data: null,
          },
          { status: 400 }
        );
      }
    }
  }

  try {
    console.log("QUERY:", query);
    // Fetch transactions based on the query
    const transactions = await Transaction.find(query);

    return NextResponse.json(
      {
        status: "success",
        message: "Transactions fetched successfully",
        data: transactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Internal Server Error",
        data: null,
      },
      { status: 500 }
    );
  }
}
