const db = require("../config/mysql.js");

const deletePostStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const deletePost = await db.execute(
      "DELETE FROM information_submission WHERE id = ?",
      [id]
    );

    if (!deletePost) {
      return res.json({ err: "Gagal menghapus pengajuaun postingan!" });
    }

    return res.json({ msg: "Pengajuan postingan berhasil dihapus" });
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = deletePostStudent;
