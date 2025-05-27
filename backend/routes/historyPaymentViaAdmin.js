const express = require("express");
const router = express.Router();

const getHistoryPaymentById = require("../controller/getHistoryPaymentById.js");

router.get("/:id", getHistoryPaymentById);

module.exports = router;
