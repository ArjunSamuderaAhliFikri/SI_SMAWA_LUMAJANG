const mongoose = require("mongoose");

const siswaSchema = new mongoose.Schema({
  role: String,
  username: String,
  password: String,
  nomorHP: String,
  tahunPembelajaran: String,
});

const Siswa = mongoose.model("Siswa", siswaSchema);

module.exports = Siswa;
