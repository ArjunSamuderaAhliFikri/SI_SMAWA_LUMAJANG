const mongoose = require("mongoose");

const accountNumberSchema = new mongoose.Schema({
  accountNumber: {
    type: String,
    required: false,
  },
  atasNama: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: false,
    default: true,
  },
});

const AccountNumber = mongoose.model("accountnumber", accountNumberSchema);

module.exports = AccountNumber;
