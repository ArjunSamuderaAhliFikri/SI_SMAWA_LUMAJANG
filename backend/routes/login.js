const mongoose = require("mongoose");
const User = require("../models/user");
const connectDB = require("../config/db");

async function handleLoginUser(username, password) {
  connectDB();

  const user = await User.findOne({ username });
  if (!user) {
    return {
      message: "Username tidak terdaftar!",
    };
  }
}

module.exports = handleLoginUser;
