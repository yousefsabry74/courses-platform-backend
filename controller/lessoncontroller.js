const { Lesson } = require("../model/lessonSchema");
const { lessonValidation } = require("../validation/lesson.validation");
const getAllLessons = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const lessons = await Lesson.find().skip(skip).limit(limit);
  res.status(200).json({
    message: "success",
    data: lessons,
  });
};
const getSingleLesson = async (req, res) => {
  const id = req.params.id;
  const lesson = await Lesson.findById(id);
  if (!lesson) {
    return res
      .status(404)
      .json({ status: "error", message: "lesson not found" });
  }
  res.status(200).json({ status: "success", data: lesson });
};
const postLesson = async (req, res) => {
  console.log("URL:", req.originalUrl);
  console.log("BODY:", req.body);
  const { value, error } = lessonValidation(req.body);
  console.log(value);
  console.log(error);
  if (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
  const lesson = await Lesson.create(value);
  console.log(lesson);
  res.status(201).json({ status: "success", data: lesson.title });
};
const editLesson = async (req, res) => {
  const id = req.params.id;
  const lesson = await Lesson.findById(id);
  if (!lesson) {
    return res
      .status(404)
      .json({ status: "error", message: "lesson not found" });
  }
  const { error, value } = lessonValidation(req.body);
  if (error) {
    return res.status(400).json({ status: "error", message: error.message });
  }
  await Lesson.findByIdAndUpdate(id, value);
  res.status(200).json({ status: "success", data: value });
};
const deleteLesson = async (req, res) => {
  const id = req.params.id;
  const lesson = await Lesson.findByIdAndDelete(id);
  if (!lesson)
    return res
      .status(404)
      .json({ status: "error", message: "Lesson not found" });

  res.json({
    status: "success",
    message: "lesson have been deleted",
  });
};
module.exports = { getAllLessons, getSingleLesson, postLesson, editLesson,deleteLesson };
