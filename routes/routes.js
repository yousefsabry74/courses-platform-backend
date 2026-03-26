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
  allowedTo("admin"),
  asyncHandler(async (req, res) => {
    res.json({
      message: "uploaded successfully",
      data: req.file,
    });
  }),
);
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
