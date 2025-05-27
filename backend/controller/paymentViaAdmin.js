const moment = require("moment");

const db = require("../config/mysql.js");

const formatDateINA = require("../logic/formatDateINA.js");
const getDateTime = moment().format("LLLL");
const date = formatDateINA(getDateTime);

const paymentViaAdmin = async (req, res) => {
  const { id, username, nominal } = req.params;
  try {
    const [totalBilling] = await db.execute(
      "SELECT * FROM paymentstudents WHERE id = ?",
      [id]
    );

    const calculateCurrentBilling =
      parseInt(totalBilling[0].jumlahTagihanSiswa) - parseInt(nominal);

    if (calculateCurrentBilling < 0) {
      return res.json({
        msg: "Monimal yang di inputkan melebihi nominal saat ini, silahkan mengisi form dengan benar!",
      });
    }

    if (req.file) {
      await db.execute(
        "UPDATE paymentstudents SET jumlahTagihanSiswa = ?, image = ?, isPaidOff = ?, isPaidOn = ? WHERE id = ?",
        [
          calculateCurrentBilling,
          req.file.filename,
          "Pembayaran Via Admin",
          date,
          id,
        ]
      );
    } else {
      await db.execute(
        "UPDATE paymentstudents SET jumlahTagihanSiswa = ?, isPaidOff = ?, isPaidOn = ? WHERE id = ?",
        [calculateCurrentBilling, "Pembayaran Via Admin", date, id]
      );
    }

    const viaAdmin = await db.execute(
      "INSERT INTO history_payment_student(namaSiswa, user_id, nominal, createdAt) VALUES(?, ?, ?, ?)",
      [username, totalBilling[0].id, nominal, date]
    );

    if (viaAdmin) {
      if (calculateCurrentBilling == 0) {
        const [getAllHistoryPaymentStudent] = await db.execute(
          "SELECT * FROM history_payment_student WHERE user_id =?",
          [id]
        );
        const calculateAll = await getAllHistoryPaymentStudent.reduce(
          (acc, curr) => (acc += parseInt(curr.nominal)),
          0
        );

        await db.execute(
          "UPDATE paymentstudents SET jumlahTagihanSiswa = ?, isPaidOff = ?, isPaidOn = ? WHERE id = ?",
          [calculateAll, "Tuntas", date, id]
        );

        return res.json({ msg: "Pembayaran telah lunas!" });
      }

      return res.json({
        msg: "Pembayaran via admin telah berhasil!",
        image: `http://localhost:3000/test/${req.file.filename}`,
      });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = paymentViaAdmin;
