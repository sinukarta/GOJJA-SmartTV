# GOJJA SmartTV — panduan hasil implementasi lokal

18 November 2026 · Repo: `D:\Studio Works\Riset\smarttv-gojja`

Implementasi fungsional sudah diterapkan langsung ke repo lokal. Aplikasi tersedia pada `http://localhost:3000/`. Tidak dilakukan commit, push, deploy, publish branding ke TV, pengaktifan launcher, pembayaran, atau login akun streaming.

**Status desain: belum identik 100% dengan mockup.** Foto bersih, logo Arunika transparan, lockup GOJJA yang sama, font dan ikon sumber belum tersedia. Foto welcome bersih dari lampiran lama berbeda dengan PNG welcome baru. Board live juga menggunakan rasio layar yang tidak seragam. Laporan visual tetap `blocked` untuk persyaratan “sama persis”; implementasi tidak diklaim lolos gerbang tersebut.

## Cara mencoba

1. Buka aplikasi lokal dan masuk ke **Brand Studio**. Preview embedded dan tombol **Pratinjau TV Layar Penuh** memakai komponen TV yang sama.
2. Pilih bahasa **Indonesia, English, 中文, 日本語**. Bahasa draft Studio dan preview layar penuh sinkron; mengganti bahasa saat meninjau draft tidak otomatis menerbitkan perubahan ke semua kamar.
3. Gunakan delapan tab penguji: Welcome, Promo hotel, Partner, TV, Layanan hotel, Bahasa, Pemeliharaan dan Hiburan. Tab penguji berada di luar kanvas tamu. Empat keadaan player tersedia melalui OK, daftar channel dan Menu.
4. Tombol arah berpindah fokus; Enter/OK mengaktifkan pilihan; Escape/Backspace menutup dialog/panel. M membuka Menu, PageUp/PageDown mengganti channel. Tombol Home tidak dicegat.

## Wi-Fi dan QR hotspot

Di **Brand Studio → Elemen welcome → QR koneksi Wi-Fi / Hotspot** tersedia nama jaringan/SSID, password, jenis keamanan dan jaringan tersembunyi. Password dimasker; ada pilihan menampilkannya untuk operator.

QR dibuat lokal dengan library `qrcode`, memakai format konfigurasi Wi-Fi. Kredensial berada pada SSOT lokal prototipe; penyimpanan ini belum merupakan secret store produksi. Password tidak dikirim ke situs pembuat QR atau dimasukkan dalam URL. SSID/password dengan karakter pemisah di-escape. QR diperbarui otomatis pada preview ketika nilainya berubah. **Simpan Draf** menyimpan konfigurasi; publish tetap tindakan terpisah.

Gunakan kredensial yang sesuai router/hotspot hotel. Mengubah password di Studio memperbarui QR, **tidak mengubah password router**. Setelah pihak hotel merotasi password jaringan, masukkan password baru di Studio dan simpan. Jika password jaringan WPA/WEP belum diisi, UI menampilkan kebutuhan konfigurasi dan tidak menampilkan QR yang seolah dapat tersambung.

Pemindaian kode diharapkan membuka penawaran koneksi dari sistem ponsel. Captive portal, autentikasi tambahan, jaringan enterprise dan kebijakan perangkat tetap mengikuti jaringan/ponsel. Sambungan ke hotspot fisik belum diuji karena kredensial jaringan hotel belum diberikan.

Verifikasi dilakukan dengan data contoh sementara: dua QR hasil browser dibaca ulang menggunakan decoder independen. Kedua payload tepat, termasuk karakter `;` dan `:`, dan rotasi password menghasilkan QR baru. Data contoh tidak disimpan ke konfigurasi hotel. Bukti: `gojja-tv-html/evidence/wifi-qr-verification.json` dan gambar QR pengujian.

Format QR mengikuti [ZXing Barcode Contents](https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11).

## Bahasa, maintenance dan running text

