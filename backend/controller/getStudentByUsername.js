const db = require("../config/mysql");

const getStudentByUsername = async (username, password) => {
  const [rows] = await db.execute(
    "SELECT * FROM students WHERE username = ? AND password = ?",
    [username, password]
  );

  return rows;
};

module.exports = getStudentByUsername;
