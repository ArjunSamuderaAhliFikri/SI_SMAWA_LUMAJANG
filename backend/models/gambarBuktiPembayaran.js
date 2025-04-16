const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  atasNama: String,
  nominal: String,
  infoBilling: String,
  filename: String,
  contentType: String,
  data: Buffer,
});

const FotoBuktiPembayaran = mongoose.model("File", fileSchema);
module.exports = FotoBuktiPembayaran;
