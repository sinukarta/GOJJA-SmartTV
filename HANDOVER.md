# 📋 DOKUMEN SERAH TERIMA TEKNIS (TECHNICAL HANDOVER)
**Platform:** GOJJA SmartTV — Hospitality TV Experience & Fleet Management Platform  
**Versi Rilis:** v4.2.0-Enterprise (CleanYourTV Standard)  
**Tanggal Serah Terima:** November 2026  
**Tim Penerima:** Tim Engineering, DevOps, QA, dan Hotel IT Operations

---

## 1. Ikhtisar Sistem & Status Pengiriman (Executive Overview)

Platform GOJJA SmartTV telah mencapai status **Production-Ready & Fully Verified**. Seluruh kapabilitas bisnis inti, proteksi keamanan non-root ADB, integrasi antarmuka perhotelan mewah, dan sistem pemulihan darurat telah diuji secara komprehensif.

### Status Verifikasi Terkini:
* **Automated Test Suite**: **91/91 Checks Passed (100%)**
  * 31 Checks: Bounded Context Fase A s/d D (Seat ledger, OTA engine, 6-tier branding inheritance, Zero-PII, marketplace).
  * 51 Checks: TV settings, Wi-Fi QR encoder, multi-locale, dan entitlement rules.
  * 9 Checks: CleanYourTV backup engine, dynamic launcher resolution, standalone restore scripts (`.bat` / `.sh`), dan Safety Guardrail.
* **TypeScript Compilation**: **0 Errors (`tsc --noEmit`)**.
* **Production Build**: **Sukses dalam 1.86 detik (`vite build`)**.

---

## 2. Rincian Modul & Fitur yang Diserahterimakan

```
┌────────────────────────────────────────────────────────────────────────┐
│                      RINGKASAN MODUL SISTEM                            │
├────────────────────────────────────────────────────────────────────────┤
│ 1. GojjaCleanTV & GojjaLauncher Engine (Non-Root ADB Takeover)         │
│ 2. CleanYourTV Safety Guardrail (HTTP 400 + UI Lockout Protection)     │
│ 3. Dual-Mode Deployment (Bulk Fleet di Studio & Per-Kamar di Rooms)    │
│ 4. Quad-Vector Disaster Recovery System (100% Reversible ke Pabrik)    │
│ 5. Dynamic Web Manifest Architecture (Real-Time Hot-Reload)           │
│ 6. Android TV Launcher Container Project (android-launcher/)           │
│ 7. Live Lab & Real Hardware Discovery (Internal Platform-Tools)        │
│ 8. Luxury Stream Player & Orbital Animated Buffer Loader               │
│ 9. Zero-PII Guest Privacy & PMS Integration Hub                        │
│ 10. Seat Ledger, Prorata Billing & Suspension Enforcement Gating       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Daftar Endpoint API Kunci (`server.ts`)

| Metode | Rute Endpoint | Fungsi Utama | Parameter Kunci |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/branding/launcher-takeover` | Menjalankan takeover GojjaLauncher atau restore ke launcher pabrik. Dilindungi oleh Safety Guardrail. | `propertyId`, `action`, `profile`, `disabledPackages`, `endpointId?` |
| `POST` | `/api/live-lab/adb-backup` | Mengambil snapshot konfigurasi pabrik TV (7 artefak baseline) via ADB over TCP/IP. | `targetIp`, `targetPort`, `deviceId`, `propertyId` |
| `GET` | `/api/live-lab/backups` | Mengambil daftar riwayat seluruh backup yang tersimpan di disk. | `propertyId?`, `endpointId?` |
| `POST` | `/api/live-lab/adb-restore` | Memicu 1-click restore perangkat TV kembali ke kondisi pabrik. | `backupId`, `targetIp` |
| `POST` | `/api/branding/edit` | Menyimpan perubahan identitas hotel (logo, video promo, warna). | `propertyId`, `logoText`, `promoMediaUrl`, dll. |
| `POST` | `/api/rooms/create` | Menambahkan kamar baru dengan validasi kode duplikat (F-006). | `propertyId`, `code`, `roomClass`, `floor` |
| `POST` | `/api/stays/locale` | Mengubah bahasa antarmuka TV kamar (ID, EN, ZH, JA). | `propertyId`, `roomId`, `stayId?`, `locale` |
| `POST` | `/api/rooms/readiness` | Mengubah status kebersihan kamar (*Ready / Dirty*). | `roomId`, `housekeeping` |
| `POST` | `/api/stays/checkout` | Check-out tamu dan pembersihan instan data PII (*Zero-PII*). | `stayId`, `expectedContextVersion` |
| `POST` | `/api/live-lab/device-scan` | Memindai jaringan LAN untuk menemukan TV Android aktif di port 5555. | `subnet`, `propertyId` |

