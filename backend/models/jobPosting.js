import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  title: { type: String },
  department: { type: String },
  description: { type: String },
  PhoneNumber: { type: String },
  requirements: { type: Date },
  postedDate: { type: Date },
  status: { type: String, enum: ["Open", "Closed"] },
});

const employeeModel = mongoose.model("employee", employeeSchema);

export default employeeModel;
