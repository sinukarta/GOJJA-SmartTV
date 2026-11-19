# GOJJA SmartTV — Hospitality TV Experience & Fleet Management Platform

Platform manajemen perangkat TV pintar terpadu (*Single Source of Truth / SSOT*) untuk industri perhotelan dan properti komersial. Mengintegrasikan CMS manajemen konten, multi-layer branding, penjadwalan kampanye iklan (*Zero-PII*), katalog layanan kamar/marketplace, tata kelola lisensi & billing, hingga pemindai hardware (*Real Hardware Discovery*) berbasis Android TV over-the-network (ADB).

---

## 📺 Panduan Pemindaian Perangkat Fisik (Real Android TV via Local Connector)

Fitur **LIVE_LAB** pada GOJJA SmartTV dirancang untuk berinteraksi langsung dengan perangkat **Android TV / Google TV fisik nyata** (atau Android TV Emulator) melalui jembatan jaringan lokal (*Local Connector Bridge*).

### Mengapa Membutuhkan Local Connector CLI?
Jika aplikasi GOJJA SmartTV diakses dari Cloud (seperti Vercel atau VPS), server cloud **tidak dapat memindai alamat IP privat lokal** (seperti `192.168.1.x`) di router Wi-Fi properti Anda. Skrip pendamping `gojja-connector.mjs` dijalankan di laptop installer yang berada di jaringan Wi-Fi yang sama dengan TV untuk memindai port ADB dan melaporkan kandidat TV ke dashboard.

> [!TIP]
> **Deteksi Langsung dari Dashboard (Zero-Console Mode)**:  
> Jika Anda menjalankan aplikasi secara lokal (`npm run dev` di `http://localhost:3000`), server telah dibekali Google ADB Platform-Tools internal (`bin/platform-tools/`). Anda **tidak perlu membuka terminal atau menjalankan skrip terpisah sama sekali**! Cukup masukkan IP TV di formulir *Add Manual Target* atau klik *Scan Authorized Network* langsung dari browser, dan sistem akan langsung mendeteksi merk (seperti **MediaTek Smart TV**), model, OS, hingga mengambil screenshot realtime.

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

### ⚡ Fitur Baru: Pengenalan Merk TV & Real-Time Screen Capture (Dashboard-Native)

Di dashboard CMS pada menu **Device Discovery & Fleet Control (LIVE_LAB)**:
1. **Pengenalan Merk & Model Otomatis**:  
   Saat TV terhubung pada port 5555, sistem menjalankan query `getprop` otomatis (`ro.product.brand`, `ro.product.model`, `ro.product.manufacturer`, `ro.build.version.release`). TV Anda langsung dikenali sebagai misalnya **`MEDIATEK Smart TV (Android 11)`** atau **`XIAOMI MiTV-4A`** lengkap dengan badge pabrikan dan nomor seri tanpa tebak-tebakan.
2. **Ambil Tangkapan Layar Realtime (Route C)**:  
   Tersedia tombol **"Ambil Screenshot Realtime"** dan toggle **"Auto-refresh (5s)"** di panel inspektor perangkat. Dashboard mengambil frame buffer layar TV secara langsung over-the-network via ADB stream dan menampilkannya di dalam bingkai TV interaktif serta modal layar penuh tanpa perlu menyentuh command prompt cmd.

---

### Langkah 1: Persiapan pada Android TV Fisik

1. **Koneksi Jaringan**: Pastikan Android TV terhubung ke jaringan **Wi-Fi atau kabel LAN yang sama** dengan laptop Anda.
2. **Buka Developer Options**:
   - Masuk ke **Settings (Pengaturan)** $\rightarrow$ **Device Preferences (Preferensi Perangkat)** $\rightarrow$ **About (Tentang)**.
   - Gulir ke bawah ke menu **Android TV OS Build / Build Number**.
   - Tekan tombol **OK / Select** pada remote sebanyak **7 kali berturut-turut** hingga muncul pesan: *"You are now a developer!"*.
3. **Aktifkan Debugging Jaringan**:
   - Kembali ke menu sebelumnya $\rightarrow$ pilih menu baru **Developer Options (Opsi Pengembang)**.
   - Aktifkan toggle **USB Debugging**.
   - Jika tersedia, aktifkan toggle **Wireless Debugging / Network Debugging** (port default: `5555`).
4. **Catat Alamat IP TV**:
   - Buka **Settings** $\rightarrow$ **Network & Internet** $\rightarrow$ pilih Wi-Fi yang terhubung $\rightarrow$ catat IP TV (contoh: `192.168.1.45`).

---

### Langkah 2: Menjalankan Local Connector CLI di Laptop

