const Siswa = require("../models/siswa");

module.exports = async (req, res) => {
  const { username, password, nomorHP, role, kelas, tapel, nisn } = req.body;

  const findStudent = await Siswa.findOne({ username });
  const checkNomorHP = await Siswa.findOne({ nomorHP });
  const checkNISN = await Siswa.findOne({ nisn });

  if (findStudent || checkNomorHP || checkNISN) {
    return res.json({ err: "Siswa sudah terdaftar!" });
  }

  if (!username || !nomorHP) {
    return res.json({ err: "Formulir harus terisi terlebih dahulu!" });
  }

  const siswaBaru = new Siswa({
    username,
    password,
    nomorHP,
    role,
    kelas,
    tapel,
    nisn,
  });

  const simpanSiswa = await siswaBaru.save();

  if (simpanSiswa) {
    return res.json({ msg: `Siswa ${username} Sudah berhasil ditambahkan!` });
  }
};
