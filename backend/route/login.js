const Admin = require("../models/admin");
const Siswa = require("../models/siswa");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
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

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.json({ token: token, user: siswa });
  }

  if (user.password != password) {
    console.log("password salah");
    return res.status(404).json({ msg: "password anda salah!" });
  }

  const token = jwt.sign({ username }, process.env.SECRET_KEY, {
    expiresIn: "10s",
  });

  res.cookie("token", token, {
    httpOnly: true,
  });

  return res.json({ token: token, user });
};
