const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const { verifyToken, allowedTo } = require("../middleware/verifytoken");
const {
  getAllUsers,
  register,
  login,
} = require("../controller/usercontroller");
const router = express.Router();
router.get("/", verifyToken, asyncHandler(getAllUsers));
router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
module.exports = router;
