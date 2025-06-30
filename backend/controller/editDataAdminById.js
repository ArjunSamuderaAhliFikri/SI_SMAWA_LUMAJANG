const db = require("../config/mysql.js");

const editDataAdminById = async (req, res) => {
  const { id } = req.params;
  const { username, password, nomorHP, role } = req.body;

  const isComplete = await db.execute(
    "UPDATE admin SET username = ?, password = ?, nomorHP = ?, role = ? WHERE id = ?",
    [username, password, nomorHP, role, id]
  );

  if (!isComplete) {
    return res.json({ err: "Gagal memperbarui data admin!" });
  }

  return res.status(200).json({ msg: "Pembaruan data telah berhasil!" });
};

module.exports = editDataAdminById;
