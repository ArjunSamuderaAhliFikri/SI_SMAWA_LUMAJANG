const db = require("../config/mysql.js");

const editClass = async (req, res) => {
  const { oldClass, newClass } = req.params;
  try {
    const isEditClass = await db.execute(
      "UPDATE kelas SET kelas = ? WHERE kelas = ?",
      [newClass, oldClass]
    );

    if (isEditClass) {
      return res.json({ msg: `Data kelas ${oldClass} berhasil diperbarui!` });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = editClass;
