const Siswa = require("../models/siswa");

module.exports = async (req, res) => {
  const getAllStudents = await Siswa.find();

  return res.json({ getAllStudents });
};
