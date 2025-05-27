const db = require("../config/mysql.js");

const deleteMedia = async (req, res) => {
  const { title } = req.params;
  try {
    const isDeleteMedia = await db.execute(
      "DELETE FROM media_news WHERE title = ?",
      [title]
    );

    if (!isDeleteMedia) {
      return res.json({ err: "Gagal menghapus postingan!" });
    }

    return res.json({ msg: "Berhasil menghapus postingan!" });
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = deleteMedia;
