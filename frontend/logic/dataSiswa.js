import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

const token = localStorage.getItem("token");

const searchStudent = document.getElementById("search-student");
const wrapperListStudents = document.getElementById("wrapper-students");
const wrapperClassList = document.getElementById("list-kelas");

document.addEventListener("DOMContentLoaded", async () => {
  let dataStudents;

  const getClass = async () => {
    try {
      const response = await fetch("https://api2.smawalmj.com/kelas", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { kelas, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      kelas.forEach((item) => {
        const { kelas } = item;

        console.log(kelas);

        const generateClass = generateListClass(kelas);

        wrapperClassList.appendChild(generateClass);
      });

      const classOption = document.querySelectorAll("li[id=opsi-kelas]");

      const copyDataStudents = [...dataStudents];

      classOption.forEach((kelas) => {
        kelas.addEventListener("click", () => {
          const filterStudents = copyDataStudents.filter(
            (student) => student.kelas == kelas.innerHTML
          );

          if (filterStudents) {
            wrapperListStudents.innerHTML = "";

            filterStudents.forEach((student) => {
              const { username, kelas, tapel, nomorHP, nisn } = student;

              const generateStudent = generateListStudent(
                username,
                kelas,
                tapel,
                nomorHP,
                nisn
              );

              wrapperListStudents.appendChild(generateStudent);
            });

            return;
          }
        });
      });
    } catch (error) {
      return console.error(error);
    }
  };

  const getStudents = async () => {
    try {
      // MENGAMBIL SEMUA DATA SISWA
      const response = await fetch(
        "https://api2.smawalmj.com/siswa/data-siswa",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Response not ok!");
      }

      const { siswa, err, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (err) return console.log(err);

      dataStudents = siswa;
      siswa.forEach((data) => {
        const { username, kelas, tapel, nomorHP, nisn } = data;
        const user = generateListStudent(username, kelas, tapel, nomorHP, nisn);

        wrapperListStudents.appendChild(user);
      });
    } catch (error) {
      return console.error(error);
    }
  };

  searchStudent.addEventListener("keyup", (event) => {
    const { value } = event.target;

    const copyDataStudents = [...dataStudents];

    if (!value) {
      wrapperListStudents.innerHTML = "";

      copyDataStudents.forEach((student) => {
        const { username, kelas, tapel, nomorHP, nisn } = student;

        const generateStudent = generateListStudent(
          username,
          kelas,
          tapel,
          nomorHP,
          nisn
        );

        wrapperListStudents.appendChild(generateStudent);
      });

      return;
    }

    const filterStudents = copyDataStudents.filter((student) =>
      student.username.toLowerCase().includes(value.toLowerCase())
    );

    if (filterStudents) {
      wrapperListStudents.innerHTML = "";

      filterStudents.forEach((student) => {
        const { username, kelas, tapel, nomorHP, nisn } = student;

        const generateStudent = generateListStudent(
          username,
          kelas,
          tapel,
          nomorHP,
          nisn
        );

        wrapperListStudents.appendChild(generateStudent);
      });

      return;
    }
  });

  getStudents();
  getClass();
});

function generateListClass(kelas) {
  const button = document.createElement("li");
  button.setAttribute("id", "opsi-kelas");
  button.setAttribute(
    "class",
    "block min-w-20 text-center bg-slate-600 px-3 py-3 text-gray-100 hover:text-gray-800 hover:bg-slate-400 rounded-lg block w-52 text-sm transition-all duration-150 cursor-pointer"
  );

  button.innerHTML = kelas;

  return button;
}

function generateListStudent(username, kelas, tapel, nomorHP, nisn) {
  const hyperLink = document.createElement("a");
  hyperLink.setAttribute(
    "href",
    `/pages/detail_siswa.html?username=${username}`
  );

  const html = `<div class="bg-slate-100 rounded-lg">
          <div class="flex items-center space-x-4 p-4">
            <div class="flex-shrink-0">
              <img
                src="/public/img/default-profile.jpeg"
                alt="User Avatar"
                class="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <div>
              <h3 class="text-md text-slate-600 font-medium">${username}</h3>
              <p class="text-slate-700 text-xs font-normal">
                <span id="kelas">${kelas}</span>
                ||
                <span id="tahun-pelajaran">${tapel}</span>
              </p>
            </div>
          </div>

          <div class="flex justify-center items-center gap-x-2 pb-3">
            <p
              class="text-xs px-4 py-2 rounded-lg bg-white text-slate-600 font-medium"
            >
              NISN :
              <span id="nisn" class="text-blue-600">${nisn.substring(
                0,
                10
              )}</span>
            </p>

            <p
              class="text-xs px-4 py-2 rounded-lg bg-white text-slate-600 font-medium"
            >
              Nomor HP :
              <span id="nomor-hp" class="text-blue-600">${nomorHP.substring(
                0,
                13
              )}</span>
            </p>
          </div>
        </div>`;

  hyperLink.innerHTML = html;

  return hyperLink;
}
