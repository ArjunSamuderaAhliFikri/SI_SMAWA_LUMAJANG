const input = document.querySelector('input[type="file"]');
const img = document.getElementById("profile_user");

input.addEventListener("change", () => {
  // ambil file gambar
  const file = input.files[0];

  // cek apakah file yang diupload adalah gambar
  if (file && file.type.startsWith("image/")) {
    // buat object URL untuk membaca file
    const reader = new FileReader();

    //   saat file selesai dibaca, tampilkan gambar
    reader.addEventListener("load", (event) => {
      img.src = event.target.result;
    });

    //   baca file gambar ke dalam bentuk URL
    reader.readAsDataURL(file);
  } else {
    // jika bukan gambar, tampilkan pesan error
    throw new Error("File harus berupa gambar");
  }
});
