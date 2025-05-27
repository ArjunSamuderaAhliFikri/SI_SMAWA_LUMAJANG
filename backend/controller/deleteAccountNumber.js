const db = require("../config/mysql.js");

const deleteAccountNumber = async (req, res) => {
  const { account } = req.params;
  try {
    const deleteAccountNumber = await db.execute(
      `DELETE FROM nomor_rekening WHERE rekening = ?`,
      [account]
    );

    if (!deleteAccountNumber) {
      return res.status(401).json({
        err: `Gagal menghapus nomor rekening ${account}, terjadi kesalahan!`,
      });
    }

    return res
      .status(200)
      .json({ msg: `Nomor rekening ${account} berhasil dihapus!` });
  } catch (error) {
    return res.status(401).json({ err: error });
  }
};

module.exports = deleteAccountNumber;
