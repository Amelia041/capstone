const STORAGE_KEY = "myits_lost_found_reports_v1";

const sampleReports = [
  {
    id: "demo-001",
    category: "Kehilangan",
    name: "Botol minum",
    location: "Perpustakaan ITS",
    date: "2026-11-18",
    description: "Botol minum berwarna hitam dengan stiker kecil di bagian samping. Terakhir terlihat di area meja baca lantai 2.",
    imageUrl: "",
    createdAt: "2026-11-18T09:00:00.000Z"
  },
  {
    id: "demo-002",
    category: "Temuan",
    name: "Tempat pensil",
    location: "Departemen Sistem Informasi",
    date: "2026-11-19",
    description: "Tempat pensil berbahan kain berwarna biru ditemukan di sekitar ruang kelas.",
    imageUrl: "",
    createdAt: "2026-11-19T08:00:00.000Z"
  }
];

function getReports() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleReports));
      return [...sampleReports];
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Gagal membaca data laporan:", error);
    return [];
  }
}

function saveReports(reports) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
}

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(`${dateString}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? "-"
    : new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function reportCard(report) {
  const isFound = report.category === "Temuan";
  const image = report.imageUrl
    ? `<img src="${escapeHTML(report.imageUrl)}" alt="Foto ${escapeHTML(report.name)}" onerror="this.parentElement.textContent='▧'">`
    : "▧";
  return `
    <article class="report-card">
      <div class="report-image">${image}</div>
      <div class="report-body">
        <div class="card-top"><span class="tag ${isFound ? "found" : ""}">${isFound ? "Barang ditemukan" : "Barang hilang"}</span></div>
        <h3>${escapeHTML(report.name)}</h3>
        <div class="report-meta">⌖ ${escapeHTML(report.location)}<br>▦ ${formatDate(report.date)}</div>
        <button class="text-button" data-detail="${escapeHTML(report.id)}">Lihat detail →</button>
      </div>
    </article>`;
}

function renderCards() {
  const reports = getReports().sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const homeContainer = document.getElementById("home-announcements");
  const listContainer = document.getElementById("announcement-list");
  if (homeContainer) {
    homeContainer.innerHTML = reports.slice(0, 4).map(reportCard).join("");
    if (reports.length === 0) homeContainer.innerHTML = '<p class="empty-state">Belum ada laporan.</p>';
  }
  if (listContainer) applyFilters();
}

function applyFilters() {
  const query = (document.getElementById("search-input")?.value || "").toLowerCase().trim();
  const category = document.getElementById("category-filter")?.value || "";
  const filtered = getReports()
    .filter(report => !category || report.category === category)
    .filter(report => `${report.name} ${report.location} ${report.description}`.toLowerCase().includes(query))
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  document.getElementById("announcement-list").innerHTML = filtered.map(reportCard).join("");
  document.getElementById("empty-state").classList.toggle("hidden", filtered.length > 0);
}

function showPage(pageName) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  const target = document.getElementById(`page-${pageName}`);
  if (target) target.classList.add("active");
  document.querySelectorAll(".nav-link").forEach(button => {
    button.classList.toggle("active", button.dataset.page === pageName);
  });
  const labels = { home: "Beranda", announcements: "Pengumuman", admin: "Kelola Laporan", detail: "Detail Laporan" };
  document.getElementById("breadcrumb-current").textContent = labels[pageName] || "Beranda";
  if (pageName === "home" || pageName === "announcements") renderCards();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showDetail(id) {
  const report = getReports().find(item => item.id === id);
  if (!report) {
    alert("Laporan tidak ditemukan. Silakan periksa kembali daftar pengumuman.");
    showPage("announcements");
    return;
  }
  const image = report.imageUrl
    ? `<img src="${escapeHTML(report.imageUrl)}" alt="Foto ${escapeHTML(report.name)}" onerror="this.parentElement.textContent='▧'">`
    : "▧";
  document.getElementById("detail-content").innerHTML = `
    <article class="detail-card">
      <div class="detail-hero">${image}</div>
      <div class="detail-body">
        <span class="tag ${report.category === "Temuan" ? "found" : ""}">${report.category === "Temuan" ? "Barang ditemukan" : "Barang hilang"}</span>
        <h1>${escapeHTML(report.name)}</h1>
        <p class="detail-description">${escapeHTML(report.description)}</p>
        <div class="detail-info"><span>⌖ ${escapeHTML(report.location)}</span><span>▦ ${formatDate(report.date)}</span></div>
        <p class="muted">Informasi ini merupakan data demonstrasi untuk prototype Q3.04.</p>
      </div>
    </article>`;
  showPage("detail");
}

document.querySelectorAll(".nav-link").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => showPage(button.dataset.go));
});

document.addEventListener("click", event => {
  const detailButton = event.target.closest("[data-detail]");
  if (detailButton) showDetail(detailButton.dataset.detail);
});

document.getElementById("back-to-list").addEventListener("click", () => showPage("announcements"));
document.getElementById("search-input").addEventListener("input", applyFilters);
document.getElementById("category-filter").addEventListener("change", applyFilters);

document.getElementById("report-form").addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.getElementById("form-message");
  const report = {
    id: `report-${Date.now()}`,
    category: document.getElementById("category").value,
    name: document.getElementById("item-name").value.trim(),
    location: document.getElementById("location").value.trim(),
    date: document.getElementById("incident-date").value,
    description: document.getElementById("description").value.trim(),
    imageUrl: document.getElementById("image-url").value.trim(),
    createdAt: new Date().toISOString()
  };

  if (!report.category || !report.name || !report.location || !report.date || !report.description) {
    message.textContent = "Periksa kembali. Semua kolom wajib harus diisi.";
    message.className = "form-message error";
    return;
  }

  try {
    const reports = getReports();
    reports.push(report);
    saveReports(reports);
    form.reset();
    message.textContent = "Laporan berhasil disimpan dan sudah ditambahkan ke Pengumuman.";
    message.className = "form-message success";
    renderCards();
  } catch (error) {
    console.error("Gagal menyimpan laporan:", error);
    message.textContent = "Laporan gagal disimpan. Penyimpanan browser mungkin penuh atau tidak tersedia.";
    message.className = "form-message error";
  }
});

document.getElementById("report-form").addEventListener("reset", () => {
  const message = document.getElementById("form-message");
  message.className = "form-message hidden";
  message.textContent = "";
});

renderCards();
