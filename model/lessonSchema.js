const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  id: { type: Number, unique: true, required: true },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  color: { type: String, required: true },
  sessions: { type: Number, required: true },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = { Lesson };
