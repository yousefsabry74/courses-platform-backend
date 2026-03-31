const mongoose = require("mongoose");

const quizResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: Number, required: true },
  sessionId: { type: Number, required: true },
  answers: mongoose.Schema.Types.Mixed, // { questionId: answer }
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now },
});
const QuizResult = mongoose.model("QuizResult", quizResultSchema);
module.exports = { Session };
