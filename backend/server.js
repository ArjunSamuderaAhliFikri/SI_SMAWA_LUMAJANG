const express = require("express");
const app = express();
const port = 3000;
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const login = require("./logic/login.js");
const getTagihanSiswa = require("./logic/getTagihanSiswa.js");
const tagihanSiswa = require("./logic/tagihanSiswa.js");
const getAllStudents = require("./logic/getAllStudents.js");
const tambahSiswa = require("./logic/tambahSiswa.js");
const buatTagihanSiswa = require("./logic/buatTagihanSiswa.js");
const buatTagihanSemuaSiswa = require("./logic/buatTagihanSemuaSiswa.js");
const verifyToken = require("./middleware/middlewareJWT.js");

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
  return res.json(req.user);
});

app.get("/tagihan-siswa", getTagihanSiswa);

app.get("/tagihan/:username", tagihanSiswa);

app.get("/siswa", getAllStudents);

app.get("/tagihan/:username/:infoBilling", (req, res) => {
  const { namaSiswa, infoBilling } = req.body;

  return res.json({ namaSiswa, infoBilling });
});

app.post("/login", login);

app.post("/tambah_siswa", tambahSiswa);

app.post("/tagihan-siswa", buatTagihanSiswa);

app.post("/buat-semua-tagihan", buatTagihanSemuaSiswa);

app.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});
