const express = require("express");
const { verifyToken } = require("../middleware/verifytoken");
const asyncHandler = require("../middleware/asyncHandler");
const router = express.Router();

const {
  saveProgress,
  getSessionProgress,
} = require("../controller/progressController");
router.post("/save", verifyToken, asyncHandler(saveProgress));
router.get(
  "/:userId/:lessonId/:sessionId",
  verifyToken,
  asyncHandler(getSessionProgress),
);
module.exports = router;
