const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.json({ msg: "Tidak ada token!" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      req.user = decoded;
      next();
    }
  } catch (error) {
    res.clearCookie("token");
    return res.json({ err: "Token gagal untuk di verifikasi" });
  }
};

module.exports = verifyToken;
