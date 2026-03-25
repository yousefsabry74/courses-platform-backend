const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const Joi = require("joi");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const courseRouter = require("./routes/routes");
const userRouter = require("./routes/user");
const app = express();
const cors = require("cors");
app.use(cors());
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
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
