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

const postMediaStudent = require("../controller/postMediaStudent.js");
const getAllPost = require("../controller/getAllPost.js");
const confirmPostStudent = require("../controller/confirmPostStudent.js");
const deletePostStudent = require("../controller/deletePostStudent.js");

router.get("/", getAllPost);

router.put("/confirm-post/:id", confirmPostStudent);

router.post(
  "/:id/:title/:description",
  upload.single("avatar"),
  postMediaStudent
);

router.delete("/:id", deletePostStudent);

module.exports = router;
