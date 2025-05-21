import mongoose from "mongoose";

const notifSchema = new mongoose.Schema({
  newNotif: { type: mongoose.Schema.Types.Mixed },
});

const notifModel = mongoose.model("notif", notifSchema);

export default notifModel;
