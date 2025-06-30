const db = require("../config/mysql.js");

const deleteDataAdminById = async (req, res) => {
  const { id } = req.params;

  const isDeleted = await db.execute("DELETE FROM admin WHERE id = ?", [id]);

  if (!isDeleted) {
    return res.json({ err: "Gagal menghapus data admin!" });
  }

  return res.status(200).json({ msg: "Data admin berhasil terhapus!" });
};

module.exports = deleteDataAdminById;
