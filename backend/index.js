const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");

const automaticClass = require("./logic/automaticClass.js");

// TODOOOO
cron.schedule("* * 30 7 *", async () => {
  await automaticClass();
});

// middleware
app.use(
  cors({
    credentials: true,
    origin: "http://127.0.0.1:5500",
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
const studentPost = require("./routes/studentPost.js");
const admin = require("./routes/admin.js");

const authMiddleware = require("./middleware/authMiddleware.js");

app.get("/abc", authMiddleware, (req, res) => {
  return res.json({ user: req.user });
});

app.use("/login", login);

app.use("/admin", authMiddleware, admin);

app.use("/siswa", authMiddleware, siswa);

app.use("/kelas", authMiddleware, kelas);

app.use("/tapel", authMiddleware, tahunPelajaran);

app.use("/account-billing", authMiddleware, nomorRekening);

app.use("/student-payments", authMiddleware, studentPayments);

app.use("/student-post", authMiddleware, studentPost);

app.use("/history-payment-via-admin", authMiddleware, historyPaymentViaAdmin);

app.use("/media", mediaNews);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
