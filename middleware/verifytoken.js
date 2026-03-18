const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const userAuth = req.headers["authorization"] || req.headers["Authorization"];
  if (!userAuth) {
    return res.status(401).json({ message: "token is required" });
  }
  const token = userAuth.split(" ")[1];

  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.currentUser = verify;
    next();
  } catch (error) {
    return res.status(403).json({ message: "unauthorized access" });
  }
};
const allowedTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.currentUser.role)) {
      return res.status(403).json({ message: "unauthorized access" });
    }
    next();
  };
};
module.exports = { verifyToken, allowedTo };
