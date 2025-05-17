import mongoose from "mongoose";

const compentencySchema = new mongoose.Schema({
  EmployeeID: { type: mongoose.Schema.Types.ObjectId, ref: "employee" },
  SkillName: { type: String },
  SkillLevel: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
  },
  Certification: { type: String },
  CertificationDate: { type: Date },
});

const compentencyModel = mongoose.model("competency", compentencySchema);

export default compentencyModel;
