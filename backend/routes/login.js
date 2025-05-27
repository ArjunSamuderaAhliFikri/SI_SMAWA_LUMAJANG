const express = require("express");
const router = express.Router();

const handleLogin = require("../controller/handleLogin");

router.post("/", handleLogin);

module.exports = router;