Skrip pemindai resmi telah tersedia di dalam repositori pada file:  
`public/gojja-connector.mjs` (atau dapat diunduh melalui tombol *"Download Local Connector CLI"* di dashboard).

Buka **Terminal / PowerShell / Command Prompt** di laptop Anda:

#### A. Jika Menghubungkan ke Server Lokal (`localhost:3000`):
```bash
node public/gojja-connector.mjs --server http://localhost:3000 --property P-01 --subnet 192.168.1.0/24 --scan-now
```

#### B. Jika Menghubungkan ke Cloud / Vercel:
```bash
node public/gojja-connector.mjs --server https://gojja-smart-tv.vercel.app --property P-01 --subnet 192.168.1.0/24 --scan-now
```

#### Penjelasan Parameter CLI:
| Parameter | Deskripsi | Default |
|---|---|---|
| `--server` | URL server backend GOJJA SmartTV | `http://localhost:3000` |
| `--property` | ID properti hotel yang dikelola | `P-01` |
| `--subnet` | Rentang IP LAN yang dipindai (maksimal range `/24` atau 254 host) | Otomatis mendeteksi kartu jaringan laptop |
| `--scan-now` | Menjalankan pemindaian TCP port 5555 segera setelah registrasi | Opsional |
| `--name` | Nama pengenal konektor laptop di dashboard | Nama hostname komputer |

---

### Langkah 3: Konfirmasi Otorisasi di Layar TV & Enrollment di CMS

1. **Popup Otorisasi di Layar TV**:
   Ketika skrip pertama kali memindai dan menyapa TV Anda, layar Android TV akan memunculkan dialog konfirmasi:
   > *"Allow USB debugging? The computer's RSA key fingerprint is: XX:XX:XX..."*
   - Berikan centang pada **"Always allow from this computer"**.
   - Pilih tombol **Allow / OK**.
2. **Lihat Hasil di Dashboard GOJJA CMS**:
   - Buka GOJJA CMS di browser $\rightarrow$ pilih Workspace **LIVE_LAB**.
   - Buka tab **Device Discovery & Fleet Control**.
   - TV fisik yang ditemukan akan otomatis tampil pada tabel **Discovery Candidates** dengan status `Reachable` dan port `5555`.
   - Klik tombol **"Enroll Device"** pada baris TV tersebut, tentukan nomor kamar (misal: *Room 101*), dan simpan. Perangkat fisik kini resmi terhubung ke ekosistem GOJJA SmartTV!

---

### Troubleshooting Pemindaian

- **Pesan error `Scan range exceeds bounded /24 maximum`**:  
  Pastikan selalu menyertakan parameter `--subnet` dengan format subnet `/24` (contoh: `--subnet 192.168.1.0/24` atau `--subnet 192.168.0.0/24`), karena kebijakan keamanan GOJJA membatasi scan maksimal 254 host agar tidak membebani jaringan router hotel.
- **Port 5555 Tidak Terdeteksi / 0 Reachable Endpoints**:  
  - Pastikan TV dan laptop berada di subnet Wi-Fi yang sama (tidak terisolasi oleh fitur *AP Client Isolation* di router).
  - Pastikan fitur *Wireless / USB Debugging* di TV masih dalam posisi aktif (*ON*).
- **Official ADB `Not found in PATH`**:  
  Skrip tetap dapat melakukan penemuan perangkat (TCP probe) tanpa ADB terinstall. Namun untuk eksekusi perintah lanjutan (seperti remote reboot, takeover launcher, atau install APK over-the-air), pasang [Android SDK Platform-Tools](https://developer.android.com/tools/releases/platform-tools) di laptop Anda dan masukkan foldernya ke variabel *Environment PATH*.

---

## 🚀 Menjalankan Proyek Secara Lokal

### Prasyarat:
- Node.js versi 20.11+ atau 22.x
- npm versi 9+ atau 10+

### Instalasi:
```bash
# 1. Install seluruh dependensi
npm install

# 2. Jalankan Full-Stack Development Server (Express API + Vite Middleware)
npm run dev
```
Akses dashboard di browser melalui: **`http://localhost:3000`**

### Menjalankan Automated Verification Test Suite:
Suite pengujian otomatis memverifikasi 31 aturan bisnis kritis (Fase A s/d D):
```bash
npm test
```

### Production Build:
```bash
npm run build
```
Output kompilasi statis akan dihasilkan di direktori `dist/`.

---

## 🛠️ Ringkasan Arsitektur & Bounded Contexts

1. **Fase A — Foundation & Capability Gating**:
   - Seat Ledger balance tracking, perhitungan prorata change order, dan lisensi suspensi.
   - Taksonomi 10 kapabilitas hardware endpoint (`kiosk.mode`, `adb.install`, `playback.hls`, `offline.cache`, dsb).
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
