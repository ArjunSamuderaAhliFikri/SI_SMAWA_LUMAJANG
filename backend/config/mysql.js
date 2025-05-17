const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "api2.smawalmj.com",
  user: "smay4278_si_smawalumajang",
  password: "si_smawalumajang717",
  database: "smay4278_si_smawalumajang",
});

module.exports = pool;
