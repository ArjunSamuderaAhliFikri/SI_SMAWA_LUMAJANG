const db = require("../config/mysql.js");

const getAccountNumbers = async (req, res) => {
  try {
    const [accounts] = await db.execute("SELECT * FROM nomor_rekening");

    if (!accounts) {
      return res.status(401).json({ err: "Tidak ada nomor rekening!" });
    }

    return res.status(200).json({ accounts });
  } catch (error) {
    return res.status(401).json({ err: error });
  }
};

module.exports = getAccountNumbers;
