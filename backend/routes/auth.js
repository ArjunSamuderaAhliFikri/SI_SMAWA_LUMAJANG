const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json("Pengguna sudah didaftarkan!");
    }

    user = new User({ username, password, role });
    await user.save();

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, "secretkey", { expiresIn: "1h" }, (error, token) => {
      if (error) throw error;
      res.json({ token });
    });
  } catch (error) {
    console.error(`Error Message : ${error.message}`);
    res.status(500).send("Server Error");
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ msg: "Error Credentials" });
    }

    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, "secretkey", { expiresIn: "1h" }, (error, token) => {
      if (error) throw error;
      res.json({ token });
    });
  } catch (error) {
    console.error(`Error Message : ${error.message}`);

    res.status(500).send("Server Error");
  }
});

module.exports = router;
