const db = require("../config/mysql.js");

const editAccountNumber = async (req, res) => {
  const { oldAccount } = req.params;
  const { atasNama, newAccountNumber } = req.body;

  try {
    const editAccount = db.execute(
      `UPDATE nomor_rekening SET atasNama = "${atasNama}", rekening = "${newAccountNumber}", status = ${1} WHERE rekening = "${oldAccount}";`
    );

    if (!editAccount) {
      return res.status(500).json({ err: `${oldAccount} gagal di update!` });
    }

    return res
      .status(200)
      .json({ msg: `Nomor rekening ${oldAccount} berhasil diperbarui!` });
  } catch (error) {
    return res.status(500).json({ err: error });
  }
};

module.exports = editAccountNumber;
