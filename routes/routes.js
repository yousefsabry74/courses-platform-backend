const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken, allowedTo } = require("../middleware/verifytoken");
const { upload } = require("../controller/covercontroller");

const router = express.Router();
const {
  getAllCourses,
  postAllCourses,
  patchCourses,
  deleteCourse,
  getSingleCourse,
  generateQuizForCourse,
} = require("../controller/coursecontroller");
router.post(
  "/course/cover",
  verifyToken,
  upload.single("courseCover"),
  allowedTo("teacher"),
  asyncHandler(async (req, res) => {
    res.json({
      message: "uploaded successfully",
      data: req.file,
    });
  }),
);
router.get("/", asyncHandler(getAllCourses));
router.get("/course", asyncHandler(getSingleCourse));
router.post("/", verifyToken, allowedTo("teacher"), asyncHandler(postAllCourses));
router.post(
  "/:id/generate-quiz",
  verifyToken,
  allowedTo("teacher"),
  asyncHandler(generateQuizForCourse),
);
router.patch(
  "/:id",
  verifyToken,
  allowedTo("teacher"),
  asyncHandler(patchCourses),
);
router.delete(
  "/:id",
  verifyToken,
  allowedTo("teacher"),
  asyncHandler(deleteCourse),
);

module.exports = router;
