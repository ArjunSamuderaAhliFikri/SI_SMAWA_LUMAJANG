const mongoose = require("mongoose");

const mediaUploadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },

  datePost: {
    type: String,
    required: true,
  },
});

const MediaUpload = mongoose.model("media", mediaUploadSchema);

module.exports = MediaUpload;
