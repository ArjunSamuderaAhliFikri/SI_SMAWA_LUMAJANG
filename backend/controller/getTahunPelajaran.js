const db = require("../config/mysql.js");

const getTahunPelajaran = async (req, res) => {
  try {
    const [tapel] = await db.execute("SELECT * FROM tahunpelajaran");

    return res.status(200).json({ tapel });
  } catch (error) {
    return console.error(error);
  }
};

module.exports = getTahunPelajaran;
