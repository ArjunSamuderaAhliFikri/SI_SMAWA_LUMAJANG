import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

const token = localStorage.getItem("token");
const statusAdmin = localStorage.getItem("admin");

import port from "../secret/port.js";

const searchStudent = document.getElementById("search-student");
const wrapperListStudents = document.getElementById("wrapper-students");
const wrapperClassList = document.getElementById("list-kelas");
const wrapperTapelList = document.getElementById("list-tapel");

const backToDashboard = document.getElementById("back-to-dashboard");

const countStudents = document.getElementById("count-students");

document.addEventListener("DOMContentLoaded", async () => {
  let dataStudents;

  if (statusAdmin == "Super Admin") {
    backToDashboard.setAttribute("href", "/frontend/pages/dashboard.html");
  }

  const getClass = async () => {
    try {
      const response = await fetch(`${port}/kelas`, {
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
    } catch (error) {
      return console.error(error);
    }
  };

  const getTapel = async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(`${port}/tapel`, config);

      if (!response.ok) return console.log("Response not ok!");

      const { tapel } = await response.json();

      tapel.forEach((data) => {
        const { tapel } = data;

        const generateTapel = generateListClass(tapel);

        wrapperTapelList.appendChild(generateTapel);
      });

      return console.log(data);
    } catch (error) {
      return console.error(error.message);
    }
  };

  const getStudents = async () => {
    try {
      // MENGAMBIL SEMUA DATA SISWA
      const response = await fetch(`${port}/siswa/data-siswa`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Response not ok!");
      }

      const { siswa, err, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (err) return console.log(err);

      countStudents.innerHTML = `${siswa.length} Siswa`;

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

  wrapperClassList.addEventListener("change", (event) => {
    const { value } = event.target;
    const copyDataStudents = [...dataStudents];

    const filterBy = copyDataStudents.filter((data) => data.kelas == value);
    if (filterBy) {
      wrapperListStudents.innerHTML = "";

      filterBy.forEach((student) => {
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

  wrapperTapelList.addEventListener("change", (event) => {
    const { value } = event.target;
    const copyDataStudents = [...dataStudents];

    const filterBy = copyDataStudents.filter((data) => data.tapel == value);
    if (filterBy) {
      wrapperListStudents.innerHTML = "";
      filterBy.forEach((student) => {
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
  getTapel();
});

function generateListClass(kelas) {
  const button = document.createElement("option");
  button.setAttribute("value", kelas);
  button.setAttribute(
    "class",
    "min-w-20 text-center bg-slate-600 px-0 py-3 text-gray-100 hover:text-gray-800 hover:bg-slate-400 rounded-lg block w-52 text-sm transition-all duration-150 cursor-pointer"
  );

  button.innerHTML = kelas;

  return button;
}

function generateListStudent(username, kelas, tapel, nomorHP, nisn) {
  const hyperLink = document.createElement("a");
  hyperLink.setAttribute(
    "href",
    `/frontend/pages/detail_siswa.html?username=${username}`
  );

  const html = `<div
          class="border-b border-gray-100 p-3 sm:p-4 hover:bg-gray-50 transition-colors"
        >
          <!-- Desktop Layout -->
          <div class="hidden md:flex items-center space-x-4">
            <!-- Profile Image -->
            <div
              class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <i class="fas fa-user text-white text-sm"></i>
            </div>

            <!-- Student Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900 truncate">${username}</h3>
                  <div class="flex items-center space-x-2 mt-1">
                    <span
                      class="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-medium"
                      >${kelas}</span
                    >
                    <span
                      class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                      >${tapel}</span
                    >
                  </div>
                </div>

                <div class="flex items-center space-x-3 text-xs text-gray-500">
                  <div class="text-right">
                    <p class="font-medium text-gray-700">NISN: ${nisn}</p>
                    <p class="mt-0.5">HP: ${nomorHP}</p>
                  </div>
                  <div class="flex space-x-1">
                    <button
                      class="bg-primary-500 hover:bg-primary-600 text-white px-2 py-1 rounded text-xs transition-colors"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      class="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Mobile Layout -->
          <div class="md:hidden">
            <div class="flex items-start space-x-3">
              <!-- Profile Image -->
              <div
                class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <i class="fas fa-user text-white text-xs"></i>
              </div>

              <!-- Student Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1 pr-2">
                    <h3 class="text-sm font-semibold text-gray-900 mb-1">${username}</h3>
                    <div class="flex flex-wrap gap-1 mb-2">
                      <span
                        class="bg-primary-100 text-primary-700 px-2 py-0.5 rounded text-xs font-medium"
                        >${kelas}</span
                      >
                      <span
                        class="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs"
                        >${tapel}</span
                      >
                    </div>
                  </div>

                  <div class="flex flex-col space-y-1">
                    <button
                      class="bg-primary-500 hover:bg-primary-600 text-white px-2 py-1 rounded text-xs transition-colors"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      class="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                  </div>
                </div>

                <!-- Contact Info -->
                <div class="grid grid-cols-1 gap-1 text-xs text-gray-600">
                  <div class="flex items-center">
                    <i class="fas fa-id-card text-gray-400 w-3 mr-2"></i>
                    <span class="font-medium">NISN: </span>
                    <span class="ml-1 text-gray-800">${nisn}</span>
                  </div>
                  <div class="flex items-center">
                    <i class="fas fa-phone text-gray-400 w-3 mr-2"></i>
                    <span class="font-medium">HP: </span>
                    <span class="ml-1 text-gray-800">${nomorHP}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

  hyperLink.innerHTML = html;

  return hyperLink;
}
