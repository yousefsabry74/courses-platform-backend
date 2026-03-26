const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken, allowedTo } = require("../middleware/verifytoken");
const { upload } = require("../controller/avatarcontroller");
const {
  getAllUsers,
  register,
  login,
} = require("../controller/usercontroller");
const router = express.Router();
router.get("/", verifyToken, asyncHandler(getAllUsers));
router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post(
  "/avatar",
  upload.single("avatar"),
  asyncHandler((req, res) => {
    res.status(200).json({ message: "uploaded successfully", data: req.file });
  }),
);
module.exports = router;
