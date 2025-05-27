const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const bearerToken = req.headers["authorization"];
    const token = bearerToken && bearerToken.split(" ")[1];

    if (token == null) {
      return res.json({ warn: "Tidak ada token!" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      req.user = decoded;

      next();
    }
  } catch (error) {
    return res.json({ warn: "Tidak ada token!" });
  }
};
