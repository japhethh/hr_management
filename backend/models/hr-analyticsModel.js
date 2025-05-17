import mongoose from "mongoose";

const hrAnalyticsSchema = new mongoose.Schema({
  AnalyticsID: { type: String },
  EmployeeID: { type: String },
  ReviewID: { type: String },
  AttendanceRate: { type: String },
  AvgHoursWorked: { type: String },
  CompentencyScore: { type: String },
});

const hrAnalyticsModel = mongoose.model("HR_Analytics", hrAnalyticsSchema);

export default hrAnalyticsModel;
