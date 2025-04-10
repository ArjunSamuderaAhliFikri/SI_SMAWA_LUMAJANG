const BillStudent = require("../models/billStudent");

module.exports = async (req, res) => {
  const { username } = req.params;

  const findBilling = await BillStudent.find({ namaSiswa: username });

  if (!findBilling) {
    return res.json({ msg: "Tidak ada tagihan!" });
  }

  return res.json({ msg: `Tagihan untuk siswa ${username}`, findBilling });
};
