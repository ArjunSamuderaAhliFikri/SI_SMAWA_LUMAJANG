const Siswa = require("../models/siswa");

module.exports = async (req, res) => {
  const { username, email, password, nomorHP, infoKelas, role } = req.body;
  const findStudent = await Siswa.findOne({ username });
  const checkEmail = await Siswa.findOne({ email });
  const checkNomorHP = await Siswa.findOne({ nomorHP });

  if (findStudent || checkEmail || checkNomorHP) {
    return res.json({ msg: "Siswa sudah terdaftar!" });
  }

  if (!username || !email || !nomorHP) {
    return res.json({ msg: "Formulir harus terisi terlebih dahulu!" });
  }

  const siswaBaru = new Siswa({
    username,
    email,
    password,
    nomorHP,
    infoKelas,
    role,
  });

  const simpanSiswa = await siswaBaru.save();

  if (simpanSiswa) {
    return res.json({ msg: `Siswa ${username} Sudah berhasil ditambahkan!` });
  }
};
