import mongoose from "mongoose";

const performanceReviewShema = new mongoose.Schema({
  ReviewID: { type: String },
  EmployeeID: { type: String },
  ReviewPeriodStart: { type: String },
  ReviewPeriodEnd: { type: String },
  ReviewID: { type: String },
  OverallRating: { type: String },
  Strengths: { type: String },
  AreasForImprovement: { type: String },
  Comments: { type: String },
});

const performanceReviewModel = mongoose.model(
  "Performance_Review",
  performanceReviewShema
);

export default performanceReviewModel;
