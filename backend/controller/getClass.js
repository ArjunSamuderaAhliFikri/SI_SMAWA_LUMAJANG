const db = require("../config/mysql.js");

const getClass = async (req, res) => {
  try {
    const [kelas] = await db.execute("SELECT * FROM kelas");

    return res.status(200).json({ kelas });
  } catch (error) {
    return console.error(error);
  }
};

module.exports = getClass;
