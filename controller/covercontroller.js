var multer = require("multer");
const fs = require("fs");
const path = require("path");
const coversDir = path.join(__dirname, "../uploads/covers");
fs.mkdirSync(coversDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, coversDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}.${file.mimetype.split("/")[1]}`;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.split("/")[0] == "image") {
      cb(null, true);
    } else cb(new Error("only images are allowed"), false);
  },
  limits: { fileSize: 10000000 },
});
module.exports = { upload };
