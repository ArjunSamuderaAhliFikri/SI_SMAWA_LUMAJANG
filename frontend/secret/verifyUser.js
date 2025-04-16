export default function (redirectPath) {
  const token = localStorage.getItem("token");

  const deleteToken = setInterval(() => {
    localStorage.removeItem("token");
  }, 36000);

  window.addEventListener("beforeunload", () => {
    clearInterval(deleteToken);
  });

  document.addEventListener("DOMContentLoaded", async () => {
    if (!token) {
      return (window.location.href = redirectPath);
    }

    try {
      const response = await fetch(
        `http://localhost:3000/get-verify/${token}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer Token",
          },
        }
      );
      if (!response.ok) {
        return alert("Gagal mendapatkan data verifikasi!");
      }

      const { role, status } = await response.json();

      console.log({ role, status });
    } catch (error) {
      return (window.location.href = redirectPath);
    }
  });
}
