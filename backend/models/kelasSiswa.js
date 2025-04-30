const mongoose = require("mongoose");

const studentClassSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  kelas: [String],
});

const KelasSiswa = mongoose.model("kela", studentClassSchema);

module.exports = KelasSiswa;