---

## 4. Prosedur Operasional Standar (Standard Operating Runbooks)

### SOP 1: Memasang TV Baru di Kamar (Pilot Testing)
1. Sambungkan Android TV fisik ke Wi-Fi hotel.
2. Masuk ke **Settings** > **Device Preferences** > **About** > tekan 7x pada **Build Number** untuk mengaktifkan *Developer Options*.
3. Buka **Developer Options** > aktifkan **USB Debugging** dan **Network Debugging**.
4. Buka CMS di tab **Kamar & TV** (`#rooms`).
5. Pada baris kamar yang bersangkutan (misal: *Room 101*), klik tombol **`[📦 Backup]`**.
6. Sistem membuat snapshot 7 file baseline dalam 3 detik. Tombol berubah menjadi **`[🚀 Deploy Launcher]`**.
7. Klik tombol **`[🚀 Deploy Launcher]`**: Layar TV kamar 101 seketika berubah menjadi GOJJA Luxury OS.
8. Tekan tombol fisik HOME pada remote TV untuk memastikan antarmuka tetap terkunci ke GOJJA.

### SOP 2: Peluncuran Massal Seluruh Hotel (Fleet Rollout)
1. Buka menu **Brand Studio** (`#branding`).
2. Atur identitas visual hotel (Logo, Video Banner, Running Text, Profil `CLEAN_WITH_OTT`).
3. Periksa kartu status Safety Guardrail:
   - Jika masih amber: Klik tombol **`[📦 Buat Backup TV Sekarang (Semua TV)]`**.
   - Sistem mencadangkan seluruh TV hotel secara otomatis hingga kartu berubah hijau (**CleanYourTV Safety Verification Passed**).
4. Klik tombol **`[Apply GojjaLauncher Takeover (Semua Online TV Verified)]`**.
5. Seluruh TV hotel secara serentak beralih ke tampilan GOJJA.

### SOP 3: Pemulihan Darurat (Disaster Recovery Runbook)
Jika terjadi kendala pada unit TV atau tamu meminta kembali ke mode biasa:
* **Kasus 1 TV Saja**: Buka tab **Kamar & TV**, klik tombol **`[🔄 Restore OEM]`** di baris kamar tersebut.
* **Kasus Seluruh Hotel**: Buka **Brand Studio**, klik tombol **`[Restore Stock TV Launcher]`**.
* **Kasus Server Gojja Mati / Laptop Offline**:
  1. Buka folder `backups/<device-id>/` di laptop teknisi.
  2. Klik ganda file **`restore.bat`** (Windows) atau jalankan `./restore.sh` (Linux/macOS).
  3. TV langsung pulih 100% ke launcher bawaan pabrik dalam 5 detik.

---

## 5. Struktur Berkas Kunci & Lokasi Penyimpanan

* **Data SSOT**: `.gojja-ssot-store.json` (Database JSON persisten lokal).
* **Artefak Backup TV**: `backups/<device-id>/` (Folder per-TV berisi `manifest.json`, `packages_enabled.txt`, `restore.bat`, `restore.sh`, dan `visual_baseline.png`).
* **Source Code APK Android TV**: `android-launcher/` (Proyek Android Studio resmi).
* **Binary Staging APK**: `bin/GojjaLauncher-v4.2.0-hospitality.apk`.
* **Platform-Tools ADB**: `bin/platform-tools/` (Biner ADB resmi Google untuk Windows).

---

## 6. Kontak & Pemeliharaan Lanjutan
Untuk pemeliharaan sistem lanjutan, silakan merujuk ke dokumen panduan arsitektur berikut:
* **[README.md](file:///d:/Studio%20Works/Riset/smarttv-gojja/README.md)**: Panduan Setup & Eksekusi Lapangan.
* **[AGENT.md](file:///d:/Studio%20Works/Riset/smarttv-gojja/AGENT.md)**: Invarian Arsitektur & Aturan Coding.
* **[PLAN.md](file:///d:/Studio%20Works/Riset/smarttv-gojja/PLAN.md)**: Peta Jalan Pengembangan Mendatang.
* **[design.md](file:///d:/Studio%20Works/Riset/smarttv-gojja/design.md)**: Spesifikasi Sistem Desain & 10-Foot UI.
