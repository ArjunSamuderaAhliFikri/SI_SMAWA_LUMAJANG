const Siswa = require("../models/siswa.js");

const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const siswa = await Siswa.find();

  return res.json({ siswa });
});

module.exports = router;
