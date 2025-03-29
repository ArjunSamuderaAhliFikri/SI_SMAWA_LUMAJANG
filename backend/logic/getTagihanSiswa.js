const BillStudent = require("../models/billStudent");

module.exports = async (req, res) => {
  const billingStudents = await BillStudent.find();

  return res.json({ tagihan: billingStudents });
};
