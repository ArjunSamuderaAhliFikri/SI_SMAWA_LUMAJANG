import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

document.addEventListener("DOMContentLoaded", () => {
  const getStudents = async () => {
    const wrapperListStudents = document.getElementById("wrapper-students");

    try {
      const response = await fetch("http://localhost:3000/siswa");

      if (!response.ok) {
        throw new Error("Response not ok!");
      }

      const { siswa, err } = await response.json();

      if (err) return console.log(err);

      siswa.forEach((data) => {
        const { username, kelas, tapel, nomorHP, nisn } = data;
        const user = generateListStudent(username, kelas, tapel, nomorHP, nisn);

        wrapperListStudents.appendChild(user);
      });
    } catch (error) {
      return console.error(error);
    }
  };

  getStudents();
});

function generateListStudent(username, kelas, tapel, nomorHP, nisn) {
  const hyperLink = document.createElement("a");
  hyperLink.setAttribute(
    "href",
    `/frontend/pages/admin/detail_siswa.html?username=${username}`
  );

  const html = `<div class="bg-slate-100 rounded-lg">
          <div class="flex items-center space-x-4 p-4">
            <div class="flex-shrink-0">
              <img
                src="/frontend/public/img/default-profile.jpeg"
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
