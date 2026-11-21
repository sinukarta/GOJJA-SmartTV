# GOJJA SmartTV — Hospitality TV Experience & Fleet Management Platform

Platform manajemen perangkat TV pintar terpadu (*Single Source of Truth / SSOT*) kelas enterprise untuk industri perhotelan (*hospitality*), apartemen berlayanan, dan properti komersial. Mengintegrasikan CMS manajemen konten multi-bahasa, multi-layer branding, penjadwalan kampanye promosi (*Zero-PII*), katalog layanan kamar/marketplace, tata kelola lisensi & billing (*Seat Ledger*), pemindai hardware fisik (*Real Hardware Discovery*) berbasis Android TV over-the-network (ADB), hingga sistem pengambilalihan launcher non-root yang aman dan 100% dapat dikembalikan ke kondisi pabrik (**GojjaCleanTV & GojjaLauncher Architecture** berbasis standar [CleanYourTV](https://github.com/Gathin23/cleanyourtv)).

---

## 🌟 Fitur Utama Platform

| Modul | Deskripsi & Kapabilitas | Standar Teknis |
| :--- | :--- | :--- |
| **Brand Studio & Media Hub** | Pengaturan identitas visual hotel (Logo, Hero Banner/Video, Video Promosi, Running Text Ticker, Warna Aksen). | 6-Tier Inheritance, WCAG 2.1 AA Contrast (>4.5:1). |
| **GojjaCleanTV (`GojjaLauncher`)** | Pengambilalihan antarmuka Smart TV bawaan pabrik via non-root ADB, mengunci antarmuka hotel GOJJA sebagai default Home screen. | Non-Root ADB, `pm disable-user --user 0`, 100% Reversible. |
| **CleanYourTV Safety Guardrail** | Perlindungan otomatis: sistem mengunci tombol ganti launcher jika TV belum memiliki snapshot backup konfigurasi pabrik yang valid. | 7 Artefak Baseline, Zero-Brick Policy, HTTP 400 Enforcement. |
| **Dual-Mode Deployment** | Fleksibilitas peluncuran: **Bulk Fleet Rollout** di Brand Studio (seluruh hotel) atau **Per-Room Control** di tab Kamar & TV (1 TV spesifik). | API Parameter `endpointId` opsional, RACI Matrix terintegrasi. |
| **Dynamic Web Manifest** | Pembaruan logo, promo video, menu F&B, dan channel IPTV berlangsung instan (*Hot-Reload*) tanpa perlu re-build atau install ulang file APK. | Real-Time Sync, Zero Guest Interruption, Low Bandwidth. |
| **Kamar & TV Operations** | Pemetaan TV kamar, status hunian tamu (*InHouse / Vacant*), kebersihan kamar (*Ready / Dirty*), dan pemilihan bahasa TV (ID, EN, ZH, JA). | Zero-PII Data Masking (`B*** S***`), PMS Binding. |
| **IPTV Streaming & EPG Guide** | Pemutar siaran TV langsung berbasis HLS/DASH dengan panduan program EPG dan animated buffer loader mewah (*orbital spinner*). | HLS.js, MediaPlayback Autoplay Policy Bypass, EPG Timeline. |
| **Marketplace & Service Orders** | Pemesanan makanan (*In-Room Dining*), spa, dan permintaan fasilitas langsung dari remote TV dengan pelacakan status pesanan. | State Machine: Request $\rightarrow$ Confirm $\rightarrow$ InFulfilment $\rightarrow$ Fulfilled. |
| **Seat Ledger & Billing Engine** | Tata kelola lisensi kursi TV, perhitungan prorata pembaruan kontrak, dan perlindungan penangguhan (*Suspension Gating*). | Automated Prorata, Append-Only Audit Logging. |
| **Live Lab & Device Discovery** | Pemindaian TV fisik di jaringan LAN (TCP 5555), inspeksi properti hardware MediaTek/Sony/Xiaomi, dan tangkapan layar live (*screencap*). | Internal Google ADB Platform-Tools, mDNS, TCP Probe. |

---

## 📺 Panduan Pemindaian Perangkat Fisik (Real Android TV via Local Connector)

Fitur **LIVE_LAB** pada GOJJA SmartTV dirancang untuk berinteraksi langsung dengan perangkat **Android TV / Google TV fisik nyata** (seperti Sony Bravia, Xiaomi TV, TCL, Philips, Hisense, atau Android TV Box) melalui jembatan jaringan lokal (*Local Connector Bridge*).

### Mengapa Membutuhkan Local Connector CLI?
Jika aplikasi GOJJA SmartTV diakses dari Cloud (seperti Vercel atau VPS publik), server cloud **tidak dapat memindai alamat IP privat lokal** (seperti `192.168.1.x`) di router Wi-Fi properti Anda karena batas firewall NAT. Skrip pendamping `gojja-connector.mjs` dijalankan di laptop installer yang berada di jaringan Wi-Fi yang sama dengan TV untuk memindai port ADB dan melaporkan kandidat TV ke dashboard.

> [!TIP]
> **Deteksi Langsung dari Dashboard (Zero-Console Mode)**:  
> Jika Anda menjalankan aplikasi secara lokal (`npm run dev` di `http://localhost:3000`), server telah dibekali Google ADB Platform-Tools internal (`bin/platform-tools/`). Anda **tidak perlu membuka terminal atau menjalankan skrip terpisah sama sekali**! Cukup masukkan IP TV di formulir *Add Manual Target* atau klik *Scan Authorized Network* langsung dari browser, dan sistem akan langsung mendeteksi merk (seperti **Sony Bravia**, **Xiaomi MiTV**, atau **MediaTek Smart TV**), model, versi OS, hingga mengambil screenshot realtime.

```
┌─────────────────────────┐               ┌─────────────────────────┐
│     Android TV Fisik    │               │      Laptop Installer   │
│   (Port 5555 ADB Open)  │◄─────────────►│  (gojja-connector.mjs)  │
└─────────────────────────┘      Wi-Fi    └────────────┬────────────┘
                              Local LAN                │
                                                       │ HTTPS / HTTP Outbound
                                                       ▼
                                          ┌─────────────────────────┐
                                          │     GOJJA SmartTV CMS   │
                                          │   (Cloud / Localhost)   │
                                          └─────────────────────────┘
```

---

## 🛡️ GojjaCleanTV: Arsitektur Backup & Restore Standar CleanYourTV

Sistem pengambilalihan launcher GOJJA SmartTV mengadopsi prinsip keselamatan dari repositori open-source [Gathin23/cleanyourtv](https://github.com/Gathin23/cleanyourtv):

```
┌────────────────────────────────────────────────────────────────────────┐
│               5 PILAR KESELAMATAN (SAFETY PILLARS)                     │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Zero Deletion    : Hanya pm disable-user --user 0 (APK pabrik utuh) │
│ 2. Dynamic Baseline : cmd package resolve-activity mendeteksi OEM TV   │
│ 3. Pre-Disabled Iso : packages_enabled.txt vs packages_disabled.txt    │
│ 4. Safety Guardrail : HTTP 400 BACKUP_REQUIRED jika TV belum dibackup  │
│ 5. Quad-Vector      : Per-Room UI, Bulk UI, restore.bat & One-Liner    │
└────────────────────────────────────────────────────────────────────────┘
```

### 4 Vektor Pemulihan Darurat (Quad-Vector Recovery System)
Jika terjadi kendala (misal: tamu VVIP meminta TV dikembalikan ke mode biasa, atau terjadi crash aplikasi), TV dapat dikembalikan ke kondisi pabrik dalam hitungan detik melalui salah satu dari 4 cara:

1. **Vektor 1 — Per-Room Rollback (Tab Kamar & TV)**:
   Klik tombol **`[🔄 Restore OEM]`** pada baris kamar yang bersangkutan. Hanya TV kamar tersebut yang dikembalikan ke launcher pabrik tanpa mengganggu kamar lain.
2. **Vektor 2 — Bulk Fleet Rollback (Brand Studio)**:
   Klik tombol **`[Restore Stock TV Launcher]`** di Brand Studio untuk mengembalikan seluruh TV hotel secara serentak.
3. **Vektor 3 — Skrip Mandiri Offline (`restore.bat` & `restore.sh`)**:
   Tersimpan otomatis di folder `backups/<device-id>/` di laptop teknisi. **Dapat dijalankan langsung melalui Command Prompt/Terminal meskipun server Gojja mati atau internet putus**.
4. **Vektor 4 — Perintah Terminal 1 Baris (*Extreme Failsafe*)**:
   ```bash
   adb -s <ip-tv>:5555 shell pm enable --user 0 com.google.android.apps.tv.launcherx
   adb -s <ip-tv>:5555 shell am start -a android.intent.action.MAIN -c android.intent.category.HOME
   ```

---

## ⚡ Arsitektur Dynamic Web Manifest (Mengapa Tidak Perlu Rebuild APK?)

Pertanyaan umum dalam operasional TV hotel:
> *"Apakah setiap kali kita mengubah logo, video promosi, atau saluran TV di Brand Studio, kita harus build ulang file APK dan menginstall ulang ke seluruh TV?"*

**JAWABANNYA: TIDAK PERLU!**

1. **APK Sebagai Kontainer Sekali Pasang (Install Once Shell)**:
   * File APK `GojjaLauncher-v4.2.0-hospitality.apk` dipasang hanya **1 kali** saat TV pertama kali disiapkan di kamar.
   * Tugas biner APK adalah mengunci tombol fisik remote **HOME**, menjalankan *fullscreen hardware-accelerated Chromium WebView*, dan menyediakan jembatan native `AndroidTvBridge` untuk membuka aplikasi luar seperti Netflix atau YouTube.
2. **Konten Terupdate Secara Real-Time (Live Hot-Reload)**:
   * Setiap kali Admin mengedit branding di **Brand Studio**, perubahan tersimpan di server CMS.
   * TV di kamar hotel yang sedang menyala otomatis menerima pembaruan secara instan tanpa restart, tanpa install ulang APK, dan tanpa mengganggu tamu yang sedang menonton siaran TV.
3. **Kapan Tombol "Build APK" Dibutuhkan?**:
   * Setup TV baru dari kardus pabrik.
   * Pembaruan driver/firmware Android native tingkat rendah.
   * Pemasangan di cabang hotel yang beroperasi 100% offline tanpa koneksi server eksternal.

Proyek template Android TV Launcher lengkap tersedia di direktori:  
👉 [`android-launcher/`](file:///d:/Studio%20Works/Riset/smarttv-gojja/android-launcher/README.md)

---

## 🧭 Panduan Eksekusi Lapangan (The 4-Stage Deployment Journey)

```
[Tahap 1: Brand Studio]   Admin menentukan Logo, Promo Video, & Profil CleanTV (CLEAN_WITH_OTT)
          │
          ▼
[Tahap 2: Kamar 101]       Teknisi klik [Backup] lalu [Deploy Launcher] khusus Kamar 101 untuk tes di TV fisik
          │
          ▼
[Tahap 3: Brand Studio]   Setelah tes sukses, Admin klik [Apply GojjaLauncher (Semua Online TV)] untuk rollout massal
          │
          ▼
[Tahap 4: Pemeliharaan]    Jika TV kamar 204 rusak atau tamu kamar 501 minta mode biasa, staf klik [Restore OEM] per-kamar
```

### Langkah 1: Persiapan pada Android TV Fisik
1. **Koneksi Jaringan**: Pastikan Android TV terhubung ke jaringan **Wi-Fi atau kabel LAN yang sama** dengan server/laptop Anda.
2. **Aktifkan Developer Options**:
   - Buka **Settings (Pengaturan)** $\rightarrow$ **Device Preferences (Preferensi Perangkat)** $\rightarrow$ **About (Tentang)**.
   - Gulir ke baris **Android TV OS Build / Build Number**.
   - Tekan tombol **OK / Center** pada remote sebanyak **7 kali berturut-turut** hingga muncul pesan: *"You are now a developer!"*.
3. **Aktifkan Debugging Jaringan**:
   - Kembali ke menu sebelumnya $\rightarrow$ pilih menu baru **Developer Options (Opsi Pengembang)**.
   - Aktifkan toggle **USB Debugging**.
   - Jika tersedia, aktifkan toggle **Wireless Debugging / Network Debugging** (port default: `5555`).
4. **Catat Alamat IP TV**:
   - Buka **Settings** $\rightarrow$ **Network & Internet** $\rightarrow$ pilih Wi-Fi yang terhubung $\rightarrow$ catat IP TV (contoh: `192.168.1.105`).

### Langkah 2: Otorisasi Kunci RSA di Layar TV
Saat server pertama kali menyapa TV via ADB, layar TV akan memunculkan dialog pop-up:
> *"Allow USB debugging? The computer's RSA key fingerprint is: XX:XX:XX..."*
- Berikan centang pada ☑ **"Always allow from this computer"** (*Selalu izinkan dari komputer ini*).
- Pilih tombol **Allow / OK**.

### Langkah 3: Uji Coba Pilot di 1 Kamar (Tab Kamar & TV)
1. Buka tab **Kamar & TV** di GOJJA CMS.
2. Cari baris kamar percontohan (misal: *Room 101 · TV E-01*).
3. Klik tombol **`[📦 Backup]`** (snapshot 7 file baseline dibuat dalam 3 detik).
4. Klik tombol **`[🚀 Deploy Launcher]`**: TV kamar 101 seketika beralih ke tampilan GOJJA Hospitality OS.
5. Tekan tombol fisik HOME pada remote TV: layar tetap kembali ke tampilan hotel GOJJA!

### Langkah 4: Mass Rollout Seluruh Hotel (Brand Studio)
1. Buka menu **Brand Studio**.
2. Klik tombol **`[Buat Backup TV Sekarang (Semua TV)]`**.
3. Setelah kartu pengaman berubah hijau (*CleanYourTV Safety Verification Passed*), klik **`[Apply GojjaLauncher Takeover (Semua Online TV Verified)]`**. Seluruh TV hotel serentak beralih ke tampilan GOJJA!

---

## 🚀 Menjalankan Proyek Secara Lokal

### Prasyarat:
- **Node.js**: Versi `20.11+` atau `22.x` (Diverifikasi pada v22.17.0)
- **npm**: Versi `9+` atau `10+`
- **ADB Platform-Tools**: Terintegrasi di `bin/platform-tools/` atau terinstall di PATH.

### Instalasi & Menjalankan Dev Server:
```bash
# 1. Clone repositori & install dependensi
npm install

# 2. Jalankan Full-Stack Development Server (Express API + Vite Middleware)
npm run dev
```
Akses dashboard di browser melalui: **`http://localhost:3000`**

### Menjalankan Automated Verification Test Suite (91 Checks):
Suite pengujian otomatis memverifikasi 91 aturan bisnis kritis (Fase A-D, TV Experience, dan CleanYourTV Backup & Safety Guardrail):
```bash
npm test
```
*Hasil: 31 checks Fase A-D + 51 checks TV Experience & Wi-Fi QR + 9 checks CleanYourTV Backup & Restore = **91/91 Checks Passed**.*

### Pengecekan Type Linting (Zero TypeScript Errors):
```bash
npm run lint
```

### Production Build:
```bash
npm run build
```
Output kompilasi statis dihasilkan di direktori `dist/` (termasuk chunking otomatis HLS player dan core web assets).

---

## 🛠️ Ringkasan Arsitektur & Bounded Contexts

1. **Fase A — Foundation & Capability Gating**:
   - Seat Ledger balance tracking, perhitungan prorata change order, dan lisensi suspensi.
   - Taksonomi 10 kapabilitas hardware endpoint (`launcher.takeover`, `adb.install`, `kiosk.mode`, `playback.hls`, `offline.cache`, `remote.dpad`, dsb).
2. **Fase B — Core Operations**:
   - 9-step OTA update state machine dengan mitigasi check-in tamu terdekat (*BR06 Check-in Imminent Deferral*).
   - Provider entitlement engine untuk menghitung lineup saluran TV efektif per kelas kamar (*Standard, Suite, Villa*).
3. **Fase C — Experience Deepening**:
   - 6-tier Branding Inheritance Resolver (*Default $\rightarrow$ Brand $\rightarrow$ Property $\rightarrow$ RoomClass $\rightarrow$ Group $\rightarrow$ Stay*).
   - WCAG 2.1 AA/AAA Contrast Ratio Calculator & Coexistence Conflict Resolution.
   - 10-step Campaign Eligibility Pipeline, per-stay frequency capping, dan telemetri *PlaybackFact* (BR19).
4. **Fase D — Commercial Expansion Foundation**:
   - Tata kelola iklan pihak ketiga (*AdOffer opt-in governance & material creative auto-invalidation*).
   - Katalog layanan concierge (*MarketplaceItem*) & pelacakan pesanan (*ServiceOrder Lifecycle*).
   - Perlindungan privasi tamu (*Zero-PII Masking*: nama disamarkan menjadi `Room 201 · Guest D*** W***`).
5. **GojjaCleanTV & GojjaLauncher Engine**:
   - Baseline Backup Engine multi-parameter non-destruktif (`manifest.json`, `packages_enabled.txt`, `restore.bat`, `restore.sh`).
   - Safety Guardrail API gating (`BACKUP_REQUIRED` blocking).
   - Dual-Mode deployment (Fleet-wide bulk vs Per-Room granular).
   - Android TV Leanback Container project (`android-launcher/`).

---

## 📄 Dokumentasi Terkait
* [DESIGN.md](file:///d:/Studio%20Works/Riset/smarttv-gojja/design.md): Spesifikasi Sistem Desain, Token Warna, Aturan Tabel Anti-Overflow, dan 10-Foot UI.
* [AGENT.md](file:///d:/Studio%20Works/Riset/smarttv-gojja/AGENT.md): Panduan Instruksi & Invarian Arsitektur untuk Agen AI dan Kontributor Kode.
* [HANDOVER.md](file:///d:/Studio%20Works/Riset/smarttv-gojja/HANDOVER.md): Panduan Serah Terima Teknis untuk Tim Engineering, DevOps, dan Operasional Hotel.
* [PLAN.md](file:///d:/Studio%20Works/Riset/smarttv-gojja/PLAN.md): Peta Jalan Eksekusi Pengembangan & Milestone Proyek Mendatang.
