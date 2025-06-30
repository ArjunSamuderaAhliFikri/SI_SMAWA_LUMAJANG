const db = require("../config/mysql.js");

const retrieveDataAdminById = async (req, res) => {
  const { id } = req.params;
  const [admin] = await db.execute("SELECT * FROM admin WHERE id = ?", [id]);

  if (!admin) {
    return res.json({ err: "Data admin tidak ditemukan!" });
  }

  return res.status(200).json({ data: admin });
};

module.exports = retrieveDataAdminById;
