const db = require("../config/mysql.js");

const addAccountNumber = async (req, res) => {
  const { atasNama, rekening } = req.body;

  try {
    const newAccountNumber =
      await db.execute(`INSERT INTO nomor_rekening(atasNama, rekening, status) 
        VALUES("${atasNama}", "${rekening}", "${1}");`);

    if (!newAccountNumber) {
      return res
        .status(500)
        .json({ err: "Tidak dapat menambahkan data, terjadi kesalahan!" });
    }

    return res.status(200).json({
      msg: `Nomor rekening ${atasNama} berhasil ditambahkan!`,
    });
  } catch (error) {
    return res.status(401).json({ err: error });
  }
};

module.exports = addAccountNumber;
