const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: Number, required: true },
  sessionId: { type: Number, required: true },
  completed: { type: Boolean, default: false },
  tabsCompleted: [String], // ["objectives", "activities"]
  activitiesDone: [Number],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Progress = mongoose.model("Progress", progressSchema);
module.exports = { Progress };