- UI inti, menu layanan, status pesanan, petunjuk, dialog dan layar maintenance mendukung empat bahasa. Nama/isi layanan memakai `localeContent` katalog yang sudah ada.
- Teks notifikasi welcome, running text dan judul/isi maintenance dapat diedit per bahasa. Kecepatan running text diatur dalam detik.
- Running text bergerak terus, dapat dijeda saat di-hover, dan menghormati pengaturan reduced motion.
- Layar maintenance menampilkan versi konfigurasi aktual endpoint dan versi aplikasi target. Tidak membuat progress pembaruan palsu dan tidak menjalankan OTA dari tombol preview.
- Widget Wi-Fi, pesan welcome, ticker, kartu promo dan menu layanan dapat diaktifkan/nonaktifkan. Logo, background gambar/video, warna dan headline tetap menggunakan editor branding yang sudah ada.

## Televisi, video dan kampanye

**Televisi** digunakan untuk channel. OK menampilkan info yang otomatis tertutup setelah enam detik tanpa interaksi. Daftar channel dan menu pilihan ditampilkan sebagai overlay pada player yang sama; membuka panel tidak merestart video. Pemilihan channel menunggu pemeriksaan entitlement backend. Respons ditolak/network gagal tidak diganti menjadi sukses lokal.

Player mendukung MP4/WebM, HLS native atau `hls.js`, dan YouTube melalui IFrame Player API resmi. Terdapat penanganan error/retry dan fallback interaksi saat autoplay dibatasi. Video mempertahankan aspect ratio. Playback YouTube, waktu video dan mute memakai API player, bukan ekstraksi stream YouTube.

Sumber contoh yang teruji:

