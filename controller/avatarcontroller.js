var multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const path = require("path");

    cb(null, path.join(__dirname, "../uploads/avatars"));
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
