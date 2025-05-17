const jwt = require("jsonwebtoken");

const getStudentByUsername = require("../controller/getStudentByUsername");

module.exports = async (req, res) => {
  const { username, password } = req.body;

  const student = await getStudentByUsername(username, password);

  if (!student) {
    return res.status(401).json({ err: "Tidak ada data siswa!" });
  }

  const token = jwt.sign({ username }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  return res.status(200).json({ student, token });
};
