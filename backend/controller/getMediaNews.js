const db = require("../config/mysql.js");

const getMediaNews = async (req, res) => {
  try {
    const [getMedia] = await db.execute(`SELECT * FROM media_news`);
    if (getMedia) {
      return res.json({ data: getMedia });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = getMediaNews;
