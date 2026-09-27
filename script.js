// ============================================================
      // SISTEM TRANSLASI (LANGUAGE TOGGLE)
      // ============================================================
      let lang = localStorage.getItem("fuh_lang") || "tr";

      // Fungsi t(Turki, Indonesia) -> Akan mengembalikan string sesuai bahasa aktif
      const t = (tr, id) => lang === "id" && id ? id : tr;

      window.setLang = (l) => {
        if (l === lang) return;
        localStorage.setItem("fuh_lang", l);
        lang = l;
        // Re-render in place instead of location.reload() so there's no
        // full-page flash — just redraw whichever screen is currently up.
        if (App.user && App.user.nama) {
          renderApp();
        } else {
          renderGate(false);
        }
        applyHtmlTranslations();
      };

      function applyHtmlTranslations() {
        document.querySelectorAll("[data-tr]").forEach(el => {
          el.innerHTML = lang === "id" ? (el.getAttribute("data-id") || el.getAttribute("data-tr")) : el.getAttribute("data-tr");
        });
        document.querySelectorAll("[data-ph-tr]").forEach(el => {
          el.placeholder = lang === "id" ? (el.getAttribute("data-ph-id") || el.getAttribute("data-ph-tr")) : el.getAttribute("data-ph-tr");
        });
        document.querySelectorAll("option[data-tr]").forEach(el => {
          el.text = lang === "id" ? (el.getAttribute("data-id") || el.getAttribute("data-tr")) : el.getAttribute("data-tr");
        });
      }

      document.addEventListener("DOMContentLoaded", applyHtmlTranslations);

      const setBtnLoading = (btn, isLoading) => {
        if (!btn) return;
        if (isLoading) {
          btn.classList.add("btn-loading");
          btn.disabled = true;
          btn.dataset.originalText = btn.innerText;
          btn.innerText = t("İşleniyor...", "Memproses...");
        } else {
          btn.classList.remove("btn-loading");
          btn.disabled = false;
          if (btn.dataset.originalText) {
            btn.innerText = btn.dataset.originalText;
          }
        }
      };

      // Dibuat sebagai fungsi (bukan array statis) supaya labelnya ikut
      // berganti bahasa saat setLang() dipanggil tanpa reload halaman.
      function getAktivitas() {
        return [
        {
          id: "kotak-acma",
          label: t("Sadaka Kutusu Açma", "Buka Kotak Amal"),
          icon: "bi-safe-fill",
          color: "#0B4D3B",
          bg: "#E8F8F3",
          uang: true,
          lokasi: "kotakAmal",
        },
        {
          id: "kotak-koyma",
          label: t("Sadaka Kutusu Koyma", "Taruh Kotak Amal"),
          icon: "bi-safe",
          color: "#2563EB",
          bg: "#EFF6FF",
          isKoyma: true,
          lokasiType: "kotakBaru",
        },
        {
          id: "kumbara-koyma",
          label: t("Kumbara Koyma", "Taruh Kumbara"),
          icon: "bi-database",
          color: "#7C3AED",
          bg: "#F5F3FF",
          isKoyma: true,
          lokasiType: "kumbara",
        },
        {
          id: "kumbara-acma",
          label: t("Kumbara Açma", "Buka Kumbara"),
          icon: "bi-database-fill",
          color: "#059669",
          bg: "#ECFDF5",
          uang: true,
          lokasi: "kumbara",
        },
        {
          id: "cami-eski",
          label: t("Eski Cami Ziyareti", "Kunjungan Masjid Lama"),
          icon: "bi-moon-stars-fill",
          color: "#B45309",
          bg: "#FFFBEB",
          lokasi: "masjidEski",
        },
        {
          id: "cami-yeni",
          label: t("Yeni Cami Ziyareti", "Kunjungan Masjid Baru"),
          icon: "bi-moon-stars",
          color: "#0891B2",
          bg: "#ECFEFF",
          isKoyma: true,
          lokasiType: "masjid",
          isMasjidYeni: true,
        },
        {
          id: "sibyan",
          label: t("Sıbyan Hizmeti", "Layanan Pendidikan Anak (Sibyan)"),
          icon: "bi-people-fill",
          color: "#BE185D",
          bg: "#FDF2F8",
        },
        {
          id: "esnaf",
          label: t("Esnaf Ziyareti", "Kunjungan Pedagang"),
          icon: "bi-shop",
          color: "#D97706",
          bg: "#FFFBEB",
        },
        {
          id: "esnaf-okutma",
          label: t("Esnaf Okutma", "Mengajar Pedagang"),
          icon: "bi-book-half",
          color: "#0D9488",
          bg: "#F0FDFA",
        },
        {
          id: "kurban",
          label: t("Adak & Kurban", "Akikah & Kurban"),
          icon: "bi-goat",
          color: "#DC2626",
          bg: "#FEF2F2",
          uang: true,
        },
        {
          id: "tahfiz",
          label: t("Hafızlık Sponsoru", "Sponsor Hafiz"),
          icon: "bi-book-fill",
          color: "#9333EA",
          bg: "#FAF5FF",
          uang: true,
        },
        {
          id: "umreci",
          label: t("Umreci Bulunan", "Pencarian Umrah"),
          icon: "bi-airplane-engines-fill",
          color: "#0891B2",
          bg: "#ECFEFF",
          butuhTelepon: true,
          sembunyikanPersonel: true,
          uang: false,
        },
        {
          id: "site-talebe",
          label: t("SITE Talebe Bulunan", "Pencarian Santri SITE"),
          icon: "bi-person-vcard-fill",
          color: "#4F46E5",
          bg: "#EEF2FF",
          butuhTelepon: true,
          sembunyikanPersonel: true,
          uang: false,
        },
        {
          id: "diger",
          label: t("Diğer", "Lainnya"),
          icon: "bi-three-dots",
          color: "#4B5563",
          bg: "#F3F4F6",
          uang: true,
        },
        ];
      }

      const savedUser = localStorage.getItem("fuh_session_user");

      const MAINTENANCE_MODE = false;

      function renderMaintenance(customText) {
        $("loaderScreen").style.display = "none";
        const msg = customText || t("Şu anda platform üzerinde geliştirme ve bakım çalışmaları yapılmaktadır. Daha iyi bir deneyim sunabilmek için kısa süreliğine çevrimdışıyız.", "Saat ini platform sedang dalam pengembangan dan pemeliharaan. Kami offline sejenak untuk memberikan pengalaman yang lebih baik.");

        $("root").innerHTML = `
          <div class="gate-wrap">
            <div class="gate-card text-center py-5">
              <div class="mb-3">
                <i class="bi bi-moon-stars-fill text-warning" style="font-size: 4rem; text-shadow: 0 4px 10px rgba(0,0,0,0.1);"></i>
              </div>
              <h3 class="fw-bold mb-3" style="color: var(--g900);">${t("Sistem Dinleniyor <br>(Sistem Bakımda)", "Sistem Sedang Istirahat <br>(Pemeliharaan Sistem)")}</h3>
              <p class="text-muted mb-4" style="font-size: 14px; line-height: 1.6;">
                ${msg}<br><br>
                ${t("Lütfen sabah 06:00'dan sonra tekrar deneyiniz. Anlayışınız için teşekkür ederiz.", "Silakan coba lagi setelah pukul 06:00 pagi. Terima kasih atas pengertiannya.")}
              </p>
              <div class="text-center mt-5 text-muted small">© <b>2026 YYSN Sulaimaniyah Jawa Tengah</b>.</div>
              <button class="btn btn-outline-secondary btn-sm mt-4 w-100" onclick="location.reload()"><i class="bi bi-arrow-clockwise me-1"></i> ${t("Sayfayı Yenile (Refresh)", "Segarkan Halaman")}</button>
            </div>
          </div>
        `;
      }

      const App = {
        user: savedUser ? JSON.parse(savedUser) : null,
        data: {},
        nav: "dashboard",
        loginGateMode: "personel",
        kelolaTab: "kotakAmal",
        dbFilterBulan: "all",
        dbFilterTahun: "all",
      };

      const API_URL = "https://script.google.com/macros/s/AKfycbw_PVpVPdbAnEbLuxuhZxj8FOi6ORbg6a2D0GWTls5eaktxjDSrUTe84STkO3xeNyYoQA/exec";

      const isGAS = typeof google !== "undefined" && typeof google.script !== "undefined";
      const $ = (id) => document.getElementById(id);
      const fmtRp = (n) => "Rp " + Math.round(Number(n || 0)).toLocaleString("tr-TR");

      const renderMapBtn = (url) => {
        if (!url || url.trim() === "") return "-";
        return `<a href="${url}" target="_blank" class="btn btn-sm btn-outline-danger py-0 px-2" title="${t("Google Haritalar'da Aç", "Buka di Google Maps")}"><i class="bi bi-geo-alt-fill"></i> ${t("Harita", "Peta")}</a>`;
      };
      const todayStr = () => new Date().toISOString().substring(0, 10);

      const DB = {
        call(fn, ...args) {
          if (isGAS) {
            return new Promise((res) => {
              google.script.run
                .withSuccessHandler(res)
                .withFailureHandler((e) => res({ ok: false, error: e.message }))[fn](...args);
            });
          }

          if (!API_URL || API_URL.includes("GANTI_DENGAN")) {
            return Promise.resolve({
              ok: false,
              error: t("Koneksi ke server belum dikonfigurasi (API_URL kosong).", "Koneksi ke server belum dikonfigurasi (API_URL kosong)."),
            });
          }

          return fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({ fn, args }),
          })
            .then(async (res) => {
              if (res.status === 404) {
                return {
                  ok: false,
                  error: t("404 Not Found: URL API tidak ditemukan.", "404 Not Found: URL API tidak ditemukan."),
                };
              }
              if (!res.ok) {
                return {
                  ok: false,
                  error: `Server error ${res.status} (${res.statusText}).`,
                };
              }
              const text = await res.text();
              try {
                return JSON.parse(text);
              } catch (_) {
                return {
                  ok: false,
                  error: t("Respons server bukan JSON.", "Respons server bukan JSON."),
                };
              }
            })
            .catch((err) => ({
              ok: false,
              error: err.message || t("Gagal terhubung ke server.", "Gagal terhubung ke server."),
            }));
        },
        async auth(username, role, pin) {
          return this.call("authenticateUser", username, role, pin);
        },
        async getInitData() {
          return this.call("getInitData");
        },
      };

      function renderGate(animate = true) {
        $("root").innerHTML = `
              <div class="gate-wrap">
                <div class="gate-card ${animate ? "gate-anim" : ""}">

                  <!-- LANGUAGE TOGGLE IN LOGIN -->
                  <div class="d-flex justify-content-center gap-2 mb-3">
                    <button type="button" class="btn btn-sm ${lang === 'tr' ? 'btn-pst' : 'btn-outline-secondary'}" onclick="setLang('tr')" style="border-radius:20px; font-weight:bold;">🇹🇷 Türkçe</button>
                    <button type="button" class="btn btn-sm ${lang === 'id' ? 'btn-pst' : 'btn-outline-secondary'}" onclick="setLang('id')" style="border-radius:20px; font-weight:bold;">🇮🇩 Indonesia</button>
                  </div>

                  <div class="text-center mb-2" style="font-family: serif; font-size:26px; color:var(--g900);">﷽</div>
                  <div class="text-center mb-2"><i class="bi bi-box-heart-fill fs-1 text-success"></i></div>
                  <h4 class="fw-bold text-center mb-1">${t("İrşad Hizmetleri", "Layanan Irsyad")}</h4>
                  <p class="text-center text-muted mb-4" style="font-size:12px;">${t("YYSN Sulaimaniyah Jawa Tengah Yönetim ve Raporlama Portalı", "Portal Manajemen & Laporan YYSN Sulaimaniyah Jawa Tengah")}</p>

                  <div class="gate-tabs">
                    <div class="gate-tab ${App.loginGateMode === "personel" ? "active" : ""}" onclick="switchGate('personel')"><i class="bi bi-person me-1"></i>${t("Personel", "Personel")}</div>
                    <div class="gate-tab ${App.loginGateMode === "idareci" ? "active" : ""}" onclick="switchGate('idareci')"><i class="bi bi-shield-lock me-1"></i>${t("İdareci", "İdareci (Admin)")}</div>
                  </div>

                  <form id="gateForm">
                    <div class="mb-3">
                      <label class="form-label fw-bold">${t("Kullanıcı Adı", "Nama Pengguna")}</label>
                      <input type="text" class="form-control" id="gateNama" placeholder="${t("Kullanıcı adınızı yazın...", "Masukkan nama pengguna...")}" required autocomplete="username" />
                    </div>
                    <div class="mb-3" id="gatePinGroup">
                      <label class="form-label fw-bold">${t("Giriş PIN Kodu", "Kode PIN Masuk")}</label>
                      <input type="password" class="form-control" id="gatePin" placeholder="${t("Güvenlik PIN Kodu...", "Kode Keamanan PIN...")}" required autocomplete="current-password" />
                    </div>
                    <button type="submit" class="btn-pst w-100 mt-2">${t("Sisteme Giriş Yap", "Masuk ke Sistem")}</button>
                  </form>
                  <div class="text-center mt-4 text-muted small">© <b>2026 YYSN Sulaimaniyah Jawa Tengah</b>.</div>
                </div>
              </div>
            `;

        $("gateForm").onsubmit = async (e) => {
          e.preventDefault();
          const btn = e.target.querySelector('button[type="submit"]');
          setBtnLoading(btn, true);

          try {
            const username = $("gateNama").value.trim();
            const pin = $("gatePin").value.trim();

            $("loaderText").innerText = t("Erişim yetkisi doğrulanıyor...", "Memverifikasi hak akses...");
            $("loaderScreen").style.display = "flex";

            const res = await DB.auth(username, App.loginGateMode, pin);
            if (res.maintenance) {
               $("loaderScreen").style.display = "none";
               return renderMaintenance(t("Akses ditutup sementara. Sistem berada di luar jam operasional (22:00 - 06:00 WIB).", "Akses ditutup sementara. Sistem berada di luar jam operasional (22:00 - 06:00 WIB)."));
            }

            if (!res.ok) {
              $("loaderScreen").style.display = "none";
              Swal.fire({
                icon: "error",
                title: t("Erişim Reddedildi", "Akses Ditolak"),
                text: res.error,
              });
              return;
            }

            App.user = res.user;
            localStorage.setItem("fuh_session_user", JSON.stringify(res.user));

            const dataRes = await DB.getInitData();
            if (dataRes.ok) App.data = dataRes.data;
            $("loaderScreen").style.display = "none";
            renderApp();
          } finally {
            if (btn && document.body.contains(btn)) setBtnLoading(btn, false);
          }
        };
      }

      async function initAppSession() {
        if (typeof MAINTENANCE_MODE !== 'undefined' && MAINTENANCE_MODE === true) {
          return renderMaintenance();
        }

        if (App.user && App.user.nama) {
          $("loaderText").innerText = `${t("Tekrardan Hoş Geldin", "Selamat Datang Kembali")}, ${App.user.nama}!`;
          $("loaderScreen").style.display = "flex";

          const dataRes = await DB.getInitData();
          if (dataRes.maintenance) {
             return renderMaintenance(t("Akses ditutup sementara.", "Akses ditutup sementara."));
          }

          if (dataRes.ok) {
            App.data = dataRes.data;
            $("loaderScreen").style.display = "none";
            renderApp();
            return;
          }

          const errMsg = String(dataRes.error || "").toLowerCase();
          const isAuthError =
            errMsg.includes("unauthorized") ||
            errMsg.includes("erişim") ||
            errMsg.includes("izin") ||
            errMsg.includes("tidak ditemukan") ||
            errMsg.includes("not found");

          if (isAuthError) {
            localStorage.removeItem("fuh_session_user");
            App.user = null;
          } else {
            App.data = { kotakAmal: [], kotakBaru: [], kumbara: [], masjid: [], users: [], todayLog: [], allLog: [], talebe: [] };
            $("loaderScreen").style.display = "none";
            renderApp();

            setTimeout(() => {
              Swal.fire({
                icon: "warning",
                title: t("Bağlantı Sorunu", "Masalah Koneksi"),
                text: `${t("Veriler yüklenemedi", "Data gagal dimuat")}: ${dataRes.error}`,
                confirmButtonText: t("Tamam", "Oke"),
                confirmButtonColor: "#0b4d3b",
              });
            }, 500);
            return;
          }
        }
        $("loaderScreen").style.display = "none";
        renderGate();
      }

      window.switchGate = (mode) => {
        App.loginGateMode = mode;
        renderGate(false);
      };

      function renderApp() {
        const isAdmin = App.user.role === "idareci";
        const navs = isAdmin
          ? [
              { id: "dashboard", icon: "bi-grid-1x2-fill", label: t("Hizmet Paneli", "Panel Layanan") },
              { id: "laporan-aktivitas", icon: "bi-clipboard-data-fill", label: t("Faaliyet Raporu", "Laporan Kegiatan") },
              { id: "laporan", icon: "bi-bar-chart-fill", label: t("Takım Raporu", "Laporan Tim") },
              { id: "kelola", icon: "bi-folder-fill", label: t("Saha Kayıtlarını Yönet", "Kelola Data Lapangan") },
              { id: "mekanlar", icon: "bi-geo-alt-fill", label: t("Mekanlar", "Daftar Tempat") },
            ]
          : [
              { id: "dashboard", icon: "bi-speedometer2", label: t("Hizmet Paneli", "Panel Layanan") },
              { id: "riwayat-aktivitas", icon: "bi-journal-text", label: t("Faaliyet Geçmişi", "Riwayat Kegiatan") },
              { id: "daftar-kotak-amal", icon: "bi-safe", label: t("Sadaka Kutusu Listesi", "Daftar Kotak Amal") },
              { id: "daftar-kumbara", icon: "bi-database-fill", label: t("Kumbara Listesi", "Daftar Kumbara") },
              { id: "daftar-cami", icon: "bi-moon-stars", label: t("Cami Listesi", "Daftar Masjid") },
              { id: "mekanlar", icon: "bi-geo-alt-fill", label: t("Mekanlar", "Daftar Tempat") },
            ];

        $("root").innerHTML = `
              <div class="app-shell">
                <div class="sidebar" id="mainSidebar">
                  <div class="sidebar-brand">
                    <div class="sb-mark"><i class="bi bi-box-heart-fill"></i></div>
                    <div><b style="font-size:14px;">${t("Hizmet Portalı", "Portal Layanan")}</b><small class="d-block text-muted" style="font-size:10px;">${isAdmin ? t("İDARE / YÖNETİM", "ADMIN / MANAJEMEN") : t("PERSONEL", "PERSONEL")}</small></div>
                  </div>
                  <div class="sidebar-nav">
                    ${navs.map((n) => `<a class="nav-item ${App.nav === n.id ? "active" : ""}" onclick="navTo('${n.id}')"><i class="${n.icon}"></i>${n.label}</a>`).join("")}
                  </div>
                  <div class="p-3 border-top">
                    <div class="fw-bold mb-2 d-flex align-items-center gap-2" style="font-size:13px;">
                      <img src="${localStorage.getItem('fuh_profile_pic_' + App.user.nama) || 'https://ui-avatars.com/api/?name=' + App.user.nama + '&background=0b4d3b&color=fff'}" id="sidebarProfilePic" class="rounded-circle shadow-sm" style="width: 28px; height: 28px; object-fit: cover;" alt="Profile">
                      ${App.user.nama}
                    </div>
                    <button class="btn btn-sm btn-outline-danger w-100" onclick="logout()"><i class="bi bi-box-arrow-left me-1"></i>${t("Çıkış Yap", "Keluar / Logout")}</button>
                  </div>
                  <input type="file" id="profileUpload" accept="image/*" style="display: none;" onchange="handleProfileUpload(event)">
                </div>
                <div class="main-area">
                  <div class="topbar">
                    <div class="d-flex align-items-center gap-2">
                      <i class="bi bi-list mobile-toggle" onclick="toggleSidebar()"></i>
                      <b id="topTitle">${t("Hizmet Paneli", "Panel Layanan")}</b>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm ${lang === 'tr' ? 'btn-pst' : 'btn-outline-secondary'}" onclick="setLang('tr')" style="font-size: 11px; font-weight: bold;">TR</button>
                        <button type="button" class="btn btn-sm ${lang === 'id' ? 'btn-pst' : 'btn-outline-secondary'}" onclick="setLang('id')" style="font-size: 11px; font-weight: bold;">ID</button>
                      </div>
                      <span class="badge ${isAdmin ? "bg-warning text-dark" : "bg-success"}">${isAdmin ? t("İdareci Modu", "Mode Admin") : t("Personel Modu", "Mode Personel")}</span>
                    </div>
                  </div>
                  <div class="p-3" id="pageContent"></div>

                  <div class="mt-auto py-3 text-center text-muted" style="font-size: 12px; border-top: 1px solid var(--bdr); background: var(--wht);">
                    © 2026 YYSN Sulaimaniyah Jawa Tengah.
                  </div>
                </div>
              </div>
            `;
        navTo("dashboard");
      }

      window.toggleSidebar = () => $("mainSidebar").classList.toggle("open");

      let distMap = null;

      function extractCoords(url) {
        if (!url) return null;
        const regex = /(?:q=|@)(-?\d+\.\d+),(-?\d+\.\d+)/;
        const match = url.match(regex);
        if (match && match.length >= 3) {
          return [parseFloat(match[1]), parseFloat(match[2])];
        }
        return null;
      }

      function getMarkerCoords(item) {
        const lat = parseFloat(item.latitude);
        const lng = parseFloat(item.longitude);
        if (!isNaN(lat) && !isNaN(lng) && (lat !== 0 || lng !== 0)) {
          return [lat, lng];
        }
        return extractCoords(item.linkMaps);
      }

      window.initMapDistribusi = () => {
        const mapContainer = document.getElementById("mapDistribusi");
        if (!mapContainer) return;

        if (distMap !== null) {
          distMap.remove();
        }

        distMap = L.map('mapDistribusi').setView([-7.005145, 110.438125], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(distMap);

        const kotakIcon = L.divIcon({
          html: '<div style="background-color: #f59e0b; color: white; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"><i class="bi bi-safe-fill" style="font-size: 14px;"></i></div>',
          className: '', iconSize: [26, 26], iconAnchor: [13, 13]
        });

        const kumbaraIcon = L.divIcon({
          html: '<div style="background-color: #3b82f6; color: white; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);"><i class="bi bi-database-fill" style="font-size: 14px;"></i></div>',
          className: '', iconSize: [26, 26], iconAnchor: [13, 13]
        });

        const dataKotak = App.data.kotakAmal || [];
        const dataKumbara = App.data.kumbara || [];
        let boundCoords = [];
        let missingCount = 0;

        dataKotak.forEach(k => {
          const coords = getMarkerCoords(k);
          if (coords) {
            L.marker(coords, { icon: kotakIcon })
              .bindPopup(`<b>${k.namaKotak || k.tempat || '-'}</b><br/>${k.alamat || '-'}<br/><span class="badge bg-warning text-dark mt-1">${t("Sadaka Kutusu", "Kotak Amal")}</span>`)
              .addTo(distMap);
            boundCoords.push(coords);
          } else {
            missingCount++;
          }
        });

        dataKumbara.forEach(k => {
          const coords = getMarkerCoords(k);
          if (coords) {
            L.marker(coords, { icon: kumbaraIcon })
              .bindPopup(`<b>${k.tempat || '-'}</b><br/>${k.alamat || '-'}<br/><span class="badge bg-primary mt-1">${t("Kumbara", "Kumbara")}</span>`)
              .addTo(distMap);
            boundCoords.push(coords);
          } else {
            missingCount++;
          }
        });

        const warningBox = document.getElementById("mapCoordsWarning");
        if (warningBox) {
          warningBox.innerHTML = missingCount > 0
            ? `<div class="alert alert-warning py-2 px-3 mb-2" style="font-size:12px;">
                 <i class="bi bi-exclamation-triangle-fill me-1"></i>
                 ${missingCount} ${t("lokasi belum punya koordinat sehingga tidak muncul di peta.", "lokasi belum punya koordinat sehingga tidak muncul di peta.")}
               </div>`
            : "";
        }

        if (boundCoords.length > 0) {
          distMap.fitBounds(boundCoords, { padding: [30, 30], maxZoom: 15 });
        }

        setTimeout(() => distMap.invalidateSize(), 300);
      };

      window.refreshMapCoordinates = async () => {
        const btn = document.getElementById("btnRefreshCoords");
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> ${t("Memproses...", "Memproses...")}`;
        }
        try {
          const res = await DB.call("backfillCoordinates");
          if (!res.ok) {
            Swal.fire(t("Gagal", "Gagal"), res.error || t("Terjadi kesalahan saat memperbarui koordinat.", "Terjadi kesalahan saat memperbarui koordinat."), "error");
            return;
          }
          const dataRes = await DB.getInitData();
          if (dataRes.ok) App.data = dataRes.data;
          initMapDistribusi();
          Swal.fire({
            icon: "success",
            title: t("Koordinat diperbarui", "Koordinat diperbarui"),
            text: res.message || t("Selesai memindai lokasi yang belum punya koordinat.", "Selesai memindai lokasi yang belum punya koordinat."),
            toast: true, position: "top-end", showConfirmButton: false, timer: 2500
          });
        } catch (e) {
          Swal.fire(t("Gagal", "Gagal"), e.message || t("Tidak bisa menghubungi server.", "Tidak bisa menghubungi server."), "error");
        } finally {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = `<i class="bi bi-arrow-repeat"></i> ${t("Perbarui Koordinat", "Perbarui Koordinat")}`;
          }
        }
      };

      window.navTo = (id) => {
        App.nav = id;
        document
          .querySelectorAll(".nav-item")
          .forEach((el) => el.classList.remove("active"));
        if ($("mainSidebar").classList.contains("open"))
          $("mainSidebar").classList.remove("open");

        if (id === "dashboard") {
          $("topTitle").innerText =
            App.user.role === "idareci" ? t("İdareci Panosu", "Dashboard Admin") : t("Personel Panosu", "Dashboard Personel");
          $("pageContent").innerHTML =
            App.user.role === "idareci" ? renderDashboardIdareci() : renderDashboardPersonel();
          if (App.user.role === "idareci") {
            setTimeout(() => initMapDistribusi(), 300);
          }
        } else if (id === "riwayat-aktivitas") {
          $("topTitle").innerText = t("Tüm Faaliyet Geçmişi", "Riwayat Seluruh Kegiatan");
          $("pageContent").innerHTML = renderRiwayatAktivitasPersonel();
          setTimeout(() => initRiwayatAktivitas(), 100);
        } else if (id === "laporan") {
          $("topTitle").innerText = t("Aylık Takım Raporu", "Laporan Tim Bulanan");
          $("pageContent").innerHTML = renderLaporan();
          loadMonthlyReport();
        } else if (id === "kelola") {
          $("topTitle").innerText = t("Saha Kayıtlarını Yönet", "Kelola Data Lapangan");
          $("pageContent").innerHTML = renderKelola();
        } else if (id === "daftar-kotak-amal") {
          $("topTitle").innerText = t("Sadaka Kutusu Listesi", "Daftar Kotak Amal");
          $("pageContent").innerHTML = renderDaftarKotakAmalPersonel();
        } else if (id === "daftar-kumbara") {
          $("topTitle").innerText = t("Kumbara Listesi", "Daftar Kumbara");
          $("pageContent").innerHTML = renderDaftarKumbaraPersonel();
        } else if (id === "daftar-cami") {
          $("topTitle").innerText = t("Cami Listesi", "Daftar Masjid");
          $("pageContent").innerHTML = renderDaftarCamiPersonel();
        } else if (id === "laporan-aktivitas") {
          $("topTitle").innerText = t("Dönemsel Faaliyet Raporu", "Laporan Kegiatan Berkala");
          $("pageContent").innerHTML = renderLaporanAktivitas();
        } else if (id === "mekanlar") {
          $("topTitle").innerText = t("Mekanlar (Daftar Tempat Potensi)", "Mekanlar (Daftar Tempat Potensi)");
          $("pageContent").innerHTML = renderMekanlar();
        }
      };

      window.buildPersonelOptions = (currentVal) => {
        const users = (App.data.users || []).filter((u) => u.role !== "idareci");
        const currentUser = users.find(u => u.nama === App.user.nama);
        const otherUsers = users.filter(u => u.nama !== App.user.nama);
        const isBlank = !currentVal || currentVal.trim() === "";

        let html = "";
        if (currentUser) {
          const sel = (currentVal === currentUser.nama) ? "selected" : "";
          html += `<option value="${currentUser.nama}" ${sel}>${currentUser.nama}</option>`;
        } else if (App.user.role === 'idareci') {
          const sel = (currentVal === App.user.nama) ? "selected" : "";
          html += `<option value="${App.user.nama}" ${sel}>${App.user.nama}</option>`;
        }

        const selBos = (isBlank || currentVal === "-") ? "selected" : "";
        html += `<option value="-" ${selBos}>- ${t("Boş / İptal", "Kosong / Batal")} -</option>`;

        otherUsers.forEach((u) => {
          const sel = u.nama === currentVal ? "selected" : "";
          html += `<option value="${u.nama}" ${sel}>${u.nama}</option>`;
        });
        return html;
      };

      window.buildVazifeOptions = (currentVal) => {
        const users = (App.data.users || []).filter((u) => u.role !== "idareci");
        const talebe = App.data.talebe || [];
        const isBlank = !currentVal || currentVal.trim() === "" || currentVal === "-";

        let html = `<option value="-" ${isBlank ? "selected" : ""}>- ${t("Seçilmedi (Boş)", "Belum Dipilih (Kosong)")} -</option>`;

        html += `<optgroup label="Personel">`;
        users.forEach((u) => {
          const sel = u.nama === currentVal ? "selected" : "";
          html += `<option value="${u.nama}" ${sel}>${u.nama}</option>`;
        });
        html += `</optgroup>`;

        if (talebe.length > 0) {
          html += `<optgroup label="Talebe">`;
          talebe.forEach((t) => {
            const namaTalebe = t.namaTalebe || t.nama || "";
            if (namaTalebe) {
              const sel = namaTalebe === currentVal ? "selected" : "";
              html += `<option value="${namaTalebe}" ${sel}>${namaTalebe}</option>`;
            }
          });
          html += `</optgroup>`;
        }
        return html;
      };

      window.setCamiVazife = async (id, namaUser, el) => {
        el.disabled = true;
        try {
          const res = await DB.call("updateCamiVazife", id, namaUser);
          if (res && res.ok === false) {
            Swal.fire({ icon: "error", title: t("Kaydetme Başarısız", "Gagal Menyimpan"), text: res.error });
          } else {
            const dataRes = await DB.getInitData();
            if (dataRes.ok) App.data = dataRes.data;
            Swal.fire({ icon: "success", title: namaUser ? `${namaUser} ${t("camiye atandı", "ditugaskan ke masjid")}` : t("Atama iptal edildi", "Tugas dibatalkan"), toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
          }
        } finally { el.disabled = false; }
      };

      window.setKotakDibuka = async (id, namaUser, el) => {
        el.disabled = true;
        try {
          const res = await DB.call("updateKotakSedangDibuka", id, namaUser);
          if (res && res.ok === false) {
            Swal.fire({ icon: "error", title: t("Kaydetme Başarısız", "Gagal Menyimpan"), text: res.error });
          } else {
            const dataRes = await DB.getInitData();
            if (dataRes.ok) App.data = dataRes.data;
            Swal.fire({ icon: "success", title: namaUser ? `${namaUser} ${t("tarafından işaretlendi", "telah menandai")}` : t("İşaret iptal edildi", "Tanda dibatalkan"), toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
          }
        } finally { el.disabled = false; }
      };

      window.setKumbaraDiambil = async (id, namaUser, el) => {
        el.disabled = true;
        try {
          const res = await DB.call("updateKumbaraSedangDiambil", id, namaUser);
          if (res && res.ok === false) {
            Swal.fire({ icon: "error", title: t("Kaydetme Başarısız", "Gagal Menyimpan"), text: res.error });
          } else {
            const dataRes = await DB.getInitData();
            if (dataRes.ok) App.data = dataRes.data;
            Swal.fire({ icon: "success", title: namaUser ? `${namaUser} ${t("tarafından işaretlendi", "telah menandai")}` : t("İşaret iptal edildi", "Tanda dibatalkan"), toast: true, position: "top-end", showConfirmButton: false, timer: 2000 });
          }
        } finally { el.disabled = false; }
      };

      window.logout = async () => {
        Swal.fire({
          title: t("Güvenli Çıkış Yapılıyor...", "Proses Keluar..."),
          html: `
          <div class="my-3">
            <p class="text-muted mb-3">${t("Oturumunuz kapatılıyor, lütfen bekleyin.", "Sesi anda sedang ditutup, silakan tunggu.")}</p>
            <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>`,
          showConfirmButton: false,
          allowOutsideClick: false,
          allowEscapeKey: false,
          timer: 1800,
          willClose: () => {
            App.user = null;
            localStorage.removeItem("fuh_session_user");
            document.body.style.transition = "opacity 0.6s ease, transform 0.6s ease";
            document.body.style.opacity = "0";
            document.body.style.transform = "scale(0.98)";
            setTimeout(() => {
              renderGate();
              document.body.style.opacity = "1";
              document.body.style.transform = "scale(1)";
            }, 600);
          },
        });
      };

      function renderDashboardPersonel() {
        const myLogs = (App.data.todayLog || []).filter((l) => l.namaUser.toLowerCase() === App.user.nama.toLowerCase());
        const totalAkt = myLogs.reduce((s, l) => s + (Number(l.jumlah) || 1), 0);
        const totalUang = myLogs.reduce((s, l) => s + (Number(l.uang) || 0), 0);
        const profilePic = localStorage.getItem(`fuh_profile_pic_${App.user.nama}`) || 'https://ui-avatars.com/api/?name=' + App.user.nama + '&background=0b4d3b&color=fff';

        const daftarKotak = App.data.kotakAmal || [];
        const totalKotak = daftarKotak.length;
        const kotakAcildi = daftarKotak.filter(k => String(k.status || "").toLowerCase() === "açıldı").length;
        const kotakAcilmadi = totalKotak - kotakAcildi;
        const persenAcildi = totalKotak > 0 ? Math.round((kotakAcildi / totalKotak) * 100) : 0;
        const persenAcilmadi = totalKotak > 0 ? 100 - persenAcildi : 0;

        return `
        <div class="pst-card bg-success text-white mb-3 d-flex align-items-center gap-3" style="background: linear-gradient(135deg, var(--g900), var(--g500)) !important;">
          <div class="profile-pic-container" onclick="document.getElementById('profileUpload').click()" title="Klik untuk ganti foto">
              <img src="${profilePic}" class="profile-pic-large" id="dashProfilePic" alt="Profile">
              <div class="profile-pic-hover"><i class="bi bi-camera-fill"></i></div>
          </div>
          <div>
            <h5>${t("Gayretleriniz Mübarek Olsun", "Semoga Usaha Anda Diberkahi")}, ${App.user.nama}! ✨</h5>
            <p class="mb-0" style="font-size:12px; opacity:0.9;">${t("Bugünkü tüm saha faaliyetlerinizi aşağıdaki menüden kaydedebilirsiniz.", "Anda dapat mencatat semua kegiatan lapangan hari ini melalui menu di bawah.")}</p>
          </div>
        </div>

        <div class="pst-card mb-3" style="border-left: 5px solid var(--g500);">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="fw-bold" style="font-size: 13px;"><i class="bi bi-safe-fill text-success me-1"></i> ${t("Sadaka Kutusu Açılma Oranı (Genel)", "Rasio Pembukaan Kotak Amal (Umum)")}</span>
            <span class="badge bg-success" style="font-size: 12px;">%${persenAcildi} ${t("Tamamlandı", "Selesai")}</span>
          </div>
          <div class="progress" style="height: 12px; border-radius: 6px; background-color: #E8F8F3; overflow: hidden;">
            <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" role="progressbar" style="width: ${persenAcildi}%"></div>
          </div>
          <div class="d-flex justify-content-between text-muted mt-2" style="font-size: 11px; font-weight: 600;">
            <span><i class="bi bi-check-circle-fill text-success me-1"></i> ${t("Açıldı", "Dibuka")}: ${kotakAcildi} ${t("Kutu", "Kotak")} (%${persenAcildi})</span>
            <span><i class="bi bi-hourglass-split text-warning me-1"></i> ${t("Açılmadı / Beklemede", "Belum Dibuka / Tersedia")}: ${kotakAcilmadi} ${t("Kutu", "Kotak")} (%${persenAcilmadi})</span>
          </div>
        </div>

        <div class="metric-grid">
          <div class="metric-card card-interactive">
            <i class="bi bi-check2-all fs-2 text-success"></i>
            <div><div class="mc-val">${totalAkt}</div><div class="mc-lbl">${t("Bugünkü Faaliyetlerim", "Kegiatanku Hari Ini")}</div></div>
          </div>
          <div class="metric-card card-interactive">
            <i class="bi bi-wallet2 fs-2 text-primary"></i>
            <div><div class="mc-val" style="font-size:16px;">${fmtRp(totalUang)}</div><div class="mc-lbl">${t("Toplanan Meblağ", "Total Dana Terkumpul")}</div></div>
          </div>
        </div>

        <div class="pst-card">
          <h6 class="fw-bold mb-3"><i class="bi bi-lightning-charge-fill text-warning me-1"></i>${t("Kaydedilecek Faaliyeti Seçin", "Pilih Kegiatan yang Akan Dicatat")}</h6>
          <div class="act-grid">
            ${getAktivitas().map((a) => `
              <div class="act-tile text-center card-interactive" onclick="openLogModal('${a.id}')">
                <i class="${a.icon} fs-4 mb-1 d-block" style="color:${a.color}"></i>
                <b style="font-size:11px;">${a.label}</b>
              </div>`).join("")}
          </div>
        </div>

        <div class="pst-card">
          <h6 class="fw-bold mb-3">${t("Bugünkü Faaliyet Geçmişim", "Riwayat Kegiatanku Hari Ini")}</h6>
          ${myLogs.length ? `
            <div class="table-responsive">
              <table class="table table-sm text-nowrap" style="width: 120%; max-width: none; table-layout: fixed;">
                <thead>
                  <tr class="text-muted" style="font-size:11px;">
                    <th style="width: 18%;">${t("Faaliyet", "Kegiatan")}</th>
                    <th style="width: 25%;">${t("Konum", "Lokasi")}</th>
                    <th style="width: 10%;">${t("Adet", "Jumlah")}</th>
                    <th style="width: 18%;">${t("Meblağ (Rp)", "Nominal (Rp)")}</th>
                    <th style="width: 12%;">${t("Notlar", "Catatan")}</th>
                    <th style="width: 17%;">${t("İşlem", "Aksi")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${myLogs.map((l) => `
                    <tr>
                      <td style="overflow: hidden; text-overflow: ellipsis;"><span class="badge bg-light text-dark border">${l.kegiatan}</span></td>
                      <td class="text-wrap" style="overflow: hidden; text-overflow: ellipsis;">${l.lokasi || "-"}</td>
                      <td><b>${l.jumlah}</b></td>
                      <td class="text-success fw-bold">${l.uang > 0 ? fmtRp(l.uang) : "-"}</td>
                      <td class="text-muted text-wrap" style="overflow: hidden; text-overflow: ellipsis;">${l.catatan || "-"}</td>
                      <td class="text-nowrap">
                        <button class="btn btn-sm text-primary me-1" onclick="openEditLogModal('${l.id}')"><i class="bi bi-pencil-square"></i></button>
                        <button class="btn btn-sm text-danger" onclick="hapusLog('${l.id}', this)"><i class="bi bi-trash"></i></button>
                      </td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          ` : `<div class="text-center text-muted py-4">${t("Bugün henüz kaydedilen bir faaliyet yok.", "Belum ada kegiatan yang dicatat hari ini.")}</div>`}
        </div>
      `;
      }

      function renderDaftarKotakAmalPersonel() {
        const data = App.data.kotakAmal || [];
        const total = data.length;
        const acildi = data.filter(k => String(k.status || "").toLowerCase() === "açıldı").length;
        const acilmadi = total - acildi;
        const pAcildi = total > 0 ? Math.round((acildi / total) * 100) : 0;
        const pAcilmadi = total > 0 ? 100 - pAcildi : 0;

        return `
          <div class="row g-3 mb-3">
            <div class="col-md-4 col-sm-12">
              <div class="pst-card h-100 mb-0 d-flex align-items-center gap-3" style="border-left: 4px solid var(--g500);">
                <div class="p-3 rounded-circle" style="background-color: var(--g100); color: var(--g900);"><i class="bi bi-safe-fill fs-3"></i></div>
                <div>
                  <div class="text-muted" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${t("Toplam Kutu", "Total Kotak")}</div>
                  <div class="fs-4 fw-bold" style="color: var(--g900);">${total} <small style="font-size: 13px; font-weight: normal;">${t("Adet", "Unit")}</small></div>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-6">
              <div class="pst-card h-100 mb-0 d-flex align-items-center justify-content-between" style="border-left: 4px solid #F59E0B; background-color: #FFFBEB;">
                <div>
                  <div class="text-muted" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${t("Açıldı (Toplandı)", "Dibuka (Terkumpul)")}</div>
                  <div class="fs-4 fw-bold text-dark">${acildi} <small style="font-size: 13px; font-weight: normal;">${t("Kutu", "Kotak")}</small></div>
                </div>
                <div class="text-end">
                  <span class="badge bg-warning text-dark fs-6">%${pAcildi}</span>
                </div>
              </div>
            </div>
            <div class="col-md-4 col-sm-6">
              <div class="pst-card h-100 mb-0 d-flex align-items-center justify-content-between" style="border-left: 4px solid #10B981; background-color: #ECFDF5;">
                <div>
                  <div class="text-muted" style="font-size: 11px; font-weight: 700; text-transform: uppercase;">${t("Açılmadı (Müsait)", "Belum Dibuka (Tersedia)")}</div>
                  <div class="fs-4 fw-bold text-success">${acilmadi} <small style="font-size: 13px; font-weight: normal;">${t("Kutu", "Kotak")}</small></div>
                </div>
                <div class="text-end">
                  <span class="badge bg-success fs-6">%${pAcilmadi}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pst-card mb-3 p-3">
            <div class="d-flex justify-content-between align-items-center mb-1" style="font-size: 12px; font-weight: bold;">
              <span class="text-warning"><i class="bi bi-box-seam-fill me-1"></i> ${t("Açılan Oranı", "Rasio Telah Dibuka")} (%${pAcildi})</span>
              <span class="text-success">${t("Açılmayan / Müsait Oranı", "Rasio Belum Dibuka / Tersedia")} (%${pAcilmadi}) <i class="bi bi-safe me-1"></i></span>
            </div>
            <div class="progress" style="height: 16px; border-radius: 8px; overflow: hidden; background-color: #E8F8F3; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
              <div class="progress-bar bg-warning text-dark fw-bold" role="progressbar" style="width: ${pAcildi}%; font-size: 10px;">${pAcildi > 5 ? '%' + pAcildi : ''}</div>
              <div class="progress-bar bg-success fw-bold" role="progressbar" style="width: ${pAcilmadi}%; font-size: 10px;">${pAcilmadi > 5 ? '%' + pAcilmadi : ''}</div>
            </div>
          </div>

          <div class="pst-card">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h6 class="fw-bold mb-0"><i class="bi bi-safe-fill text-success me-2"></i>${t("Aktif Sadaka Kutusu Listesi", "Daftar Kotak Amal Aktif")}</h6>
              <input type="text" class="form-control form-control-sm" style="max-width: 250px;" placeholder="${t("🔍 Ara (İsim/Adres)...", "🔍 Cari (Nama/Alamat)...")}" onkeyup="filterTableData(this.value)">
            </div>
            <div class="table-responsive">
              <table class="table table-sm table-hover text-nowrap align-middle">
                <thead class="table-light">
                  <tr>
                    <th>${t("Sadaka Kutusu Adı", "Nama Kotak")}</th><th>${t("Konum", "Lokasi")}</th><th>${t("Bağlantı", "Tautan Maps")}</th><th>${t("Kayıt Tarihi", "Tgl Pasang")}</th><th>${t("Durum", "Status")}</th><th>${t("Kim Tarafından", "Oleh Siapa")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.length ? data.map((k) => {
                    const isDiambil = String(k.status || "").toLowerCase() === "açıldı";
                    const badgeStyle = isDiambil ? "bg-warning text-dark" : "bg-success";
                    return `
                      <tr>
                        <td class="fw-bold">${k.namaKotak || k.tempat || "-"}</td>
                        <td class="text-wrap">${k.alamat || "-"}</td>
                        <td>${renderMapBtn(k.linkMaps)}</td>
                        <td>${k.tanggalPasang ? String(k.tanggalPasang).substring(0, 10) : "-"}</td>
                        <td><span class="badge ${badgeStyle}">${!k.status || k.status === "Aktif" ? t("Açılmadı", "Belum Dibuka") : t(k.status, k.status)}</span></td>
                        <td>
                          <select class="form-select form-select-sm" style="min-width: 140px; font-size: 12px; font-weight:600; color:var(--g900);" onchange="setKotakDibuka('${k.id}', this.value, this)" ${isDiambil ? "disabled" : ""}>
                            ${buildPersonelOptions(k.sedangDibukaOleh)}
                          </select>
                        </td>
                      </tr>
                    `;
                  }).join("") : `<tr><td colspan="6" class="text-center text-muted py-3">${t("Henüz sadaka kutusu verisi yok", "Belum ada data kotak amal")}</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      function renderDaftarKumbaraPersonel() {
        const data = App.data.kumbara || [];
        return `
          <div class="pst-card">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h6 class="fw-bold mb-0"><i class="bi-database text-primary me-2"></i>${t("Aktif Kumbara Listesi", "Daftar Kumbara Aktif")}</h6>
              <input type="text" class="form-control form-control-sm" style="max-width: 250px;" placeholder="${t("🔍 Ara (İsim/Adres)...", "🔍 Cari (Nama/Alamat)...")}" onkeyup="filterTableData(this.value)">
            </div>
            <div class="table-responsive">
              <table class="table table-sm table-hover text-nowrap align-middle">
                <thead class="table-light">
                  <tr>
                    <th>${t("Kumbara Yeri", "Lokasi Kumbara")}</th><th>${t("Konum", "Alamat")}</th><th>${t("Bağlantı", "Tautan")}</th><th>${t("Kayıt Tarihi", "Tanggal")}</th><th>${t("Notlar", "Catatan")}</th><th>${t("Durum", "Status")}</th><th>${t("Atanan Personel", "Ditugaskan ke")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.length ? data.map((k) => {
                    const isDiambil = ["alınmış", "alinmis", "toplandı", "açıldı"].includes(String(k.status || "").trim().toLowerCase());
                    const badgeStyle = isDiambil ? "bg-warning text-dark" : "bg-success";
                    const logsForLoc = (App.data.allLog || []).filter((l) => l.catatan && l.catatan.trim() !== "" && l.lokasi && (l.lokasi === k.tempat || l.lokasi.includes(k.tempat)));
                    const displayNote = k.catatan || (logsForLoc.length ? logsForLoc[logsForLoc.length - 1].catatan : "-");

                    return `
                      <tr>
                        <td class="fw-bold">${k.tempat || "-"}</td>
                        <td class="text-wrap">${k.alamat || "-"}</td>
                        <td>${renderMapBtn(k.linkMaps)}</td>
                        <td>${k.tanggal ? String(k.tanggal).substring(0, 10) : "-"}</td>
                        <td class="text-muted text-wrap" style="max-width: 180px;">${displayNote}</td>
                        <td><span class="badge ${badgeStyle}">${t(k.status || "Aktif", k.status || "Aktif")}</span></td>
                        <td>
                          <select class="form-select form-select-sm" style="min-width: 140px; font-size: 12px; font-weight:600; color:var(--g900);" onchange="setKumbaraDiambil('${k.id}', this.value, this)" ${isDiambil ? "disabled" : ""}>
                            ${buildPersonelOptions(k.sedangDiambil)}
                          </select>
                        </td>
                      </tr>
                    `;
                  }).join("") : `<tr><td colspan="7" class="text-center text-muted py-3">${t("Henüz kumbara verisi yok", "Belum ada data kumbara")}</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      function renderDaftarCamiPersonel() {
        const data = App.data.masjid || [];
        return `
          <div class="pst-card">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h6 class="fw-bold mb-0"><i class="bi-moon-stars text-info me-2"></i>${t("Aktif Cami Listesi", "Daftar Masjid Aktif")}</h6>
              <input type="text" class="form-control form-control-sm" style="max-width: 250px;" placeholder="${t("🔍 Ara (İsim/Adres)...", "🔍 Cari (Nama/Alamat)...")}" onkeyup="filterTableData(this.value)">
            </div>
            <div class="table-responsive">
              <table class="table table-sm table-hover text-nowrap align-middle">
                <thead class="table-light">
                  <tr>
                    <th>${t("Cami Adı", "Nama Masjid")}</th><th>${t("Konum", "Alamat")}</th><th>${t("Bağlantı", "Tautan")}</th><th>${t("Tür", "Tipe")}</th><th>${t("Vazife Olan (Personel/Talebe)", "Ditugaskan ke (Personel/Talebe)")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${data.length ? data.map((k) => `
                    <tr>
                      <td class="fw-bold">${k.namaMasjid || "-"}</td>
                      <td class="text-wrap">${k.alamat || "-"}</td>
                      <td>${renderMapBtn(k.linkMaps)}</td>
                      <td><span class="badge bg-secondary">${t(k.tipe || "-", k.tipe || "-")}</span></td>
                      <td>
                        <select class="form-select form-select-sm" style="min-width: 150px; font-size: 12px; font-weight:600; color:var(--g900);" onchange="setCamiVazife('${k.id}', this.value, this)">
                          ${buildVazifeOptions(k.vazifeOlan || "")}
                        </select>
                      </td>
                    </tr>
                  `).join("") : `<tr><td colspan="5" class="text-center text-muted py-3">${t("Henüz cami verisi yok", "Belum ada data masjid")}</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      function renderDashboardIdareci() {
        const todayLogs = App.data.todayLog || [];
        const allUsers = (App.data.users || []).filter((u) => u.role !== "idareci");
        const activeUserNames = new Set(todayLogs.map((l) => l.namaUser));
        const totalUangTim = todayLogs.reduce((s, l) => s + (Number(l.uang) || 0), 0);
        const totalAktTim = todayLogs.reduce((s, l) => s + (Number(l.jumlah) || 1), 0);
        const profilePic = localStorage.getItem(`fuh_profile_pic_${App.user.nama}`) || 'https://ui-avatars.com/api/?name=' + App.user.nama + '&background=0b4d3b&color=fff';

        // 1. Kalkulasi Kumbara
        const daftarKumbara = App.data.kumbara || [];
        const totalKumbara = daftarKumbara.length;
        const kumbaraAlinmis = daftarKumbara.filter(k => ["alınmış", "alinmis", "toplandı"].includes(String(k.status || "").trim().toLowerCase())).length;
        const kumbaraAktif = totalKumbara - kumbaraAlinmis;
        const persenAlinmis = totalKumbara > 0 ? Math.round((kumbaraAlinmis / totalKumbara) * 100) : 0;
        const persenAktif = totalKumbara > 0 ? 100 - persenAlinmis : 0;

        // 2. Kalkulasi Sadaka Kutusu (Kotak Amal)
        const daftarKotak = App.data.kotakAmal || [];
        const totalKotak = daftarKotak.length;
        const kotakAcildi = daftarKotak.filter(k => String(k.status || "").toLowerCase() === "açıldı").length;
        const kotakAcilmadi = totalKotak - kotakAcildi;
        const persenAcildi = totalKotak > 0 ? Math.round((kotakAcildi / totalKotak) * 100) : 0;
        const persenAcilmadi = totalKotak > 0 ? 100 - persenAcildi : 0;

        return `
          <div class="pst-card mb-3 d-flex align-items-center gap-3" style="background: linear-gradient(135deg, #1e293b, #334155) !important; color: white;">
            <div class="profile-pic-container" onclick="document.getElementById('profileUpload').click()" title="Klik untuk ganti foto">
                <img src="${profilePic}" class="profile-pic-large" id="dashProfilePic" alt="Profile">
                <div class="profile-pic-hover"><i class="bi bi-camera-fill"></i></div>
            </div>
            <div>
              <h5>${t("Hoş Geldiniz", "Selamat Datang")}, ${App.user.nama} (İdareci) 🛡️</h5>
              <p class="mb-0" style="font-size:12px; opacity:0.9;">${t("Tüm takım performansını dan saha verilerini buradan yönetebilirsiniz.", "Anda dapat mengelola seluruh performa tim dan data lapangan di sini.")}</p>
            </div>
          </div>

          <!-- KARTU STATISTIK KUMBARA -->
          <div class="pst-card mb-4 shadow-sm" style="border-top: 4px solid #3b82f6; border-radius: 10px;">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h6 class="fw-bold mb-0 text-dark"><i class="bi bi-piggy-bank-fill text-primary me-2"></i>${t("Kumbara Toplama Oranı (Genel Durum)", "Rasio Pengumpulan Kumbara (Umum)")}</h6>
                <small class="text-muted" style="font-size: 11px;">${t("Gönüllülerde bulunan ve sahadan toplanan kumbaraların anlık yüzdesi", "Persentase kumbara aktif di donatur dan yang telah diambil")}</small>
              </div>
              <span class="badge bg-primary px-3 py-2" style="font-size: 12px;"><i class="bi bi-collection me-1"></i> ${t("Toplam", "Total")}: ${totalKumbara} ${t("Kumbara", "Kumbara")}</span>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-md-4 col-sm-12">
                <div class="p-3 rounded-3 border d-flex align-items-center justify-content-between" style="background-color: #f8fafc;">
                  <div>
                    <div class="text-muted fw-bold" style="font-size: 11px; text-transform: uppercase;">${t("Kayıtlı Kumbara", "Kumbara Terdaftar")}</div>
                    <div class="fs-4 fw-bold text-dark">${totalKumbara} <span class="fs-6 fw-normal text-muted">${t("Adet", "Unit")}</span></div>
                  </div>
                  <div class="fs-1 text-secondary opacity-25"><i class="bi bi-database"></i></div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="p-3 rounded-3 border d-flex align-items-center justify-content-between" style="background-color: #eff6ff; border-color: #bfdbfe !important;">
                  <div>
                    <div class="text-muted fw-bold" style="font-size: 11px; text-transform: uppercase; color: #db1514 !important;">${t("Alınmış / Toplandı", "Sudah Diambil / Terkumpul")}</div>
                    <div class="fs-4 fw-bold text-primary">${kumbaraAlinmis} <span class="fs-6 fw-normal text-muted">${t("Kumbara", "Kumbara")}</span></div>
                  </div>
                  <div class="text-end">
                    <span class="badge bg-primary fs-6" style="font-weight: 800;">%${persenAlinmis}</span>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="p-3 rounded-3 border d-flex align-items-center justify-content-between" style="background-color: #f0fdf4; border-color: #bbf7d0 !important;">
                  <div>
                    <div class="text-muted fw-bold" style="font-size: 11px; text-transform: uppercase; color: #15803d !important;">${t("Aktif (Gönüllüde)", "Aktif (Di Donatur)")}</div>
                    <div class="fs-4 fw-bold text-success">${kumbaraAktif} <span class="fs-6 fw-normal text-muted">${t("Kumbara", "Kumbara")}</span></div>
                  </div>
                  <div class="text-end">
                    <span class="badge bg-success fs-6" style="font-weight: 800;">%${persenAktif}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-2">
              <div class="d-flex justify-content-between align-items-center mb-1" style="font-size: 12px; font-weight: 700;">
                <span style="color: #1d4ed8;"><i class="bi bi-check-circle-fill me-1"></i> ${t("Alınma Oranı", "Rasio Diambil")}: %${persenAlinmis} (${kumbaraAlinmis} ${t("Adet", "Unit")})</span>
                <span class="text-success">${kumbaraAktif} ${t("Kumbara Sahada / Aktif", "Kumbara Aktif / Di Lapangan")} (%${persenAktif}) <i class="bi bi-house-heart-fill ms-1"></i></span>
              </div>
              <div class="progress" style="height: 18px; border-radius: 9px; overflow: hidden; background-color: #e2e8f0; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary fw-bold" role="progressbar" style="width: ${persenAlinmis}%; font-size: 11px;">${persenAlinmis > 5 ? '%' + persenAlinmis : ''}</div>
                <div class="progress-bar bg-success fw-bold" role="progressbar" style="width: ${persenAktif}%; font-size: 11px;">${persenAktif > 5 ? '%' + persenAktif : ''}</div>
              </div>
            </div>
          </div>

          <!-- KARTU STATISTIK SADAKA KUTUSU -->
          <div class="pst-card mb-4 shadow-sm" style="border-top: 4px solid var(--g500); border-radius: 10px;">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <div>
                <h6 class="fw-bold mb-0 text-dark"><i class="bi bi-pie-chart-fill text-success me-2"></i>${t("Sadaka Kutusu Operasyon Oranı (Sahadaki Genel Durum)", "Rasio Operasional Kotak Amal (Umum)")}</h6>
                <small class="text-muted" style="font-size: 11px;">${t("Tüm personel tarafından açılan ve açılmayı bekleyen kutuların anlık yüzdesi", "Persentase kotak yang telah dibuka dan menunggu untuk dibuka")}</small>
              </div>
              <span class="badge bg-dark px-3 py-2" style="font-size: 12px;"><i class="bi bi-box-seam me-1"></i> ${t("Toplam", "Total")}: ${totalKotak} ${t("Kutu", "Kotak")}</span>
            </div>

            <div class="row g-3 mb-3">
              <div class="col-md-4 col-sm-12">
                <div class="p-3 rounded-3 border d-flex align-items-center justify-content-between" style="background-color: #f8fafc;">
                  <div>
                    <div class="text-muted fw-bold" style="font-size: 11px; text-transform: uppercase;">${t("Toplam Sahattaki Kutu", "Total Kotak di Lapangan")}</div>
                    <div class="fs-4 fw-bold text-dark">${totalKotak} <span class="fs-6 fw-normal text-muted">${t("Adet", "Unit")}</span></div>
                  </div>
                  <div class="fs-1 text-secondary opacity-25"><i class="bi bi-safe2-fill"></i></div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="p-3 rounded-3 border d-flex align-items-center justify-content-between" style="background-color: #fffbeb; border-color: #fde68a !important;">
                  <div>
                    <div class="text-muted fw-bold" style="font-size: 11px; text-transform: uppercase; color: #d97706 !important;">${t("Açıldı / Toplandı", "Dibuka / Terkumpul")}</div>
                    <div class="fs-4 fw-bold text-dark">${kotakAcildi} <span class="fs-6 fw-normal text-muted">${t("Kutu", "Kotak")}</span></div>
                  </div>
                  <div class="text-end">
                    <span class="badge bg-warning text-dark fs-6" style="font-weight: 800;">%${persenAcildi}</span>
                  </div>
                </div>
              </div>
              <div class="col-md-4 col-sm-6">
                <div class="p-3 rounded-3 border d-flex align-items-center justify-content-between" style="background-color: #ecfdf5; border-color: #a7f3d0 !important;">
                  <div>
                    <div class="text-muted fw-bold" style="font-size: 11px; text-transform: uppercase; color: #059669 !important;">${t("Açılmadı / Müsait", "Belum Dibuka / Tersedia")}</div>
                    <div class="fs-4 fw-bold text-success">${kotakAcilmadi} <span class="fs-6 fw-normal text-muted">${t("Kutu", "Kotak")}</span></div>
                  </div>
                  <div class="text-end">
                    <span class="badge bg-success fs-6" style="font-weight: 800;">%${persenAcilmadi}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-2">
              <div class="d-flex justify-content-between align-items-center mb-1" style="font-size: 12px; font-weight: 700;">
                <span style="color: #d97706;"><i class="bi bi-check-circle-fill me-1"></i> ${t("Açılma Oranı", "Rasio Dibuka")}: %${persenAcildi} (${kotakAcildi} ${t("Kutu", "Kotak")})</span>
                <span class="text-success">${kotakAcilmadi} ${t("Kutu Bekliyor", "Kotak Menunggu")} (%${persenAcilmadi}) <i class="bi bi-hourglass-split ms-1"></i></span>
              </div>
              <div class="progress" style="height: 18px; border-radius: 9px; overflow: hidden; background-color: #e2e8f0; box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);">
                <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning text-dark fw-bold" role="progressbar" style="width: ${persenAcildi}%; font-size: 11px;">
                  ${persenAcildi > 5 ? '%' + persenAcildi : ''}
                </div>
                <div class="progress-bar bg-success fw-bold" role="progressbar" style="width: ${persenAcilmadi}%; font-size: 11px;">
                  ${persenAcilmadi > 5 ? '%' + persenAcilmadi : ''}
                </div>
              </div>
            </div>
          </div>

          <div class="metric-grid">
            <div class="metric-card card-interactive">
              <i class="bi bi-people-fill fs-2 text-primary"></i>
              <div><div class="mc-val">${activeUserNames.size} / ${allUsers.length || 1}</div><div class="mc-lbl">${t("Bugün Göreve Başlayanlar", "Mulai Tugas Hari Ini")}</div></div>
            </div>
            <div class="metric-card card-interactive">
              <i class="bi bi-bar-chart-steps fs-2 text-success"></i>
              <div><div class="mc-val">${totalAktTim}</div><div class="mc-lbl">${t("Bugünkü Toplam İşlem Sayısı", "Total Transaksi Hari Ini")}</div></div>
            </div>
            <div class="metric-card card-interactive">
              <i class="bi bi-cash-stack fs-2 text-warning"></i>
              <div><div class="mc-val" style="font-size:16px;">${fmtRp(totalUangTim)}</div><div class="mc-lbl">${t("Bugün Toplanan Meblağ", "Total Dana Terkumpul Hari Ini")}</div></div>
            </div>
          </div>

          <div class="pst-card">
            <h6 class="fw-bold mb-3"><i class="bi bi-radar text-danger me-2"></i>${t("Personel Rapor Durumu Takibi (Bugün)", "Status Laporan Personel (Hari Ini)")}</h6>
            <div class="personnel-grid">
              ${allUsers.map((u) => {
                const isLapor = activeUserNames.has(u.nama);
                return `
                  <div class="personnel-item" style="border-left: 4px solid ${isLapor ? "#10B981" : "#EF4444"};">
                    <span class="fw-bold" style="font-size:12px;">${u.nama}</span>
                    <span class="badge ${isLapor ? "bg-success" : "bg-secondary"}">${isLapor ? t("Rapor Verdi", "Sudah Lapor") : t("Beklemede", "Belum Lapor")}</span>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="pst-card">
            <h6 class="fw-bold mb-3"><i class="bi bi-clock-history me-2"></i>${t("Bugünkü Tüm Takım Faaliyetleri Akışı", "Aktivitas Tim Keseluruhan Hari Ini")}</h6>
            <div class="table-responsive">
              <table class="table table-hover table-sm text-nowrap" style="font-size:13px;">
                <thead class="table-light"><tr><th>${t("Personel", "Personel")}</th><th>${t("Faaliyet", "Kegiatan")}</th><th>${t("Konum", "Lokasi")}</th><th>${t("Adet", "Jumlah")}</th><th>${t("Meblağ", "Nominal")}</th><th>${t("Notlar", "Catatan")}</th><th>${t("Zaman", "Waktu")}</th></tr></thead>
                <tbody>
                  ${todayLogs.slice().reverse().map((l) => `
                    <tr>
                      <td class="fw-bold">${l.namaUser}</td>
                      <td><span class="badge bg-light text-dark border">${l.kegiatan}</span></td>
                      <td class="text-wrap">${l.lokasi || "-"}</td>
                      <td>${l.jumlah}</td>
                      <td class="text-success fw-bold">${l.uang > 0 ? fmtRp(l.uang) : "-"}</td>
                      <td class="text-muted text-wrap">${l.catatan || "-"}</td>
                      <td class="text-muted" style="font-size:11px;">${String(l.timestamp || "").split(" ")[1] || t("Bugün", "Hari Ini")}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;
      }

      function renderLaporan() {
        const now = new Date();
        return `
          <div class="pst-card mb-3">
            <div class="row g-2 align-items-center">
              <div class="col-auto"><label class="fw-bold">${t("Ay ve Yıl Seçiniz:", "Pilih Bulan dan Tahun:")}</label></div>
              <div class="col-auto">
                <select id="lapBulan" class="form-select form-select-sm">
                  <option value="all">${t("Tüm Aylar", "Semua Bulan")}</option>
                  ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => `<option value="${m}" ${m === now.getMonth() + 1 ? "selected" : ""}>${m}. ${t("Ay", "Bulan")}</option>`).join("")}
                </select>
              </div>
              <div class="col-auto">
                <select id="lapTahun" class="form-select form-select-sm">
                  <option value="all">${t("Tüm Yıllar", "Semua Tahun")}</option>
                  ${[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => `<option value="${yr}" ${yr === now.getFullYear() ? "selected" : ""}>${yr}</option>`).join("")}
                </select>
              </div>
              <div class="col-auto">
                <button class="btn btn-sm btn-pst" onclick="loadMonthlyReport()"><i class="bi bi-search me-1"></i>${t("Göster", "Tampilkan")}</button>
              </div>
              <div class="col-auto ms-auto">
                <button class="btn btn-sm btn-danger" onclick="printLaporanPDF()"><i class="bi bi-printer me-1"></i> ${t("PDF Raporu Yazdır", "Cetak PDF Laporan")}</button>
              </div>
            </div>
          </div>
          <div id="laporanContainer"><div class="text-center py-5"><div class="spinner-border text-success"></div></div></div>
        `;
      }

      window.loadMonthlyReport = async () => {
        if (!$("laporanContainer")) return;
        $("laporanContainer").innerHTML = `<div class="text-center py-5"><div class="spinner-border text-success"></div></div>`;
        const m = $("lapBulan").value, y = $("lapTahun").value;
        const res = await DB.call("getMonthlyReport", m, y);

        if (!res.ok) {
          $("laporanContainer").innerHTML = `<div class="alert alert-danger">${t("Rapor yüklenemedi", "Gagal memuat laporan")}</div>`;
          return;
        }

        const { summary = [], aktivitasList = [], totalRecords = 0, totalUang = 0 } = res.data || {};

        $("laporanContainer").innerHTML = `
          <div class="metric-grid mb-3">
            <div class="metric-card card-interactive"><i class="bi bi-folder2-open fs-2 text-success"></i><div><div class="mc-val">${totalRecords}</div><div class="mc-lbl">${t("Bu Ayki Toplam İşlem Sayısı", "Total Transaksi Bulan Ini")}</div></div></div>
            <div class="metric-card card-interactive"><i class="bi bi-cash-stack fs-2 text-success"></i><div><div class="mc-val" style="font-size:16px;">${fmtRp(totalUang)}</div><div class="mc-lbl">${t("Toplam Gelen Meblağ", "Total Dana Masuk")}</div></div></div>
          </div>
          <div class="pst-card">
            <h6 class="fw-bold mb-3"><i class="bi bi-table me-2"></i>${t("Personel Bazlı Performans Özeti", "Ringkasan Performa Personel")}</h6>
            <div class="table-responsive">
              <table class="table table-hover table-bordered align-middle" style="font-size:13px;">
                <thead style="background-color: var(--g900); color: white;">
                  <tr>
                    <th class="text-start">${t("Personel Adı", "Nama Personel")}</th>
                    ${aktivitasList.map((a) => `<th style="white-space: normal;">${a}</th>`).join("")}
                    <th>${t("Toplam Faaliyet", "Total Kegiatan")}</th>
                    <th>${t("Toplam Meblağ", "Total Nominal")}</th>
                  </tr>
                </thead>
                <tbody>
                  ${summary.map((item) => `
                    <tr>
                      <td class="text-start fw-bold">${item.nama}</td>
                      ${aktivitasList.map((a) => `<td>${item.acts[a] ? item.acts[a].count : 0}</td>`).join("")}
                      <td class="fw-bold bg-light" style="color: var(--g900);">${item.totalCount}</td>
                      <td class="text-success fw-bold" style="background-color: #f0fdf4;">${fmtRp(item.totalUang)}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>
        `;
      };

      window.printLaporanPDF = () => {
        const m = $("lapBulan").value;
        const y = $("lapTahun").value;
        let title = t("Takım Performans Raporu", "Laporan Performa Tim");
        if (m === "all" && y === "all") title += t(" (Tüm Zamanlar)", " (Semua Waktu)");
        else if (m === "all" && y !== "all") title += ` (${y} ${t("Yılı Geneli", "Tahun Penuh")})`;
        else if (m !== "all" && y === "all") title += ` (${m}. ${t("Ay", "Bulan")} - ${t("Tüm Yıllar", "Semua Tahun")})`;
        else title += ` (${m}. ${t("Ay", "Bulan")} ${y})`;
        const container = $("laporanContainer");
        if (!container) return;

        let contentHtml = container.innerHTML;
        const printWin = window.open("", "_blank");
        printWin.document.write(`
          <!doctype html>
          <html lang="tr">
            <head>
              <meta charset="UTF-8">
              <title>${title}</title>
              <style>
                @media print { @page { size: A4 landscape; margin: 12mm; } body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }
                body { font-family: sans-serif; color: #1e293b; padding: 10px; font-size:12px;}
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #cbd5e1; padding: 5px; text-align: center; }
                th { background-color: #0b4d3b; color: white; }
                h3 { margin-bottom:0; }
              </style>
            </head>
            <body>
              <h3>${title}</h3>
              <p>${t("Toplam Performans Özeti", "Ringkasan Performa Total")}</p>
              ${contentHtml}
              <script>window.onload=()=>{setTimeout(()=>{window.print();window.close();},600);}<\/script>
            </body>
          </html>
        `);
        printWin.document.close();
      };

      function getFilteredDBData(tab) {
        let data = App.data[tab] || [];
        const m = App.dbFilterBulan || "all", y = App.dbFilterTahun || "all";
        if (m !== "all" || y !== "all") {
          data = data.filter((item) => {
            let dateStr = item.tanggal || item.tanggalPasang || "";
            if (!dateStr) return true;
            try {
              const parts = dateStr.split("-");
              if (parts.length >= 2) {
                return (y === "all" || parseInt(parts[0], 10) == y) && (m === "all" || parseInt(parts[1], 10) == m);
              }
            } catch (e) {}
            return true;
          });
        }
        return data;
      }

      function renderKelola() {
        const kaTotal = (App.data.kotakAmal || []).length;
        const kbTotal = (App.data.kotakBaru || []).length;
        const kmbTotal = (App.data.kumbara || []).length;
        const msjTotal = (App.data.masjid || []).length;

        return `
        <div class="d-flex gap-2 mb-3 flex-wrap">
          <button class="btn btn-sm ${App.kelolaTab === "kotakAmal" ? "btn-pst" : "btn-outline-secondary"}" onclick="switchKelolaTab('kotakAmal')">${t("Aktif Sadaka Kutusu", "Kotak Amal Aktif")} (${kaTotal})</button>
          <button class="btn btn-sm ${App.kelolaTab === "kotakBaru" ? "btn-pst" : "btn-outline-secondary"}" onclick="switchKelolaTab('kotakBaru')">${t("Yeni/Bekleyen Kutu", "Kotak Baru/Menunggu")} (${kbTotal})</button>
          <button class="btn btn-sm ${App.kelolaTab === "kumbara" ? "btn-pst" : "btn-outline-secondary"}" onclick="switchKelolaTab('kumbara')">${t("Kumbara", "Kumbara")} (${kmbTotal})</button>
          <button class="btn btn-sm ${App.kelolaTab === "masjid" ? "btn-pst" : "btn-outline-secondary"}" onclick="switchKelolaTab('masjid')">${t("Cami Listesi", "Daftar Masjid")} (${msjTotal})</button>
          <button class="btn btn-sm btn-success ms-auto" onclick="openDBModal('${App.kelolaTab}')"><i class="bi bi-plus-lg me-1"></i>${t("Manuel Veri Ekle", "Tambah Data Manual")}</button>
        </div>

        <div class="pst-card mb-3 p-2 bg-light border">
          <div class="d-flex gap-2 align-items-center flex-wrap">
            <span class="fw-bold" style="font-size:13px;"><i class="bi bi-funnel text-primary me-1"></i> ${t("Filtreler:", "Filter:")}</span>
            <input type="text" class="form-control form-control-sm w-auto" placeholder="${t("🔍 Veri Ara...", "🔍 Cari Data...")}" onkeyup="filterTableData(this.value)">
            <select class="form-select form-select-sm w-auto" onchange="App.dbFilterBulan=this.value; refreshKelolaTable()">
              <option value="all">${t("Tüm Aylar", "Semua Bulan")}</option>
              ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => `<option value="${m}" ${App.dbFilterBulan == m ? "selected" : ""}>${m}. ${t("Ay", "Bulan")}</option>`).join("")}
            </select>
            <select class="form-select form-select-sm w-auto" onchange="App.dbFilterTahun=this.value; refreshKelolaTable()">
              <option value="all">${t("Tüm Yıllar", "Semua Tahun")}</option>
              ${[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((yr) => `<option value="${yr}" ${App.dbFilterTahun == yr ? "selected" : ""}>${yr}</option>`).join("")}
            </select>
          </div>
        </div>
        <div id="kelolaContent">${renderKelolaTable()}</div>
      `;
      }

      window.switchKelolaTab = (tab) => { App.kelolaTab = tab; navTo("kelola"); };
      window.refreshKelolaTable = () => { if ($("kelolaContent")) $("kelolaContent").innerHTML = renderKelolaTable(); };

      function renderKelolaTable() {
        const tab = App.kelolaTab;
        if (tab === "kotakAmal") {
          return `<div class="pst-card"><div class="table-responsive"><table class="table table-sm align-middle"><thead><tr><th>${t("Kutu Adı", "Nama Kotak")}</th><th>${t("Adres", "Alamat")}</th><th>${t("Harita", "Maps")}</th><th>${t("Tarih", "Tanggal")}</th><th>${t("Durum", "Status")}</th><th>${t("Açan Personel", "Personel Pembuka")}</th><th class="no-print">${t("İşlem", "Aksi")}</th></tr></thead><tbody>${getFilteredDBData("kotakAmal").map((k) => `<tr><td class="fw-bold">${k.namaKotak || "-"}</td><td>${k.alamat || "-"}</td><td>${renderMapBtn(k.linkMaps)}</td><td>${k.tanggalPasang ? String(k.tanggalPasang).substring(0, 10) : "-"}</td><td><span class="badge bg-success">${t(k.status||"Aktif", k.status||"Aktif")}</span></td><td><select class="form-select form-select-sm" onchange="setKotakDibuka('${k.id}', this.value, this)">${buildPersonelOptions(k.sedangDibukaOleh)}</select></td><td class="no-print"><button class="btn btn-sm text-primary me-1" onclick="openEditDBModal('kotakAmal','${k.id}')"><i class="bi bi-pencil-square"></i></button><button class="btn btn-sm text-danger" onclick="hapusDBItem('kotakAmal','${k.id}', this)"><i class="bi bi-trash"></i></button></td></tr>`).join("")}</tbody></table></div></div>`;
        } else if (tab === "kotakBaru") {
          return `<div class="pst-card"><div class="table-responsive"><table class="table table-sm"><thead><tr><th>${t("Kutu Adı", "Nama Kotak")}</th><th>${t("Adres", "Alamat")}</th><th>${t("Harita", "Maps")}</th><th>${t("Koyan Personel", "Pemasang")}</th><th class="no-print">${t("Durum İşlemi", "Aksi Status")}</th><th class="no-print">${t("İşlem", "Aksi")}</th></tr></thead><tbody>${getFilteredDBData("kotakBaru").map((k) => `<tr><td class="fw-bold">${k.namaKotak || "-"}</td><td>${k.alamat || "-"}</td><td>${renderMapBtn(k.linkMaps)}</td><td>${k.pemasang || "-"}</td><td class="no-print"><button class="btn btn-sm btn-success" onclick="pindahKotak('${k.id}', this)"><i class="bi bi-check2-circle me-1"></i>${t("Aktif Yap", "Aktifkan")}</button></td><td class="no-print text-nowrap"><button class="btn btn-sm text-primary me-1" onclick="openEditDBModal('kotakBaru','${k.id}')"><i class="bi bi-pencil-square"></i></button><button class="btn btn-sm text-danger" onclick="hapusDBItem('kotakBaru','${k.id}', this)"><i class="bi bi-trash"></i></button></td></tr>`).join("")}</tbody></table></div></div>`;
        } else if (tab === "kumbara") {
          return `<div class="pst-card"><div class="table-responsive"><table class="table table-sm align-middle"><thead><tr><th>${t("Kumbara Yeri", "Lokasi")}</th><th>${t("Adres", "Alamat")}</th><th>${t("Harita", "Maps")}</th><th>${t("Tarih", "Tanggal")}</th><th>${t("Notlar", "Catatan")}</th><th>${t("Durum", "Status")}</th><th>${t("Atanan Personel", "Tugas")}</th><th class="no-print">${t("İşlem", "Aksi")}</th></tr></thead><tbody>${getFilteredDBData("kumbara").map((k) => `<tr><td class="fw-bold">${k.tempat || "-"}</td><td>${k.alamat || "-"}</td><td>${renderMapBtn(k.linkMaps)}</td><td>${k.tanggal ? String(k.tanggal).substring(0, 10) : "-"}</td><td class="text-muted text-wrap">${k.catatan || "-"}</td><td><span class="badge bg-success">${t(k.status||"Aktif",k.status||"Aktif")}</span></td><td><select class="form-select form-select-sm" onchange="setKumbaraDiambil('${k.id}', this.value, this)">${buildVazifeOptions(k.sedangDiambil)}</select></td><td class="no-print"><button class="btn btn-sm text-primary me-1" onclick="openEditDBModal('kumbara','${k.id}')"><i class="bi bi-pencil-square"></i></button><button class="btn btn-sm text-danger" onclick="hapusDBItem('kumbara','${k.id}', this)"><i class="bi bi-trash"></i></button></td></tr>`).join("")}</tbody></table></div></div>`;
        } else if (tab === "masjid") {
          return `<div class="pst-card"><div class="table-responsive"><table class="table table-sm align-middle"><thead><tr><th>${t("Cami Adı", "Nama Masjid")}</th><th>${t("Adres", "Alamat")}</th><th>${t("Harita", "Maps")}</th><th>${t("Tür", "Tipe")}</th><th>${t("Vazife Olan", "Tugas")}</th><th class="no-print">${t("İşlem", "Aksi")}</th></tr></thead><tbody>${getFilteredDBData("masjid").map((k) => `<tr><td class="fw-bold">${k.namaMasjid || "-"}</td><td>${k.alamat || "-"}</td><td>${renderMapBtn(k.linkMaps)}</td><td><span class="badge bg-secondary">${t(k.tipe||"-", k.tipe||"-")}</span></td><td><select class="form-select form-select-sm" onchange="setCamiVazife('${k.id}', this.value, this)">${buildVazifeOptions(k.vazifeOlan || "")}</select></td><td class="no-print"><button class="btn btn-sm text-primary me-1" onclick="openEditDBModal('masjid','${k.id}')"><i class="bi bi-pencil-square"></i></button><button class="btn btn-sm text-danger" onclick="hapusDBItem('masjid','${k.id}', this)"><i class="bi bi-trash"></i></button></td></tr>`).join("")}</tbody></table></div></div>`;
        }
        return "";
      }

      window.openDBModal = (type) => {
        $("db_edit_id").value = "";
        $("db_type").value = type;
        let titleModal = t("Veri Ekle", "Tambah Data");
        let labelNama = t("Mekan / Kutu / Cami Adı", "Nama Tempat/Kotak/Masjid");

        if (type === "kotakAmal") { titleModal = t("Aktif Sadaka Kutusu Ekle", "Tambah Kotak Amal Aktif"); labelNama = t("Dükkan / Mekan Adı", "Nama Toko / Tempat"); }
        else if (type === "kotakBaru") { titleModal = t("Yeni / Bekleyen Kutu Ekle", "Tambah Kotak Baru"); labelNama = t("Dükkan / Mekan Adı", "Nama Toko / Tempat"); }
        else if (type === "kumbara") { titleModal = t("Kumbara Mekanı Ekle", "Tambah Lokasi Kumbara"); labelNama = t("Mekan / Kumbara Evi Adı", "Nama Lokasi / Rumah"); }
        else if (type === "masjid") { titleModal = t("Cami Ekle", "Tambah Masjid"); labelNama = t("Cami Adı", "Nama Masjid"); }

        $("modalDBTitle").innerText = titleModal;
        $("db_nama_label").innerText = labelNama;
        $("formDB").reset();
        $("db_tipe_group").style.display = type === "masjid" ? "block" : "none";
        $("db_pemasang_group").style.display = type === "kotakBaru" ? "block" : "none";
        $("db_catatan_group").style.display = type === "kumbara" ? "block" : "none";
        bootstrap.Modal.getOrCreateInstance($("modalDB")).show();
      };

      window.openEditDBModal = (type, id) => {
        const item = (App.data[type] || []).find((x) => String(x.id) === String(id));
        if (!item) return;
        $("db_edit_id").value = id; $("db_type").value = type;
        $("modalDBTitle").innerText = t("Veriyi Düzenle", "Edit Data");
        $("db_nama").value = item.namaKotak || item.tempat || item.namaMasjid || "";
        $("db_alamat").value = item.alamat || ""; $("db_linkMaps").value = item.linkMaps || "";
        $("db_pemasang").value = item.pemasang || ""; $("db_catatan").value = item.catatan || "";
        $("db_tipe").value = item.tipe || "Yeni";

        $("db_tipe_group").style.display = type === "masjid" ? "block" : "none";
        $("db_pemasang_group").style.display = type === "kotakBaru" ? "block" : "none";
        $("db_catatan_group").style.display = type === "kumbara" ? "block" : "none";
        bootstrap.Modal.getOrCreateInstance($("modalDB")).show();
      };

      $("formDB").onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        setBtnLoading(btn, true);
        try {
          const payload = {
            nama: $("db_nama").value.trim(), alamat: $("db_alamat").value.trim(), linkMaps: $("db_linkMaps").value.trim(),
            pemasang: $("db_pemasang").value.trim(), catatan: $("db_catatan").value.trim(), tipe: $("db_tipe").value,
          };
          const editId = $("db_edit_id").value;
          const res = editId ? await DB.call("editLocationItem", $("db_type").value, editId, payload) : await DB.call("addLocationItem", $("db_type").value, payload);

          if (res && res.ok !== false) {
            const dataRes = await DB.getInitData();
            if (dataRes.ok) App.data = dataRes.data;
            bootstrap.Modal.getOrCreateInstance($("modalDB")).hide();
            refreshKelolaTable();
            Swal.fire({ icon: "success", title: t("Başarılı!", "Berhasil!"), text: t("Veri kaydedildi.", "Data tersimpan."), timer: 1500, showConfirmButton: false });
          } else {
            Swal.fire({ icon: "error", title: t("Hata", "Error"), text: res?.error });
          }
        } finally { setBtnLoading(btn, false); }
      };

      window.hapusDBItem = async (type, id, btn) => {
        const confirm = await Swal.fire({
          title: t("Emin misiniz?", "Apakah Anda yakin?"), text: t("Bu veri kalıcı olarak silinecektir!", "Data ini akan dihapus permanen!"),
          icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#6b7280",
          confirmButtonText: t("Evet, Sil!", "Ya, Hapus!"), cancelButtonText: t("İptal", "Batal"),
        });
        if (confirm.isConfirmed) {
          setBtnLoading(btn, true);
          try {
            const res = await DB.call("deleteLocationItem", type, id);
            if (res && res.ok !== false) {
              const dataRes = await DB.getInitData();
              if (dataRes.ok) App.data = dataRes.data;
              refreshKelolaTable();
              Swal.fire({ icon: "success", title: t("Silindi!", "Terhapus!"), timer: 1200, showConfirmButton: false });
            }
          } finally { setBtnLoading(btn, false); }
        }
      };

      window.pindahKotak = async (id, btn) => {
        setBtnLoading(btn, true);
        try {
          const res = await DB.call("moveKotakAmalBaru", id);
          if (res && res.ok !== false) {
            const dataRes = await DB.getInitData();
            if (dataRes.ok) App.data = dataRes.data;
            refreshKelolaTable();
            Swal.fire({ icon: "success", title: t("Aktif Edildi!", "Telah Diaktifkan!"), timer: 1200, showConfirmButton: false });
          }
        } finally { setBtnLoading(btn, false); }
      };

      window.openLogModal = (actId) => {
        const act = getAktivitas().find((a) => a.id === actId);
        if (!act) return;

        $("formLog").reset();
        $("log_kegiatan").value = act.label;
        $("log_isKoyma").value = act.isKoyma ? "true" : "false";
        $("log_lokasiType").value = act.lokasiType || "";
        $("modalLogTitle").innerText = act.label + (lang==="id" ? " (Pencatatan)" : " Kaydı");

        $("log_lokasi_group").style.display = "none";
        $("log_nama_baru_group").style.display = "none";
        $("log_telepon_group").style.display = "none";
        $("log_uang_group").style.display = "none";
        $("log_personel_tambahan_group").style.display = "none";

        if (act.uang) $("log_uang_group").style.display = "block";
        if (act.butuhTelepon) $("log_telepon_group").style.display = "block";
        if (act.isKoyma) $("log_nama_baru_group").style.display = "block";

        if (act.lokasi) {
          $("log_lokasi_group").style.display = "block";
          const sel = $("log_lokasi");
          sel.innerHTML = `<option value="">-- ${t("Mekan Seçin", "Pilih Tempat")} --</option>`;

          let listDropdown = [];
          if (act.lokasi === "kotakAmal") {
            listDropdown = (App.data.kotakAmal || []).filter((k) => String(k.status || "").toLowerCase() !== "açıldı").map((k) => ({ val: k.namaKotak, label: k.namaKotak }));
          } else if (act.lokasi === "kumbara") {
            listDropdown = (App.data.kumbara || []).filter(k => !["alınmış", "alinmis", "toplandı"].includes(String(k.status || "").trim().toLowerCase())).map((k) => ({ val: k.tempat, label: k.tempat }));
          } else if (act.lokasi === "masjidEski") {
            listDropdown = (App.data.masjid || []).filter((m) => String(m.tipe || "").toLowerCase() === "eski").map((m) => ({ val: m.namaMasjid, label: m.namaMasjid }));
          }

          listDropdown.forEach((item) => {
            if (item.val) {
              const opt = document.createElement("option");
              opt.value = item.val; opt.innerText = item.label;
              sel.appendChild(opt);
            }
          });
        }

        if (!act.sembunyikanPersonel) {
          $("log_personel_tambahan_group").style.display = "block";
          const popPersonel = (idSelect) => {
            const s = $(idSelect);
            s.innerHTML = `<option value="">--${t("Diğer Personel", "Personel Lain")}--</option>`;
            (App.data.users || []).filter((u) => u.nama !== App.user.nama && u.role !== "idareci").forEach((u) => {
              s.innerHTML += `<option value="${u.nama}">${u.nama}</option>`;
            });
          };
          popPersonel("log_personel_1"); popPersonel("log_personel_2");
        }
        bootstrap.Modal.getOrCreateInstance($("modalLog")).show();
      };

      $("formLog").onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        setBtnLoading(btn, true);

        try {
          const isKoyma = $("log_isKoyma").value === "true";
          let lokasiVal = "";
          if (isKoyma) {
            const nm = $("log_nama_baru").value.trim(), alm = $("log_alamat_baru").value.trim();
            lokasiVal = `${nm} (${alm})`;
            const type = $("log_lokasiType").value;
            if (type) await DB.call("addLocationItem", type, { nama: nm, tempat: nm, alamat: alm, linkMaps: $("log_linkMaps_baru").value.trim(), pemasang: App.user.nama, tipe: type === "masjid" ? "Yeni" : "" });
          } else if ($("log_lokasi_group").style.display !== "none") {
            lokasiVal = $("log_lokasi").value;
          }

          let finalCatatan = $("log_catatan").value.trim();
          const telp = $("log_telepon").value.trim();
          if (telp && $("log_telepon_group").style.display !== "none") finalCatatan = "Telp/WA: " + telp + (finalCatatan ? " | " + finalCatatan : "");

          const isPersonelHidden = $("log_personel_tambahan_group").style.display === "none";
          const payload = {
            namaUser: App.user.nama, tanggal: $("log_tanggal").value, kegiatan: $("log_kegiatan").value,
            jumlah: $("log_jumlah").value, uang: $("log_uang_group").style.display !== "none" ? $("log_uang").value : 0,
            lokasi: lokasiVal, catatan: finalCatatan,
            personel1: isPersonelHidden ? "" : $("log_personel_1").value, personel2: isPersonelHidden ? "" : $("log_personel_2").value,
          };

          const res = await DB.call("submitLog", payload);
          if (res && res.ok !== false) {
            const dataRes = await DB.getInitData();
            if (dataRes.ok) App.data = dataRes.data;
            bootstrap.Modal.getOrCreateInstance($("modalLog")).hide();

            // Render ulang tab aktif tanpa refresh halaman
            navTo(App.nav);
            applyHtmlTranslations();
            Swal.fire({ icon: "success", title: t("Başarılı!", "Berhasil!"), text: t("Data tersimpan.", "Data tersimpan."), timer: 2000, showConfirmButton: false });
          }
        } finally { setBtnLoading(btn, false); }
      };

      window.openEditLogModal = (id) => {
        const item = (App.data.todayLog || []).find((x) => String(x.id) === String(id));
        if (!item) return;
        $("edit_log_id").value = id; $("edit_log_kegiatan").value = item.kegiatan || "";
        $("edit_log_lokasi").value = item.lokasi || ""; $("edit_log_tanggal").value = String(item.tanggal || "").substring(0, 10);
        $("edit_log_jumlah").value = item.jumlah || 1; $("edit_log_uang").value = item.uang || 0;
        $("edit_log_catatan").value = item.catatan || "";
        bootstrap.Modal.getOrCreateInstance($("modalEditLog")).show();
      };

      $("formEditLog").onsubmit = async (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button[type="submit"]');
        setBtnLoading(btn, true);
        try {
          const payload = { tanggal: $("edit_log_tanggal").value, jumlah: $("edit_log_jumlah").value, uang: $("edit_log_uang").value, catatan: $("edit_log_catatan").value.trim() };
          const res = await DB.call("editLog", $("edit_log_id").value, payload);
          if (res && res.ok !== false) {
            const dataRes = await DB.getInitData();
            if (dataRes.ok) App.data = dataRes.data;
            bootstrap.Modal.getOrCreateInstance($("modalEditLog")).hide();

            navTo(App.nav);
            applyHtmlTranslations();
            Swal.fire({ icon: "success", title: t("Güncellendi!", "Diperbarui!"), timer: 1200, showConfirmButton: false });
          }
        } finally { setBtnLoading(btn, false); }
      };

      window.hapusLog = async (id, btn) => {
        const confirm = await Swal.fire({
          title: t("Silmek istediğinize emin misiniz?", "Yakin ingin menghapus?"), icon: "warning",
          showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#6b7280",
          confirmButtonText: t("Sil", "Hapus"), cancelButtonText: t("İptal", "Batal"),
        });
        if (confirm.isConfirmed) {
          setBtnLoading(btn, true);
          try {
            const res = await DB.call("deleteLog", id);
            if (res && res.ok !== false) {
              const dataRes = await DB.getInitData();
              if (dataRes.ok) App.data = dataRes.data;

              navTo(App.nav);
              applyHtmlTranslations();
              Swal.fire({ icon: "success", title: t("Silindi!", "Terhapus!"), timer: 1200, showConfirmButton: false });
            }
          } finally { setBtnLoading(btn, false); }
        }
      };

      window.filterTableData = (query) => {
        const lowerQuery = query.toLowerCase();
        document.querySelectorAll(".table-responsive tbody tr").forEach((row) => {
          if (row.cells.length === 1 && row.cells[0].colSpan > 1) return;
          row.style.display = row.innerText.toLowerCase().includes(lowerQuery) ? "" : "none";
        });
      };

      function renderRiwayatAktivitasPersonel() {
        return `
          <div class="pst-card mb-3">
            <h6 class="fw-bold mb-3"><i class="bi bi-calendar-range text-primary me-2"></i>${t("Tarih Aralığını Filtrele", "Saring Rentang Tanggal")}</h6>
            <div class="row g-2 align-items-end">
              <div class="col-md-4 col-sm-6">
                <label class="form-label text-muted" style="font-size:12px; font-weight:bold;">${t("Başlangıç Tarihi", "Tanggal Mulai")}</label>
                <input type="date" id="filterRiwayatMulai" class="form-control form-control-sm">
              </div>
              <div class="col-md-4 col-sm-6">
                <label class="form-label text-muted" style="font-size:12px; font-weight:bold;">${t("Bitiş Tarihi", "Tanggal Akhir")}</label>
                <input type="date" id="filterRiwayatAkhir" class="form-control form-control-sm">
              </div>
              <div class="col-md-4 col-sm-12 d-flex gap-2">
                <button class="btn btn-sm btn-pst flex-grow-1" onclick="updateTableRiwayatAktivitas()"><i class="bi bi-funnel-fill me-1"></i> ${t("Uygula", "Terapkan")}</button>
                <button class="btn btn-sm btn-outline-secondary" onclick="initRiwayatAktivitas()"><i class="bi bi-arrow-clockwise"></i> ${t("Sıfırla", "Reset")}</button>
              </div>
            </div>
          </div>
          <div class="row mb-3" id="ringkasanAtasRiwayat"></div>
          <div class="pst-card">
            <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <h6 class="fw-bold mb-0"><i class="bi bi-clock-history text-primary me-2"></i>${t("Faaliyetlerim", "Kegiatanku")}</h6>
              <input type="text" class="form-control form-control-sm" style="max-width: 200px;" placeholder="${t("🔍 Faaliyet/Konum Ara...", "🔍 Cari Kegiatan/Tempat...")}" onkeyup="filterTabelRiwayat(this.value)">
            </div>
            <div id="riwayatAktivitasContainer"><div class="text-center py-4"><div class="spinner-border text-success"></div></div></div>
          </div>
        `;
      }

      window.initRiwayatAktivitas = () => {
        const now = new Date(), firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const fmtStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        if ($("filterRiwayatMulai") && $("filterRiwayatAkhir")) {
          $("filterRiwayatMulai").value = fmtStr(firstDay); $("filterRiwayatAkhir").value = fmtStr(now);
          updateTableRiwayatAktivitas();
        }
      };

      window.updateTableRiwayatAktivitas = () => {
        const container = $("riwayatAktivitasContainer"), ringkasanEl = $("ringkasanAtasRiwayat");
        if (!container || !ringkasanEl) return;
        const tglMulai = $("filterRiwayatMulai").value, tglAkhir = $("filterRiwayatAkhir").value;

        const myLogs = (App.data.allLog || []).filter((l) => {
          if (l.namaUser.toLowerCase() !== App.user.nama.toLowerCase()) return false;
          const logDate = String(l.tanggal || "").substring(0, 10);
          return (!tglMulai || logDate >= tglMulai) && (!tglAkhir || logDate <= tglAkhir);
        }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

        const summary = {}; let totalUang = 0, totalSemuaAkt = 0;
        myLogs.forEach((l) => {
          const keg = l.kegiatan || t("Diğerleri", "Lainnya");
          if (!summary[keg]) summary[keg] = { count: 0, money: 0 };
          summary[keg].count += Number(l.jumlah) || 1;
          totalUang += Number(l.uang) || 0;
          totalSemuaAkt += Number(l.jumlah) || 1;
        });

        const rincianHtml = Object.keys(summary).map((keg) => `
          <div class="col-sm-6 col-12">
            <div class="d-flex justify-content-between align-items-center p-2 rounded border h-100 bg-light">
              <span class="fw-bold" style="font-size: 11.5px; color: #1a1a1a;">${keg}</span><span class="badge bg-secondary">${summary[keg].count}</span>
            </div>
          </div>
        `).join("") || `<div class="col-12 text-center text-muted small py-2">${t("Bu dönemde henüz faaliyet bulunmuyor.", "Tidak ada kegiatan di rentang waktu ini.")}</div>`;

        ringkasanEl.innerHTML = `
          <div class="row g-3">
            <div class="col-md-7 col-12"><div class="pst-card h-100 mb-0"><div class="text-muted small fw-bold mb-3 d-flex justify-content-between"><span>${t("FAALİYET DETAYLARI", "DETAIL KEGIATAN")}</span><span class="badge bg-success">${t("Genel Toplam", "Total Keseluruhan")}: ${totalSemuaAkt}</span></div><div class="row g-2">${rincianHtml}</div></div></div>
            <div class="col-md-5 col-12"><div class="pst-card text-center h-100 mb-0 d-flex flex-column justify-content-center"><div class="text-muted small fw-bold mb-2">${t("TOPLANAN TOPLAM MEBLAĞ", "TOTAL DANA TERKUMPUL")}</div><div class="fs-1 fw-bold text-success">${fmtRp(totalUang)}</div></div></div>
          </div>`;

        container.innerHTML = myLogs.length === 0 ? `<div class="text-center text-muted py-4"><i class="bi bi-inbox fs-3 d-block mb-2"></i>${t("Bu tarih aralığına ait faaliyet geçmişi bulunmuyor.", "Tidak ada riwayat kegiatan di tanggal ini.")}</div>` : `
          <div class="table-responsive">
            <table class="table table-sm table-hover text-nowrap" id="tabelRiwayatSaya" style="width: 120%; max-width: none; table-layout: fixed;">
              <thead class="table-light"><tr style="font-size:12px;"><th>${t("Tarih", "Tanggal")}</th><th>${t("Faaliyet", "Kegiatan")}</th><th>${t("Konum", "Lokasi")}</th><th>${t("Adet", "Jumlah")}</th><th>${t("Meblağ (Rp)", "Nominal (Rp)")}</th><th>${t("Notlar", "Catatan")}</th></tr></thead>
              <tbody>${myLogs.map((l) => `<tr><td class="text-muted" style="font-size:12px;">${String(l.tanggal).substring(0, 10)}</td><td><span class="badge bg-light text-dark border">${l.kegiatan}</span></td><td class="text-wrap">${l.lokasi || "-"}</td><td><b>${l.jumlah}</b></td><td class="text-success fw-bold">${l.uang > 0 ? fmtRp(l.uang) : "-"}</td><td class="text-wrap">${l.catatan || "-"}</td></tr>`).join("")}</tbody>
            </table>
          </div>`;
      };

      window.filterTabelRiwayat = (q) => { document.querySelectorAll("#tabelRiwayatSaya tbody tr").forEach(row => { row.style.display = row.innerText.toLowerCase().includes(q.toLowerCase()) ? "" : "none"; }); };

      function renderLaporanAktivitas() {
        return `
          <div class="pst-card mb-3">
            <h6 class="fw-bold mb-3">${t("Tarih Aralığı Seçiniz", "Pilih Rentang Tanggal")}</h6>
            <div class="row g-2 align-items-end">
              <div class="col-md-4"><label class="form-label text-muted" style="font-size:12px;">${t("Başlangıç:", "Mulai:")}</label><input type="date" id="lapMulai" class="form-control form-control-sm"></div>
              <div class="col-md-4"><label class="form-label text-muted" style="font-size:12px;">${t("Bitiş:", "Akhir:")}</label><input type="date" id="lapAkhir" class="form-control form-control-sm"></div>
              <div class="col-md-4"><button class="btn btn-sm btn-pst w-100" onclick="loadCustomReport()">${t("Raporu Görüntüle", "Tampilkan Laporan")}</button></div>
            </div>
          </div>
          <div id="customReportContainer"></div>
        `;
      }

      window.loadCustomReport = async () => {
        const start = $("lapMulai").value, end = $("lapAkhir").value;
        if (!start || !end) return Swal.fire(t("Uyarı", "Peringatan"), t("Lütfen önce bir tarih seçiniz!", "Silakan pilih tanggal terlebih dahulu!"), "warning");

        const container = $("customReportContainer");
        container.innerHTML = `<div class="text-center py-4"><div class="spinner-border text-success"></div></div>`;
        const res = await DB.call("getCustomActivityReport", start, end);
        if (!res.ok) return (container.innerHTML = `<div class="alert alert-danger">${t("Hata:", "Error:")} ${res.error}</div>`);

        const { summary = [], aktivitasList = [], totalRecords = 0, totalUang = 0 } = res.data || {};
        if (summary.length === 0) return (container.innerHTML = `<div class="pst-card text-center text-muted py-4">${t("Seçilen tarih aralığında veri bulunamadı.", "Data tidak ditemukan pada rentang tanggal ini.")}</div>`);

        let headers = aktivitasList.map((a) => `<th class="text-center align-middle">${a}</th>`).join("");
        let rows = summary.map((item) => `<tr><td class="text-start fw-bold">${item.nama}</td>${aktivitasList.map((a) => `<td class="text-center">${item.acts[a] || "-"}</td>`).join("")}<td class="text-center fw-bold bg-light">${item.totalCount}</td><td class="text-end fw-bold text-success bg-light">${fmtRp(item.totalUang)}</td></tr>`).join("");

        container.innerHTML = `
          <div class="pst-card"><div class="table-responsive"><table class="table table-bordered table-hover text-nowrap"><thead class="table-light"><tr style="font-size: 13px;"><th class="text-start align-middle">${t("Personel Adı", "Nama Personel")}</th>${headers}<th class="text-center align-middle">${t("Toplam Adet", "Total Jumlah")}</th><th class="text-end align-middle">${t("Toplam Meblağ", "Total Nominal")}</th></tr></thead><tbody>${rows}</tbody><tfoot><tr class="table-active"><td class="fw-bold text-end pe-3" colspan="${aktivitasList.length + 1}">${t("GENEL TOPLAM", "TOTAL KESELURUHAN")}</td><td class="text-center fw-bold fs-6">${totalRecords}</td><td class="text-end fw-bold text-success fs-6">${fmtRp(totalUang)}</td></tr></tfoot></table></div></div>`;
      };

      window.addEventListener("DOMContentLoaded", initAppSession);

      window.handleProfileUpload = function(event) {
        const file = event.target.files[0];
        if (!file) return;
        if(file.size > 2 * 1024 * 1024) return Swal.fire({ icon: 'error', title: t('Ukuran Terlalu Besar', 'Ukuran Terlalu Besar'), text: t('Maksimal ukuran foto adalah 2MB.', 'Maksimal ukuran foto adalah 2MB.') });

        const reader = new FileReader();
        reader.onload = function(e) {
            const base64Image = e.target.result;
            localStorage.setItem(`fuh_profile_pic_${App.user.nama}`, base64Image);
            if($('dashProfilePic')) $('dashProfilePic').src = base64Image;
            if($('sidebarProfilePic')) $('sidebarProfilePic').src = base64Image;
            Swal.fire({ icon: 'success', title: t('Foto Profil Diperbarui!', 'Foto Profil Diperbarui!'), toast: true, position: 'top-end', showConfirmButton: false, timer: 2000 });
        };
        reader.readAsDataURL(file);
      };

      const MEKAN_ICONS = { "Masjid": "bi-moon-stars-fill", "Mushollah": "bi-moon-stars", "PT/Instansi": "bi-building", "Warung Madura": "bi-shop", "Warung Makan": "bi-cup-hot-fill" };
      function getMekanIcon(k) { return MEKAN_ICONS[k] || "bi-geo-alt-fill"; }
      function buildWaLink(n) { if(!n) return ""; let x = String(n).replace(/[^0-9]/g, ""); return `https://wa.me/${x.startsWith("0") ? "62" + x.substring(1) : x}`; }

      function renderMekanlar() {
          const isAdmin = App.user.role === "idareci";
          const dataMekan = App.data.mekanlar || [];

          let html = `
            <div class="d-flex justify-content-between mb-4">
              <div><h6 class="fw-bold"><i class="bi bi-geo-alt-fill text-primary"></i> ${t("Mekanlar (Daftar Tempat Potensi)", "Daftar Tempat Potensi")}</h6></div>
              <button class="btn btn-sm btn-pst" onclick="openMekanModal()"><i class="bi bi-plus-lg"></i> ${t("Yeni Ekle", "Tambah Baru")}</button>
            </div>`;

          if (dataMekan.length === 0) return html + `<div class="pst-card text-center py-5 text-muted">${t("Veri yok.", "Belum ada data.")}</div>`;

          const grouped = {};
          dataMekan.forEach(m => { const k = m.kategori || "Lainnya"; if(!grouped[k]) grouped[k] = []; grouped[k].push(m); });

          let groupIdx = 0;
          for(const [kategori, items] of Object.entries(grouped)) {
            const groupId = `mekan-group-${groupIdx++}`;
            html += `
              <div class="mb-4">
                <div class="d-flex align-items-center justify-content-between mb-3" style="border-bottom: 2px solid var(--g500); padding-bottom: 6px;">
                  <h6 class="fw-bold text-success mb-0">
                    <i class="bi ${getMekanIcon(kategori)}"></i> ${kategori}
                    <span class="badge bg-light text-dark border ms-1">${items.length}</span>
                  </h6>
                  <button type="button" class="btn btn-sm btn-outline-secondary py-0 px-2" onclick="toggleGroup('${groupId}', this)">
                    <i class="bi bi-chevron-up"></i> <span class="toggle-label">${t("")}</span>
                  </button>
                </div>
                <div class="row g-3" id="${groupId}">
            `;
            html += items.map(m => `
              <div class="col-md-4 col-sm-6">
                <div class="card-modern h-100 d-flex flex-column">
                  <div class="fw-bold text-dark mb-2">${m.nama} ${m.linkMaps ? `<a href="${m.linkMaps}" target="_blank" class="ms-2"><i class="bi bi-geo-alt"></i></a>` : ""}</div>
                  <div class="text-muted small mb-1"><i class="bi bi-person-fill"></i> ${m.penanggungJawab || "-"}</div>
                  <div class="text-muted small mb-2"><i class="bi bi-whatsapp text-success"></i> ${m.noWA ? `<a href="${buildWaLink(m.noWA)}" target="_blank" class="text-success text-decoration-none">${m.noWA}</a>` : "-"}</div>

                  <!-- Bagian yang diubah: Menampilkan 'Potensi yang Ada' jika keterangan kosong -->
                  <div class="p-2 bg-light flex-grow-1 small">
                    ${m.keterangan ? m.keterangan : `<span class="text-muted fst-italic">${t("Potansiyel Mevcut", "Potensi yang Ada")}</span>`}
                  </div>

                  <div class="d-flex gap-2 mt-2 border-top pt-2">
                    <button class="btn btn-sm btn-outline-primary flex-grow-1" onclick="openEditMekanModal('${m.id}')">${t("Düzenle", "Edit")}</button>
                    ${isAdmin ? `<button class="btn btn-sm btn-outline-danger" onclick="hapusMekan('${m.id}')"><i class="bi bi-trash"></i></button>` : ""}
                  </div>
                </div>
              </div>
            `).join("");
            html += `</div></div>`;
          }
          return html;
        }

      window.onMekanKategoriChange = () => {
        const k = $("mekan_kategori").value;
        $("mekan_kategori_manual_group").style.display = k === "__lainnya__" ? "" : "none";
        $("mekan_instansi_group").style.display = k === "PT/Instansi" ? "" : "none";
      };

      window.openMekanModal = () => { $("formMekan").reset(); $("mekan_edit_id").value = ""; $("modalMekanTitle").innerText = t("Mekan Ekle", "Tambah Tempat"); onMekanKategoriChange(); bootstrap.Modal.getOrCreateInstance($("modalMekan")).show(); };
      window.openEditMekanModal = (id) => {
        const m = (App.data.mekanlar || []).find(x => x.id === id); if(!m) return;
        $("mekan_edit_id").value = id; $("mekan_kategori").value = ["Masjid","Mushollah","PT/Instansi","Warung Madura","Warung Makan"].includes(m.kategori) ? m.kategori : "__lainnya__";
        if($("mekan_kategori").value === "__lainnya__") $("mekan_kategori_manual").value = m.kategori;
        $("mekan_nama").value = m.nama; $("mekan_linkMaps").value = m.linkMaps; $("mekan_penanggungJawab").value = m.penanggungJawab; $("mekan_noWA").value = m.noWA;
        $("mekan_bidangUsaha").value = m.bidangUsaha; $("mekan_adaMasjidMushollah").value = m.adaMasjidMushollah; $("mekan_keterangan").value = m.keterangan;
        $("modalMekanTitle").innerText = t("Mekanı Düzenle", "Edit Tempat"); onMekanKategoriChange(); bootstrap.Modal.getOrCreateInstance($("modalMekan")).show();
      };
      window.hapusMekan = async (id) => {
        const confirm = await Swal.fire({ title: t("Sil?", "Hapus?"), icon: "warning", showCancelButton: true, confirmButtonText: t("Sil", "Hapus") });
        if(confirm.isConfirmed) {
          await DB.call("deleteMekan", id);
          const dataRes = await DB.getInitData();
          if (dataRes.ok) App.data = dataRes.data;

          navTo(App.nav);
          applyHtmlTranslations();
          Swal.fire({ icon: 'success', title: t('Silindi!', 'Terhapus!'), toast: true, position: 'top-end', showConfirmButton: false, timer: 1500 });
        }
      };

      if($("formMekan")) $("formMekan").onsubmit = async (e) => {
        e.preventDefault(); const btn = e.target.querySelector('button'); setBtnLoading(btn, true);
        const k = $("mekan_kategori").value === "__lainnya__" ? $("mekan_kategori_manual").value : $("mekan_kategori").value;
        const p = { kategori: k, nama: $("mekan_nama").value, linkMaps: $("mekan_linkMaps").value, penanggungJawab: $("mekan_penanggungJawab").value, noWA: $("mekan_noWA").value, bidangUsaha: $("mekan_bidangUsaha").value, adaMasjidMushollah: $("mekan_adaMasjidMushollah").value, keterangan: $("mekan_keterangan").value };
        const editId = $("mekan_edit_id").value;
        const res = editId ? await DB.call("editMekan", editId, p) : await DB.call("addMekan", p);

        if(res.ok) {
          const dataRes = await DB.getInitData();
          if (dataRes.ok) App.data = dataRes.data;
          bootstrap.Modal.getOrCreateInstance($("modalMekan")).hide();

          navTo(App.nav);
          applyHtmlTranslations();
          Swal.fire({ icon: 'success', title: t('Başarılı!', 'Berhasil!'), timer: 1500, showConfirmButton: false });
        } else {
          Swal.fire("Error", res.error, "error");
        }
        setBtnLoading(btn, false);
      };