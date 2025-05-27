const db = require("../config/mysql");

const getAdmin = async (username, password) => {
  try {
    const [isAdmin] = await db.execute(
      `SELECT * FROM admin WHERE username = ? AND password = ?`,
      [username, password]
    );

    return isAdmin;
  } catch (error) {
    return error.message;
  }
};

module.exports = getAdmin;
