# 📦 GOJJA SmartTV — Hospitality Launcher Container (`GojjaLauncher`)
**Standar Arsitektur:** CleanYourTV Non-Root Android TV Home Replacement  
**Package Name:** `tv.gojja.hospitality.launcher`  
**Version:** `4.2.0-hospitality`

---

## 💡 Arsitektur Kritis: Mengapa TIDAK Perlu Rebuild APK Setiap Kali Edit di Studio TV?

Salah satu pertanyaan paling penting dalam operasional Smart TV perhotelan:
> *"Apakah setiap kali kita mengubah logo, video promo, atau channel TV di Brand Studio kita harus build ulang file APK dan install ulang ke seluruh TV?"*

**JAWABAN: TIDAK PERLU!**

Dalam standar sistem Smart TV perhotelan global (seperti LG Pro:Centric, Samsung LYNK, dan Philips MediaSuite):
1. **APK Hanyalah "Shell / Kontainer" Sekali Pasang (Install Once)**:
   - APK `GojjaLauncher` dipasang hanya **1 kali** saat TV pertama kali di-setup di kamar hotel.
   - Tugas native APK hanya 3 hal:
     1. Menjadi aplikasi Home default Android TV (`CATEGORY_HOME` & `CATEGORY_LEANBACK_LAUNCHER`).
     2. Menjaga fullscreen hardware-accelerated Chromium WebView agar tidak bisa ditutup oleh tamu (*Kiosk Mode*).
     3. Menyediakan jembatan native `AndroidTvBridge` untuk membuka aplikasi bawaan seperti Netflix (`com.netflix.ninja`) atau YouTube (`com.google.android.youtube.tv`) serta menangani tombol remote D-Pad.
2. **Perubahan Branding & Konten Berjalan Secara Real-Time (Dynamic Manifest)**:
   - Ketika Admin mengedit logo, video promo restoran, daftar saluran IPTV, atau harga room service di **Brand Studio CMS**, data tersebut disimpan di server/database (`/api/branding/edit` & manifest).
   - TV hotel yang sedang menyala di kamar langsung menerima pembaruan secara otomatis melalui **Live Hot-Reload / WebSocket Telemetry**.
   - **Tamu yang sedang menonton TV tidak terganggu sedikitpun** (tidak ada proses install ulang APK, tidak ada layar hitam, dan tidak membebani bandwidth Wi-Fi hotel).

---

## 🛠️ Kapan Tombol "Build APK" Dibutuhkan?

Build APK **HANYA** diperlukan pada kondisi berikut:
1. **Pemasangan TV Baru Pertama Kali**: Menghasilkan biner `.apk` untuk dipasang ke TV baru yang baru dibeli dari kardus pabrik.
2. **Pembaruan Firmware Native Shell**: Jika di masa depan ada penambahan fitur Android tingkat rendah (misal: integrasi sensor hardware baru, integrasi kartu kunci kamar RFID via USB, atau peningkatan Android Target SDK).
3. **Hardcoding Offline Fallback IP**: Jika hotel ingin mem-bundle IP server lokal tetap ke dalam kode biner sebelum TV didistribusikan ke cabang hotel tanpa internet.

---

## 🚀 Cara Build APK (Dua Pilihan)

### Opsi A: Menggunakan Script Otomatis
* Di Windows: Jalankan `scripts\build_apk.bat`
* Di Linux / macOS: Jalankan `chmod +x scripts/build_apk.sh && ./scripts/build_apk.sh`

### Opsi B: Menggunakan Android Studio
1. Buka folder `android-launcher` di Android Studio.
2. Tunggu Gradle Sync selesai.
3. Klik menu **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
4. File APK siap digunakan di `app/build/outputs/apk/release/app-release.apk`.
