const db = require("../config/mysql.js");

const detailStudent = async (req, res) => {
  const { username } = req.params;
  try {
    const [getStudent] = await db.execute(
      "SELECT * FROM students WHERE username = ?",
      [username]
    );

    if (getStudent) {
      return res.json({ siswa: getStudent });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = detailStudent;
