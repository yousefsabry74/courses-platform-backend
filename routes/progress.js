const express = require("express");
const { verifyToken, allowedTo } = require("../middleware/verifytoken");
const asyncHandler = require("../middleware/asyncHandler");
const router = express.Router();

const {
  saveProgress,
  getSessionProgress,
  saveQuizResult,
  getMyQuizResult,
  getMyQuizResults,
  getTeacherQuizOverview,
} = require("../controller/progressController");

router.post("/save", verifyToken, asyncHandler(saveProgress));
router.post("/quiz", verifyToken, asyncHandler(saveQuizResult));
router.get("/quiz-results/me", verifyToken, asyncHandler(getMyQuizResults));
router.get(
  "/quiz-results/teacher-overview",
  verifyToken,
  allowedTo("teacher"),
  asyncHandler(getTeacherQuizOverview),
);
router.get("/quiz/:lessonId/:sessionId", verifyToken, asyncHandler(getMyQuizResult));
router.get(
  "/:userId/:lessonId/:sessionId",
  verifyToken,
  asyncHandler(getSessionProgress),
);
module.exports = router;
