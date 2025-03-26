const mongoose = require("mongoose");

const siswaSchema = new mongoose.Schema({
  role: String,
  username: String,
  email: String,
  password: String,
  nomorHP: String,
  infoKelas: String,
});

const Siswa = mongoose.model("Siswa", siswaSchema);

module.exports = Siswa;
