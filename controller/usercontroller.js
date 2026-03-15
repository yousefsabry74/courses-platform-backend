const { User } = require("../model/userSchema");
const { registerValidation } = require("../validation/user.validation");
const bcrypt = require("bcrypt");
const saltRounds = 10;
var jwt = require("jsonwebtoken");
const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let users = await User.find({}, { __v: false, password: false })
    .skip(skip)
    .limit(limit);
  res.json({
    status: "success",
    data: { users },
  });
};
const register = async (req, res) => {
  const { error, value } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ message: "invalid input" });
  }
  const { password, email, role, username } = value;
  const oldUser = await User.findOne({ email: email }).select("+password");
  if (oldUser) {
    return res.status(400).json({ message: "User Already Exist" });
  }
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const user = await User.create({
    email: email,
    password: hashedPassword,
    role: role,
    username: username,
  });
  const token = jwt.sign(
    { role, username, user: user.id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );
  res.status(201).json({ message: "success", token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }).select("+password");
  if (!user) {
    return res.status(400).json({ message: "Invalid Email or password" });
  }
  const result = await bcrypt.compare(password, user.password);
  if (!result) {
    return res.status(400).json({ message: "Invalid Email or password" });
  }
  const token = jwt.sign(
    {
      role: user.role,
      id: user.id,
      username: user.username,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "1h",
    },
  );
  res.status(200).json({ message: "succes", token });
};

module.exports = { getAllUsers, register, login };
