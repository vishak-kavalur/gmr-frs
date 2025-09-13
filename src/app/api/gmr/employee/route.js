import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { updateFaceDB } from "../utils";

// MongoDB connection
const uri = process.env.MONGODB_URI+"/gmr" || "";
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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
  isActive: { type: Boolean, default: true },
  managerName: { type: String, required: true },
  managerPhone: { type: String, required: true },
  managerEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  gender: { type: String, required: true }, //M, F
  touchpoints: {type: String, required: true}, // Possible values: APOC_IN, APOC_OUT, NOB_IN, NOB_OUT, PTB_IN, PTB_OUT
});

const Employee =
  mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

// POST: Create a new employee
export async function POST(request) {
  console.log("###### 1 ######");
  try {
    console.log("###### 2 ######");
    const body = await request.json();
    console.log("body:", body);
    const {
      empId,
      empName,
      phNo,
      email,
      bloodGroup,
      emergencyContact,
      department,
      entityName,
      empImage,
      qr,
      managerName,
      managerPhone,
      managerEmail,
      touchpoints,
      gender,
    } = body;

    console.log("BODY:", body);
    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ empId });
    if (existingEmployee) {
      return NextResponse.json(
        { status: "error", message: "Employee already exists", data: null },
        { status: 400 }
      );
    }

    // Create new employee
    const newEmployee = new Employee({
      empId,
      empName,
      phNo,
      email,
      bloodGroup,
      emergencyContact,
      department,
      entityName,
      empImage,
      qr,
      managerName,
      managerPhone,
      managerEmail,
      touchpoints,
      gender,
    });

    const createdEmployee = await newEmployee.save();
    console.log("Created Employee:", createdEmployee);
    // Update Face database
    if (createdEmployee.empImage) {
      console.log("Updating Face DB for employee:", createdEmployee._id);
      await updateFaceDB(createdEmployee._id, body.empImage);
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Employee created successfully",
        data: createdEmployee,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating employee:", error);
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

// GET: Retrieve an employee by empId
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const empId = searchParams.get("empId");

  if (!empId) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing required parameter: empId",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const query = {
      empId: { $regex: empId, $options: "i" }, // Fuzzy search using regex with case-insensitivity
    };
    const employee = await Employee.find(query);

    if (!employee) {
      return NextResponse.json(
        { status: "error", message: "Employee not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Employee fetched successfully",
        data: employee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching employee:", error);
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

// PUT: Update an employee's details
export async function PUT(request) {
  try {
    const body = await request.json();
    const { empId } = body;

    if (!empId) {
      return NextResponse.json(
        {
          status: "error",
          message: "Missing required field: empId",
          data: null,
        },
        { status: 400 }
      );
    }

    // Exclude empId from being updated
    const updateFields = { ...body, updatedAt: new Date() };
    delete updateFields.empId; // Ensure empId is not updated

    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId },
      updateFields,
      { new: true }
    );

    if (!updatedEmployee) {
      return NextResponse.json(
        { status: "error", message: "No employee found to update", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Employee updated successfully",
        data: updatedEmployee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating employee:", error);
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

// DELETE: Mark an employee as inactive
export async function DELETE(request) {
  const body = await request.json();
  const { empId } = body;

  if (!empId) {
    return NextResponse.json(
      {
        status: "error",
        message: "Missing required parameter: empId",
        data: null,
      },
      { status: 400 }
    );
  }

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedEmployee) {
      return NextResponse.json(
        {
          status: "error",
          message: "No employee found to mark inactive",
          data: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Employee marked as inactive successfully",
        data: updatedEmployee,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking employee as inactive:", error);
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
\