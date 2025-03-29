const mongoose = require("mongoose");

const siswaSchema = new mongoose.Schema({
  role: String,
  username: String,
  password: String,
  nomorHP: String,
  kelas: String,
  tapel: String,
});

const Siswa = mongoose.model("siswas", siswaSchema);

module.exports = Siswa;
