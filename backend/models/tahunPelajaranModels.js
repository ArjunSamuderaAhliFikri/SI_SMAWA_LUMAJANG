const mongoose = require("mongoose");

const TapelSchema = new mongoose.Schema({
  XII: String,
  XI: String,
  XI: String,
});

const TahunPelajaran = mongoose.model("tapel", TapelSchema);

module.exports = TahunPelajaran;
