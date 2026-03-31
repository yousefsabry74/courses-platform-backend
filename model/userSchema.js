const { required } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    age: {
      type: Number,
      min: 10,
      max: 100,
    },
    role: {
      type: String,
      enum: ["student", "teacher"],
      default: "student",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    class: {
      type: String,
      required: true,
    },
    grade: {
      type: Number,
    },
    displayName: {
      type: String,
    },
    avatar: {
      type: String,
      default: "uploads/avatars/avatar.png",
    },
  },
  { timestamps: true },
);
const User = mongoose.model("User", userSchema);
module.exports = { User };
