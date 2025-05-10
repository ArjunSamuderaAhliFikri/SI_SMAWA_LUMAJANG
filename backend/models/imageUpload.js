const mongoose = require("mongoose");

const imageUploadSchema = new mongoose.Schema({
  title: String,
  originalname: String,
});

const ImageUpload = mongoose.model("image-upload", imageUploadSchema);

module.exports = ImageUpload;
