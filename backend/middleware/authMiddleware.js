// const jwt = require("jsonwebtoken");

// module.exports = function (req, res, next) {
//   const token = req.cookies.token;

//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied!" });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.SECRET_KEY);
//     req.user = decoded.user;
//     next();
//   } catch (error) {
//     res.clearCookie("token");
//     res.status(401).json({ msg: "Token is not valid!" });
//   }
// };

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    // Token biasanya diawali dengan kata "Bearer"
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; // Simpan data user dalam req untuk digunakan selanjutnya
  } catch (err) {
    return res.status(401).json({ msg: "Invalid Token" });
  }

  return next(); // Lanjut ke route berikutnya
};

module.exports = verifyToken;
