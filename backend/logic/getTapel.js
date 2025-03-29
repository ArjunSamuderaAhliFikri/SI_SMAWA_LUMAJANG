const TahunPelajaran = require("../models/tahunPelajaranModels");

module.exports = async (req, res) => {
  const tapel = await TahunPelajaran.find();

  return res.json(tapel[0]);
};
