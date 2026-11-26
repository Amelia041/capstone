/**
 * app.js
 * Antarmuka: navigasi, tampilan halaman, popup, dan pencatatan uji coba.
 * Data pengumuman diambil hanya melalui DataService (data.js).
 */
(function () {
    "use strict";

    /* ============ Penyimpanan (aman jika storage diblokir) ============ */
    const memory = {};
    function createStore(name) {
        return {
            get(key) {
                try { return window[name].getItem(key); }
                catch (e) { return memory[name + key] ?? null; }
            },
            set(key, value) {
                try { window[name].setItem(key, value); }
                catch (e) { memory[name + key] = value; }
            },
            remove(key) {
                try { window[name].removeItem(key); }
                catch (e) { delete memory[name + key]; }
            }
        };
    }
    const session = createStore("sessionStorage"); // status login & popup
    const local = createStore("localStorage");     // catatan uji & preferensi

    const KEY = {
        loggedIn: "lf_loggedIn",
        popupClosed: "lf_popupClosed",
        favorites: "lf_favorites",
        largeText: "lf_largeText",
        log: "lf_testLog"
    };

    /* ============ Catatan uji coba (tersimpan di perangkat ini saja) ============ */
    function readLog() {
        try { return JSON.parse(local.get(KEY.log)) || []; }
        catch (e) { return []; }
    }
    function track(event, detail = "") {
        const log = readLog();
        log.push({ time: new Date().toISOString(), event, detail });
        local.set(KEY.log, JSON.stringify(log.slice(-500)));
    }

    /* ============ Bantuan ============ */
    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

    // Semua teks dari data di-escape agar aman ketika kelak berasal dari API.
    function esc(value) {
        return String(value ?? "").replace(/[&<>"']/g, (c) => (
            { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
        ));
    }

    function parseDate(iso) {
        const [y, m, d] = iso.split("-").map(Number);
        return new Date(y, m - 1, d);
    }
    function formatDate(iso) {
        return parseDate(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    }

    const ICON_PATHS = {
        home: '<path d="M3 11 12 3l9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
        user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>',
        megaphone: '<path d="M3 10v4h4l9 5V5l-9 5H3Z"/><path d="M19 9a4 4 0 0 1 0 6M7 14l1.5 6h3"/>',
        gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/><circle cx="12" cy="12" r="7"/>',
        pin: '<path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
        calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
        doc: '<path d="M6 3h9l4 4v14H6Z"/><path d="M14 3v5h5M9 13h7M9 17h7"/>',
        info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.500v.1"/>',
        shield: '<path d="M12 3 20 6v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6Z"/><path d="m8.500 12 2.500 2.500 4.500-5"/>',
        external: '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v6H4V6h6"/>',
        arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
        back: '<path d="m15 5-7 7 7 7"/>',
        close: '<path d="m6 6 12 12M18 6 6 18"/>',
        search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
        book: '<path d="M12 6c-2-1.500-5-2-9-1.500v14c4-.5 7 0 9 1.500 2-1.500 5-2 9-1.500v-14c-4-.5-7 0-9 1.500Zm0 0v14"/>',
        grid: '<rect x="4" y="4" width="6" height="6"/><rect x="14" y="4" width="6" height="6"/><rect x="4" y="14" width="6" height="6"/><rect x="14" y="14" width="6" height="6"/>',
        star: '<path d="m12 3 2.7 5.8 6.3.7-4.7 4.300 1.3 6.200-5.600-3.200L6.400 20l1.3-6.200L3 9.500l6.300-.7Z"/>'
    };
    function icon(name) {
        return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
    }

    const CATEGORY_LABEL = { akademik: "Akademik", kegiatan: "Kegiatan", lostfound: "Kehilangan & Temuan" };
    const TYPE = {
        kehilangan: {
            label: "Kehilangan", badge: "badge--lost", place: "Lokasi kehilangan",
            question: "Apakah Anda menemukan atau melihat barang ini?"
        },
        temuan: {
            label: "Temuan", badge: "badge--found", place: "Lokasi penemuan",
            question: "Apakah barang ini milik Anda?"
        }
    };
    function badge(item) {
        if (item.category === "lostfound") {
            const type = TYPE[item.reportType];
            return `<span class="badge ${type.badge}">${type.label}</span>`;
        }
        return `<span class="badge">${CATEGORY_LABEL[item.category]}</span>`;
    }

    function photo(item, className) {
        if (!item.image) return `<div class="${className} photo-empty">Foto tidak tersedia</div>`;
        return `<img class="${className}" src="${esc(item.image)}" alt="Gambar ${esc(item.title)}">`;
    }

    /* ============ State ============ */
    const state = {
        items: [],
        source: "demo",
        search: "",
        appSearch: "",
        favoritesOnly: false,
        slide: 0,
        previousHash: null,
        currentHash: null
    };
    const findItem = (id) => state.items.find((item) => item.id === id);
    const featuredItem = () =>
        findItem(CONFIG.popupItemId) || state.items.find((item) => item.category === "lostfound");
    const isDemo = () => state.source === "demo";

    /* ============ Beranda ============ */
    const SLIDES = [
        { kicker: "PENGEMBANGAN KOMPETENSI", title: "PLC TRAINING", sub: "OPEN REGISTRATION", date: "28 & 29 November 2026", org: "Departemen Teknik Elektro ITS, Surabaya", id: "plc-training", button: "Informasi pendaftaran", tag: "LEARN · BUILD" },
        { kicker: "KEMAHASISWAAN", title: "STUDENT CONNECT", sub: "CATAT KEGIATANMU", date: "Sepanjang semester", org: "myITS StudentConnect", id: "student-connect", button: "Baca informasi", tag: "ACT · GROW" },
        { kicker: "AKADEMIK", title: "PERENCANAAN SKEM", sub: "DAPAT DILAKUKAN KAPAN SAJA", date: "Mulai semester genap 2025/2026", org: "Institut Teknologi Sepuluh Nopember", id: "perencanaan-skem", button: "Baca informasi", tag: "PLAN · DO" }
    ];

    const APPS = [
        { name: "Cek PDDIKTI", desc: "Periksa data PDDIKTI", icon: "book" },
        { name: "myITS Academics 2.0", desc: "Perwalian, FRS, Presensi, Penilaian", icon: "grid" },
        { name: "myITS Classroom", desc: "Akses kelas dan materi", icon: "book" },
        { name: "myITS LSP", desc: "Kelola sertifikasi profesi", icon: "grid" },
        { name: "myITS Thesis", desc: "Kelola tugas akhir", icon: "book" },
        { name: "myITS Wali", desc: "Informasi wali dan bimbingan", icon: "grid" }
    ];

    function bannerHtml() {
        const s = SLIDES[state.slide];
        return `
            <div class="banner__body">
                <div>
                    <p class="banner__kicker">${s.kicker}</p>
                    <h2>${s.title}</h2>
                    <p class="banner__sub">${s.sub}</p>
                    <p class="banner__date">${s.date}</p>
                    <p class="banner__org">${s.org}</p>
                    <a class="btn btn--light" href="#/detail/${s.id}">${s.button} ${icon("arrow")}</a>
                </div>
                <div class="banner__tile" aria-hidden="true">${icon("grid")}<span>${s.tag}</span></div>
            </div>
            <div class="banner__dots">
                ${SLIDES.map((_, i) => `<button type="button" data-slide="${i}" aria-label="Tampilkan banner ${i + 1}" aria-pressed="${i === state.slide}"></button>`).join("")}
            </div>`;
    }

    function readFavorites() {
        try { return JSON.parse(local.get(KEY.favorites)) || []; }
        catch (e) { return []; }
    }

    function appListHtml() {
        const favorites = readFavorites();
        const query = state.appSearch.trim().toLowerCase();
        const list = APPS.filter((a) =>
            (!state.favoritesOnly || favorites.includes(a.name)) &&
            (a.name + " " + a.desc).toLowerCase().includes(query));
        if (!list.length) {
            return `<p class="empty">${state.favoritesOnly && !favorites.length
                ? "Belum ada aplikasi favorit. Tekan ikon bintang pada aplikasi untuk menambahkannya."
                : "Aplikasi tidak ditemukan."}</p>`;
        }
        return `<ul class="apps">${list.map((a) => `
            <li class="apps__item">
                <button type="button" class="apps__open" data-app="${a.name}">
                    <span class="icon-box">${icon(a.icon)}</span>
                    <span><strong>${a.name}</strong><small>${a.desc}</small></span>
                </button>
                <button type="button" class="apps__fav" data-fav="${a.name}" aria-pressed="${favorites.includes(a.name)}" aria-label="Favoritkan ${a.name}">${icon("star")}</button>
            </li>`).join("")}</ul>`;
    }

    function widgetHtml() {
        const featured = featuredItem();
        const others = state.items.filter((i) => i.category !== "lostfound").slice(0, 3);
        return `
            <section class="card">
                <h2>Pengumuman</h2>
                ${featured ? `
                <article class="notice notice--featured">
                    <span class="icon-box">${icon("megaphone")}</span>
                    <div>
                        ${badge(featured)}
                        <h3>${featured.reportType === "temuan" ? "Barang Ditemukan" : "Kehilangan Barang"}: ${esc(featured.title)}</h3>
                        <p>Lokasi: ${esc(featured.location)}</p>
                        <time datetime="${featured.date}">${formatDate(featured.date)}</time>
                        <a class="btn btn--primary btn--small" href="#/detail/${esc(featured.id)}" data-track="widget">Lihat Informasi ${icon("arrow")}</a>
                    </div>
                </article>` : ""}
                ${others.map((item) => `
                <article class="notice">
                    <span class="icon-box">${icon("megaphone")}</span>
                    <div>
                        ${badge(item)}
                        <h3 class="clamp">${esc(item.title)}</h3>
                        <p class="clamp">${esc(item.summary)}</p>
                        <time datetime="${item.date}">${formatDate(item.date)}</time>
                        <a class="btn btn--small" href="#/detail/${esc(item.id)}">Selengkapnya</a>
                    </div>
                </article>`).join("")}
                <a class="btn btn--block" href="#/pengumuman">Lihat Semua Pengumuman</a>
            </section>`;
    }

    function renderHome(view) {
        const today = CONFIG.demoDate ? parseDate(CONFIG.demoDate) : new Date();
        view.innerHTML = `
            <h1 class="sr-only">Beranda</h1>
            <div class="dashboard">
                <div class="column">
                    <section class="banner" id="banner" aria-label="Banner kegiatan kampus">${bannerHtml()}</section>
                    <section class="card">
                        <h2>Kegiatanmu Berharga, Yuk Catat di myITS StudentConnect!</h2>
                        <h3>myITS StudentConnect</h3>
                        <p class="muted">Prestasi/kegiatan kemahasiswaan Anda akan masuk ke Surat Keterangan Pendamping Ijazah (SKPI).</p>
                        <a class="link" href="#/detail/student-connect">Selengkapnya ${icon("arrow")}</a>
                    </section>
                    <section class="card card--row">
                        <div>
                            <h2>Perencanaan SKEM</h2>
                            <p class="muted">Mulai semester genap 2025/2026, perencanaan SKEM dapat dilakukan kapan saja.</p>
                        </div>
                        <a class="icon-box icon-box--link" href="#/detail/perencanaan-skem" aria-label="Buka informasi Perencanaan SKEM">${icon("book")}</a>
                    </section>
                    <section class="card">
                        <div class="card__head">
                            <h2>Aplikasi</h2>
                            <button type="button" class="btn btn--small" id="favorite-toggle" aria-pressed="${state.favoritesOnly}">${icon("star")} Tampilkan Favorit Saja</button>
                        </div>
                        <label class="search">${icon("search")}<span class="sr-only">Cari aplikasi</span>
                            <input type="search" id="app-search" placeholder="Cari aplikasi..." value="${esc(state.appSearch)}">
                        </label>
                        <h3 class="group-title">Akademik</h3>
                        <div id="app-list">${appListHtml()}</div>
                    </section>
                </div>
                <div class="column">
                    <section class="card calendar" aria-label="Kalender">
                        <h2>${today.toLocaleDateString("id-ID", { weekday: "long" })}</h2>
                        <p class="muted">${today.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                        <p class="calendar__week">${icon("calendar")} ${esc(CONFIG.lectureWeek)}</p>
                    </section>
                    ${widgetHtml()}
                </div>
            </div>`;

        $("#banner").addEventListener("click", (event) => {
            const dot = event.target.closest("[data-slide]");
            if (!dot) return;
            state.slide = Number(dot.dataset.slide);
            $("#banner").innerHTML = bannerHtml();
            $(`[data-slide="${state.slide}"]`).focus();
        });
        const refreshApps = () => { $("#app-list").innerHTML = appListHtml(); };
        $("#app-search").addEventListener("input", (event) => {
            state.appSearch = event.target.value;
            refreshApps();
        });
        $("#favorite-toggle").addEventListener("click", (event) => {
            state.favoritesOnly = !state.favoritesOnly;
            event.currentTarget.setAttribute("aria-pressed", state.favoritesOnly);
            refreshApps();
        });
        $("#app-list").addEventListener("click", (event) => {
            const fav = event.target.closest("[data-fav]");
            const app = event.target.closest("[data-app]");
            if (fav) {
                const name = fav.dataset.fav;
                const list = readFavorites();
                const next = list.includes(name) ? list.filter((n) => n !== name) : [...list, name];
                local.set(KEY.favorites, JSON.stringify(next));
                refreshApps();
            } else if (app) {
                openMessage(app.dataset.app, "Aplikasi ini tidak tersedia pada prototipe. Fokus uji coba adalah informasi Lost & Found.");
            }
        });
    }

    /* ============ Pengumuman ============ */
    const TABS = [
        { slug: "semua", label: "Semua" },
        { slug: "akademik", label: "Akademik" },
        { slug: "kegiatan", label: "Kegiatan" },
        { slug: "lostfound", label: "Kehilangan & Temuan" }
    ];

    function cardHtml(item) {
        const isReport = item.category === "lostfound";
        return `
            <article class="announcement" data-id="${esc(item.id)}">
                ${isReport
                    ? photo(item, "announcement__photo")
                    : `<div class="announcement__photo announcement__photo--icon">${icon(item.category === "akademik" ? "book" : "megaphone")}</div>`}
                <div class="announcement__body">
                    ${badge(item)}
                    <h2>${esc(item.title)}</h2>
                    ${isReport ? `<p class="meta">${icon("pin")} Lokasi: ${esc(item.location)}</p>` : ""}
                    <p class="meta">${icon("calendar")} Tanggal: ${formatDate(item.date)}</p>
                    <p class="muted">${esc(item.summary)}</p>
                    <a class="btn announcement__action" href="#/detail/${esc(item.id)}" data-track="daftar">Lihat Informasi ${icon("arrow")}</a>
                </div>
            </article>`;
    }

    function listHtml(tab) {
        const query = state.search.trim().toLowerCase();
        const list = state.items.filter((item) =>
            (tab === "semua" || item.category === tab) &&
            [item.title, item.summary, item.location, CATEGORY_LABEL[item.category], TYPE[item.reportType]?.label]
                .join(" ").toLowerCase().includes(query));
        return list.length ? list.map(cardHtml).join("") : '<p class="empty card">Tidak ada pengumuman yang cocok.</p>';
    }

    function renderAnnouncements(view, tabParam) {
        const tab = TABS.some((t) => t.slug === tabParam) ? tabParam : "semua";
        view.innerHTML = `
            <div class="page">
                <h1>Pengumuman</h1>
                <p class="muted">Temukan informasi dan pengumuman terbaru di lingkungan ITS.</p>
                <label class="search search--large">${icon("search")}<span class="sr-only">Cari pengumuman</span>
                    <input type="search" id="search" placeholder="Cari pengumuman..." value="${esc(state.search)}">
                </label>
                <nav class="tabs" aria-label="Kategori pengumuman">
                    ${TABS.map((t) => `<a href="#/pengumuman/${t.slug}" ${t.slug === tab ? 'aria-current="true"' : ""}>${t.label}</a>`).join("")}
                </nav>
                <div id="list">${listHtml(tab)}</div>
            </div>`;
        $("#search").addEventListener("input", (event) => {
            state.search = event.target.value;
            $("#list").innerHTML = listHtml(tab);
        });
        track("buka_pengumuman", tab);
    }

    /* ============ Detail ============ */
    function officialUrl() {
        try {
            const url = new URL(CONFIG.lostFoundOfficialUrl);
            return url.protocol === "https:" ? url.href : null;
        } catch (e) {
            return null;
        }
    }

    function row(iconName, label, value) {
        return `<div class="info-row"><span class="icon-box">${icon(iconName)}</span>
            <div><dt>${label}</dt><dd>${value}</dd></div></div>`;
    }

    function renderDetail(view, id) {
        const item = findItem(id);
        if (!item) {
            view.innerHTML = `<div class="page"><div class="card"><h1>Pengumuman tidak ditemukan</h1>
                <a class="btn btn--primary" href="#/pengumuman">Ke halaman Pengumuman</a></div></div>`;
            return;
        }
        const isReport = item.category === "lostfound";
        const url = officialUrl();
        view.innerHTML = `
            <div class="page">
                <article class="card detail">
                    <button type="button" class="btn btn--small" id="back">${icon("back")} Kembali</button>
                    <div>${badge(item)}</div>
                    <h1>${esc(item.title)}</h1>
                    ${isReport ? photo(item, "detail__photo") : ""}
                    <dl>
                        ${isReport ? row("info", "Kategori", TYPE[item.reportType].label) : ""}
                        ${isReport ? row("pin", TYPE[item.reportType].place, esc(item.location)) : ""}
                        ${row("calendar", isReport ? "Tanggal kejadian" : "Tanggal pengumuman", formatDate(item.date))}
                        ${row("doc", isReport ? "Deskripsi barang" : "Isi pengumuman", esc(item.description))}
                        ${isReport && item.features?.length ? row("search", "Ciri-ciri barang",
                            `<ul>${item.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>`) : ""}
                        ${isReport && item.status ? row("shield", "Status informasi",
                            esc(item.status) + (isDemo() ? " (simulasi)" : "")) : ""}
                    </dl>
                </article>
                ${isReport ? `
                <section class="card followup">
                    <p class="followup__text">${icon("info")}<span>Untuk memperoleh informasi lebih lanjut atau melakukan tindak lanjut terkait barang, silakan kunjungi layanan resmi myITS Lost &amp; Found.</span></p>
                    ${url
                        ? `<a class="btn btn--primary btn--block" id="official-link" href="${esc(url)}" target="_blank" rel="noopener noreferrer">Informasi Lebih Lanjut ${icon("external")}</a>
                           <p class="hint">Layanan resmi terbuka di tab baru.</p>`
                        : `<button type="button" class="btn btn--primary btn--block" id="official-missing">Informasi Lebih Lanjut ${icon("external")}</button>`}
                    <p class="hint">${icon("shield")} Proses pelaporan, komunikasi dengan petugas, dan verifikasi tetap dilakukan melalui layanan resmi.</p>
                </section>` : ""}
            </div>`;

        $("#back").addEventListener("click", () => {
            if (state.previousHash) history.back();
            else location.hash = "#/pengumuman";
        });
        $("#official-link")?.addEventListener("click", () => track("klik_layanan_resmi", item.id));
        $("#official-missing")?.addEventListener("click", () => openMessage(
            "URL layanan resmi belum diisi",
            "Pengelola prototipe: isi lostFoundOfficialUrl pada file config.js dengan alamat resmi yang diawali https://."));
        track("buka_detail", item.id);
    }

    /* ============ Akun, Pengaturan, Fasilitator ============ */
    function renderAccount(view) {
        view.innerHTML = `
            <div class="page">
                <h1>Akun</h1>
                <section class="card">
                    <h2>Mahasiswa Simulasi</h2>
                    <p class="muted">Profil contoh untuk prototipe. Tidak ada akun myITS atau data pribadi yang digunakan.</p>
                    <button type="button" class="btn" id="logout">Keluar</button>
                </section>
            </div>`;
        $("#logout").addEventListener("click", logout);
    }

    function renderSettings(view) {
        view.innerHTML = `
            <div class="page">
                <h1>Pengaturan Web</h1>
                <section class="card">
                    <h2>Tampilan</h2>
                    <label class="check"><input type="checkbox" id="large-text" ${local.get(KEY.largeText) ? "checked" : ""}> Perbesar ukuran teks</label>
                </section>
                <section class="card">
                    <h2>Notifikasi Lost &amp; Found</h2>
                    <p class="muted">Tampilkan kembali popup pengumuman di Beranda.</p>
                    <button type="button" class="btn" id="show-popup">Tampilkan popup lagi</button>
                </section>
            </div>`;
        $("#large-text").addEventListener("change", (event) => {
            if (event.target.checked) local.set(KEY.largeText, "1");
            else local.remove(KEY.largeText);
            applyTextSize();
        });
        $("#show-popup").addEventListener("click", () => {
            session.remove(KEY.popupClosed);
            location.hash = "#/beranda";
        });
    }

    // Halaman tersembunyi untuk fasilitator: tambahkan #/fasilitator pada alamat.
    function renderFacilitator(view) {
        const log = readLog();
        const csv = ["waktu,kejadian,keterangan",
            ...log.map((l) => [l.time, l.event, l.detail].join(","))].join("\n");
        view.innerHTML = `
            <div class="page">
                <h1>Catatan Uji Coba</h1>
                <p class="muted">Tersimpan hanya di browser perangkat ini dan tidak dikirim ke mana pun. Waktu dalam format UTC.</p>
                <section class="card">
                    <div class="actions">
                        <button type="button" class="btn btn--primary" id="download">Unduh CSV</button>
                        <button type="button" class="btn" id="copy">Salin</button>
                        <button type="button" class="btn" id="reset">Hapus catatan &amp; mulai peserta baru</button>
                    </div>
                    <p class="hint" id="copy-status" role="status"></p>
                    <label class="sr-only" for="csv">Isi catatan</label>
                    <textarea id="csv" rows="16" readonly>${esc(csv)}</textarea>
                </section>
            </div>`;
        $("#download").addEventListener("click", () => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
            link.download = "catatan-uji.csv";
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 1000);
        });
        $("#copy").addEventListener("click", async () => {
            const area = $("#csv");
            try { await navigator.clipboard.writeText(csv); $("#copy-status").textContent = "Catatan disalin."; }
            catch (e) { area.select(); $("#copy-status").textContent = "Teks sudah dipilih, salin secara manual."; }
        });
        $("#reset").addEventListener("click", () => {
            [KEY.log, KEY.favorites, KEY.largeText].forEach((k) => local.remove(k));
            applyTextSize();
            Object.assign(state, { search: "", appSearch: "", favoritesOnly: false, slide: 0 });
            logout(false);
        });
    }

    /* ============ Popup ============ */
    let modal = null;

    function openModal(html, onClose) {
        closeModal("diganti");
        const lastFocus = document.activeElement;
        const root = $("#modal-root");
        root.innerHTML = `<div class="backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1">
            <button type="button" class="modal__close" data-close="tombol_x" aria-label="Tutup">${icon("close")}</button>${html}</div></div>`;
        $("#app").inert = true;
        document.body.classList.add("modal-open");
        modal = { onClose, lastFocus };
        $$("[data-close]", root).forEach((el) =>
            el.addEventListener("click", (event) => {
                // Tautan dipindahkan lewat script: elemen yang sudah dihapus
                // dari halaman tidak selalu diikuti oleh semua browser.
                const target = el.getAttribute("href");
                if (target) event.preventDefault();
                closeModal(el.dataset.close);
                if (target) location.hash = target;
            }));
        $(".modal", root).focus();
    }

    function closeModal(reason) {
        if (!modal) return;
        const { onClose, lastFocus } = modal;
        modal = null;
        $("#modal-root").innerHTML = "";
        $("#app").inert = false;
        document.body.classList.remove("modal-open");
        if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
        onClose?.(reason);
    }

    function openMessage(title, message) {
        openModal(`<h2 id="modal-title">${esc(title)}</h2><p>${esc(message)}</p>
            <button type="button" class="btn btn--primary btn--block" data-close="ok">Mengerti</button>`);
    }

    function openLostFoundPopup() {
        const item = featuredItem();
        if (!item || session.get(KEY.popupClosed)) return;
        const type = TYPE[item.reportType];
        openModal(`
            <h2 id="modal-title">Pengumuman Kehilangan &amp; Temuan</h2>
            <p class="popup__tags">${badge(item)}${isDemo() ? '<span class="badge badge--demo">Data simulasi</span>' : ""}</p>
            <div class="popup__item">
                ${photo(item, "popup__photo")}
                <div>
                    <h3>${esc(item.title)}</h3>
                    <dl>
                        <dt>Kategori</dt><dd>${type.label}</dd>
                        <dt>Lokasi</dt><dd>${esc(item.location)}</dd>
                        <dt>Tanggal</dt><dd>${formatDate(item.date)}</dd>
                    </dl>
                </div>
            </div>
            <p class="popup__desc">${esc(item.summary)}</p>
            <p class="popup__question">${type.question}</p>
            <a class="btn btn--primary btn--block" href="#/detail/${esc(item.id)}" data-close="lihat_informasi">Lihat Informasi</a>
            <button type="button" class="btn btn--block" data-close="abaikan">Abaikan</button>`,
            (reason) => {
                // Cara apa pun menutupnya, popup tidak muncul lagi pada sesi ini.
                session.set(KEY.popupClosed, "1");
                track("popup_ditutup", reason);
            });
        track("popup_tampil", item.id);
    }

    document.addEventListener("keydown", (event) => {
        if (!modal) return;
        if (event.key === "Escape") closeModal("escape");
        if (event.key === "Tab") { // fokus tetap di dalam popup
            const focusable = $$("#modal-root a[href], #modal-root button");
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            const active = document.activeElement;
            if (event.shiftKey && (active === first || active.classList.contains("modal"))) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
        }
    });

    /* ============ Navigasi ============ */
    const ROUTES = {
        beranda: renderHome,
        pengumuman: renderAnnouncements,
        detail: renderDetail,
        akun: renderAccount,
        pengaturan: renderSettings,
        fasilitator: renderFacilitator
    };

    function render() {
        const loggedIn = Boolean(session.get(KEY.loggedIn));
        $("#login-page").hidden = loggedIn;
        $("#app").hidden = !loggedIn;
        if (!loggedIn) {
            closeModal("keluar");
            if (location.hash) history.replaceState(null, "", location.pathname + location.search);
            state.previousHash = state.currentHash = null;
            return;
        }

        let [name, param] = location.hash.replace(/^#\/?/, "").split("/");
        if (!Object.hasOwn(ROUTES, name)) {
            name = "beranda";
            param = undefined;
            history.replaceState(null, "", "#/beranda");
        }
        closeModal("pindah_halaman");

        if (state.currentHash !== location.hash) {
            state.previousHash = state.currentHash;
            state.currentHash = location.hash;
        }

        const view = $("#view");
        view.innerHTML = "";
        ROUTES[name](view, param);

        const activeNav = name === "detail" ? "pengumuman" : name;
        $$("[data-nav]").forEach((link) => {
            if (link.dataset.nav === activeNav) link.setAttribute("aria-current", "page");
            else link.removeAttribute("aria-current");
        });
        window.scrollTo(0, 0);
        if (name === "beranda") openLostFoundPopup();
        if (!modal) view.focus({ preventScroll: true });
    }

    function login() {
        session.set(KEY.loggedIn, "1");
        session.remove(KEY.popupClosed); // setiap login baru, popup muncul sekali
        track("masuk");
        history.pushState(null, "", "#/beranda");
        render();
    }

    function logout(record = true) {
        if (record) track("keluar");
        session.remove(KEY.loggedIn);
        session.remove(KEY.popupClosed);
        render();
    }

    function applyTextSize() {
        document.documentElement.classList.toggle("large-text", Boolean(local.get(KEY.largeText)));
    }

    async function init() {
        const data = await DataService.getAnnouncements();
        state.items = data.items;
        state.source = data.lostFoundSource;

        $$("[data-icon]").forEach((el) => { el.innerHTML = icon(el.dataset.icon); });
        if (!isDemo()) $(".proto-badge").textContent = "Prototipe";
        $("#footer-note").textContent = isDemo()
            ? "Prototipe, bukan situs resmi ITS. Seluruh pengumuman merupakan data simulasi dan tidak berasal dari database myITS Lost & Found."
            : "Prototipe, bukan situs resmi ITS. Pengumuman akademik dan kegiatan merupakan data simulasi.";
        $("#login-button").addEventListener("click", login);
        document.addEventListener("click", (event) => {
            const link = event.target.closest("[data-track]");
            if (link) track("klik_lihat_informasi", link.dataset.track);
        });
        window.addEventListener("hashchange", render);
        applyTextSize();
        render();
    }

    init();
})();
