const moment = require("moment");
const db = require("../config/mysql.js");

const formatDateINA = require("../logic/formatDateINA.js");
const getDateTime = moment().format("LLLL");
const date = formatDateINA(getDateTime);

const updateMedia = async (req, res) => {
  const { title, oldTitle, descriptionPost } = req.params;
  try {
    // KETIKA ADMIN MEMPERBARUI POSTINGAN DENGAN MENGUNGGAH FOTO
    if (oldTitle && req.file) {
      const editMedia = await db.execute(
        "UPDATE media_news SET title = ?, image = ?, description = ?, datePost = ? WHERE title = ?",
        [title, req.file.filename, descriptionPost, date, oldTitle]
      );

      if (!editMedia) {
        return res.json({ err: "Gagal memperbarui postingan!" });
      }

      return res.json({ msg: "Berhasil memperbarui postingan!" });
    }

    // KETIKA ADMIN MEMPERBARUI POSTINGAN HANYA MENGUBAH JUDUL DAN DESKRIPSI SAJA
    if (oldTitle && !req.file) {
      const editMedia = await db.execute(
        "UPDATE media_news SET title = ?, description = ?, datePost = ? WHERE title = ?",
        [title, descriptionPost, date, oldTitle]
      );

      if (!editMedia) {
        return res.json({ err: "Gagal memperbarui postingan!" });
      }

      return res.json({ msg: "Berhasil memperbarui postingan!" });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = updateMedia;
