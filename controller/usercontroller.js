const { User } = require("../model/userSchema");
const { registerValidation } = require("../validation/user.validation");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const getAllUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let users = await User.find({}, { __v: false, password: false })
    .skip(skip)
    .limit(limit);
  res.json({ status: "sucess", data: { users } });
};
const register = async (req, res) => {
  const email = req.body.email;
  const oldUser = await User.findOne({ email: email });
  if (oldUser) {
    return res
      .status(400)
      .json({ status: "error", message: "user already exist" });
  }
  const { error, value } = registerValidation(req.body);
  if (error) {
    return res.status(400).send({ status: "error", message: error.message });
  }
  const hashedPassword = await bcrypt.hash(value.password, saltRounds);
  value.password = hashedPassword;
  const user = await User.create(value);
  res
    .status(201)
    .json({
      status: "success",
      data: { username: user.username, age: user.age },
    });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ status: "failed", message: "login failed" });
  }

  const user = await User.findOne({ email: email }).select("+password");

  if (!user) {
    return res
      .status(400)
      .json({ status: "failed", message: "invalid email or password" });
  }

  const matchedPassword = await bcrypt.compare(password, user.password);
  if (!matchedPassword) {
    return res
      .status(400)
      .json({ status: "failed", message: "invalid email or password" });
  }
  return res
    .status(200)
    .json({ status: "success", message: "login succesful" });
};
module.exports = { getAllUsers, register, login };
