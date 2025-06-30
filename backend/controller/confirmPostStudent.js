const db = require("../config/mysql.js");

const confirmPostStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const isConfirmPost = await db.execute(
      "UPDATE information_submission SET confirmed = ? WHERE id = ?",
      [true, id]
    );

    if (isConfirmPost) {
      console.log("confirm post");
      const [getCurrentPost] = await db.execute(
        "SELECT * FROM information_submission WHERE id = ?",
        [id]
      );

      if (getCurrentPost) {
        console.log("get current post");
        const { title, description, image, datePost } = getCurrentPost[0];

        const publishMedia = await db.execute(
          "INSERT INTO media_news(title, description, datePost, image) VALUES(?, ? , ? , ?)",
          [title, description, datePost, image]
        );

        if (publishMedia) {
          console.log("publish media");
          return res.json({
            msg: "Media berhasil di izinkan! Media akan segera diluncurkan dihalaman utama!",
          });
        }
      }

      return res.json({ err: "Terjadi kesalahan! Silahkan coba lagi nanti." });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = confirmPostStudent;
