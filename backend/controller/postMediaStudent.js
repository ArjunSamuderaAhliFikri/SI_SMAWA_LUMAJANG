const moment = require("moment");

const db = require("../config/mysql.js");

const formatDateINA = require("../logic/formatDateINA.js");
const getDateTime = moment().format("LLLL");
const date = formatDateINA(getDateTime);

const postMediaStudent = async (req, res) => {
  const { id, title, description } = req.params;

  if (!req.file || !title || !description) {
    return res.json({ err: "Form harus terisi lengkap!" });
  }

  try {
    const postMedia = await db.execute(
      "INSERT INTO information_submission(authorId, title, description, datePost, image) VALUES(?, ?, ? ,?, ?)",
      [id, title, description, date, req.file.filename]
    );

    if (!postMedia) {
      return res.json({ err: "Gagal mengunggah media!" });
    }

    return res.json({ msg: "Berhasil!" });
  } catch (error) {
    return res.json({ err: error.message });
  }
};

module.exports = postMediaStudent;
