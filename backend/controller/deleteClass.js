const db = require("../config/mysql.js");

const deleteClass = async (req, res) => {
  const { kelas } = req.params;
  try {
    const newClass = await db.execute("DELETE FROM kelas WHERE kelas = ?", [
      kelas,
    ]);

    if (newClass) {
      return res.json({ msg: `Data kelas ${kelas} berhasil dihapus!` });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = deleteClass;
