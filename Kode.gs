// ============================================================
// FOLLOW UP HARIAN — Code.gs (Full Feature + Dual Role + Username & PIN)
// ============================================================

const SN = {
  USERS: "Users",
  LOG: "Log_Aktivitas",
  KOTAK_AMAL: "Kotak_Amal",
  KOTAK_BARU: "Kotak_Amal_Baru",
  KUMBARA: "Kumbara",
  MASJID: "Masjid",
  TALEBE: "Talebe",
  BROSUR: "Brosur",
  MEKANLAR: "Mekanlar",
  PENGATURAN: "Pengaturan"
};

const HEADERS = {
  USERS: ["username", "namaLengkap", "role", "pin", "tanggalDaftar"],
  LOG: [
    "id",
    "tanggal",
    "namaUser",
    "kegiatan",
    "jumlah",
    "uang",
    "lokasi",
    "catatan",
    "timestamp",
  ],
  KOTAK_AMAL: [
    "id",
    "namaKotak",
    "alamat",
    "linkMaps",
    "status",
    "tanggalPasang",
    "sedangDibukaOleh",
    "latitude",
    "longitude",
  ],
  KOTAK_BARU: [
    "id",
    "namaKotak",
    "alamat",
    "linkMaps",
    "tanggal",
    "pemasang",
    "status",
    "latitude",
    "longitude",
  ],
  KUMBARA: [
    "id",
    "tempat",
    "alamat",
    "linkMaps",
    "status",
    "tanggal",
    "sedangDiambil",
    "catatan",
    "latitude",
    "longitude",
  ],
  MASJID: [
    "id",
    "namaMasjid",
    "alamat",
    "linkMaps",
    "tipe",
    "vazifeOlan",
    "latitude",
    "longitude",
  ],
  TALEBE: ["id", "namaTalebe"],
  BROSUR: ["id","pesantren", "judul", "imgUrl", "text", "tanggal"], // <--- TAMBAHAN: Header Brosur
  // <--- TAMBAHAN: Header Mekanlar (Masjid/Mushollah/PT-Instansi/Warung Madura/Warung Makan/Lainnya)
  MEKANLAR: [
    "id",
    "kategori",
    "nama",
    "linkMaps",
    "penanggungJawab",
    "noWA",
    "bidangUsaha",
    "adaMasjidMushollah",
    "keterangan",
    "tanggal",
  ],
  PENGATURAN: ["Pengaturan", "Nilai", "Keterangan"]
};

