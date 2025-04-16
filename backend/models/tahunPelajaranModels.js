const mongoose = require("mongoose");

const TapelSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  tapel: [String],
});

const TahunPelajaran = mongoose.model("tapel", TapelSchema);

module.exports = TahunPelajaran;
