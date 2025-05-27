const moment = require("moment");

const db = require("../config/mysql.js");

const formatDateINA = require("../logic/formatDateINA.js");
const getDateTime = moment().format("LLLL");
const date = formatDateINA(getDateTime);

const addNewMedia = async (req, res) => {
  const { title, description } = req.params;
  try {
    const addMedia =
      await db.execute(`INSERT INTO media_news(title, description, image, datePost)
        VALUES("${title}", "${description}", "${req.file.filename}", "${date}");`);

    if (addMedia) {
      return res.json({
        msg: `Postingan telah berhasil dibuat!`,
        image: `http://localhost:3000/test/${req.file.filename}`,
      });
    }
  } catch (error) {
    return res.json({
      err: error,
    });
  }
};

module.exports = addNewMedia;
