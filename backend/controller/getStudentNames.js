const db = require("../config/mysql.js");

const getStudentNames = async (req, res) => {
  try {
    const [siswa] = await db.execute("SELECT username FROM students");

    if (!siswa) {
      return res.status(401).json({ err: "Tidak ada Siswa!" });
    }

    return res.status(200).json({ siswa });
  } catch (error) {
    return res.status(401).json({ err: error });
  }
};

module.exports = getStudentNames;
