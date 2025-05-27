const db = require("../config/mysql.js");

const deleteTahunPelajaran = async (req, res) => {
  const { tapel } = req.params;
  const encodedTapel = tapel.split("-").join("/");
  try {
    const deleteTapel = await db.execute(
      "DELETE FROM tahunpelajaran WHERE tapel = ?",
      [encodedTapel]
    );

    if (deleteTapel) {
      return res.json({
        msg: `Tahun pelajaran ${encodedTapel} berhasil dihapus!`,
      });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = deleteTahunPelajaran;
