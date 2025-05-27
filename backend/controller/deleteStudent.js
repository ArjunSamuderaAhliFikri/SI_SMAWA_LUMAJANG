const db = require("../config/mysql.js");

const deleteStudent = async (req, res) => {
  const { username } = req.params;
  try {
    const isDeleteStudent = await db.execute(
      "DELETE FROM students WHERE username = ?",
      [username]
    );

    if (isDeleteStudent) {
      return res.json({ msg: `Data Siswa ${username} berhasil dihapus!` });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = deleteStudent;
