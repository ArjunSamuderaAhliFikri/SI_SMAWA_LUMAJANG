import port from "../secret/port.js";

const token = localStorage.getItem("token");

const tbody = document.querySelector("tbody");

document.addEventListener("DOMContentLoaded", () => {
  const retrieveAllPostStudent = async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const getAuthorConfig = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(`${port}/student-post`, config);

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { data, msg } = await response.json();

      if (!data) {
        Swal.fire("Tidak ada pengajuan media saat ini!");
        return;
      }

      if (data) {
        const getAuthor = await fetch(
          `${port}/siswa/detailSiswa/byId/${data[0].authorId}`,
          getAuthorConfig
        );

        if (!getAuthor.ok) return console.log("Response not ok!");

        const { siswa } = await getAuthor.json();

        data.forEach((post) => {
          const tableRow = document.createElement("tr");
          tableRow.setAttribute(
            "class",
            "lg:table-row grid grid-rows-[] place-items-start gap-y-1 w-full lg:w-full bg-transparent lg:rounded-lg bg-white overflow-hidden transition-all duration-150 hover:bg-slate-200 pl-4 lg:pl-0"
          );
          const { username, kelas, tapel } = siswa[0];
          const { id, title, datePost, confirmed } = post;

          const tableBody = generateListMedia(
            id,
            username,
            kelas,
            tapel,
            title,
            datePost,
            confirmed
          );

          tableRow.innerHTML = tableBody;

          tbody.appendChild(tableRow);
        });

        const confirmedPostButtons = document.querySelectorAll(
          "button[id=confirmed-post]"
        );

        confirmedPostButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const handleConfirmPost = async () => {
              const config = {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };

              try {
                const response = await fetch(
                  `${port}/student-post/confirm-post/${button.dataset.post}`,
                  config
                );

                if (!response.ok) {
                  return console.log("Response not ok!");
                }

                const { msg, warn, err } = await response.json();

                if (warn) {
                  window.location.href = "/frontend/pages";
                }

                if (err) {
                  Swal.fire(err);
                }

                setTimeout(() => {
                  Swal.fire(msg);
                }, 500);
              } catch (error) {
                return console.error(error.message);
              }
            };

            handleConfirmPost();
          });
        });

        const deletePostButtons = document.querySelectorAll(
          "button[id=delete-post]"
        );

        deletePostButtons.forEach((button) => {
          button.addEventListener("click", () => {
            const handleDeletePostStudent = async () => {
              const config = {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              };

              try {
                const response = await fetch(
                  `${port}/student-post/${button.dataset.post}`,
                  config
                );

                if (!response.ok) return console.log("Response not ok!");

                const { msg, warn, err } = await response.json();

                if (warn) {
                  window.location.href = "/frontend/pages";
                }

                if (err) {
                  Swal.fire(err);
                }

                setTimeout(() => {
                  Swal.fire(msg).then((result) => {
                    if (result.isConfirmed) {
                      window.location.reload();
                    }
                  });
                }, 500);
              } catch (error) {
                return console.error(error.message);
              }
            };

            handleDeletePostStudent();
          });
        });
      }
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveAllPostStudent();
});

function generateListMedia(
  id,
  author,
  authorClass,
  authorTapel,
  title,
  datePost,
  confirmed
) {
  const tableBody = `<td td class="pt-4 lg:pt-0">
                    <a class="block size-full" href="/frontend/pages/persetujuan_media.html?id=${id}">
                      <div
                        class="flex items-center justify-start gap-x-6 my-3 ml-4"
                      >
                        <section class="size-10 rounded-full overflow-hidden">
                          <img
                            class="block size-full object-cover"
                            src="/frontend/public/img/default-profile.jpeg"
                            alt="profile_user"
                          />
                        </section>

                        <section class="flex flex-col"><h1 class="text-sm font-semibold text-slate-700 capitalize">${author}</h1>
                          <div
                            class="flex text-slate-500 font-normal text-xs pt-[2px]"
                          ><p>${authorClass}</p><span> | </span><p>${authorTapel}</p>
                          </div>
                        </section>
                      </div>
                    </a>
                  </td>
                  <td class="text-sm font-normal text-slate-800">
                    <a class="lg:block grid grid-cols-[125px_minmax(900px,_1fr)_100px] size-full" href="">
                    <span class="block lg:hidden font-medium text-slate-700 text-sm capitalize">judul postingan : </span>
                      ${title}
                    </a>
                  </td>
                  <td class="text-sm font-normal text-slate-800">
                    <a class="lg:block grid grid-cols-[125px_minmax(900px,_1fr)_100px] size-full" href="">
                    <span class="block lg:hidden font-medium text-slate-700 text-sm capitalize">Dibuat Pada : </span>
                    ${datePost}</a>
                  </td>
                  <td class="relative pb-7 lg:pb-0 mt-2.5">
                      <div class="w-fit mx-auto z-10">
                      ${
                        confirmed
                          ? `<button
                              type="button"
                              disabled="true"
                              class="bg-transparent text-emerald-500 font-normal px-3 py-1 rounded-full shadow border-2 border-emerald-500 cursor-pointer transition-all duration-150 hover:bg-emerald-500 hover:text-slate-100 ml-4 disabled:hover:bg-transparent disabled:hover:text-emerald-500">
                              <i class="fa-regular fa-circle-check"></i>
                              <span class="pl-2">Postingan Telah Di Izinkan!</span>
                            </button>`
                          : `<button id="delete-post" data-post="${id}" type="button" class="bg-transparent text-red-600 font-normal px-3 py-1 rounded-full shadow border-2 border-red-600 cursor-pointer transition-all duration-150 hover:bg-red-600 hover:text-slate-100">
                              <i class="fa-solid fa-trash"></i>
                              <span class="pl-2">Delete</span>
                            </button>

                            <button
                              data-post="${id}"
                              id="confirmed-post"
                              type="button"
                              class="bg-transparent text-emerald-500 font-normal px-3 py-1 rounded-full shadow border-2 border-emerald-500 cursor-pointer transition-all duration-150 hover:bg-emerald-500 hover:text-slate-100 ml-4">
                              <i class="fa-regular fa-circle-check"></i>
                              <span class="pl-2">Izinkan</span>
                            </button>`
                      }  
                      </div>
                  </td>`;

  return tableBody;
}