// ============================================================
// FUNGSI SINKRONISASI DATABASE (SMART SYNC)
// ============================================================
function syncDatabaseHeaders() {
  try {
    const ss = getSS();

    for (const key in SN) {
      const sheetName = SN[key];
      const newHeaders = HEADERS[key];

      if (!newHeaders) continue;

      let sh = ss.getSheetByName(sheetName);

      if (!sh) {
        sh = ss.insertSheet(sheetName);
        sh.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
        sh.getRange(1, 1, 1, newHeaders.length)
          .setFontWeight("bold")
          .setBackground("#0d6e56")
          .setFontColor("white");
        continue;
      }

      const lastRow = sh.getLastRow();
      const lastCol = sh.getLastColumn();

      if (lastRow === 0 || lastCol === 0) {
        sh.getRange(1, 1, 1, newHeaders.length).setValues([newHeaders]);
        sh.getRange(1, 1, 1, newHeaders.length)
          .setFontWeight("bold")
          .setBackground("#0d6e56")
          .setFontColor("white");
        continue;
      }

      const oldData = sh.getRange(1, 1, lastRow, lastCol).getValues();
      const oldHeaders = oldData[0];

      if (JSON.stringify(oldHeaders) === JSON.stringify(newHeaders)) continue;

      const newData = [];
      newData.push(newHeaders);

      for (let i = 1; i < oldData.length; i++) {
        const oldRow = oldData[i];
        const newRow = [];

        for (let j = 0; j < newHeaders.length; j++) {
          const targetHeader = newHeaders[j];
          const oldIndex = oldHeaders.indexOf(targetHeader);

          if (oldIndex !== -1) {
            newRow.push(oldRow[oldIndex]);
          } else {
            newRow.push("");
          }
        }
        newData.push(newRow);
      }

      sh.clearContents();

      if (sh.getMaxColumns() < newHeaders.length) {
        sh.insertColumnsAfter(
          sh.getMaxColumns(),
          newHeaders.length - sh.getMaxColumns(),
        );
      }

      sh.getRange(1, 1, newData.length, newHeaders.length).setValues(newData);

      sh.getRange(1, 1, 1, newHeaders.length)
        .setFontWeight("bold")
        .setBackground("#0d6e56")
        .setFontColor("white");
    }

    return {
      ok: true,
      message:
        "Sinkronisasi Database Berhasil. Semua data aman dan header telah diperbarui.",
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function setupSpreadsheetWithDummyData() {
  const ss = getSS();
  const today = fmtDate(new Date());
  const nowTs = fmtTs(new Date());

  const DUMMY_DATA = {
    USERS: [
      ["ahmad", "Ahmad Fauzi", "idareci", "12345", today],
      ["budi", "Budi Santoso", "personel", "12345", today],
      ["citra", "Citra Lestari", "personel", "54321", today],
    ],
    KOTAK_AMAL: [
      ["KA-3001", "Warung Padang Sederhana", "Jl. Merdeka No. 10", "", "Aktif", "2026-01-15"],
    ],
    KOTAK_BARU: [
      ["KB-4001", "Bakso Solo Mas Slamet", "Jl. Ahmad Yani No. 12", "", today, "Budi Santoso", "Pending"],
    ],
    KUMBARA: [
      ["KMB-5001", "Rumah Pak RT 03", "Perumahan Indah Blok A1", "", "Aktif", "2026-02-20"],
    ],
    MASJID: [
      ["MSJ-6001", "Masjid Al-Ikhlas", "Jl. Kebangkitan Bangsa No. 1", "", "yeni"],
    ],
    LOG: [
      ["LOG-7001", today, "Budi Santoso", "Sadaka Kutusu Açma", 1, 150000, "Warung Padang Sederhana", "Kotak penuh", nowTs],
    ],
  };

  Object.keys(SN).forEach((key) => {
    const sheetName = SN[key];
    const headers = HEADERS[key];
    const dummyRows = DUMMY_DATA[key] || [];

    let sh = ss.getSheetByName(sheetName);
    if (!sh) {
      sh = ss.insertSheet(sheetName);
    } else {
      sh.clear();
    }

    if (headers && headers.length > 0) {
      sh.appendRow(headers);
    }
    if (dummyRows.length > 0) {
      sh.getRange(2, 1, dummyRows.length, dummyRows[0].length).setValues(
        dummyRows,
      );
    }
  });

  rapihkanKolom();
  SpreadsheetApp.getUi().alert(
    "✅ Setup Database Berhasil diperbarui.",
  );
}

function rapihkanKolom() {
  const ss = getSS();

  Object.keys(SN).forEach((key) => {
    const sheetName = SN[key];
    const sh = ss.getSheetByName(sheetName);
    if (!sh) return;

    const lastRow = sh.getLastRow();
    const lastCol = sh.getLastColumn();
    if (lastCol === 0) return;

    const headerRange = sh.getRange(1, 1, 1, lastCol);
    headerRange
      .setFontWeight("bold")
      .setBackground("#0B4D3B")
      .setFontColor("#FFFFFF")
      .setHorizontalAlignment("center")
      .setVerticalAlignment("middle");

    sh.setRowHeight(1, 36);
    sh.setFrozenRows(1);

    if (lastRow > 1) {
      const dataRange = sh.getRange(2, 1, lastRow - 1, lastCol);
      dataRange.setVerticalAlignment("middle");

      if (sheetName === SN.LOG) {
        sh.getRange(2, 1, lastRow - 1, 2).setHorizontalAlignment("center");
        sh.getRange(2, 5, lastRow - 1, 1).setHorizontalAlignment("center");
        sh.getRange(2, 6, lastRow - 1, 1)
          .setNumberFormat('"Rp "#,##0')
          .setHorizontalAlignment("right");
      }

      dataRange.setBorder(
        true, true, true, true, true, true,
        "#E5E7EB", SpreadsheetApp.BorderStyle.SOLID,
      );
    }
  });
}

function doGet(e) {
  if (e && e.parameter && e.parameter.fn) {
    return handleApiRequest(e);
  }
  return HtmlService.createHtmlOutputFromFile("index")
    .setTitle("İrşadi Faaliyetlerin Al-Muhajirin Semarang")
    .addMetaTag("viewport", "width=device-width, initial-scale=1.0")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================================
// JEMBATAN API (BRIDGE)
// ============================================================

const API_WHITELIST = {
  authenticateUser: authenticateUser,
  getInitData: getInitData,
  updateCamiVazife: updateCamiVazife,
  updateKotakSedangDibuka: updateKotakSedangDibuka,
  updateKumbaraSedangDiambil: updateKumbaraSedangDiambil,
  getMonthlyReport: getMonthlyReport,
  editLocationItem: editLocationItem,
  addLocationItem: addLocationItem,
  deleteLocationItem: deleteLocationItem,
  moveKotakAmalBaru: moveKotakAmalBaru,
  submitLog: submitLog,
  editLog: editLog,
  deleteLog: deleteLog,
  getCustomActivityReport: getCustomActivityReport,
  addBrosur: addBrosur,        // <--- TAMBAHAN
  deleteBrosur: deleteBrosur,
  editBrosur: editBrosur,   // <--- TAMBAHAN
  addMekan: addMekan,           // <--- TAMBAHAN: Mekanlar
  editMekan: editMekan,         // <--- TAMBAHAN: Mekanlar
  deleteMekan: deleteMekan,     // <--- TAMBAHAN: Mekanlar
  backfillCoordinates: backfillCoordinates
};

function doPost(e) {
  return handleApiRequest(e);
}

function handleApiRequest(e) {
  let fn = "";
  let args = [];

  try {
    if (e && e.postData && e.postData.contents) {
      const body = JSON.parse(e.postData.contents);
      fn = body.fn;
      args = body.args || [];
    } else if (e && e.parameter && e.parameter.fn) {
      fn = e.parameter.fn;
      args = e.parameter.args ? JSON.parse(e.parameter.args) : [];
    }

    if (!fn || !Object.prototype.hasOwnProperty.call(API_WHITELIST, fn)) {
      return jsonOutput({
        ok: false,
        error: "Fungsi '" + fn + "' tidak dikenali atau tidak diizinkan.",
      });
    }

    const result = API_WHITELIST[fn].apply(null, args);
    return jsonOutput(result);
  } catch (err) {
    return jsonOutput({ ok: false, error: err.message });
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getSS() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrCreateSheet(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (headers && headers.length) {
      sh.appendRow(headers);
      sh.getRange(1, 1, 1, headers.length)
        .setFontWeight("bold")
        .setBackground("#0B4D3B")
        .setFontColor("#FFFFFF");
      sh.setFrozenRows(1);
      sh.autoResizeColumns(1, headers.length);
    }
  }
  return sh;
}

function initSheets() {
  const ss = getSS();
  Object.keys(SN).forEach((k) => getOrCreateSheet(ss, SN[k], HEADERS[k]));
}

function genId(prefix) {
  return prefix + "-" + Date.now() + "-" + ((Math.random() * 9999) | 0);
}

function sheetToArr(sh) {
  if (!sh) return [];
  const vals = sh.getDataRange().getValues();
  if (vals.length < 2) return [];
  const heads = vals[0];
  return vals.slice(1).map((row) => {
    const obj = {};
    heads.forEach((h, i) => {
      const v = row[i];
      obj[String(h)] =
        v instanceof Date
          ? Utilities.formatDate(v, "Asia/Jakarta", "yyyy-MM-dd")
          : v !== undefined && v !== null
            ? v
            : "";
    });
    return obj;
  });
}

function fmtDate(d) {
  return Utilities.formatDate(d || new Date(), "Asia/Jakarta", "yyyy-MM-dd");
}

function fmtTs(d) {
  return Utilities.formatDate(
    d || new Date(),
    "Asia/Jakarta",
    "yyyy-MM-dd HH:mm:ss",
  );
}

function numFmt(v) {
  return Number(String(v || "0").replace(/[^0-9.-]/g, "")) || 0;
}

function authenticateUser(username, targetRole, pinInput) {
  try {
  if (isMaintenanceMode()) {
      return { ok: false, maintenance: true, error: "Sistem sedang dalam pemeliharaan otomatis (22:00 - 06:00 WIB)." };
    }
    initSheets();
    const ss = getSS();
    const sh = ss.getSheetByName(SN.USERS);
    if (!sh) return { ok: false, error: "Sheet Users tidak ditemukan." };

    const data = sh.getDataRange().getValues();
    const inputUser = String(username || "").trim().toLowerCase();
    const inputPin = String(pinInput || "").trim();

    if (!inputUser || inputUser.length < 2) {
      return { ok: false, error: "Username minimal 2 karakter." };
    }

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const uName = String(row[0]).trim().toLowerCase();
      const fullName = String(row[1]).trim() || String(row[0]).trim();
      const uRole = String(row[2]).trim().toLowerCase();
      const uPin = String(row[3]).trim();

      if (uName === inputUser) {
        if (uRole !== String(targetRole).trim().toLowerCase()) {
          return {
            ok: false,
            error: `Akun Anda terdaftar sebagai ${
              uRole === "idareci" ? "İdareci" : "Personel"
            }. Silakan login di tab yang sesuai.`,
          };
        }
        if (uPin !== inputPin) {
          return { ok: false, error: "PIN yang Anda masukkan salah." };
        }
        return {
          ok: true,
          user: {
            username: row[0],
            nama: fullName,
            role: uRole,
          },
        };
      }
    }

    return { ok: false, error: "Username tidak ditemukan atau salah PIN." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function cekStatusKotak() {
  const ss = getSS();
  const sh = ss.getSheetByName(SN.KOTAK_AMAL);
  if (!sh) return;

  const data = sh.getDataRange().getValues();
  const now = new Date();

  for (let i = 1; i < data.length; i++) {
    const status = String(data[i][4]).toLowerCase();
    const tglUpdate = data[i][5];

    if ((status === "açıldı" || status === "alınmış") && tglUpdate instanceof Date) {
      const diffTime = Math.abs(now - tglUpdate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays >= 30) {
        sh.getRange(i + 1, 5).setValue("Açılmadı");
        sh.getRange(i + 1, 6).setValue(now);
        sh.getRange(i + 1, 7).setValue("");
      }
    }
  }
}

function getInitData() {
  try {
    if (isMaintenanceMode()) {
      return { ok: false, maintenance: true, error: "Sistem sedang dalam pemeliharaan otomatis (22:00 - 06:00 WIB)." };
    }
    initSheets();
    cekStatusKotak();
    const ss = getSS();
    const kotakAmal = sheetToArr(ss.getSheetByName(SN.KOTAK_AMAL));
    const kotakBaru = sheetToArr(ss.getSheetByName(SN.KOTAK_BARU)).filter(
      (k) => String(k.status || "").toLowerCase() !== "dipindah",
    );
    const kumbara = sheetToArr(ss.getSheetByName(SN.KUMBARA));
    const masjid = sheetToArr(ss.getSheetByName(SN.MASJID));

    const shTalebe = ss.getSheetByName(SN.TALEBE);
    const talebe = shTalebe ? sheetToArr(shTalebe) : [];

    // --- TAMBAHAN: Tarik Data Brosur ---
    const shBrosur = ss.getSheetByName(SN.BROSUR);
    const brosur = shBrosur ? sheetToArr(shBrosur) : [];

    // --- TAMBAHAN: Tarik Data Mekanlar ---
    const shMekanlar = ss.getSheetByName(SN.MEKANLAR);
    const mekanlar = shMekanlar ? sheetToArr(shMekanlar) : [];

    const usersRaw = sheetToArr(ss.getSheetByName(SN.USERS));
    const users = usersRaw.map((u) => ({
      username: u.username || u.id || "",
      nama: u.namaLengkap || u.nama || u.username || "",
      role: u.role || "personel",
    }));

    const today = fmtDate(new Date());
    const allLog = sheetToArr(ss.getSheetByName(SN.LOG));
    const todayLog = allLog.filter(
      (l) => String(l.tanggal || "").substring(0, 10) === today,
    );

    return {
      ok: true,
      data: {
        kotakAmal,
        kotakBaru,
        kumbara,
        masjid,
        users,
        todayLog,
        allLog,
        talebe,
        brosur, // <--- TAMBAHAN: Kirim brosur ke frontend
        mekanlar, // <--- TAMBAHAN: Kirim mekanlar ke frontend
      },
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function submitLog(logData) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName(SN.LOG);
    const now = new Date();

    let personelList = [logData.namaUser];
    if (logData.personel1) personelList.push(logData.personel1);
    if (logData.personel2) personelList.push(logData.personel2);

    const jumlahPersonel = personelList.length;
    const uangPerOrang = Math.round(numFmt(logData.uang) / jumlahPersonel);

    personelList.forEach((nama) => {
      sh.appendRow([
        genId("LOG"),
        String(logData.tanggal || fmtDate(now)).substring(0, 10),
        nama,
        logData.kegiatan,
        logData.jumlah,
        uangPerOrang,
        logData.lokasi,
        personelList.length > 1
          ? "Split: " + personelList.join(", ") + ". " + (logData.catatan || "")
          : logData.catatan || "",
        fmtTs(now),
      ]);
    });

    const kegiatanLower = String(logData.kegiatan || "").toLowerCase();
    if (
      (kegiatanLower === "kumbara açma" ||
        kegiatanLower === "sadaka kutusu açma") &&
      logData.lokasi
    ) {
      const namaSheet =
        kegiatanLower === "kumbara açma" ? SN.KUMBARA : SN.KOTAK_AMAL;
      const shTarget = ss.getSheetByName(namaSheet);

      if (shTarget) {
        const dataTarget = shTarget.getDataRange().getValues();
        for (let i = 1; i < dataTarget.length; i++) {
          const namaTempat = String(dataTarget[i][1]).trim();
          if (namaTempat === String(logData.lokasi).trim()) {
            const statusBaru = kegiatanLower === "sadaka kutusu açma" ? "Açıldı" : "Alınmış";
            shTarget.getRange(i + 1, 5).setValue(statusBaru);
            shTarget.getRange(i + 1, 6).setValue(fmtDate(new Date()));
            shTarget.getRange(i + 1, 7).setValue(logData.namaUser);
            break;
          }
        }
      }
    }

    return {
      ok: true,
      message: "Aktivitas dan pembagian dana berhasil disimpan!",
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function getMonthlyReport(month, year) {
  try {
    const ss = getSS();
    const allLog = sheetToArr(ss.getSheetByName(SN.LOG));
    const filtered = allLog.filter((l) => {
      const raw = String(l.tanggal || "").substring(0, 10);
      const d = new Date(raw);
      if (isNaN(d)) return false;

      const itemMonth = d.getMonth() + 1;
      const itemYear = d.getFullYear();

      const matchMonth = month === "all" || itemMonth === Number(month);
      const matchYear = year === "all" || itemYear === Number(year);

      return matchMonth && matchYear;
    });

    const report = {}, aktSet = new Set(), dailyTrend = {}, moneyByAkt = {};

    filtered.forEach((l) => {
      const user = String(l.namaUser || "").trim(),
        akt = String(l.kegiatan || "").trim();
      if (!user || !akt) return;
      aktSet.add(akt);
      if (!report[user]) report[user] = {};
      if (!report[user][akt]) report[user][akt] = { count: 0, uang: 0 };
      const jml = numFmt(l.jumlah) || 1, uang = numFmt(l.uang);
      report[user][akt].count += jml;
      report[user][akt].uang += uang;
      const day = String(l.tanggal || "").substring(0, 10);
      dailyTrend[day] = (dailyTrend[day] || 0) + jml;
      if (uang > 0) moneyByAkt[akt] = (moneyByAkt[akt] || 0) + uang;
    });

    const summary = Object.entries(report)
      .map(([nama, acts]) => ({
        nama, acts,
        totalCount: Object.values(acts).reduce((s, a) => s + a.count, 0),
        totalUang: Object.values(acts).reduce((s, a) => s + a.uang, 0),
      }))
      .sort((a, b) => b.totalCount - a.totalCount);

    return {
      ok: true,
      data: {
        summary,
        aktivitasList: [...aktSet],
        dailyTrend,
        moneyByAkt,
        totalRecords: filtered.length,
        totalUang: Object.values(moneyByAkt).reduce((s, v) => s + v, 0),
      },
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function moveKotakAmalBaru(id) {
  try {
    const ss = getSS(),
      shBaru = ss.getSheetByName(SN.KOTAK_BARU),
      shAmal = ss.getSheetByName(SN.KOTAK_AMAL);

    const list = sheetToArr(shBaru),
      target = list.find((k) => String(k.id) === String(id));

    if (!target) return { ok: false, error: "Data tidak ditemukan." };

    shAmal.appendRow([
      genId("KA"), target.namaKotak, target.alamat, target.linkMaps || "",
      "Aktif", fmtDate(new Date()), "", target.latitude || "", target.longitude || "",
    ]);

    const raw = shBaru.getDataRange().getValues();
    for (let i = 1; i < raw.length; i++) {
      if (String(raw[i][0]) === String(id)) {
        shBaru.getRange(i + 1, 7).setValue("Dipindah");
        break;
      }
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function addLocationItem(type, payload) {
  try {
    const ss = getSS();
    let sh, row;
    const linkMaps = payload.linkMaps || "";
    const geo = geocodeAddress(payload.alamat);

    if (type === "kotakAmal") {
      sh = ss.getSheetByName(SN.KOTAK_AMAL);
      row = [genId("KA"), payload.nama, payload.alamat, linkMaps, "Aktif", fmtDate(new Date()), "", geo.lat, geo.lng];
    } else if (type === "kotakBaru") {
      sh = ss.getSheetByName(SN.KOTAK_BARU);
      row = [genId("KB"), payload.nama, payload.alamat, linkMaps, fmtDate(new Date()), String(payload.pemasang || ""), "Pending", geo.lat, geo.lng];
    } else if (type === "kumbara") {
      sh = ss.getSheetByName(SN.KUMBARA);
      row = [genId("KMB"), payload.tempat || payload.nama, payload.alamat, linkMaps, "Aktif", fmtDate(new Date()), "", payload.catatan || "", geo.lat, geo.lng];
    } else if (type === "masjid") {
      sh = ss.getSheetByName(SN.MASJID);
      row = [genId("MSJ"), payload.nama, payload.alamat, linkMaps, payload.tipe || "Yeni", "", geo.lat, geo.lng];
    }

    sh.appendRow(row);
    return { ok: true, id: row[0] };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function deleteLog(id) {
  try {
    const ss = getSS(), sh = ss.getSheetByName(SN.LOG), raw = sh.getDataRange().getValues();
    for (let i = 1; i < raw.length; i++)
      if (String(raw[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        return { ok: true };
      }
    return { ok: false };
  } catch (e) {
    return { ok: false };
  }
}

function deleteLocationItem(type, id) {
  try {
    const ss = getSS(),
      shMap = {
        kotakAmal: SN.KOTAK_AMAL, kotakBaru: SN.KOTAK_BARU,
        kumbara: SN.KUMBARA, masjid: SN.MASJID,
      };
    const sh = ss.getSheetByName(shMap[type]), raw = sh.getDataRange().getValues();
    for (let i = 1; i < raw.length; i++)
      if (String(raw[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        return { ok: true };
      }
    return { ok: false };
  } catch (e) {
    return { ok: false };
  }
}

function updateKotakSedangDibuka(id, namaUser) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName(SN.KOTAK_AMAL);
    if (!sh) return { ok: false, error: "Sheet Kotak_Amal tidak ditemukan." };
    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sh.getRange(i + 1, 7).setValue(namaUser);
        return { ok: true };
      }
    }
    return { ok: false, error: "Data kotak amal tidak ditemukan di database." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function updateKumbaraSedangDiambil(id, namaUser) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName(SN.KUMBARA);
    if (!sh) return { ok: false, error: "Sheet Kumbara tidak ditemukan." };
    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sh.getRange(i + 1, 7).setValue(namaUser);
        return { ok: true };
      }
    }
    return { ok: false, error: "Data kumbara tidak ditemukan di database." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function editLog(id, payload) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName(SN.LOG);
    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        const rowIndex = i + 1;
        sh.getRange(rowIndex, 2).setValue(payload.tanggal);
        sh.getRange(rowIndex, 5).setValue(payload.jumlah);
        sh.getRange(rowIndex, 6).setValue(payload.uang);
        sh.getRange(rowIndex, 8).setValue(payload.catatan);
        return { ok: true };
      }
    }
    return { ok: false, error: "Catatan aktivitas tidak ditemukan." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function editLocationItem(type, id, payload) {
  try {
    const ss = getSS();
    const shMap = {
      kotakAmal: SN.KOTAK_AMAL, kotakBaru: SN.KOTAK_BARU,
      kumbara: SN.KUMBARA, masjid: SN.MASJID,
    };
    const sh = ss.getSheetByName(shMap[type]);
    const data = sh.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        const rowIndex = i + 1;
        sh.getRange(rowIndex, 2).setValue(payload.nama);
        sh.getRange(rowIndex, 3).setValue(payload.alamat);
        sh.getRange(rowIndex, 4).setValue(payload.linkMaps || "");

        if (type === "kotakBaru") {
          sh.getRange(rowIndex, 6).setValue(payload.pemasang || "");
        } else if (type === "kumbara") {
          sh.getRange(rowIndex, 8).setValue(payload.catatan || "");
        } else if (type === "masjid") {
          sh.getRange(rowIndex, 5).setValue(payload.tipe || "Yeni");
        }
        return { ok: true };
      }
    }
    return { ok: false, error: "Data database tidak ditemukan." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function updateCamiVazife(id, namaUser) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName(SN.MASJID);
    if (!sh) return { ok: false, error: "Sheet Masjid tidak ditemukan." };

    const data = sh.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        sh.getRange(i + 1, 6).setValue(namaUser);
        return { ok: true };
      }
    }
    return { ok: false, error: "Data cami tidak ditemukan di database." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function getCustomActivityReport(startDate, endDate) {
  try {
    const ss = getSS();
    const allLog = sheetToArr(ss.getSheetByName(SN.LOG));

    const filtered = allLog.filter((l) => {
      const date = String(l.tanggal || "").substring(0, 10);
      return date >= startDate && date <= endDate;
    });

    const report = {};
    const aktSet = new Set();
    let totalRecords = 0;
    let totalUang = 0;

    filtered.forEach((l) => {
      const user = String(l.namaUser || "Bilinmeyen").trim();
      const akt = String(l.kegiatan || "Diğerleri").trim();
      const jml = numFmt(l.jumlah) || 1;
      const uang = numFmt(l.uang);

      aktSet.add(akt);

      if (!report[user]) {
        report[user] = { acts: {}, totalCount: 0, totalUang: 0 };
      }
      if (!report[user].acts[akt]) {
        report[user].acts[akt] = 0;
      }

      report[user].acts[akt] += jml;
      report[user].totalCount += jml;
      report[user].totalUang += uang;

      totalRecords += jml;
      totalUang += uang;
    });

    const summary = Object.entries(report)
      .map(([nama, data]) => ({
        nama,
        acts: data.acts,
        totalCount: data.totalCount,
        totalUang: data.totalUang,
      }))
      .sort((a, b) => b.totalCount - a.totalCount);

    return {
      ok: true,
      data: {
        summary: summary,
        aktivitasList: [...aktSet],
        totalRecords: totalRecords,
        totalUang: totalUang,
      },
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function geocodeAddress(alamat) {
  try {
    const query = alamat + ", Semarang, Indonesia";
    const response = Maps.newGeocoder().geocode(query);

    if (response.status === "OK" && response.results.length > 0) {
      const loc = response.results[0].geometry.location;
      return { lat: loc.lat, lng: loc.lng };
    }
  } catch (e) {
    console.error("Geocoding gagal: " + e.message);
  }
  return { lat: "", lng: "" };
}

function backfillCoordinates() {
  try {
    const ss = getSS();
    const sheetsToProcess = [
      SN.KOTAK_AMAL,
      SN.KOTAK_BARU,
      SN.KUMBARA,
      SN.MASJID,
    ];

    for (let s = 0; s < sheetsToProcess.length; s++) {
      const sheetName = sheetsToProcess[s];
      const sh = ss.getSheetByName(sheetName);

      if (!sh) continue;

      const data = sh.getDataRange().getValues();
      const headers = data[0];

      const latIdx = headers.indexOf("latitude");
      const lngIdx = headers.indexOf("longitude");
      const mapsIdx = headers.indexOf("linkMaps");
      const alamatIdx = headers.indexOf("alamat");

      if (latIdx === -1 || lngIdx === -1) continue;

      // Kumpulkan dulu semua nilai lat/lng (lama + hasil scan), baru
      // ditulis sekali di akhir per sheet. Ini menghindari ratusan
      // panggilan getRange().setValue() satu-satu per baris yang
      // lambat dan bisa kena limit kuota Apps Script.
      const latCol = [];
      const lngCol = [];
      let changed = false;

      for (let i = 1; i < data.length; i++) {
        let lat = data[i][latIdx];
        let lng = data[i][lngIdx];
        let linkMaps = data[i][mapsIdx] ? String(data[i][mapsIdx]) : "";
        let alamat = data[i][alamatIdx] ? String(data[i][alamatIdx]) : "";

        if (String(lat).trim() === "" || String(lng).trim() === "") {
          let found = false;

          if (linkMaps !== "") {
            let match =
              linkMaps.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
              linkMaps.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
              linkMaps.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/);

            if (match) {
              lat = match[1];
              lng = match[2];
              found = true;
            }
            else if (linkMaps.includes("goo.gl") || linkMaps.includes("maps.app")) {
              try {
                let response = UrlFetchApp.fetch(linkMaps, {
                  followRedirects: false,
                  muteHttpExceptions: true,
                });
                let locationUrl = response.getHeaders()["Location"];
                if (locationUrl) {
                  let match2 =
                    locationUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                    locationUrl.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                    locationUrl.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/);
                  if (match2) {
                    lat = match2[1];
                    lng = match2[2];
                    found = true;
                  }
                }
              } catch (e) {
              }
            }
          }

          if (!found && alamat !== "") {
            if (typeof geocodeAddress === "function") {
              let geo = geocodeAddress(alamat);
              if (geo && geo.lat) {
                lat = geo.lat;
                lng = geo.lng;
              }
            }
          }

          if (lat && lng) {
            changed = true;
          }
        }

        latCol.push([lat]);
        lngCol.push([lng]);
      }

      // Tulis sekali saja untuk seluruh sheet, hanya jika ada perubahan.
      if (changed) {
        sh.getRange(2, latIdx + 1, latCol.length, 1).setValues(latCol);
        sh.getRange(2, lngIdx + 1, lngCol.length, 1).setValues(lngCol);
      }
    }
    return {
      ok: true,
      message: "Pemindaian selesai. Semua koordinat yang ditemukan telah dimasukkan.",
    };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}


function hitungStatusKotak(logData, daftarKotak) {
  const dibuka = new Set();
  if (logData && logData.length > 0) {
    logData.forEach((row) => {
      const kegiatan = String(row[3] || "").trim().toLowerCase();
      if (kegiatan === "sadaka kutusu açma") {
        dibuka.add(String(row[6] || "").trim());
      }
    });
  }

  let jmlDibuka = 0;
  let jmlBelum = 0;

  if (daftarKotak && daftarKotak.length > 0) {
    daftarKotak.forEach((kotak) => {
      const namaKotak = String(kotak[1] || "").trim();
      const statusKotak = String(kotak[4] || "").trim().toLowerCase();

      if (dibuka.has(namaKotak) || statusKotak === "açıldı") {
        jmlDibuka++;
      } else {
        jmlBelum++;
      }
    });
  }

  const total = jmlDibuka + jmlBelum;
  const persentaseDibuka = total > 0 ? Math.round((jmlDibuka / total) * 100) : 0;
  const persentaseBelum = total > 0 ? 100 - persentaseDibuka : 0;

  return {
    total: total, dibuka: jmlDibuka, belum: jmlBelum,
    persentaseDibuka: persentaseDibuka, persentaseBelum: persentaseBelum,
  };
}

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('📍 Ekstrak Koordinat')
      .addItem('Proses Semua Link Maps', 'ekstrakSemuaKoordinat')
      .addToUi();
}

function ekstrakSemuaKoordinat() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sheetKotakAmal = ss.getSheetByName("Kotak_Amal");
  if (sheetKotakAmal) {
    prosesSheet(sheetKotakAmal, 4, 8, 9);
  }

  var sheetKumbara = ss.getSheetByName("Kumbara");
  if (sheetKumbara) {
    prosesSheet(sheetKumbara, 4, 9, 10);
  }

  SpreadsheetApp.getUi().alert('✅ Proses ekstraksi koordinat selesai!');
}

function prosesSheet(sheet, urlCol, latCol, lngCol) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  var range = sheet.getRange(2, 1, lastRow - 1, Math.max(urlCol, lngCol));
  var data = range.getValues();

  var latValues = [];
  var lngValues = [];
  var changed = false;

  for (var i = 0; i < data.length; i++) {
    var url = data[i][urlCol - 1];
    var currentLat = data[i][latCol - 1];
    var currentLng = data[i][lngCol - 1];

    if (url && typeof url === 'string' && url.indexOf("http") !== -1 && (!currentLat || !currentLng)) {
      var coords = getKoordinatDariURL(url);
      if (coords[0] !== "" && coords[1] !== "") {
        currentLat = coords[0];
        currentLng = coords[1];
        changed = true;
      }
    }

    latValues.push([currentLat]);
    lngValues.push([currentLng]);
  }

  // Tulis sekali untuk seluruh kolom, bukan setValue()+flush() per baris.
  if (changed) {
    sheet.getRange(2, latCol, latValues.length, 1).setValues(latValues);
    sheet.getRange(2, lngCol, lngValues.length, 1).setValues(lngValues);
  }
}

function getKoordinatDariURL(url) {
  try {
    var response = UrlFetchApp.fetch(url, {
      followRedirects: false, muteHttpExceptions: true
    });
    var finalUrl = url;
    var headers = response.getHeaders();

    if (headers['Location']) {
      finalUrl = headers['Location'];
    }

    if (finalUrl !== url && !finalUrl.includes('@')) {
       var response2 = UrlFetchApp.fetch(finalUrl, {
          followRedirects: false, muteHttpExceptions: true
       });
       if (response2.getHeaders()['Location']) {
         finalUrl = response2.getHeaders()['Location'];
       }
    }

    var match = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return [match[1], match[2]];
    }

    var queryMatch = finalUrl.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/) ||
                     finalUrl.match(/destination=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (queryMatch) {
      return [queryMatch[1], queryMatch[2]];
    }

  } catch (e) {
    Logger.log("Error URL: " + url + " | Pesan: " + e.message);
  }

  return ["", ""];
}

// ============================================================
// FUNGSI MANAJEMEN BROSUR (TAMBAHAN BARU)
// ============================================================
function addBrosur(payload) {
  try {
    const ss = getSS();
    let sh = ss.getSheetByName(SN.BROSUR);

    // Jika sheet belum ada, buat otomatis
    if (!sh) {
      sh = ss.insertSheet(SN.BROSUR);
      sh.appendRow(HEADERS.BROSUR);
    }

    const id = genId("BRS");
    sh.appendRow([
      id,
      payload.pesantren,
      payload.judul,
      payload.imgUrl,
      payload.text,
      fmtDate(new Date())
    ]);

    return { ok: true, id: id };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function deleteBrosur(id) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName(SN.BROSUR);
    if (!sh) return { ok: false, error: "Sheet Brosur tidak ditemukan." };

    const raw = sh.getDataRange().getValues();
    for (let i = 1; i < raw.length; i++) {
      if (String(raw[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        return { ok: true };
      }
    }
    return { ok: false, error: "Data brosur tidak ditemukan." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function editBrosur(id, payload) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName(SN.BROSUR);
    if (!sh) return { ok: false, error: "Sheet Brosur tidak ditemukan." };

    const data = sh.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        // Kolom 2: judul, Kolom 3: imgUrl, Kolom 4: text
        sh.getRange(i + 1, 2, 1, 4).setValues([
          [payload.pesantren, payload.judul, payload.imgUrl, payload.text],
        ]);
        return { ok: true };
      }
    }
    return { ok: false, error: "Data brosur tidak ditemukan di database." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ============================================================
// TAMBAHAN: MEKANLAR (Daftar Tempat Potensi Dakwah)
// Kategori: Masjid, Mushollah, PT/Instansi, Warung Madura,
// Warung Makan, dan kategori manual/lainnya.
// ============================================================
function addMekan(payload) {
  try {
    const ss = getSS();
    let sh = ss.getSheetByName(SN.MEKANLAR);

    // Jika sheet belum ada, buat otomatis
    if (!sh) {
      sh = ss.insertSheet(SN.MEKANLAR);
      sh.appendRow(HEADERS.MEKANLAR);
    }

    const id = genId("MKN");
    sh.appendRow([
      id,
      payload.kategori || "",
      payload.nama || "",
      payload.linkMaps || "",
      payload.penanggungJawab || "",
      payload.noWA || "",
      payload.bidangUsaha || "",
      payload.adaMasjidMushollah || "",
      payload.keterangan || "",
      fmtDate(new Date()),
    ]);

    return { ok: true, id: id };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function editMekan(id, payload) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName(SN.MEKANLAR);
    if (!sh) return { ok: false, error: "Sheet Mekanlar tidak ditemukan." };

    const data = sh.getDataRange().getValues();

    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]) === String(id)) {
        // Kolom 2-9: kategori, nama, linkMaps, penanggungJawab, noWA, bidangUsaha, adaMasjidMushollah, keterangan
        sh.getRange(i + 1, 2, 1, 8).setValues([
          [
            payload.kategori || "",
            payload.nama || "",
            payload.linkMaps || "",
            payload.penanggungJawab || "",
            payload.noWA || "",
            payload.bidangUsaha || "",
            payload.adaMasjidMushollah || "",
            payload.keterangan || "",
          ],
        ]);
        return { ok: true };
      }
    }
    return { ok: false, error: "Data mekan tidak ditemukan di database." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function deleteMekan(id) {
  try {
    const ss = getSS();
    const sh = ss.getSheetByName(SN.MEKANLAR);
    if (!sh) return { ok: false, error: "Sheet Mekanlar tidak ditemukan." };

    const raw = sh.getDataRange().getValues();
    for (let i = 1; i < raw.length; i++) {
      if (String(raw[i][0]) === String(id)) {
        sh.deleteRow(i + 1);
        return { ok: true };
      }
    }
    return { ok: false, error: "Data mekan tidak ditemukan." };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

// ==========================================
// FUNGSI CEK WAKTU & MAINTENANCE OTOMATIS
// ==========================================
function isMaintenanceMode() {
  try {
    const ss = getSS();
    let sh = ss.getSheetByName(SN.PENGATURAN);

    // Jika sheet "Pengaturan" belum ada, buat otomatis
    if (!sh) {
      sh = ss.insertSheet(SN.PENGATURAN);
      sh.appendRow(HEADERS.PENGATURAN);
      sh.getRange(1, 1, 1, 3).setFontWeight("bold").setBackground("#0B4D3B").setFontColor("#FFFFFF");
      sh.appendRow(["MODE_MALAM_OTOMATIS", "AKTIF", "Ketik AKTIF untuk blokir login jam 22:00-06:00 WIB. Ketik NONAKTIF untuk mematikan."]);
      sh.setColumnWidth(1, 200); sh.setColumnWidth(3, 500);
    }

    const data = sh.getDataRange().getValues();
    let isAutoNightActive = false;

    // Cari baris MODE_MALAM_OTOMATIS
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === "MODE_MALAM_OTOMATIS") {
        if (String(data[i][1]).trim().toUpperCase() === "AKTIF") {
          isAutoNightActive = true;
        }
        break;
      }
    }

    // Jika fitur diset AKTIF di Spreadsheet, cek jam saat ini (Zona Waktu Asia/Jakarta)
    if (isAutoNightActive) {
      const hourStr = Utilities.formatDate(new Date(), "Asia/Jakarta", "HH");
      const hour = parseInt(hourStr, 10);

      // Rentang jam 22:00 malam sampai 05:59 pagi (jam 22, 23, 0, 1, 2, 3, 4, 5)
      if (hour >= 22 || hour < 6) {
        return true;
      }
    }
    return false;
  } catch(e) {
    return false; // Fail-safe: jika error, anggap tidak maintenance agar sistem tidak mati total
  }
}