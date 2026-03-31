const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken, allowedTo } = require("../middleware/verifytoken");
const {
  getAllLessons,
  getSingleLesson,
  postLesson,
  editLesson,
  deleteLesson,
} = require("../controller/lessoncontroller");
const sessionRouter = require("./sessions");
const router = express.Router();
router.get("/", asyncHandler(getAllLessons));
router.get("/:id", asyncHandler(getSingleLesson));
router.post("/", verifyToken, allowedTo("teacher"), asyncHandler(postLesson));
router.patch(
  "/:id",
  verifyToken,
  allowedTo("teacher"),
  asyncHandler(editLesson),
);
router.delete(
  "/:id",
  verifyToken,
  allowedTo("teacher"),
  asyncHandler(deleteLesson),
);

router.use("/:lessonId/sessions", sessionRouter);

module.exports = router;
