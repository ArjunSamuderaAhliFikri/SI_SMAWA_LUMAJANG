const db = require("../config/mysql.js");

const getHistoryPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    [historyPayment] = await db.execute(
      "SELECT * FROM history_payment_student WHERE user_id = ?",
      [id]
    );

    if (historyPayment) {
      return res.json({ payments: historyPayment });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = getHistoryPaymentById;
