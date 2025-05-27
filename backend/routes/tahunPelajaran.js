const express = require("express");
const router = express.Router();

const getTahunPelajaran = require("../controller/getTahunPelajaran.js");
const editTahunPelajaran = require("../controller/editTahunPelajaran.js");
const deleteTahunPelajaran = require("../controller/deleteTahunPelajaran.js");
const addTahunPelajaran = require("../controller/addTahunPelajaran.js");

router.get("/", getTahunPelajaran);

router.post("/", addTahunPelajaran);

router.put("/:hidden/:currentText", editTahunPelajaran);

router.delete("/:tapel", deleteTahunPelajaran);

module.exports = router;
