const db = require("../config/mysql.js");

const retrieveMediaById = async (req, res) => {
  const { id } = req.params;
  try {
    const [mediaById] = await db.execute(
      "SELECT * FROM media_news WHERE id = ?",
      [id]
    );

    if (mediaById) {
      return res.json({ data: mediaById });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = retrieveMediaById;
