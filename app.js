const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const Joi = require("joi");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const courseRouter = require("./routes/routes");
const userRouter = require("./routes/user");
const lessonRouter = require("./routes/lessons");
const SessionRouter = require("./routes/sessions");
const chatbotRouter = require("./routes/chatbot");
const progressRouter = require("./routes/progress");

const rateLimit = require("express-rate-limit");
const app = express();
const { xss } = require("express-xss-sanitizer");
const options = {
  maxDepth: 50, // default 100
};

const cors = require("cors");
const helmet = require("helmet");
var hpp = require("hpp");
app.use(hpp());
app.use(helmet());
app.use(cors());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});
app.use(limiter);
app.set("trust proxy", 1);
app.use(xss(options));

app.use("/uploads", express.static("uploads"));
const port = process.env.PORT || 8000;
const db = process.env.DBURL;
app.use(express.json());
mongoose
  .connect(db)
  .then(() => {
    console.log("Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/api/courses", courseRouter);
app.use("/api/users", userRouter);
app.use("/api/lessons", lessonRouter);
app.use("/api/chatbot", chatbotRouter);
app.use("/api/progress", progressRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
