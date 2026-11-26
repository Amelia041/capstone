/**
 * data.js
 * Lapisan data. Antarmuka (app.js) HANYA boleh mengambil pengumuman lewat
 * DataService, sehingga sumber data bisa diganti tanpa mengubah tampilan.
 *
 * Seluruh isi DEMO_ANNOUNCEMENTS adalah DATA SIMULASI, bukan laporan nyata
 * dan tidak berasal dari database myITS Lost & Found.
 */
const DEMO_ANNOUNCEMENTS = [
    // ---------- Kehilangan & Temuan ----------
    {
        id: "flashdisk-biru",
        category: "lostfound",
        reportType: "kehilangan",
        title: "Flashdisk Biru",
        location: "Departemen Sistem Informasi ITS",
        date: "2026-11-18",
        summary: "Flashdisk berwarna biru dilaporkan hilang di sekitar lokasi tersebut.",
        description: "Flashdisk berwarna biru dilaporkan hilang di sekitar Departemen Sistem Informasi ITS.",
        features: ["Warna badan biru", "Konektor USB berwarna perak", "Ada lubang gantungan di bagian ujung"],
        status: "Belum ditemukan",
        image: "assets/images/flashdisk-biru.svg"
    },
    {
        id: "dompet-hitam",
        category: "lostfound",
        reportType: "temuan",
        title: "Dompet Hitam",
        location: "Perpustakaan ITS",
        date: "2026-11-18",
        summary: "Ditemukan dompet berwarna hitam di area perpustakaan.",
        description: "Ditemukan dompet lipat berwarna hitam di area Perpustakaan ITS. Isi dompet tidak ditampilkan untuk keperluan verifikasi pemilik.",
        features: ["Warna hitam", "Model lipat", "Jahitan tepi terlihat"],
        status: "Menunggu pemilik",
        image: "assets/images/dompet-hitam.svg"
    },
    {
        id: "botol-minum",
        category: "lostfound",
        reportType: "temuan",
        title: "Botol Minum",
        location: "Perpustakaan ITS",
        date: "2026-11-18",
        summary: "Ditemukan botol minum berwarna hitam di area perpustakaan.",
        description: "Ditemukan botol minum berwarna hitam di area perpustakaan.",
        features: ["Warna hitam", "Tutup ulir", "Ada tali pegangan pada tutup"],
        status: "Menunggu pemilik",
        image: "assets/images/botol-minum.svg"
    },
    {
        id: "tempat-pensil",
        category: "lostfound",
        reportType: "kehilangan",
        title: "Tempat Pensil",
        location: "Departemen Sistem Informasi",
        date: "2026-11-19",
        summary: "Tempat pensil berwarna biru dengan beberapa alat tulis di dalamnya.",
        description: "Tempat pensil berwarna biru dengan beberapa alat tulis di dalamnya.",
        features: ["Warna biru", "Menggunakan ritsleting", "Berisi beberapa alat tulis"],
        status: "Belum ditemukan",
        image: "assets/images/tempat-pensil.svg"
    },
    {
        id: "kartu-identitas",
        category: "lostfound",
        reportType: "temuan",
        title: "Kartu Identitas",
        location: "Area Kampus ITS",
        date: "2026-11-20",
        summary: "Ditemukan kartu identitas di sekitar area kampus.",
        description: "Ditemukan kartu identitas di sekitar area kampus. Data pribadi pada kartu tidak ditampilkan.",
        features: ["Berbentuk kartu", "Data pribadi disamarkan"],
        status: "Menunggu pemilik",
        image: "assets/images/kartu-identitas.svg"
    },

    // ---------- Akademik ----------
    {
        id: "perencanaan-skem",
        category: "akademik",
        title: "Perencanaan SKEM",
        date: "2026-11-14",
        summary: "Mulai semester genap 2025/2026, perencanaan SKEM dapat dilakukan kapan saja.",
        description: "Mulai semester genap 2025/2026, perencanaan SKEM dapat dilakukan kapan saja."
    },
    {
        id: "keringanan-biaya",
        category: "akademik",
        title: "Permohonan Keringanan Biaya Pendidikan",
        date: "2026-11-15",
        summary: "Ketentuan umum: pengajuan hanya untuk mahasiswa Program Sarjana.",
        description: "Ketentuan umum: pengajuan hanya untuk mahasiswa Program Sarjana. Rincian jadwal dan persyaratan pada prototipe ini tidak tersedia."
    },

    // ---------- Kegiatan ----------
    {
        id: "plc-training",
        category: "kegiatan",
        title: "PLC Training: Open Registration",
        date: "2026-11-16",
        summary: "Pelatihan Control and Automation, 28 & 29 November 2026.",
        description: "Pendaftaran PLC Training (Control and Automation) dibuka. Pelaksanaan 28 & 29 November 2026 oleh Departemen Teknik Elektro ITS. Pendaftaran tidak diproses melalui prototipe ini."
    },
    {
        id: "hari-ayah",
        category: "kegiatan",
        title: "Untuk Dia yang Tak Pernah Meminta, Namun Selalu Mengusahakan",
        date: "2026-11-17",
        summary: "Ruang apresiasi sivitas akademika untuk sosok yang selalu mengusahakan.",
        description: "Ruang apresiasi sivitas akademika untuk sosok yang selalu mengusahakan. Konten ini hanya contoh tampilan pengumuman kegiatan."
    },
    {
        id: "student-connect",
        category: "kegiatan",
        title: "Kegiatanmu Berharga, Yuk Catat di myITS StudentConnect!",
        date: "2026-11-13",
        summary: "Prestasi dan kegiatan kemahasiswaan akan masuk ke SKPI.",
        description: "Prestasi/kegiatan kemahasiswaan Anda akan masuk ke Surat Keterangan Pendamping Ijazah (SKPI). SKPI berguna untuk menunjukkan pengalaman non-akademis selama kuliah kepada perusahaan atau institusi tempat Anda melamar kerja."
    }
];

