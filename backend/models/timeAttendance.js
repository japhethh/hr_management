import mongoose from "mongoose";

const timeAttendanceSchema = new mongoose.Schema({
  EmployeeId: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  workDate: { type: Date },
  ClockIn: { type: String },
  ClockOut: { type: String },
  HoursWorked: { type: Date },
  Status: { type: String, enum: ["Present", "Absent", "Leave", "Late"] },
});

const timeAttendanceModel = mongoose.model(
  "TimeAttendance",
  timeAttendanceSchema
);

export default timeAttendanceModel;
