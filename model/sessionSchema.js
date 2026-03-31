const mongoose = require("mongoose");
const sessionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lesson",
    required: true,
  },
  title: { type: String, required: true },
  icon: { type: String, required: true },
  available: { type: Boolean, default: true },
  objectives: [
    {
      icon: String,
      text: String,
    },
  ],
  activities: [
    {
      id: Number,
      type: String, // "content", "exercise", "video"
      title: String,
      content: String,
      chatbotContext: String,
    },
  ],
  quiz: {
    questions: [
      {
        id: Number,
        text: String,
        type: String, // "multiple", "true-false", "essay"
        options: [String],
        correctAnswer: String,
        points: Number,
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Session = mongoose.model("Session", sessionSchema);
module.exports = { Session };
