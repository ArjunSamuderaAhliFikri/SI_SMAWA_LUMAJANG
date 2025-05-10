const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const { cookie } = await req.headers;
    const token = cookie && cookie.split("=")[1];

    if (!cookie) {
      const tokenCookies = req.cookies.token;

      if (!tokenCookies) {
        return res.json({ msg: "Tidak ada token!" });
      }
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
