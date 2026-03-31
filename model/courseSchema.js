const { required } = require("joi");
const mongoose = require("mongoose");
const { User } = require("./userSchema");
const { Schema } = mongoose;

const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  lessonNumber: Number,
  icon: String,
  available: Boolean,
  totalSessions: Number,
  quizzes: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
    },
  ],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      },
      ratings: { type: Number, min: 1, max: 5 },
      comment: String,
    },
  ],
  courseCover: {
    coverImage: {
      type: String,
      default: "uploads/covers/cover.png",
    },
  },
});
const Course = mongoose.model("Course", courseSchema);
module.exports = { Course };