- MP4 lokal CC0 dari [contoh MDN](https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4): waktu video bertambah, player tidak pause dan frame tersedia.
- HLS test stream yang digunakan dalam [contoh resmi hls.js](https://github.com/video-dev/hls.js/blob/master/demo/basic-usage.html): diputar di browser, `readyState=4`, lebar frame 1280, waktu pemutaran bertambah.
- YouTube contoh developer: embed resmi tampil, video berjalan dan transkrip berubah. Menggunakan [YouTube IFrame API](https://developers.google.com/youtube/iframe_api_reference).

Sumber contoh Google ForBigger lama yang menolak akses dipetakan ke video demo lokal untuk preview. Preset yang baru diberi label demo/test sesuai isinya. Perubahan sumber dan judul promo internal pada Studio digunakan langsung oleh kanvas promo; sumber preview channel tidak menimpa sumber promo yang dipilih operator.

**Video demo bukan siaran TV live.** Untuk channel sungguhan, kosongkan sumber video preview dan gunakan URL stream channel yang valid beserta kontrak/hak aksesnya. URL fixture seperti `hls://demo-headend.local/...` bukan siaran yang bisa diputar di browser. DRM/provider login, audio track multi-bahasa, subtitle stream dan remote TV fisik belum diuji end-to-end.

Kampanye partner memakai jalur evaluasi eligibility yang sudah ada. Reviewer dapat melihat tampilan demo dengan label Pratinjau; ini tidak mempublikasikan kampanye atau mencatat tayangan advertiser. Tidak ada iklan yang dimasukkan pada setiap pergantian channel. Preview ini tidak mengirim metrik waktu atau completion palsu.

## Layanan hotel dan pesan pesanan

Seluruh layanan **Active** dari properti yang sesuai ditampilkan, bukan tiga item pertama. Katalog demo P-01 kini mencakup dining, spa, transport, wisata dan laundry. Tidak ada penambahan laundry otomatis ke properti produksi/LIVE_LAB yang sudah tersimpan.

Operator dapat mengedit/menambah layanan dalam empat bahasa dari bagian katalog di Studio: judul, deskripsi, label aksi, jadwal, harga, kategori dan status. Layanan Paused/Archived tidak ditawarkan pada TV.

Tamu membuka detail dahulu, lalu secara eksplisit mengirim permintaan. UI menunggu konfirmasi server, mencegah pengiriman berulang selama proses, dan menampilkan kegagalan bila server menolak. Order memuat konteks properti, kamar dan masa menginap. Pesan welcome memakai order yang sesuai kamar dan stay aktif, dengan label status empat bahasa. Perubahan dari sesi lain tersedia setelah data dashboard diperbarui; tidak ada klaim sinkronisasi push lintas perangkat.

Pengujian pembuatan dan konfirmasi order dilakukan pada penyimpanan uji terpisah. Backend menolak layanan properti lain, kamar tidak sesuai dan stay yang tidak aktif. Katalog dan pengaturan Wi-Fi/draft diuji tersimpan ke disk uji.

## Hiburan / Apps dan fitur berbayar

**Hiburan** dipakai untuk Netflix, HBO Max, Apple TV, Prime Video, Disney+ dan YouTube. **Televisi** tetap untuk lineup channel.

Pengaturan tersedia pada **Layanan TV → Aplikasi Hiburan** dan di Brand Studio. Admin properti dapat mengaktifkan menu Hiburan dan memilih aplikasi satu per satu setelah add-on tersedia. Content Editor tidak dapat mengubah kontrol fitur berbayar. App yang dinonaktifkan hilang dari katalog preview; backend juga menolak permintaan membukanya.

Entitlement add-on berasal dari subscription properti. Hanya peran HQ yang berwenang mengubah grant lisensi. Demo P-01 mempunyai grant **DEMO**, yang tidak berlaku pada LIVE_LAB. Lisensi nonaktif/kedaluwarsa atau subscription yang ditangguhkan memblokir akses. Tidak ada pembelian atau penagihan otomatis; grant kontrak pada prototipe belum menggantikan integrasi billing produksi.

Lisensi add-on GOJJA tidak menyertakan langganan konten provider. Admin properti memilih pemilik akun PROPERTY atau ISP dan referensi provisioning nonrahasia pada tiap aplikasi. Password dan token akun tidak disimpan dalam konfigurasi ini. Backend browser mengembalikan NATIVE_MANAGED_REQUIRED tanpa URL login umum; layar tamu menampilkan bantuan aktivasi. Pengaturan pemilik akun hanya dapat diubah administrator properti/HQ, bukan tamu atau Content Editor. Pilihan ISP menunjukkan pemilik/provisioner akun; belum ada portal provisioning kredensial untuk operator ISP. Peluncuran aplikasi native, verifikasi aplikasi terpasang, DRM dan pembersihan sesi saat check-out masih memerlukan integrasi perangkat/launcher dan pengujian di TV. Tidak ada akun streaming pengguna yang dibuka atau diubah selama pengujian.

## File implementasi dan batas integrasi

Pemilik utama di repo:

- `src/components/ArunikaTvExperience.tsx`: kanvas, navigasi remote, layar welcome/player/layanan/bahasa/maintenance/Apps.
- `src/components/TvMediaPlayer.tsx`: MP4/HLS/YouTube, kontrol audio, waktu dan error.
- `src/components/TvWifiQr.tsx`: pembuatan QR lokal dan penggantian gambar setelah password berubah.
- `src/components/TvStudioSettings.tsx`, `TvEntertainmentSettings.tsx`: editor konfigurasi dan katalog.
- `src/components/TvGuestAppModal.tsx`: kontrak props lama tetap tersedia; ekspor aktif diarahkan ke kanvas baru. Implementasi lama disimpan sebagai ekspor legacy untuk referensi/rollback.
- `src/data/tvExperience.ts`: schema, validasi, lokalisasi awal, QR payload, allowlist aplikasi dan entitlement helper.
- `src/App.tsx`: ketiga lokasi preview menggunakan kanvas/adapter yang sama; draft Studio tidak otomatis publish.
- `server.ts`: penyimpanan konfigurasi TV/Wi-Fi, upsert katalog, validasi order, pemeriksaan Apps dan lisensi HQ. `GOJJA_STORE_FILE`/`HOST` mendukung pengujian terpisah dan loopback.
- `tests/tv_experience.test.ts`: tes tambahan yang dijalankan oleh `npm test`.

Data `.gojja-ssot-store.json` sudah mempunyai perubahan sebelum tugas ini. File tersebut tidak di-reset atau diganti dengan seed/hasil pengujian. Cadangan sebelum integrasi disimpan pada folder kerja. Penambahan fixture demo dan audit interaksi lokal mengikuti penyimpanan repo; data ini tidak disertakan dalam paket handoff.

## Hasil pemeriksaan

- TypeScript / `npm run lint`: lulus.
- `npm run build`: lulus; masih ada peringatan ukuran bundle besar dari Vite.
- `npm test`: **31 pemeriksaan bisnis + 37 pemeriksaan TV/QR/entitlement lulus**.
- Pengujian API dengan store terpisah: **43 lulus**, termasuk persistensi, penolakan lintas properti, kontrol peran, entitlement Apps dan rotasi password Wi-Fi.
- Dua QR hasil browser: keduanya berhasil di-decode dan sesuai data uji.
- Browser: navigasi D-pad/OK/Back/CH/Menu, empat bahasa, filter channel, video MP4/HLS/YouTube, toggle Apps, maintenance dan QR diperiksa. Screenshot ada di `gojja-tv-html/evidence/`.
- `git diff --check` untuk kode: bersih.
- Belum diuji pada remote/perangkat TV fisik, jaringan hotspot hotel, DRM provider atau peluncuran aplikasi native.

## Paket HTML pembanding

`gojja-tv-html/index.html` adalah prototipe tujuh state awal dan pembanding PNG, disimpan untuk referensi pengukuran. Mode PNG + hotspot merupakan raster, bukan bukti bahwa React sudah identik. Penambahan Apps, maintenance terpadu, backend layanan dan QR hotspot dinamis berada pada **repo React**, bukan pada HTML pembanding lama. Panduan ini menggantikan status “belum diintegrasikan” dalam dokumen tahap awal.

Jangan menganggap gambar demo, status entitlement demo, order uji atau desain yang belum lolos fidelity sebagai persetujuan produksi. Push, deploy dan publish ke perangkat tetap belum dilakukan.


## Revisi welcome premium · 18 November 2026

Mengikuti referensi tv-james.jpg, dengan identitas/foto Arunika tetap berasal dari properti. Ini adaptasi tata letak, bukan salinan identik merek dan foto Hotel LDP. Guest name menjadi hero; tidak ada lagi kartu Royal Javanese Spa, Tonton TV/Panduan Channel ganda, bilah bahasa besar, atau latar pill GOJJA pada welcome. Notifikasi berada pada header. Ticker tetap berjalan.

Di Brand Studio → Elemen welcome → Welcome premium, atur:

1. Lapisan gelap 0–85% dan opasitas kartu 6–50%. Default 56% dan 18%.
2. Editorial serif atau modern sans. Font Manrope dan Cormorant Garamond disajikan lokal, lisensi OFL terlampir di public/assets/tv/fonts. Aksara Cina/Jepang menggunakan fallback sistem yang tersedia; perlu verifikasi font pada perangkat TV target.
3. Identitas: logo + nama, logo/wordmark saja, atau nama hotel. Logo/foto tetap memakai pengaturan upload yang sudah ada.
4. Grup status di kanan atau kiri. Label cuaca opsional berasal dari teks hotel, bukan data cuaca live otomatis.
5. Pilih 1–8 pintasan dan atur urutan dengan tombol naik/turun. Pintasan aplikasi tunduk pada lisensi dan toggle aplikasi; aplikasi nonaktif tidak muncul. Wifi dapat menjadi panel, pintasan, atau keduanya sesuai konfigurasi.
6. Bahasa awal: forced preview locale → locale tamu → default hotel → Indonesia. Tamu mengganti bahasa melalui ikon globe.
7. Simpan Draf menyimpan konfigurasi ke properti. Jangan tekan Publikasikan sebelum persetujuan pengujian perangkat.

Kontrak data baru: tvExperience.welcome {dim,glass,typography,brandLayout,statusSide,weatherLabel,items}; tvExperience.appProfiles[appId] {owner,reference}. resolveTvExperience mengisi default untuk data lama. Validasi server menolak pintasan duplikat/tidak dikenal, rentang tidak sah, dan field password/token pada profil aplikasi. Disney+ default nonaktif agar konfigurasi lama tidak tiba-tiba mengaktifkannya.

Integrasi launcher berikutnya: implementasikan adapter peluncuran native setelah pemeriksaan entitlement, scope endpoint dan status online; tentukan package ID vendor dari perangkat yang terpasang, bukan URL dari tamu. Simpan kredensial pada sistem provisioning perangkat, jangan di JSON frontend. Enforce kebijakan akun menggunakan kemampuan hospitality vendor; browser tidak membuktikan penguncian akun, DRM, maupun langganan provider. Endpoint open-app saat ini melaporkan kebutuhan integrasi secara eksplisit.

Bukti revisi di outputs/welcome-redesign: empat screenshot welcome, konteks preview, perbandingan referensi, dan 43 hasil API uji terisolasi. Pemeriksaan browser mencakup perubahan urutan, tipografi, dimming, Disney+ sebagai tombol kedelapan, empat bahasa tanpa overflow kartu, remote ke aplikasi dan TV/channel menu, serta video lokal yang bergerak. Tidak ada push/deploy/publish TV.


## Revisi layanan, Explore dan Studio

# GOJJA · Layanan Kamar, Explore & Brand Studio

Revisi lokal 18 November 2026. Sudah diterapkan langsung di repository D:/Studio Works/Riset/smarttv-gojja. Tidak ada push, deploy, publikasi ke TV, maupun perubahan katalog hotel utama untuk video uji.

## Susunan Studio

Pengaturan 1–7 berada di kolom kiri dan masing-masing bisa dibuka/ditutup. Hanya poin 1 terbuka saat awal. Preview berada di kanan atas dan mengikuti scroll editor pada desktop; di browser sempit preview ditampilkan lebih dulu, disusul pengaturan. Panel launcher teknis dilipat di bagian Lanjutan. Form, select, textarea, border dan focus mengikuti token tema CMS; tidak mengganti warna kanvas TV saat tema CMS berubah.

- Poin 1–4: logo, latar, promosi, warna dan bahasa.
- Poin 5: welcome, Wi-Fi, notifikasi, running text, maintenance dan aplikasi.
- Poin 6: tampilan kartu dan katalog Layanan Kamar.
- Poin 7: katalog Explore.

## Layanan Kamar

Kartu kini transparan gelap, berukuran ringkas dan mempunyai ikon garis dengan aksen properti. Pilih 3 atau 4 kolom, opasitas 6–60%, dan penggunaan thumbnail dari poin 6. Ikon per item dapat dipilih dari 11 opsi: layanan, dining, spa, laundry, transport, wisata, oleh-oleh, kafe, kamar, fitness dan kolam renang.

Pilih item yang ada atau tambah layanan, isi teks dalam empat tab bahasa, pilih ikon/foto, kategori, jadwal, tarif dan status. Tekan Simpan item layanan untuk menyimpan katalog. Pengaturan tampilan menggunakan Simpan Draf. Deskripsi kartu diringkas menjadi dua baris; teks lengkap ada di detail. Permintaan layanan tetap membutuhkan tombol kirim dan konfirmasi server.

## Explore

Explore khusus informasi wisata, kuliner sekitar hotel, dan oleh-oleh. Item disimpan per properti, memiliki empat bahasa, ikon, kategori, lokasi/area, foto, dan video opsional. MP4, HLS dan URL YouTube memakai player yang sama dengan TV. URL media lokal maupun HTTP/HTTPS didukung; URL eksekusi, URL berisi kredensial, blob dan data tidak diterima untuk penyimpanan katalog.

Buka poin 7, pilih atau tambah item, isi konten empat bahasa, foto/video dan lokasi, lalu Simpan item Explore. Item Active muncul di TV; Paused/Archived tidak ditawarkan. Membuka detail/video Explore tidak membuat pesanan. Bantuan informasi mengarah ke resepsionis yang sudah dikonfigurasi.

Data wisata lama bertipe ThirdPartyExperience otomatis tampil di Explore, sehingga operator dapat melengkapinya tanpa duplikasi. Kategori yang belum diisi dianggap Wisata. Layanan hotel lainnya tetap di Layanan Kamar. Default welcome baru menyertakan pintasan Explore; susunan khusus yang sudah disimpan hotel dipertahankan dan bisa diubah di poin 5. Preview reviewer juga mempunyai tab 9 Explore.

Foto dan video berasal dari katalog hotel. Video bunga CC0 pada bukti explore-video-test.jpg hanya menguji player pada salinan data; bukan video Borobudur dan tidak dipasang pada katalog utama. Harga/jadwal pada fixture lama tetap merupakan data demo.

## Integrasi kode

- src/components/StudioSection.tsx: bagian pengaturan yang dapat dilipat.
- src/components/TvCatalogEditor.tsx: editor layanan/Explore bersama, empat bahasa dan penyimpanan item.
- src/components/TvCatalogIcon.tsx: ikon pilihan dan thumbnail dengan penanganan gambar gagal.
- src/data/tvCatalog.ts: pemisahan katalog, default ikon, validasi media/kategori/lokasi.
- src/data/mockData.ts: field opsional tvIcon, videoUrl, locationLabel, exploreCategory pada MarketplaceItem.
- src/data/tvExperience.ts: services {glass,columns,showImages} dengan fallback data lama.
- src/components/ArunikaTvExperience.tsx: layar Explore, kartu ringkas, filter kategori, detail video dan remote.
- src/components/TvStudioSettings.tsx, src/App.tsx, src/index.css: editor kiri, preview sticky dan tema form.
- server.ts: endpoint upsert-item mempertahankan field lama ketika tidak dikirim, memvalidasi field baru sebelum mutasi, dan tetap membatasi properti/peran.

Tidak perlu migrasi destruktif. Field baru opsional; data lama mendapatkan default. Endpoint katalog tetap /api/marketplace/services/upsert-item, memakai propertyId dan item. Save item menyimpan katalog langsung ke store; ia tidak membuat publikasi konfigurasi TV atau service order. Snapshot terpisah di port 3001 dipakai selama QA lalu server uji dihentikan. Server preview utama tetap loopback port 3000.

## Verifikasi

- Lint/TypeScript dan build: lulus. Peringatan bundle >500 kB masih ada.
- npm test: 31 tes bisnis + 47 tes TV/konfigurasi/katalog lulus.
- 16 pemeriksaan API katalog terisolasi: lulus, termasuk persistensi ikon/media, pembatasan properti/peran, mutasi atomik, penolakan URL tidak aman, dan pengaturan kartu.
- Browser: tema terang/gelap, kolom 3/4, perubahan opasitas, form dalam batas kolom, preview tetap terlihat saat scroll.
- Viewport 1920×1080 dan sidebar 603×900 diperiksa; lebar dokumen pada sidebar tetap 603 px.
- Remote kanan/OK membuka detail layanan dan Escape menutupnya. Empat bahasa layanan diperiksa; tidak ada overflow kotak.
- Explore: simpan ikon melalui Studio pada data uji, kategori kosong, detail, tombol Kembali, dan video lokal selesai diputar 5.055 detik (readyState 4).
- Detail video ringkas: tinggi isi 639 px dan scrollHeight 639 px, tombol Kembali terlihat.
- git diff --check: bersih; peringatan konversi akhir baris pada file lama bukan error kode.

Pengujian dilakukan di browser dengan keyboard/remote simulasi, belum pada perangkat TV fisik.
