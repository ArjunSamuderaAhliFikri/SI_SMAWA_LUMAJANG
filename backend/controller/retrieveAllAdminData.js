const db = require("../config/mysql.js");

const retrieveAllAdminData = async (req, res) => {
  const [admins] = await db.execute("SELECT * FROM admin");

  if (admins) {
    return res.status(200).json({ data: admins });
  }
};

module.exports = retrieveAllAdminData;
