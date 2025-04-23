const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  nomorHP: String,
  status: String,
});

const Admin = mongoose.model("admins", AdminSchema);
module.exports = Admin;
