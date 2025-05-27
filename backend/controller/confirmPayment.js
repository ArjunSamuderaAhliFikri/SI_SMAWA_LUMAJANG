const moment = require("moment");
const db = require("../config/mysql.js");
const formatDateINA = require("../logic/formatDateINA.js");

const getDateTime = moment().format("LLLL");
const date = formatDateINA(getDateTime);

const confirmPayment = async (req, res) => {
  const { id } = req.params;

  try {
    const confirmationPayment = await db.execute(
      "UPDATE paymentstudents SET image = ?, isPaidOff = ?, isPaidOn = ? WHERE id = ?",
      [req.file.filename, "Menunggu Konfirmasi", date, id]
    );

    if (confirmationPayment) {
      return res.json({
        msg: "Bukti pembayaran anda berhasil terkirim, silahkan tunggu beberapa saat untuk menunggu konfirmasi dari admin!",
      });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = confirmPayment;
