const express = require("express");
const router = express.Router();

const getAccountNumbers = require("../controller/getAccountNumbers.js");
const addAccountNumber = require("../controller/addAccountNumber.js");
const editAccountNumber = require("../controller/editAccountNumber.js");
const deleteAccountNumber = require("../controller/deleteAccountNumber.js");

router.get("/", getAccountNumbers);

router.post("/", addAccountNumber);

router.put("/:oldAccount", editAccountNumber);

router.delete("/:account", deleteAccountNumber);

module.exports = router;
