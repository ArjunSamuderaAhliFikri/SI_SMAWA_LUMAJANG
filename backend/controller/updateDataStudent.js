const db = require("../config/mysql.js");

const updateDataStudent = async (req, res) => {
  const { hidden, username, kelas, tapel, nomorHP, nisn } = req.body;
  try {
    const updateStudent = await db.execute(
      "UPDATE students SET username = ?, kelas = ?, tapel = ?, nomorHP = ?, nisn = ? WHERE username = ?",
      [username, kelas, tapel, nomorHP, nisn, hidden]
    );

    if (!updateStudent) {
      return res.json({ err: "Gagal memperbarui data siswa!" });
    }

    return res.json({ msg: `Siswa ${hidden} berhasil diperbarui!` });
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = updateDataStudent;
