const {
  updateCoursesValidator,
  postCoursesValidator,
} = require("../validation/course.validation");
const { Course } = require("../model/courseSchema");
const { options } = require("joi");
const getAllCourses = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const courses = await Course.find().skip(skip).limit(limit);
  res.status(200).send(courses);
};
const getSingleCourse = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 5;
  const skip = (page - 1) * limit;
  const { price, maxPrice, minPrice, sort, title } = req.query;
  const filter = {};
  if (price) {
    filter.price = Number(price);
  } else {
    filter.price = {};
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (minPrice) filter.price.$gte = Number(minPrice);
  }
  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }
  const sortOption = { createdAt: -1 };
  if (sort) {
    const order = sort.startsWith("-") ? -1 : 1;
    const field = sort.startsWith("-") ? sort.slice(1) : sort;
    sortOption[field] = order;
  }
  const procducts = await Course.find(filter).skip(skip).sort(sortOption);
  res.status(200).json({
    totalResult: procducts.length,
    status: "success",
    data: procducts,
  });
};
const postAllCourses = async (req, res) => {
  const { error, value } = postCoursesValidator(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  const course = await Course.create(value);

  res.status(201).json({ status: "success", data: { course } });
};
const patchCousrs = async (req, res) => {
  const { error, value } = updateCoursesValidator(req.body);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }

  const id = req.params.id;
  const course = await Course.findByIdAndUpdate(
    id,
    { $set: value },
    {
      new: true,
      runValidators: true,
    },
  );
  if (!course)
    return res
      .status(404)
      .json({ status: "error", message: "Course not found" });

  res.json({ status: "success", data: course });
};
const deleteCourse = async (req, res) => {
  const id = req.params.id;

  const course = await Course.findByIdAndDelete(id);
  if (!course)
    return res
      .status(404)
      .json({ status: "error", message: "Course not found" });

  res.json({
    status: "success",
    message: "course have been deleted",
  });
};
module.exports = {
  getAllCourses,
  postAllCourses,
  patchCousrs,
  deleteCourse,
  getSingleCourse,
};
