const db = require("../config/mysql.js");

const getAllPost = async (req, res) => {
  try {
    const [allPost] = await db.execute("SELECT * FROM information_submission");

    if (!allPost) {
      return res.json({ msg: "Tidak ada pengajuan media saat ini!" });
    }

    return res.json({ data: allPost });
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = getAllPost;
