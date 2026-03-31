const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken, allowedTo } = require("../middleware/verifytoken");
const { upload } = require("../controller/avatarcontroller");
const {
  getAllUsers,
  register,
  login,
} = require("../controller/usercontroller");
const rateLimit = require("express-rate-limit");

const router = express.Router();
router.get("/", verifyToken, allowedTo("teacher"), asyncHandler(getAllUsers));
router.post("/register", asyncHandler(register));
router.post(
  "/login",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 15,
  }),
  asyncHandler(login),
);
router.post(
  "/avatar",
  verifyToken,
  upload.single("avatar"),
  asyncHandler((req, res) => {
    res.status(200).json({ message: "uploaded successfully", data: req.file });
  }),
);
module.exports = router;
