const {
  updateCoursesValidator,
  postCoursesValidator,
} = require("../validation/course.validation");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite-preview",
});
const { Course } = require("../model/courseSchema");
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
  if (!value.description) {
    const prompt = `أكتب وصفاً احترافياً وجذاباً لكورس تعليمي عنوانه: "${value.title}". الوصف يجب أن يكون باللغة العربية ومشجعاً للطلاب.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    value.description = response.text();
  }
  const course = await Course.create(value);

  res.status(201).json({ status: "success", data: { course } });
};
const patchCourses = async (req, res) => {
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
const generateQuizForCourse = async (req, res) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const prompt = `بناءً على وصف الكورس التالي: "${course.description}"، 
    قم بتوليد 3 أسئلة اختيار من متعدد (MCQ) باللغة العربية.
    يجب أن يكون الرد بصيغة JSON فقط كصفوف داخل مصفوفة (Array of Objects) بهذا الشكل:
    [{"question": "...", "options": ["...", "...", "..."], "correctAnswer": "..."}]`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const quizData = JSON.parse(response.text());

  course.quizzes = quizData;
  await course.save();

  res.status(200).json({ status: "success", data: course.quizzes });
};

module.exports = {
  getAllCourses,
  postAllCourses,
  patchCourses,
  deleteCourse,
  getSingleCourse,
  generateQuizForCourse,
};
