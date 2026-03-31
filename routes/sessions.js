const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken, allowedTo } = require("../middleware/verifytoken");
const {
  editSession,
  getAllSessions,
  getSingleSession,
} = require("../controller/sessioncontroller");
const router = express.Router({ mergeParams: true });
router.get("/", asyncHandler(getAllSessions));
router.get("/:sessionId", asyncHandler(getSingleSession));
router.patch(
  "/:sessionId",
  verifyToken,
  allowedTo("teacher"),
  asyncHandler(editSession),
);

module.exports = router;
