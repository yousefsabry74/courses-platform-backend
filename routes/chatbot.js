const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken } = require("../middleware/verifytoken");
const {
  askChatbot,
  reviewAnswers,
} = require("../controller/chatbotController");

const router = express.Router();

router.post("/ask", verifyToken, asyncHandler(askChatbot));
router.post("/review-answers", verifyToken, asyncHandler(reviewAnswers));

module.exports = router;
