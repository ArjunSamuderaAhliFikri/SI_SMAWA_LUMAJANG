const multer = require("multer");

function storageMediaPost(path) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path);
    },

    filename: function (req, file, cb) {
      cb(null, `${file.originalname}`);
    },
  });
}

const storage = storageMediaPost("../frontend/public/img/mediaPost");

const uploadMedia = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

module.exports = uploadMedia;
