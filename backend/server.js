const express = require("express");
const app = express();
const port = 3000;
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const TahunPelajaran = require("./models/tahunPelajaranModels");

const login = require("./route/login.js");
const getTagihanSiswa = require("./route/getTagihanSiswa.js");
const tagihanSiswa = require("./route/tagihanSiswa.js");
const getAllStudents = require("./route/getAllStudents.js");
const getTapel = require("./route/getTapel.js");
const tambahSiswa = require("./route/tambahSiswa.js");
const buatTagihanSiswa = require("./route/buatTagihanSiswa.js");
const buatTagihanSemuaSiswa = require("./route/buatTagihanSemuaSiswa.js");
const verifyToken = require("./middleware/middlewareJWT.js");
const mongoose = require("mongoose");
const AccountNumber = require("./models/accountNumber.js");
const BillStudent = require("./models/billStudent.js");

app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

dotenv.config();

app.get("/testing", verifyToken, (req, res) => {
  return res.send("hello world!");
});

app.get("/tagihan-siswa", getTagihanSiswa);

app.get("/tagihan/:username", tagihanSiswa);

app.get("/siswa", getAllStudents);

app.get("/detail-tagihan/:namaSiswa/:infoBilling", async (req, res) => {
  const { namaSiswa, infoBilling } = req.params;
  // console.log("from server:", req.params);
  const findDetailBilling = await BillStudent.find({
    namaSiswa: namaSiswa,
  });

  const result = findDetailBilling.find(
    (item) =>
      item.catatanSiswa.split(" ").join("") === infoBilling.split(" ").join("")
  );

  if (!result) {
    return res.json({ err: "Tagihan tidak ditemukan!" });
  }

  return res.json({ billing: result, msg: "Tagihan ditemukan!" });
});

app.put("/update-tagihan/:name", async (req, res) => {
  const { namaSiswa, kelasSiswa, jumlahTagihanSiswa } = req.body;
  const { name } = req.params;

  const updateAccountNumber = await BillStudent.findOneAndUpdate(
    { namaSiswa: name },
    { namaSiswa, kelasSiswa, jumlahTagihanSiswa }
  );

  if (!updateAccountNumber) {
    return res.json({ err: "Update tagihan tidak berhasil!" });
  }

  return res.json({ update: updateAccountNumber });
});

app.put("/update-nomor-rekening/:name", async (req, res) => {
  const { newAccountNumber } = req.body;
  const { name } = req.params;

  const updateAccountNumber = await AccountNumber.findOneAndUpdate(
    { accountNumber: name },
    { accountNumber: newAccountNumber }
  );

  if (!updateAccountNumber) {
    return res.json({ err: "Update tagihan tidak berhasil!" });
  }

  return res.json({ update: updateAccountNumber });
});

app.delete("/delete-nomor-rekening/:name", async (req, res) => {
  const { name } = req.params;
  const deleteAccountNumber = await AccountNumber.deleteOne({
    accountNumber: name,
  });

  if (!deleteAccountNumber) {
    return res.json({ err: "Gagal untuk menghapus tagihan!" });
  }

  return res.json({ deleted: name });
});

app.delete("/delete-tagihan-siswa/:name", async (req, res) => {
  const { name } = req.params;
  const deleteDataStudent = await BillStudent.deleteOne({ namaSiswa: name });

  if (!deleteDataStudent) {
    return res.json({ err: "Gagal untuk menghapus tagihan!" });
  }

  return res.json({ deleted: name });
});

app.get("/tapel", getTapel);

app.get("/kelasNTapel", async (req, res) => {
  const getTapel = await TahunPelajaran.find();

  const kelasSchema = new mongoose.Schema({
    kelas: [String],
  });
  const Kelas = mongoose.model("kela", kelasSchema);

  const data = await Kelas.find();
  const setKelas = data[0].kelas;
  const setTapel = getTapel[0];
  return res.json({ kelas: setKelas, tapel: setTapel });
});

app.post("/login", login);

app.post("/tambah_siswa", tambahSiswa);

app.post("/tagihan-siswa", buatTagihanSiswa);

app.post("/buat-semua-tagihan", buatTagihanSemuaSiswa);

app.post("/tambah-nomor-rekening", async (req, res) => {
  const { nomorRekening } = req.body;

  const findAccount = await AccountNumber.findOne({
    accountNumber: nomorRekening,
  });

  if (findAccount) {
    return res.json({ err: "Nomor rekening sudah ada!" });
  }

  const addAccountNumber = new AccountNumber({
    accountNumber: nomorRekening,
    status: true,
  });

  const result = await addAccountNumber.save();

  if (result) {
    return res.json({ message: "Nomor rekening berhasil ditambahkan!" });
  }
});

app.get("/nomor-rekening", async (req, res) => {
  const findAccount = await AccountNumber.find();

  if (!findAccount) {
    return res.json({ err: "Tidak ada nomor rekening!" });
  }

  return res.json({ accounts: findAccount });
});

app.put("/tuntaskan-tagihan/:name", async (req, res) => {
  const { name } = req.params;
  const { namaSiswa, jumlahTagihanSiswa, catatanSiswa } = req.body;

  const findBilling = await BillStudent.findOne({
    namaSiswa: name,
    jumlahTagihanSiswa,
    catatanSiswa,
  });

  if (!findBilling) {
    return res.json({ err: "Tagihan tidak ditemukan!" });
  }

  const updateBilling = await BillStudent.findOneAndUpdate(
    { namaSiswa, jumlahTagihanSiswa, catatanSiswa },
    { isPaidOff: true }
  );

  const result = await updateBilling.save();

  if (!result) {
    return res.json({ err: "Tagihan gagal untuk di tuntaskan!" });
  }

  return res.json({ msg: "Tagihan berhasil di bayar!", billing: result });
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
