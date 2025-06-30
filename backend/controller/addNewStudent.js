const db = require("../config/mysql");

const addNewStudent = async (req, res) => {
  const {
    username,
    password,
    kelas,
    tapel,
    nomorHP,
    nisn,
    alamatSiswa,
    tanggalLahir,
  } = req.body;
  try {
    const [findStudent] = await db.execute(
      "SELECT * FROM students WHERE username = ? OR nomorHP = ? OR nisn = ?",
      [username, nomorHP, nisn]
    );

    if (findStudent.length > 0) {
      console.log("Benar");
      return res.json({ err: "Data siswa sudah terdaftar!" });
    }

    const addStudent = await db.execute(
      `INSERT INTO students(username, password, kelas, tapel, nomorHP, nisn, alamatSiswa, tanggalLahir) 
      VALUES("${username}", "${password}", "${kelas}", "${tapel}", "${nomorHP}", "${nisn}", "${alamatSiswa}", "${tanggalLahir}");`
    );

    if (!addStudent) {
      return res.status(401).json({ err: "Gagal Menambahkan Siswa!" });
    }

    return res.status(200).json({ msg: `${username} berhasil di daftarkan!` });
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = addNewStudent;
