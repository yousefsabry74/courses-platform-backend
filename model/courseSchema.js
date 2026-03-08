const mongoose = require("mongoose");
const { Schema } = mongoose;
const dotenv = require("dotenv");
dotenv.config();
const db = process.env.DBURL;


const courseSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});
const Course = mongoose.model("Course", courseSchema);
module.exports = { Course };
