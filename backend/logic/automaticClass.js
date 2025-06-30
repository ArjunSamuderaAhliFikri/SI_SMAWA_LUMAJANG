const db = require("../config/mysql.js");

const automaticClass = async () => {
  const [getAllStudents] = await db.execute("SELECT * FROM students");

  //   handle delete account student when class is biggest twelve
  const filterGraduateStudents = getAllStudents.filter(
    (student) => student.kelas.split("-")[0].length >= 4
  );

  if (filterGraduateStudents.length > 0) {
    for (let i = 0; i < filterGraduateStudents.length; i++) {
      const studentId = filterGraduateStudents[i].id;

      await db.execute("DELETE FROM students WHERE id = ?", [studentId]);
    }
  }

  //   handle next grade
  const filterStudents = getAllStudents.filter(
    (student) => student.kelas.split("-")[0].length <= 3
  );

  if (filterStudents.length > 0) {
    for (let i = 0; i < filterStudents.length; i++) {
      let currentClass = filterStudents[i].kelas;

      let nextGrade = currentClass.split("-")[0] + "I";
      currentClass = nextGrade + "-" + currentClass.split("-")[1];

      await db.execute("UPDATE students SET kelas = ? WHERE id = ?", [
        currentClass,
        filterStudents[i].id,
      ]);
    }
  }

  return true;
};

// automaticClass();

module.exports = automaticClass;
