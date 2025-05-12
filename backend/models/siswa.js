const mongoose = require("mongoose");

const siswaSchema = new mongoose.Schema({
  role: String,
  username: String,
  password: String,
  nomorHP: String,
  kelas: String,
  tapel: String,
  nisn: String,
  nextGrade: {
    type: Number,
    default: Date.now() + 1000 * 60 * 60 * 24 * 365,
  },
});

const Siswa = mongoose.model("siswas", siswaSchema);

module.exports = Siswa;
