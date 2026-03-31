const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessonId: { type: Number, required: true },
    sessionId: { type: Number, required: true },
    answers: mongoose.Schema.Types.Mixed,
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

quizResultSchema.index(
  { userId: 1, lessonId: 1, sessionId: 1 },
  { unique: true },
);

const QuizResult = mongoose.model("QuizResult", quizResultSchema);
module.exports = { QuizResult };
