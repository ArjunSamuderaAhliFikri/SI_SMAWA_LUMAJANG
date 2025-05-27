const db = require("../config/mysql.js");

const detailMedia = async (req, res) => {
  const { title } = req.params;
  try {
    const [detailMedia] = await db.execute(
      `SELECT * FROM media_news WHERE title = ?`,
      [title]
    );

    if (!detailMedia) {
      return res.status(200).json({ err: `Gagal mengambil data` });
    }

    return res.json({ data: detailMedia });
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = detailMedia;
