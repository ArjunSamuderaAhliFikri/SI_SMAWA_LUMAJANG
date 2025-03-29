const Siswa = require("../models/siswa");

module.exports = async (req, res) => {
  const { username, password, nomorHP, role } = req.body;
  const findStudent = await Siswa.findOne({ username });
  const checkNomorHP = await Siswa.findOne({ nomorHP });

  if (findStudent || checkNomorHP) {
    return res.json({ msg: "Siswa sudah terdaftar!" });
  }

  if (!username || !nomorHP) {
    return res.json({ msg: "Formulir harus terisi terlebih dahulu!" });
  }

  const siswaBaru = new Siswa({
    username,
    password,
    nomorHP,
    role,
  });

  const simpanSiswa = await siswaBaru.save();

  if (simpanSiswa) {
    return res.json({ msg: `Siswa ${username} Sudah berhasil ditambahkan!` });
  }
};
