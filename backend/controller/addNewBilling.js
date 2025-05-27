const moment = require("moment");

const db = require("../config/mysql.js");
const formatDateINA = require("../logic/formatDateINA.js");
const getDateTime = moment().format("LLLL");
const date = formatDateINA(getDateTime);

const addNewBilling = async (req, res) => {
  const {
    namaSiswa,
    kelasSiswa,
    tapelSiswa,
    jumlahTagihanSiswa,
    deadline,
    rekeningTujuan,
    catatanSiswa,
    typeofPayment,
    specialKeyword,
  } = req.body;

  try {
    if (specialKeyword == "Fitur Buat Tagihan Untuk Semua Siswa") {
      const [specificStudents] = await db.execute(
        "SELECT * FROM students WHERE kelas = ?",
        [kelasSiswa]
      );

      if (specificStudents.length <= 0) {
        return res.json({
          err: `Siswa di kelas ${kelasSiswa} tidak ditemukan!`,
        });
      }

      specificStudents.forEach(async (student) => {
        const { username, tapel } = student;
        await db.execute(
          `INSERT INTO paymentstudents(namaSiswa, kelasSiswa, tapel, jumlahTagihanSiswa, deadline, catatanSiswa, rekeningTujuan, typeofPayment, createdAt, isPaidOff)
        VALUES("${username}", "${kelasSiswa}","${tapel}", "${jumlahTagihanSiswa}" ,"${deadline}", "${catatanSiswa}", "${rekeningTujuan}", "${typeofPayment}", "${date}", "Belum Tuntas");`
        );
      });

      return res.json({
        msg: `Tagihan Untuk Semua Siswa Kelas ${kelasSiswa} Berhasil Ditambahkan!`,
      });
    }

    if (
      typeofPayment == "Pendaftaran Siswa Kelas X" ||
      typeofPayment == "Pendaftaran Ulang Siswa Kelas XI"
    ) {
      const addBilling = await db.execute(
        `INSERT INTO paymentstudents(namaSiswa, kelasSiswa, tapel, jumlahTagihanSiswa, rekeningTujuan, typeofPayment, catatanSiswa ,isPaidOff, createdAt)
      VALUES("${namaSiswa}", "${kelasSiswa}", "${tapelSiswa}","${jumlahTagihanSiswa}", "${rekeningTujuan}", "${typeofPayment}",  "${typeofPayment}", "Belum Tuntas" ,"${date}");`
      );

      if (addBilling) {
        return res
          .status(200)
          .json({ msg: `${typeofPayment} ${namaSiswa} berhasil ditambahkan!` });
      }
    }

    const [tapelStudent] = await db.execute(
      "SELECT * from students WHERE username = ?",
      [namaSiswa]
    );

    const [isCorrectStudent] = await db.execute(
      "SELECT * FROM students WHERE username = ? AND kelas = ?",
      [namaSiswa, kelasSiswa]
    );

    if (isCorrectStudent.length <= 0) {
      return res.json({
        err: `Kelas ${namaSiswa} di ${tapelStudent[0].kelas}, silahkan mengisi forum dengan benar!`,
      });
    }

    const addBilling = await db.execute(
      `INSERT INTO paymentstudents(namaSiswa, kelasSiswa, tapel, jumlahTagihanSiswa, deadline, catatanSiswa, rekeningTujuan, typeofPayment, createdAt, isPaidOff)
      VALUES("${namaSiswa}", "${kelasSiswa}","${tapelStudent[0].tapel}", "${jumlahTagihanSiswa}" ,"${deadline}", "${catatanSiswa}", "${rekeningTujuan}", "${typeofPayment}", "${date}", "Belum Tuntas");`
    );

    if (addBilling) {
      return res
        .status(200)
        .json({ msg: `${typeofPayment} ${namaSiswa} berhasil ditambahkan!` });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = addNewBilling;
