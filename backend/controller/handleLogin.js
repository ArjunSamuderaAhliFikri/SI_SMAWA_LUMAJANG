const jwt = require("jsonwebtoken");

const getStudentByUsername = require("../logic/getStudentByUsername");
const getAdmin = require("../logic/getAdminByUsername");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  const student = await getStudentByUsername(username, password);
  const isAdmin = await getAdmin(username, password);

  if (student.length <= 0 && isAdmin.length <= 0) {
    return res.json({ err: "Pengguna tidak ditemukan!" });
  }

  if (isAdmin.length > 0) {
    const token = jwt.sign({ username }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("token", token);
    return res.status(200).json({ role: "Admin", admin: isAdmin, token });
  }

  const token = jwt.sign({ username }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  res.cookie("token", token);

  return res.status(200).json({ role: "Siswa", siswa: student, token });
};

module.exports = handleLogin;
