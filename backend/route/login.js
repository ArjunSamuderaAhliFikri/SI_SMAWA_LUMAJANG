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

    const token = jwt.sign(
      { username: siswa.username, role: siswa.role },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.json({ user: siswa, token });
  }

  if (user.password != password) {
    console.log("password salah");
    return res.status(404).json({ msg: "password anda salah!" });
  }

  const { role, status } = user;

  const token = jwt.sign({ role, status }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });

  return res.json({ token, user });
};
