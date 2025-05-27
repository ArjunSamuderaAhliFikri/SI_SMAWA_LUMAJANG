const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

// middleware
app.use(
  cors({
    credentials: true,
    origin: "*",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

dotenv.config();

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const port = process.env.PORT || 4000;

// ROUTES
const login = require("./routes/login.js");
const kelas = require("./routes/class.js");
const siswa = require("./routes/siswa.js");
const tahunPelajaran = require("./routes/tahunPelajaran.js");
const nomorRekening = require("./routes/nomorRekening.js");
const studentPayments = require("./routes/studentPayments.js");
const mediaNews = require("./routes/mediaNews.js");
const historyPaymentViaAdmin = require("./routes/historyPaymentViaAdmin.js");

const authMiddleware = require("./middleware/authMiddleware.js");

app.get("/abc", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

app.use("/login", login);

app.use("/siswa", authMiddleware, siswa);

app.use("/kelas", authMiddleware, kelas);

app.use("/tapel", authMiddleware, tahunPelajaran);

app.use("/account-billing", authMiddleware, nomorRekening);

app.use("/student-payments", authMiddleware, studentPayments);

app.use("/history-payment-via-admin", authMiddleware, historyPaymentViaAdmin);

app.use("/media", mediaNews);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
