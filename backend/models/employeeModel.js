import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  FirstName: { type: String },
  LastName: { type: String },
  Email: { type: String },
  PhoneNumber: { type: String },
  HireDate: { type: Date },
  JobTitle: { type: String },
  DepartmentId: { type: String },
  SupervisorId: { type: String },
  status: { type: String, enum: ["Active", "On Leave", "Terminated"] },
});

const employeeModel = mongoose.model("employee", employeeSchema);

export default employeeModel;
