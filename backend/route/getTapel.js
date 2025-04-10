const TahunPelajaran = require("../models/tahunPelajaranModels");

module.exports = async (req, res) => {
  const { kelas } = req.body;
  const getTapel = await TahunPelajaran.find();

  const testing = getTapel[0];

  return res.json(testing);
};
