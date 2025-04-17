// core module
const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const jwt = require("jsonwebtoken");
const port = 3000;
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/img/buktiPembayaran");
  },

  filename: function (req, file, cb) {
    file.setUniq = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.setUniq}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50 MB
  },
});

// core module

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
const KelasSiswa = require("./models/kelasSiswa.js");
const FotoBuktiPembayaran = require("./models/gambarBuktiPembayaran.js");
const { verify } = require("crypto");

app.use(cookieParser());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use(express.json({ limit: "50mb" }));

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
  const { namaSiswa, kelasSiswa, jumlahTagihanSiswa, catatanSiswa } = req.body;
  const { name } = req.params;

  const updateAccountNumber = await BillStudent.findOneAndUpdate(
    { namaSiswa: name, catatanSiswa: catatanSiswa },
    { namaSiswa, kelasSiswa, jumlahTagihanSiswa }
  );

  if (!updateAccountNumber) {
    return res.json({ err: "Update tagihan tidak berhasil!" });
  }

  return res.json({ update: updateAccountNumber });
});

app.put("/update-nomor-rekening/:name", async (req, res) => {
  const { newAccountNumber, atasNama } = req.body;
  const { name } = req.params;

  const findAccountNumber = await AccountNumber.findOne({
    accountNumber: newAccountNumber,
  });

  // if (findAccountNumber ) {
  //   return res.json({ err: "Nomor rekening sudah ada!" });
  // }

  const updateAccountNumber = await AccountNumber.findOneAndUpdate(
    { accountNumber: name },
    { accountNumber: newAccountNumber, atasNama: atasNama }
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

app.get("/kelas_siswa", async (req, res) => {
  try {
    const kelasSiswaData = await KelasSiswa.find();

    if (!kelasSiswaData || kelasSiswaData.length === 0) {
      return res.json({ err: "Data kelas siswa tidak ditemukan!" });
    }

    return res.json({ kelasSiswaData });
  } catch (error) {
    return res.status(500).json({ err: "Terjadi kesalahan pada server!" });
  }
});

app.post("/add-tapel", async (req, res) => {
  const { tapel } = req.body;

  if (!tapel) {
    return res.json({ err: "data kosong" });
  }

  let addTapel = await TahunPelajaran.findOne({ identifier: "1" });

  const findDuplicateTapel = addTapel.tapel.find(
    (oldTapel) => oldTapel == tapel
  );

  if (findDuplicateTapel) {
    return res.json({ err: "Tapel sudah ada!" });
  }

  const newTapel = [...addTapel.tapel, tapel];

  const updateTapel = await addTapel.updateOne({ tapel: newTapel });

  return res.json({ msg: "Berhasil menambahkan tapel baru!" });
});

app.post("/add-kelas", async (req, res) => {
  const { kelas } = req.body;

  if (!kelas) {
    return res.json({ err: "Data Kosong" });
  }

  const findKelas = await KelasSiswa.findOne({});

  const findDuplicateClass = findKelas.kelas.find(
    (oldKelas) => oldKelas == kelas
  );

  if (findDuplicateClass) {
    return res.json({ err: "Kelas sudah ada!" });
  }

  const newClass = [...findKelas.kelas, kelas];

  await findKelas.updateOne({ kelas: newClass });

  return res.json({ msg: "kelas berhasil ditambahkan" });
});

app.put("/editKelas/:hidden/:newClass", async (req, res) => {
  const { hidden, newClass } = req.params;

  const findKelas = await KelasSiswa.findOne({});

  let updateClass = findKelas.kelas.filter((kelas) => kelas != hidden);

  const result = [newClass, ...updateClass];

  await findKelas.updateOne({ kelas: result });

  return res.json({ msg: "update kelas telah berhasil" });
});

app.put("/editTapel/:hidden/:newTapel", async (req, res) => {
  const { hidden, newTapel } = req.params;

  let convertHidden = hidden.split("-").join("/");

  let convertTapel = newTapel.split("-").join("/");

  const findTapel = await TahunPelajaran.findOne({});

  let updateTapel = findTapel.tapel.filter((tapel) => tapel != convertHidden);

  const result = [convertTapel, ...updateTapel];

  await findTapel.updateOne({ tapel: result });

  return res.json({ msg: "update tapel telah berhasil" });
});

app.delete("/deleteTapel/:currentText", async (req, res) => {
  const { currentText } = req.params;

  let convertText = currentText.split("-").join("/");

  // return console.log(convertText);

  const findNDelete = await TahunPelajaran.findOne({});

  // return console.log(findNDelete);

  let newClass = findNDelete.tapel.filter((tapel) => tapel != convertText);

  await findNDelete.updateOne({ tapel: newClass });

  return res.json({ msg: `${convertText} berhasil dihapus` });
});

app.delete("/deleteClass/:currentText", async (req, res) => {
  const { currentText } = req.params;

  const findNDelete = await KelasSiswa.findOne({});

  let newClass = findNDelete.kelas.filter((kelas) => kelas != currentText);

  await findNDelete.updateOne({ kelas: newClass });

  return res.json({ msg: `${currentText} berhasil dihapus` });
});

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
  const { nomorRekening, atasNama } = req.body;

  const findAccount = await AccountNumber.findOne({
    accountNumber: nomorRekening,
  });

  if (findAccount) {
    return res.json({ err: "Nomor rekening sudah ada!" });
  }

  const addAccountNumber = new AccountNumber({
    atasNama: atasNama,
    accountNumber: nomorRekening,
    status: true,
  });

  const result = await addAccountNumber.save();

  if (result) {
    return res.json({ message: "Nomor rekening berhasil ditambahkan!" });
  }
});

app.get("/get-verify/:token", async (req, res) => {
  const { token } = req.params;
  const checkVerify = jwt.verify(token, process.env.SECRET_KEY);

  if (!checkVerify) return res.json({ err: "Gagal!!!!!" });

  const { role, status } = checkVerify;

  return res.json({ role, status });
  // const { username, role } = await req.user;

  // return res.json({ username, role });
});

app.get("/nomor-rekening", async (req, res) => {
  const findAccount = await AccountNumber.find();

  if (!findAccount) {
    return res.json({ err: "Tidak ada nomor rekening!" });
  }

  return res.json({ accounts: findAccount });
});

app.get(
  "/bukti-pembayaran/:namaSiswa/:jumlahTagihan/:deskripsiTagihan",
  async (req, res) => {
    const { namaSiswa, jumlahTagihan, deskripsiTagihan } = req.params;
    console.log("from server:", req.params);

    const findPhoto = await FotoBuktiPembayaran.findOne({
      atasNama: namaSiswa,
      nominal: jumlahTagihan,
      infoBilling: deskripsiTagihan,
    });

    if (!findPhoto) {
      return res.json({ err: "Tidak ada foto!" });
    }

    return res.json({ image: findPhoto });
  }
);

app.put(
  "/upload-photo/:nama/:nominal/:infoBilling",
  upload.single("avatar"),
  async (req, res) => {
    // infoBilling TODOOOOO
    const { nama, nominal, infoBilling } = req.params;

    const findHistoryPayment = await FotoBuktiPembayaran.findOneAndUpdate(
      { atasNama: nama, nominal: nominal, infoBilling },
      {
        filename: `${req.file.setUniq}-${req.file.originalname}`,
        contentType: req.file.mimetype,
        data: req.file.buffer,
      }
    );

    if (findHistoryPayment) {
      return res.json({ msg: "Tagihan Berhasil di perbarui" });
    }

    const addPhoto = new FotoBuktiPembayaran({
      atasNama: nama,
      nominal: nominal,
      infoBilling,
      filename: `${req.file.setUniq}-${req.file.originalname}`,
      contentType: req.file.mimetype,
      data: req.file.buffer,
    });

    await addPhoto.save();

    await BillStudent.findOneAndUpdate(
      { atasNama: nama, nominal: nominal, infoBilling },
      { uniqAccessImage: `${req.file.setUniq}-${req.file.originalname}` }
    );

    return res.json({ msg: "Berhasil!" });
  }
);

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
    { isPaidOff: "Menunggu Konfirmasi" }
  );

  const result = await updateBilling.save();

  if (!result) {
    return res.json({ err: "Tagihan gagal untuk di tuntaskan!" });
  }

  return res.json({ msg: "Tagihan berhasil di bayar!", billing: result });
});

app.put("/confirm-payment/:name", async (req, res) => {
  const { name } = req.params;
  const {
    namaSiswa,
    kelasSiswa,
    jumlahTagihanSiswa,
    catatanSiswa,
    statusPembayaran,
    diVerifikasiOleh,
  } = req.body;

  const updateBilling = await BillStudent.findOneAndUpdate(
    {
      namaSiswa: name,
      kelasSiswa,
      jumlahTagihanSiswa,
      catatanSiswa,
      isPaidOff: statusPembayaran,
    },
    { isPaidOff: "Tuntas", verifiedBy: diVerifikasiOleh }
  );

  if (!updateBilling) {
    return res.json({ err: "Tagihan gagal untuk di bayar!" });
  }
  return res.json({ msg: "Tagihan berhasil di bayar!" });
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
