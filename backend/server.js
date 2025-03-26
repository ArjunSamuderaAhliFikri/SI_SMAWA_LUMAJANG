const express = require("express");
const app = express();
const port = 3000;
const jwt = require("jsonwebtoken");
const Admin = require("./models/admin");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const Siswa = require("./models/siswa");
const BillStudent = require("./models/billStudent.js");
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware/authMiddleware.js");

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

app.get("/user", verifyToken, (req, res) => {
  const { user } = req;
  return res.json({ user });
});

app.get("/tagihan-siswa", async (req, res) => {
  const billingStudents = await BillStudent.find();

  return res.json({ tagihan: billingStudents });
});

app.get("/tagihan/:username", async (req, res) => {
  const { username } = req.params;

  const findBilling = await BillStudent.find({ namaSiswa: username });

  if (!findBilling) {
    return res.json({ msg: "Tidak ada tagihan!" });
  }

  return res.json({ msg: `Tagihan untuk siswa ${username}`, findBilling });
});

app.get("/siswa", async (req, res) => {
  const getAllStudents = await Siswa.find();

  return res.json({ getAllStudents });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await Admin.findOne({ username });

  if (!user) {
    const siswa = await Siswa.findOne({ username });

    if (!siswa) {
      return res.json({ msg: "Tidak ada akun yang terdaftar" });
    }

    if (siswa.password != password) {
      return res.json({ msg: "Password anda sebagai siswa salah!" });
    }

    const token = jwt.sign({ username }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token.toString(), {
      httpOnly: true,
    });

    return res.json({ token, user: siswa });
  }

  if (user.password != password) {
    console.log("password salah");
    return res.status(404).json({ msg: "password anda salah!" });
  }

  const token = jwt.sign({ username }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  res.cookie("token", token.toString(), {
    httpOnly: true,
  });

  return res.json({ token, user });
});

app.post("/tambah_siswa", async (req, res) => {
  const { username, email, password, nomorHP, infoKelas, role } = req.body;
  const findStudent = await Siswa.findOne({ username });
  const checkEmail = await Siswa.findOne({ email });
  const checkNomorHP = await Siswa.findOne({ nomorHP });

  if (findStudent || checkEmail || checkNomorHP) {
    return res.json({ msg: "Siswa sudah terdaftar!" });
  }

  if (!username || !email || !nomorHP) {
    return res.json({ msg: "Formulir harus terisi terlebih dahulu!" });
  }

  const siswaBaru = new Siswa({
    username,
    email,
    password,
    nomorHP,
    infoKelas,
    role,
  });

  const simpanSiswa = await siswaBaru.save();

  if (simpanSiswa) {
    return res.json({ msg: `Siswa ${username} Sudah berhasil ditambahkan!` });
  }
});

app.post(
  "/tagihan-siswa",
  async (req, res) => {
    const billingStudents = await BillStudent.find();

    return tagihan: res.json({ billingStudents });
  },
  async (req, res) => {
    const { namaSiswa, kelasSiswa, catatanSiswa, jumlahTagihanSiswa } =
      req.body;

    const buatTagihanBaru = new BillStudent({
      namaSiswa,
      kelasSiswa,
      catatanSiswa,
      jumlahTagihanSiswa,
    });

    const saveTagihan = await buatTagihanBaru.save();

    if (saveTagihan) {
      return res.json({ msg: "Penambahan tagihan telah berhasil!" });
    }
  }
);

app.post("/buat-semua-tagihan", async (req, res) => {
  const { catatanSiswa, kelasTagihan, jumlahTagihanSiswa } = req.body;

  const getAllStudents = await Siswa.find({ infoKelas: kelasTagihan });

  getAllStudents.forEach(async (data) => {
    const buatTagihanBaru = new BillStudent({
      namaSiswa: data.username,
      kelasSiswa: data.infoKelas,
      jumlahTagihanSiswa,
      catatanSiswa,
    });

    await buatTagihanBaru.save();
  });

  return res.json({ msg: "Proses membuat tagihan ke semua siswa berhasil!" });
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
