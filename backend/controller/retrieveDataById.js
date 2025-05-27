const db = require("../config/mysql.js");

const retrieveDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const [retrieveData] = await db.execute(
      "SELECT * FROM paymentstudents WHERE id = ?",
      [id]
    );

    if (retrieveData) {
      return res.json({ siswa: retrieveData });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = retrieveDataById;
