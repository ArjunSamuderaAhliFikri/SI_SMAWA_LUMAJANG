const moment = require("moment");
const db = require("../config/mysql.js");

const formatDateINA = require("../logic/formatDateINA.js");
const getDateTime = moment().format("LLLL");
const date = formatDateINA(getDateTime);

const adminConfirmPayment = async (req, res) => {
  const { id } = req.params;
  try {
    const confirmPayment = await db.execute(
      "UPDATE paymentstudents SET isPaidOff = ?, isPaidOn = ? WHERE id = ?",
      ["Tuntas", date, id]
    );

    if (confirmPayment) {
      return res.json({ msg: "Pembayaran berhasil di konfirmasi!" });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = adminConfirmPayment;
