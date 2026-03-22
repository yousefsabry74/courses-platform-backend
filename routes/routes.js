const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken, allowedTo } = require("../middleware/verifytoken");

const router = express.Router();
const {
  getAllCourses,
  postAllCourses,
  patchCousrs,
  deleteCourse,
  getSingleCourse,
} = require("../controller/coursecontroller");

router.get("/", asyncHandler(getAllCourses));
router.get("/course", asyncHandler(getSingleCourse));
router.post("/", verifyToken, allowedTo("admin"), asyncHandler(postAllCourses));

router.patch(
  "/:id",
  verifyToken,
  allowedTo("admin"),
  asyncHandler(patchCousrs),
);
router.delete(
  "/:id",
  verifyToken,
  allowedTo("admin"),
  asyncHandler(deleteCourse),
);

module.exports = router;
