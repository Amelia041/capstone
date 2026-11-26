/**
 * config.js
 * Satu-satunya tempat untuk mengubah pengaturan prototipe.
 */
const CONFIG = {
    // URL layanan resmi myITS Lost & Found (tujuan tombol "Informasi Lebih Lanjut").
    // PERIKSA SEBELUM USER TESTING: alamat ini diambil dari artikel jurnal
    // (LibTech Vol. 6 No. 2, 2025), bukan dari halaman resmi ITS.
    // Buka di browser; jika berbeda, ganti nilainya di sini (harus diawali https://).
    lostFoundOfficialUrl: "https://lostfound.its.ac.id/",

    // "demo" = data dummy dari data.js.
    // "api"  = hanya dipakai jika API resmi sudah tersedia dan fungsinya
    //          sudah dilengkapi di data.js. Lihat README.
    integrationMode: "demo",

    // id pengumuman Lost & Found yang muncul di popup dan disorot di Beranda.
    // Pilihan: "flashdisk-biru", "dompet-hitam", "botol-minum",
    //          "tempat-pensil", "kartu-identitas"
    popupItemId: "flashdisk-biru",

    // Tanggal simulasi pada widget kalender (format TTTT-BB-HH).
    // Kosongkan ("") untuk memakai tanggal perangkat.
    demoDate: "2026-11-20",
    lectureWeek: "Pekan perkuliahan ke-12"
};
