const db = require("../config/mysql.js");

const addNewAdmin = async (req, res) => {
  const { username, password, nomorHP, role } = req.body;

  try {
    const isAdded = await db.execute(
      "INSERT INTO admin(username, password, nomorHP, role) VALUES(?, ?, ?, ?)",
      [username, password, nomorHP, role]
    );

    if (!isAdded) {
      return res.json({
        err: `Menambahkan ${username} sebagai ${role} gagal!`,
      });
    }

    return res
      .status(200)
      .json({ msg: `Menambahkan ${username} sebagai ${role} berhasil!` });
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = addNewAdmin;
