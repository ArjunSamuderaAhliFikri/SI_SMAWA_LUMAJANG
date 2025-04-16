const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const { cookie } = await req.headers;

    if (!cookie) {
      return res.json({ msg: "Tidak ada token!" });
    }

    const token = await cookie.split("=")[1];

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
