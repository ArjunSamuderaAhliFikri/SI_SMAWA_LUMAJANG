const db = require("../config/mysql.js");

const editTahunPelajaran = async (req, res) => {
  const { hidden, currentText } = req.params;

  const oldTapel = hidden.split("-").join("/");
  const newTapel = currentText.split("-").join("/");

  try {
    const editTapel = await db.execute(
      "UPDATE tahunpelajaran SET tapel = ? WHERE tapel = ?",
      [newTapel, oldTapel]
    );

    if (editTapel) {
      return res.status(200).json({ msg: "Data berhasil diperbarui!" });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = editTahunPelajaran;
