const {
  updateCoursesValidator,
  postCoursesValidator,
} = require("../validation/course.validation");
const { Course } = require("../model/courseSchema");
const getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.status(200).send(courses);
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
module.exports = { getAllCourses, postAllCourses, patchCousrs, deleteCourse };
