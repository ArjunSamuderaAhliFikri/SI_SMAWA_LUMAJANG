const db = require("../config/mysql.js");

const searchStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [getStudent] = await db.execute(
      "SELECT * FROM students WHERE id = ?",
      [id]
    );

    if (getStudent) {
      return res.json({ siswa: getStudent });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = searchStudentById;
