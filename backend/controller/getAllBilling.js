const db = require("../config/mysql.js");

const getAllBilling = async (req, res) => {
  try {
    const [getBillingStudents] = await db.execute(
      "SELECT * FROM paymentstudents"
    );

    if (getBillingStudents) {
      return res.json({ tagihan: getBillingStudents });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = getAllBilling;
