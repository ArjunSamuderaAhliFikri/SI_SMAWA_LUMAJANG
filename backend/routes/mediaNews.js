const express = require("express");
const router = express.Router();

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/test");
  },
  filename: function (req, file, cb) {
    file.setUniq = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.setUniq}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

const getMediaNews = require("../controller/getMediaNews.js");
const addNewMedia = require("../controller/addNewMedia.js");
const detailMedia = require("../controller/detailMedia.js");
const updateMedia = require("../controller/updateMedia.js");
const deleteMedia = require("../controller/deleteMedia.js");
const retrieveMediaById = require("../controller/retrieveMediaById.js");
const byTitle = require("../controller/byTitle.js");

router.get("/", getMediaNews);

router.get("/:id", retrieveMediaById);

router.get("/:title", upload.single("media-photo"), detailMedia);

router.get("/by-title/:title", byTitle);

router.put(
  "/:title/:oldTitle/:descriptionPost",
  upload.single("media-photo"),
  updateMedia
);

router.post(
  "/post-information/:title/:description",
  upload.single("media-photo"),
  addNewMedia
);

router.delete("/:title", deleteMedia);

module.exports = router;
