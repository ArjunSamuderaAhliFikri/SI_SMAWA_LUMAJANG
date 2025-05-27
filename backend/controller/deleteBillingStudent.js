const db = require("../config/mysql.js");

const deleteBillingStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteBilling = await db.execute(
      "DELETE FROM paymentstudents WHERE id = ?",
      [id]
    );

    if (deleteBilling) {
      return res.json({ msg: "Tagihan berhasil dihapus!" });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = deleteBillingStudent;