/**
 * ADAPTER API (BELUM AKTIF)
 * Belum ada API resmi yang diketahui, jadi tidak ada endpoint atau nama field
 * yang dikarang di sini. Lengkapi kedua fungsi di bawah HANYA setelah pengelola
 * myITS Lost & Found memberikan dokumentasi API dan izin akses.
 *
 * JANGAN menaruh API key, token, atau kredensial di file ini (bisa dibaca siapa
 * saja). Jika API butuh kredensial, panggil lewat server perantara (backend).
 */
const OfficialApiAdapter = {
    /** Harus mengembalikan Promise berisi array data mentah dari API resmi. */
    async fetchRawReports() {
        throw new Error("API resmi myITS Lost & Found belum dikonfigurasi.");
    },

    /**
     * Ubah satu data mentah menjadi format yang dipakai antarmuka:
     * { id, category: "lostfound", reportType: "kehilangan" | "temuan",
     *   title, location, date: "TTTT-BB-HH", summary, description,
     *   features: [], status, image }
     */
    toAnnouncement(raw) {
        throw new Error("Pemetaan field API belum dibuat.");
    }
};

const DataService = {
    /**
     * @returns {Promise<{items: Array, lostFoundSource: "demo"|"api"}>}
     * lostFoundSource dipakai antarmuka untuk menandai data simulasi dengan jujur.
     */
    async getAnnouncements() {
        if (CONFIG.integrationMode === "api") {
            try {
                const raw = await OfficialApiAdapter.fetchRawReports();
                const reports = raw.map((r) => OfficialApiAdapter.toAnnouncement(r));
                // Pengumuman akademik & kegiatan tetap dummy.
                const others = DEMO_ANNOUNCEMENTS.filter((a) => a.category !== "lostfound");
                return { items: sortByDate([...reports, ...others]), lostFoundSource: "api" };
            } catch (error) {
                console.warn("Memakai data simulasi:", error.message);
            }
        }
        return { items: sortByDate([...DEMO_ANNOUNCEMENTS]), lostFoundSource: "demo" };
    }
};

function sortByDate(list) {
    return list.sort((a, b) => b.date.localeCompare(a.date));
}
