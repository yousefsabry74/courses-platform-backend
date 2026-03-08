const express = require("express");
const Joi = require("joi");
const errorHandler = require("./middleware/errorHandler");
const mongoose = require("mongoose");
const router = require("./routes/routes");
const app = express();
const dotenv = require("dotenv");
const port = process.env.PORT || 8000;
const db = process.env.DBURL;
dotenv.config();

app.use(express.json());

mongoose.connect(db).then(() => {
  console.log("Connected Successfully");
});
app.use("/api/courses", router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port 3000`);
});
