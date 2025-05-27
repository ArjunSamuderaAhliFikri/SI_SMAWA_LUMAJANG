const express = require("express");
const router = express.Router();

const getClass = require("../controller/getClass.js");
const addNewClass = require("../controller/addNewClass.js");
const editClass = require("../controller/editClass.js");
const deleteClass = require("../controller/deleteClass.js");

const authMiddleware = require("../middleware/authMiddleware.js");

router.get("/", authMiddleware, getClass);

router.post("/", addNewClass);

router.put("/:oldClass/:newClass", editClass);

router.delete("/:kelas", deleteClass);

module.exports = router;
