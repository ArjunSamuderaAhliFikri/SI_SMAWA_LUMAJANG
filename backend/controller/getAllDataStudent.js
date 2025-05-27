const db = require("../config/mysql.js");

const getAllStudent = async (req, res) => {
  try {
    const [getStudents] = await db.execute("SELECT * FROM students");

    if (getStudents) {
      return res.json({ siswa: getStudents });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = getAllStudent;
