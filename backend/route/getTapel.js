const TahunPelajaran = require("../models/tahunPelajaranModels");

module.exports = async (req, res) => {
  const getTapel = await TahunPelajaran.find();

  const { tapel } = getTapel[0];

  return res.json({ tapel });
};
