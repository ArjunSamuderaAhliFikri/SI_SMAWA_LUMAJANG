const db = require("../config/mysql");

const addNewStudent = async (req, res) => {
  const { username, password, kelas, tapel, nomorHP, nisn } = req.body;
  try {
    const addStudent = await db.execute(
      `INSERT INTO students(username, password, kelas, tapel, nomorHP, nisn) 
      VALUES("${username}", "${password}", "${kelas}", "${tapel}", "${nomorHP}", "${nisn}");`
    );

    if (!addStudent) {
      return res.status(401).json({ err: "Gagal Menambahkan Siswa!" });
    }

    return res.status(200).json({ msg: `${username} berhasil di daftarkan!` });
  } catch (error) {
    return res.status(401).json({ err: error });
  }
};

module.exports = addNewStudent;
