document.addEventListener("DOMContentLoaded", function () {
    updateClock();
    setInterval(updateClock, 1000);
    fetchPrayerTimes();
});

let countdownInterval; // Menyimpan interval hitung mundur

function updateClock() {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Format HH:MM

    document.getElementById("digital-clock").textContent = now.toLocaleTimeString("id-ID").replace(/\./g, ":");;
    document.getElementById("current-date").textContent = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    
    const prayerTimes = [
        document.getElementById("subuh").textContent,
        document.getElementById("dzuhur").textContent,
        document.getElementById("ashar").textContent,
        document.getElementById("maghrib").textContent,
        document.getElementById("isya").textContent
    ];

    if (prayerTimes.includes(currentTime)) {
        startCountdown(7 * 60); // Mulai hitung mundur 7 menit
    }
}

function startCountdown(duration) {
    clearInterval(countdownInterval); // Hentikan hitungan sebelumnya jika ada
    let remainingTime = duration;
    document.getElementById("digital-clock").style.color = "red"; // Ubah warna jam jadi merah

    countdownInterval = setInterval(() => {
        console.log("Sisa waktu:", remainingTime);
        let minutes = Math.floor(remainingTime / 60);
        let seconds = remainingTime % 60;
        document.getElementById("digital-clock").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

        if (remainingTime <= 3) {
            playBeep(); // Bunyi beep pada 3 detik terakhir
        }

        if (remainingTime === 0) {
            clearInterval(countdownInterval);
            document.getElementById("digital-clock").style.color = "white"; // Kembalikan warna normal
            updateClock(); // Tampilkan kembali jam normal
        }

        remainingTime--;
    }, 1000);
}

function playBeep() {
    let beep = new Audio("beep-04.mp3"); // Ganti dengan suara beep yang sesuai
    beep.play();
}

function fetchPrayerTimes() {
    // const province = "DKI";  // Ganti sesuai provinsi
    const city = "1420";  // Ganti sesuai id kota (1420 - KAB. PURBALINGGA)
    const today = new Date().toISOString().split("T")[0]; // Format YYYY-MM-DD
    const url = `https://api.myquran.com/v2/sholat/jadwal//${city}/${today}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status) {
                const times = data.data.jadwal;
                document.getElementById("subuh").textContent = times.subuh;
                document.getElementById("dzuhur").textContent = times.dzuhur;
                document.getElementById("ashar").textContent = times.ashar;
                document.getElementById("maghrib").textContent = times.maghrib;
                document.getElementById("isya").textContent = times.isya;
            } else {
                console.error("Gagal mengambil data:", data.message);
            }
        })
        .catch(error => console.error("Gagal mengambil data:", error));
}
// Panggil pertama kali saat halaman dimuat
fetchPrayerTimes();
// Perbarui setiap 5 menit (300000 ms)
setInterval(fetchPrayerTimes, 300000);