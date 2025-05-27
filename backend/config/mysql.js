const dotenv = require("dotenv");

dotenv.config();

const mysql = require("mysql2/promise");

// const pool = mysql.createPool({
//   host: process.env.HOST_DB,
//   user: process.env.USER_DB,
//   password: process.env.PASSWORD,
//   database: process.env.DATABASE,
// });

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "arjunsaf270606",
  database: "si_smawalumajang",
});

module.exports = pool;
