const db = require("../config/mysql.js");

const addNewClass = async (req, res) => {
  const { kelas } = req.body;
  try {
    const newClass = await db.execute("INSERT INTO kelas(kelas) VALUES(?)", [
      kelas,
    ]);

    if (newClass) {
      return res.json({ msg: "Berhasil menambahkan kelas baru!" });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = addNewClass;
