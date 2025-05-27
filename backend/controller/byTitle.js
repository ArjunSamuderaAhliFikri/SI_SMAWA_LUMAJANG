const db = require("../config/mysql.js");

const byTitle = async (req, res) => {
  const { title } = req.params;
  try {
    const [byTitle] = await db.execute(
      `SELECT * FROM media_news WHERE title = ?`,
      [title]
    );

    if (!byTitle) {
      return res.status(200).json({ err: `Gagal mengambil data` });
    }

    return res.json({ data: byTitle });
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = byTitle;
