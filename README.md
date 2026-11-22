# Q3.04 - Lost & Found myITS Portal MVP

Prototype web sederhana untuk membuktikan fungsi inti penyebaran informasi Lost & Found melalui halaman Pengumuman.

## Teknologi
- HTML
- CSS
- JavaScript
- Browser LocalStorage

## Cara menjalankan
1. Ekstrak folder proyek.
2. Buka folder `capstone-q304-starter`.
3. Klik dua kali `index.html` untuk membukanya di browser.
4. Pilih menu **Kelola Laporan**.
5. Isi formulir dengan data uji, lalu klik **Simpan Laporan**.
6. Buka menu **Pengumuman**. Laporan baru seharusnya muncul.
7. Klik **Lihat detail** untuk melihat data lengkap.
8. Refresh browser untuk memeriksa apakah data masih tersimpan.

Disarankan menggunakan Chrome atau Edge versi terbaru. Tidak wajib menjalankan server lokal untuk versi awal ini.

## Fitur yang sudah disiapkan
- Formulir laporan barang hilang/ditemukan.
- Validasi kolom wajib.
- Penyimpanan data pada LocalStorage.
- Daftar pengumuman yang diperbarui setelah laporan disimpan.
- Pencarian berdasarkan nama barang, lokasi, dan deskripsi.
- Filter kategori Kehilangan/Temuan.
- Halaman detail laporan.
- Dua data contoh untuk membantu uji coba awal.

## Catatan batasan
- Data hanya tersimpan pada browser dan perangkat yang digunakan.
- Belum ada login atau pembagian hak akses admin/pengguna.
- Foto menggunakan URL gambar publik, bukan unggah file.
- Belum terhubung ke database, API, myITS Portal, atau layanan resmi myITS Lost & Found.
- Data contoh adalah data fiktif untuk demonstrasi.
- Prototype ini bukan sistem resmi ITS.

## Struktur
- `index.html`: struktur halaman dan navigasi.
- `styles.css`: tampilan antarmuka.
- `app.js`: validasi, penyimpanan, filter, dan render data.
