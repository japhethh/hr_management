  import mongoose from "mongoose";

  const recruitmentShema = new mongoose.Schema({
    title: { type: String, trim: true },
    department: { type: String },
    postDate: { type: Date },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    application: { type: String },
  });

  const recruitmentModel = mongoose.model("recruitment", recruitmentShema);

  export default recruitmentModel;

