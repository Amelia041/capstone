# Prototipe Lost & Found di myITS Portal

**Optimalisasi Penyebaran Informasi Lost & Found melalui Integrasi Notifikasi dan Pengumuman pada myITS Portal**

> Ini prototipe (MVP) proyek Design Thinking, **bukan situs resmi ITS**. Semua pengumuman adalah data simulasi, tidak ada autentikasi, dan belum ada integrasi dengan sistem ITS mana pun.

## Sebelum user testing

1. **Periksa URL resmi.** Di `config.js`, `lostFoundOfficialUrl` berisi `https://lostfound.its.ac.id/`. Alamat ini diambil dari artikel jurnal ([LibTech Vol. 6 No. 2, 2025](https://ejournal.uin-malang.ac.id/index.php/libtech/article/download/36750/13260)), bukan halaman resmi ITS, dan belum dibuka saat prototipe dibuat. Buka di browser. Jika salah, ganti nilainya (wajib diawali `https://`).
2. Pastikan pembimbing mengetahui bahwa prototipe publik ini memakai nama myITS. Nonaktifkan situs setelah pengujian selesai.

## 1. Struktur folder

```text
capstone/
├── index.html
├── styles.css
├── app.js
├── data.js
├── config.js
├── README.md
└── assets/
    ├── images/   (ilustrasi barang, SVG)
    └── icons/    (favicon.svg)
```

## 2. Fungsi tiap file

| File | Fungsi |
|---|---|
| `index.html` | Kerangka halaman login, header, sidebar, dan tempat popup |
| `styles.css` | Seluruh tampilan, termasuk versi ponsel |
| `config.js` | URL resmi, mode integrasi, barang di popup, tanggal kalender |
| `data.js` | Data dummy, `DataService`, dan adapter API (belum aktif) |
| `app.js` | Navigasi, halaman, popup, tombol, dan catatan uji coba |
| `assets/` | Gambar dan ikon |

Pengaturan yang sering diubah ada di `config.js`:

- `popupItemId`: barang yang muncul di popup (bawaan `flashdisk-biru`).
- `demoDate`: tanggal pada kalender (bawaan `2026-11-20`; isi `""` untuk tanggal perangkat).
- `lectureWeek`: teks pekan perkuliahan.

**Mengganti ilustrasi dengan foto:** simpan foto di `assets/images/`, lalu ubah `image` di `data.js`, misalnya `"assets/images/botol.jpg"`. Huruf besar/kecil nama file harus sama persis. Jangan memakai foto yang memperlihatkan data pribadi.

## 3. Menjalankan lewat VS Code

1. Ekstrak file zip.
2. VS Code → **File → Open Folder** → pilih folder `capstone`.
3. Buka tab **Extensions**, pasang **Live Server** (Ritwick Dey).
4. Klik kanan `index.html` → **Open with Live Server**.

Tanpa ekstensi pun bisa: klik dua kali `index.html`.

## 4. Menguji setiap fitur

| No | Langkah | Hasil yang diharapkan |
|---|---|---|
| 1 | Klik **Masuk dengan myITS** | Masuk ke Beranda |
| 2 | Perhatikan Beranda | Popup Lost & Found muncul |
| 3 | Klik **Abaikan** | Popup tertutup |
| 4 | Pindah menu lewat sidebar, kembali ke Beranda, muat ulang | Popup tidak muncul lagi |
| 5 | **Akun → Keluar**, masuk lagi, klik **Lihat Informasi** | Detail Flashdisk Biru terbuka |
| 6 | **Pengumuman**, coba keempat tab | Daftar berubah sesuai kategori |
| 7 | Tab **Kehilangan & Temuan**, buka tiap barang | Foto, nama, lokasi, tanggal, deskripsi, ciri-ciri, status sesuai |
| 8 | Klik **Kembali** | Kembali ke tab sebelumnya |
| 9 | Klik **Informasi Lebih Lanjut** | URL di `config.js` terbuka di tab baru |
| 10 | Ketik di kolom pencarian | Daftar tersaring |
| 11 | Beranda: titik banner, pencarian aplikasi, bintang, filter favorit | Semua merespons |
| 12 | **Pengaturan Web** | Ukuran teks berubah; popup bisa ditampilkan lagi |
| 13 | Tekan **F12 → Console** | Tidak ada error |

Status popup disimpan di `sessionStorage`: sekali ditutup, tidak muncul lagi sampai pengguna keluar lalu masuk kembali, memakai tombol di Pengaturan Web, atau membuka sesi browser baru.

## 5. Panduan user testing

### Skenario dan tugas

Jangan menyebut "popup" atau "Lost & Found" sebelum Tugas 1 selesai. Minta peserta berpikir sambil bersuara.

| Tujuan | Tugas / pertanyaan | Dianggap berhasil jika | Bukti |
|---|---|---|---|
| 1. Menyadari popup | "Silakan masuk ke portal. Ceritakan apa yang Anda lihat." | Menyebut popup/informasi barang tanpa dipancing, sebelum atau saat menutupnya | Observasi |
| 2. Memahami informasi | Setelah popup tertutup atau layar dialihkan: "Barang apa, hilang atau ditemukan, di mana, kapan?" | Minimal 3 dari 4 jawaban benar | Wawancara |
| 3. Menemukan kembali | Mulai dari Beranda: "Cari informasi tentang dompet hitam." | Membuka detail lewat menu Pengumuman tanpa bantuan, < 60 detik | Observasi + log |
| 4. Memahami layanan resmi | Di halaman detail: "Kalau ini barang Anda atau Anda punya informasi, apa yang dilakukan?" | Menyebut myITS Lost & Found, bukan lapor di portal ini | Wawancara |
| 5. Membuka layanan resmi | "Lanjutkan tindak lanjutnya." | Menekan **Informasi Lebih Lanjut** dan halaman resmi terbuka | Observasi + log |

Catatan:

- Tugas 3 sengaja memakai barang selain yang ada di popup.
- Widget Beranda hanya menyorot barang popup, sehingga dompet dicari lewat Pengumuman. Jika peserta memakai cara lain, catat jalurnya.
- Log hanya mencatat bahwa tombol ditekan. Apakah halaman resmi berhasil dimuat (mungkin meminta login myITS) harus diamati.
- Ambang keberhasilan di atas adalah usulan; sesuaikan dengan tim.

### Lembar pencatatan

| Peserta | T1 (Y/T) | T2 (0–4) | T3 (Y/T, detik) | T4 (Y/T) | T5 (Y/T) | Komentar |
|---|---|---|---|---|---|---|
| P1 | | | | | | |

Pertanyaan penutup: Seberapa mengganggu popup ini (1–5)? Dibanding grup WhatsApp, kapan Anda akan memakai informasi di portal? Apa yang membingungkan?

### Catatan otomatis (halaman fasilitator)

Tambahkan `#/fasilitator` di akhir alamat (setelah masuk), contoh `https://situsanda.netlify.app/#/fasilitator`. Di sana catatan bisa disalin, diunduh (CSV), atau dihapus untuk peserta berikutnya.

Catatan tersimpan **hanya di perangkat yang dipakai peserta** dan tidak terkirim ke Anda. Pada pengujian jarak jauh, minta peserta menyalin dan mengirimnya, atau gunakan satu perangkat milik fasilitator. Beri tahu peserta bahwa interaksi dicatat.

| Kejadian | Arti |
|---|---|
| `masuk`, `keluar` | Awal dan akhir sesi |
| `popup_tampil`, `popup_ditutup` | Keterangan: `lihat_informasi`, `abaikan`, `tombol_x`, `escape`, `pindah_halaman` |
| `klik_lihat_informasi` | Dari `widget` Beranda atau `daftar` Pengumuman |
| `buka_pengumuman` | Tab yang dibuka |
| `buka_detail` | Barang/pengumuman yang dibuka |
| `klik_layanan_resmi` | Tombol Informasi Lebih Lanjut ditekan |

## 6. Mengunggah ke GitHub

**Cara web (paling mudah)**

1. Login di github.com → **New repository** → nama misalnya `capstone-lostfound` → **Public** → **Create**.
2. Klik **uploading an existing file**.
3. Seret **isi** folder `capstone` (termasuk folder `assets`) sehingga `index.html` berada di posisi paling atas repository.
4. Klik **Commit changes**.

**Cara terminal VS Code** (perlu Git terpasang):

```bash
git init
git add .
git commit -m "Prototipe Lost & Found"
git branch -M main
git remote add origin https://github.com/USERNAME/capstone-lostfound.git
git push -u origin main
```

## 7. Publikasi dan link untuk peserta

Pilih salah satu.

**GitHub Pages**

1. Repository → **Settings → Pages**.
2. Source: **Deploy from a branch** → Branch `main`, folder `/ (root)` → **Save**.
3. Tunggu beberapa menit, muat ulang halaman tersebut.
4. Link: `https://USERNAME.github.io/capstone-lostfound/`

**Netlify**

1. Buat akun / login di netlify.com (agar situs tersimpan di akun Anda).
2. Buka `https://app.netlify.com/drop`, seret folder `capstone`.
3. Netlify memberi link `https://nama-acak.netlify.app`; nama dapat diubah di pengaturan situs.
4. Alternatif: **Add new site → Import from Git** agar pembaruan otomatis.

**Sebelum dibagikan:** buka link di jendela privat dan di ponsel, jalankan tabel pengujian bagian 4. Bagikan link utamanya saja (tanpa `#/...`). Nama menu di GitHub/Netlify dapat berubah sewaktu-waktu.

## 8. Integrasi API resmi di masa mendatang

Lakukan hanya jika pengelola myITS Lost & Found memberikan API resmi dan izin akses. Jangan melakukan scraping.

1. `data.js` → `OfficialApiAdapter.fetchRawReports()`: panggil endpoint dari dokumentasi resmi.
2. `data.js` → `OfficialApiAdapter.toAnnouncement(raw)`: petakan field API ke format antarmuka.
3. `config.js` → `integrationMode: "api"`.

Contoh pola (alamat dan nama field adalah **placeholder**, bukan API nyata):

```javascript
async fetchRawReports() {
    const response = await fetch("ALAMAT_SERVER_PERANTARA_ANDA");
    if (!response.ok) throw new Error("API gagal: " + response.status);
    return response.json(); // sesuaikan jika datanya dibungkus objek lain
},
toAnnouncement(raw) {
    return {
        id: String(raw.FIELD_ID),
        category: "lostfound",
        reportType: raw.FIELD_JENIS === "NILAI_HILANG" ? "kehilangan" : "temuan",
        title: raw.FIELD_NAMA,
        location: raw.FIELD_LOKASI,
        date: raw.FIELD_TANGGAL.slice(0, 10),
        summary: raw.FIELD_DESKRIPSI,
        description: raw.FIELD_DESKRIPSI,
        features: [],
        status: raw.FIELD_STATUS,
        image: raw.FIELD_FOTO
    };
}
```

Hal yang perlu diperhatikan:

- **Kredensial:** jangan menaruh API key atau token di frontend. Jika dibutuhkan, atau autentikasinya lewat SSO, gunakan backend sebagai perantara (GitHub Pages hanya melayani file statis).
- **CORS:** server API harus mengizinkan domain situs, atau lewat backend perantara.
- **Gagal memuat:** aplikasi otomatis kembali ke data dummy dan tetap menandainya sebagai simulasi. Untuk produksi, ganti dengan pesan galat agar pengguna tidak melihat data dummy.
- **Privasi:** tampilkan hanya data yang boleh dipublikasikan.
- Login simulasi (`login()` di `app.js`) perlu diganti autentikasi resmi, dan akademik/kegiatan masih dummy.
