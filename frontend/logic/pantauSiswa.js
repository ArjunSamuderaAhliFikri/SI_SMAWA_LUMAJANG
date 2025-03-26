const bodyOfTable = document.querySelector("tbody");

document.addEventListener("DOMContentLoaded", () => {
  async function retrieveDataStudent() {
    try {
      const response = await fetch("http://localhost:3000/siswa");

      if (response.ok) {
        const data = await response.json();
        const { getAllStudents } = data;

        getAllStudents.forEach((data) => {
          const createTrElement = document.createElement("tr");
          createTrElement.setAttribute(
            "class",
            "cursor-pointer hover:bg-gray-100"
          );

          createTrElement.innerHTML = generateTdElement(
            data.username,
            data.infoKelas,
            data.email,
            data.nomorHP,
            "Tuntas"
          );

          bodyOfTable.appendChild(createTrElement);
        });
      }
    } catch (error) {
      alert(error.message);
    }
  }

  retrieveDataStudent();
});

function generateTdElement(name, kelas, email, nomorHP, statusPembayaran) {
  return `<td class="flex items-center gap-4 py-4 px-4 border-b">
    <div class="size-8 rounded-full overflow-hidden">
      <img
        class="block size-full object-cover"
        src="/frontend/public/img/default-profile.jpeg"
        alt="user"
      />
    </div>
    <span class="text-[14px] font-semibold text-slate-600"
      >${name}</span
    >
  </td>
  <td
    class="py-4 px-4 border-b text-sm font-semibold text-slate-500"
  >
   ${kelas}
  </td>
  <td
    class="py-4 px-4 border-b text-sm font-semibold text-slate-500"
  >
    ${email}
  </td>
  <td
    class="py-4 px-4 border-b text-sm font-semibold text-slate-500"
  >
    ${nomorHP}
  </td>
  <td
    class="py-4 px-4 border-b text-center text-md font-semibold text-slate-500"
  >
    ${statusPembayaran}
  </td>`;
}
