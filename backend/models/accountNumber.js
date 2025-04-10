const mongoose = require("mongoose");

const accountNumberSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: true,
  },
});

const AccountNumber = mongoose.model("accountnumber", accountNumberSchema);

module.exports = AccountNumber;
