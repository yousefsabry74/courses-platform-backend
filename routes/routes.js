const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken, allowedTo } = require("../middleware/verifytoken");

const router = express.Router();
const {
  getAllCourses,
  postAllCourses,
  patchCourses,
  deleteCourse,
  getSingleCourse,
  generateQuizForCourse,
} = require("../controller/coursecontroller");

router.get("/", asyncHandler(getAllCourses));
router.get("/course", asyncHandler(getSingleCourse));
router.post("/", verifyToken, allowedTo("admin"), asyncHandler(postAllCourses));
router.post(
  "/:id/generate-quiz",
  verifyToken,
  allowedTo("admin"),
  asyncHandler(generateQuizForCourse),
);
router.patch(
  "/:id",
  verifyToken,
  allowedTo("admin"),
  asyncHandler(patchCourses),
);
router.delete(
  "/:id",
  verifyToken,
  allowedTo("admin"),
  asyncHandler(deleteCourse),
);

module.exports = router;
