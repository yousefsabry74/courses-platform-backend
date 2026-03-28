var multer = require("multer");
const fs = require("fs");
const path = require("path");
const avatarsDir = path.join(__dirname, "../uploads/avatars");
fs.mkdirSync(avatarsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);
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
    } else {
      cb(new Error("only images are allowed"), false);
    }
  },
  limits: {
    fileSize: 1000000,
  },
});
module.exports = { upload };
