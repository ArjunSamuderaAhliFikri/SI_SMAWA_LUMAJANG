const express = require("express");
const router = express.Router();

const addNewStudent = require("../controller/addNewStudent.js");
const getStudentNames = require("../controller/getStudentNames.js");
const getAllDataStudent = require("../controller/getAllDataStudent.js");
const detailStudent = require("../controller/detailStudent.js");
const updateDataStudent = require("../controller/updateDataStudent.js");
const deleteStudent = require("../controller/deleteStudent.js");

router.get("/", getStudentNames);

router.get("/data-siswa", getAllDataStudent);

router.get("/detailSiswa/:username", detailStudent);

router.post("/", addNewStudent);

router.put("/", updateDataStudent);

router.delete("/:username", deleteStudent);

module.exports = router;
