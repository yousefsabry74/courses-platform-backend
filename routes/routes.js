const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();
const {
  getAllCourses,
  postAllCourses,
  patchCousrs,
  deleteCourse,
} = require("../controller/coursecontroller");

router.get("/", asyncHandler(getAllCourses));
router.post("/", asyncHandler(postAllCourses));

router.patch("/:id", asyncHandler(patchCousrs));
router.delete("/:id", asyncHandler(deleteCourse));

module.exports = router;
