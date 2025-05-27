const db = require("../config/mysql.js");

const retrieveDataByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const [retrieveData] = await db.execute(
      "SELECT * FROM paymentstudents WHERE namaSiswa = ?",
      [username]
    );

    if (retrieveData) {
      return res.json({ data: retrieveData });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = retrieveDataByUsername;
