const db = require("../config/mysql.js");

const addTahunPelajaran = async (req, res) => {
  const { tapel } = req.body;
  try {
    const addAccountNumber = await db.execute(
      `INSERT INTO tahunpelajaran(tapel) VALUES(?);`,
      [tapel]
    );

    if (addAccountNumber) {
      return res
        .status(200)
        .json({ msg: `Berhasil menambahkan tahun pelajaran baru!` });
    }
  } catch (error) {
    return res.status(401).json({ err: error });
  }
};

module.exports = addTahunPelajaran;
