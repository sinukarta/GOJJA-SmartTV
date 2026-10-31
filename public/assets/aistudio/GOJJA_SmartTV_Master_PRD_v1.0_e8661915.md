# GOJJA SmartTV

## Master PRD

Versi 1.0 | 23 Oktober 2026 | Bahasa Indonesia  
Product Requirements Document lintas segmen  
Untuk Dyan Raditya Sinukarta dan tim product engineering design QA serta operasi GOJJA  
Cakupan platform: Hospitality, Residence, Home dan Shared Display  
Baseline implementasi pertama: Hospitality Core

GOJJA SmartTV adalah platform software untuk mengelola pengalaman televisi, branding, konten, layanan dan perangkat pada properti serta rumah tangga. Master PRD menetapkan perilaku yang harus dibangun, pihak yang berwenang, kondisi keberhasilan, batas integrasi dan cara memeriksanya. Fondasi platform harus mengenali pelanggan langsung maupun reseller ISP, berbagai provider konten dan beberapa profil penggunaan sejak model datanya dibangun. Peluncuran pertama tetap berfokus pada hotel dan properti short stay.

Rekomendasi implementasi adalah aplikasi Android TV native, portal CMS berbasis React, backend NestJS modular monolith, serta pengelolaan perangkat berdasarkan kemampuan yang dibuktikan per SKU dan firmware. Produk tidak bergantung pada PMS, iklan atau marketplace untuk memberi nilai Core. Master PRD menguraikan kebutuhan jangka panjang tanpa menjadikan seluruhnya komitmen rilis pertama.

Dokumen melanjutkan Product Foundation and Feasibility v1.0 [I01], Master Product Blueprint and Grand Design v1.0 [I02], Commercial and Operating Model v1.0 [I03], serta Design and Brand Guideline v1.0 [I04]. Harga, kuota, target layanan dan pilihan implementasi yang masih berupa usulan tetap memiliki status tersebut. Requirement adalah kriteria rancangan untuk pengembangan dan pengujian, bukan pernyataan bahwa fitur sudah tersedia.

## Ringkasan produk

- Aplikasi dapat dipasang pada TV Android yang tervalidasi atau box yang tervalidasi. GOJJA merupakan lapisan aplikasi dan opsi launcher, bukan pengganti firmware universal.
- CMS pusat mengelola produk, organisasi, partner, langganan, invoice, perangkat, rilis dan operasional. Portal ISP dan properti membatasi akses sesuai penugasan.
- CMS properti mengelola brand, media, channel, kamar, welcome manual/rombongan, monitoring, tiket dan izin update dalam scope mereka.
- Subscription software, hak konten, order hardware serta layanan mempunyai state dan tanggung jawab terpisah. TV offline tidak otomatis mengurangi jumlah seat berlangganan.
- Channel mengikuti kontrak dan kemampuan provider; menambahkan nama Transvision atau Vision+ tidak berarti akses integrasi sudah tersedia.
- Update menggabungkan approval teknis GOJJA, izin pemasangan pelanggan, kondisi perangkat serta jadwal lokal. Checkout belum membuktikan kamar siap maintenance.
- Data personal tamu memakai konteks stay, validitas dan fallback yang aman. Hak penghuni Residence/Home tidak diwariskan dari pola pengelolaan tamu hotel.
- AI awal membantu triage dan diagnosis. Signing key, persetujuan rilis serta tindakan finance tetap berada pada fungsi manusia yang berwenang.
- Promosi hotel tersedia pada slot aplikasi P1. Ad network, marketplace, casting, Residence komersial dan Home retail memiliki gate tersendiri.
- Kelayakan harga Rp15.000 wholesale diuji dengan biaya serta penggunaan aktual; angka ini bukan tarif final yang di-hardcode ke aplikasi.

| Kelompok acuan | Jumlah | Lokasi utama |
| --- | --- | --- |
| Modul platform | 26 modul M01–M26 | Bab 8–33 |
| Kebutuhan fungsional | 212 requirement FR | Tabel pada tiap modul |
| Aturan lintas modul | 28 business rules | Bab 6 |
| Kualitas dan UX | 16 NFR serta 8 UX requirements | Bab 34 dan 38 |
| Acceptance lintas domain | 48 skenario UAT | Bab 40 |
| Keputusan terbuka | 20 decision records | Bab 42 |

## Navigasi dokumen

1. Mandat dan tata kelola kebutuhan
2. Visi masalah dan hasil produk
3. Batas fase dan penawaran
4. Persona kewenangan dan permukaan produk
5. Journey dan kontrak lintas modul
6. Aturan bisnis dan invariant platform
7. Katalog modul dan dependensi
8. M01 Organisasi pelanggan dan partner
9. M02 Katalog lisensi subscription dan billing
10. M03 Onboarding pairing dan assignment
11. M04 Shell dan pengalaman TV
12. M05 Branding template media dan publish
13. M06 Guest stay dan corporate group
14. M07 Provider konten channel dan hak siaran
15. M08 Monitoring health dan diagnosis perangkat
16. M09 Rilis approval dan update
17. M10 Capability registry dan managed controls
18. M11 Ticket knowledge dan incident
19. M12 AI operations dan bantuan engineering
20. M13 Promosi hotel dan slot signage lokal
21. M14 Integrasi PMS dan rekonsiliasi stay
22. M15 OTT resmi casting dan pembersihan sesi
23. M16 Ad network penawaran dan consent
24. M17 Marketplace katalog order dan fulfilment
25. M18 Home profile dan B2C
26. M19 Household membership dan ownership
27. M20 Residence building dan occupancy
28. M21 Hardware commerce fulfilment dan RMA
29. M22 Ledger revenue share dan settlement
30. M23 Policy consent dan authorization resolver
31. M24 Integration gateway API dan event delivery
32. M25 Analytics KPI dan decision dashboard
33. M26 Security privasi dan governance
34. Struktur layar UX dan design requirements
35. Model data minimum dan lifecycle
36. Kontrak API command dan event
37. Arsitektur aplikasi dan deployment requirements
38. Nonfunctional requirements dan definisi pengukuran
39. Offline recovery dan data lifecycle
40. QA acceptance dan traceability
41. Delivery plan dependensi dan gate
42. Risiko keputusan terbuka dan change control
43. Referensi glosarium dan riwayat versi

## 1 Mandat dan tata kelola kebutuhan

### 1.1 Tujuan dan pengguna dokumen

Product owner memakai PRD untuk mengendalikan scope dan keputusan produk. Engineering memakai requirement serta invariant sebagai kontrak perilaku. Designer menerjemahkannya menjadi layar, state dan interaksi. QA membangun pengujian positif, negatif, race condition dan recovery. Sales, finance dan support memakai batas produk untuk menyiapkan penawaran serta operasi yang dapat dipenuhi.

Master PRD tidak menggantikan Phase 1 PRD, spesifikasi API/OpenAPI, skema database, kontrak konten, hasil sertifikasi perangkat atau perjanjian SLA. Dokumen turunan dapat memperinci perilaku; perubahan material pada scope, privasi atau kewenangan harus dikembalikan ke keputusan produk. Prototype tidak boleh dipakai sebagai bukti silent install, DRM, power recovery atau dukungan vendor.

### 1.2 Status dan prioritas

K adalah arah yang telah disepakati dalam diskusi. R adalah rekomendasi rancangan. H adalah hipotesis angka/biaya. V adalah ketergantungan yang perlu bukti perangkat, akses vendor atau kontrak. E adalah fakta eksternal dari sumber resmi. Seluruh requirement fungsional merupakan R untuk implementasi, kecuali arah K yang disebut eksplisit. Penetapan requirement tidak mengubah H/V menjadi fitur terbukti.

Fase P1 berarti wajib dalam baseline Hospitality Core. P1C berarti bersyarat dan hanya diaktifkan pada profil/vendor yang lulus validasi. P2 adalah perluasan properti, monetisasi dan pilot Residence. P3 adalah Home, household penuh dan retail sesuai gate. P4 adalah perluasan ekosistem berdasarkan permintaan. Model data dapat disiapkan sebelum fitur fase tersebut dibuka.

Prioritas Must berlaku di dalam fase yang tertera, bukan seluruh roadmap sekaligus. Should adalah peningkatan yang dapat ditunda tanpa melanggar invariant. Could adalah eksplorasi. Semua baris FR berstatus Must pada fase masing-masing kecuali ditandai Should. Fitur bersyarat boleh tidak dirilis, tetapi UI dan penawaran wajib menyebut ketidaktersediaannya.

### 1.3 Struktur requirement dan perubahan

FRxx-yy adalah requirement fungsional modul Mxx. BR adalah invariant/aturan lintas modul. NFR adalah kebutuhan kualitas. UAT adalah skenario acceptance lintas modul. DR adalah keputusan terbuka. Setiap baris FR memiliki fase dan bukti penerimaan minimum. Persona, scope, input serta kegagalan dijelaskan pada pengantar dan alur modul terkait; seluruh BR, otorisasi serta NFR tetap berlaku.

Perubahan menyimpan alasan, owner, requirement terdampak, migrasi data, perubahan kontrak dan tes regresi. Nomor ID yang dihapus tidak digunakan ulang; catat retired/superseded. Baseline implementasi dirilis melalui daftar requirement yang dibekukan, bukan asumsi semua halaman master selesai bersamaan.

## 2 Visi masalah dan hasil produk

### 2.1 Masalah yang diselesaikan

Operator perlu memperbarui branding, channel dan promosi tanpa masuk ke tiap kamar. Front office perlu menyambut tamu individual atau rombongan meski belum memiliki PMS. Installer menghadapi model TV, remote, firmware dan jaringan yang berbeda. ISP perlu menjual serta mendukung banyak properti dengan pemisahan pelanggan. GOJJA perlu mengetahui deployment, seat, invoice, biaya pelayanan dan kesehatan produk tanpa mengekspos data tamu berlebihan.

Penghuni apartemen dan rumah mempunyai kebutuhan berbeda: kontrol pribadi, paket rumah tangga, perubahan penghuni, layanan gedung serta ownership perangkat. Menyamakan seluruh layar sebagai kamar hotel dapat menyebabkan reset atau akses data yang salah. Karena itu profil pengalaman dan hubungan kontraktual menjadi bagian domain inti.

### 2.2 Hasil dan ukuran keberhasilan

| Hasil produk | Ukuran | Bukti awal yang diperlukan |
| --- | --- | --- |
| Instalasi dapat diulang | Completion preflight, elapsed setup, bantuan manusia per properti | Installer ISP menyelesaikan run tanpa bantuan developer langsung |
| Operasi konten terpusat | Publish applied dan latency, bukan klik Publish | Versi target cocok dengan laporan endpoint |
| Pengalaman tamu aman | Tidak ada salah nama/kamar pada skenario kritis | Lifecycle manual, offline, room move dan event terlambat lulus |
| Update terkendali | Eligible job healthy dan alasan penundaan | Approval, window, readiness dan health dapat dibuktikan |
| Billing dapat ditelusuri | Rekonsiliasi quantity, invoice, kas dan adjustment | Contoh prorata, pool dan webhook duplikat cocok |
| Ekonomi Core terukur | Cost to serve/property, human hours, contribution | Pengukuran pilot menggantikan asumsi model |
| Partner dapat beroperasi | Kualitas L1, escalation evidence, retention | Scope dan owner masalah tidak terputus |

Angka target pada bagian NFR adalah kandidat internal, bukan hasil aktual atau SLA. Target adopsi 1.000 TV dari satu ISP merupakan potensi pool, bukan 1.000 pelanggan baru per bulan, kontrak committed atau kapasitas yang sudah dibuktikan.

### 2.3 Posisi dan diferensiasi

Branding, cloud CMS, launcher dan personal welcome merupakan kebutuhan pasar yang juga tampak pada benchmark Smartiv/GMEDIA di Blueprint [I02]. GOJJA harus membuktikan kualitas lewat kompatibilitas, alur partner/provider, kontrol update, isolasi data, instalasi serta cost to serve. Tidak munculnya fitur di situs pesaing tidak membuktikan mereka tidak memilikinya. Tidak ada klaim paling lengkap atau paling murah dalam PRD ini.

## 3 Batas fase dan penawaran

### 3.1 Matriks cakupan

| Area | P1 Hospitality Core | Fase bersyarat atau lanjutan |
| --- | --- | --- |
| Tenant dan partner | Direct/reseller, properti, room, endpoint, role | Household penuh dan building scope diperluas P2/P3 |
| TV | Home, channel, informasi, bahasa, offline shell | Casting/OTT khusus P1C/P2, Home P3 |
| CMS | Preset brand, media, preview, publish, monitoring | Custom template, ad campaign dan merchant sesuai fase |
| Stay | Manual, corporate group, checkout, room move | Satu PMS adapter setelah akses tersedia |
| Perangkat | Pairing, capability registry, diagnosis dan update workflow | Kiosk/silent install/power hanya SKU tervalidasi |
| Bisnis | Plan version, seat, invoice, payment reconciliation | Revenue settlement, hardware commerce dan Home billing |
| Support | Ticket, knowledge dan AI read-only terbatas | Patch assistance/tool tindakan setelah evaluasi |
| Promosi | Konten milik properti di slot aplikasi | Ad network opt-in, settlement dan marketplace |

### 3.2 Batas peluncuran pertama

P1 tidak mensyaratkan native mobile app, SDK publik, penggantian OS/firmware, provider premium universal, retail box GOJJA, integrasi semua PMS, wallet bersama atau iklan berbayar lintas hotel. Konten live tetap memerlukan source yang sah. Permintaan layanan tamu atau QR referral dapat disiapkan secara terbatas; pemesanan berbayar lengkap mengikuti M17.

Core harus berguna walau properti tanpa PMS dan belum mengikuti monetisasi. Template premium standar merupakan fitur CMS; desain custom tanpa batas bukan scope default. Remote support tidak menggantikan pemeriksaan listrik, HDMI dan jaringan lapangan. Jalur instalasi serta update mengikuti distribusi yang disetujui dan diuji.

### 3.3 Commercial policy sebagai konfigurasi

Harga wholesale Rp15.000 adalah H baseline pengguna. Harga direct Rp25.000, minimum 10 seat/properti, trial 14 hari maksimum 5 endpoint, kuota 5 GB serta bantuan remote 2 jam berasal dari usulan Commercial Model [I03]. Parameter tersebut harus versioned dan belum aktif sebagai policy kontrak sampai disahkan. Nilai paket historis Rp22.500/Rp30.000 bukan SKU yang otomatis dijual.

Perubahan pricebook tidak mengubah kontrak historis. Cloud termasuk subscription sesuai kuota; infrastruktur, delivery dan AI tetap mempunyai biaya internal. Harga konten, OEM/MDM, hardware, on-site dan connector mempunyai line komersial terpisah. Marketplace/iklan tidak menjadi subsidi yang diasumsikan tersedia untuk menutup Core.

## 4 Persona kewenangan dan permukaan produk

### 4.1 Persona

| Persona | Tugas utama | Scope yang diperbolehkan |
| --- | --- | --- |
| Business/product owner GOJJA | Katalog, roadmap, keputusan komersial | Platform sesuai role, tanpa data pribadi default |
| Technical approver GOJJA | Review rilis, canary, recovery | Release/artifact, bukan izin kamar tanpa pelanggan |
| Finance GOJJA | Invoice, collection, credit dan settlement | Billing account dan ledger yang ditugaskan |
| Support GOJJA | Diagnosis tiket dan eskalasi | Data teredaksi dan akses sementara sesuai tujuan |
| ISP account admin | Properti, alokasi seat, invoice wholesale | Pelanggan dengan relasi partner aktif |
| Installer ISP/properti | Pairing, preflight, penggantian perangkat | Endpoint dan waktu penugasan terbatas |
| Hotel owner/manager | Branding, channel, approval dan operasi | Properti yang diotorisasi |
| Front office | Stay, room move, group welcome | Data minimum stay dalam properti |
| Content editor/publisher | Media, template dan publikasi | Hak edit dan publish dapat dipisahkan |
| Tamu | Menonton, informasi, layanan aman | Endpoint/stay yang sedang berlaku |
| Building operator | Pengumuman, unit dan aset gedung | Tidak otomatis menguasai household pribadi |
| Household owner/member | Paket, perangkat dan preferensi | Rumah tangga serta delegasi anggota |
| Advertiser/merchant | Campaign atau order yang ditugaskan | Tanpa akses daftar nama tamu/penghuni |

### 4.2 Model izin

Akses efektif adalah irisan role, relationship scope, entitlement software, hak konten, capability, profile policy serta consent yang diperlukan. Deny berlaku pada server, media URL, export, worker dan tool AI, bukan hanya menu frontend. Perubahan lokasi tampilan tidak boleh menaikkan izin. Superadmin tidak menjadi pengecualian audit untuk membaca data tamu.

Finance tidak boleh menandatangani APK. Publisher konten tidak otomatis dapat mengubah account bank. Installer tidak otomatis dapat melihat guest list. Satu orang dapat memegang beberapa peran pada tim kecil, tetapi sesi, aksi, approval serta alasan tetap terpisah dan dapat ditelusuri. Break-glass hanya untuk insiden yang terdokumentasi, terbatas waktu dan ditinjau setelahnya.

### 4.3 Permukaan aplikasi

Portal pusat, portal partner dan CMS properti dapat memakai codebase web yang sama dengan navigasi serta scope berbeda. Portal household P3 bersifat responsif; mobile native bukan syarat awal. Aplikasi TV berbagi shell dan engine, sementara profil menentukan menu serta kendali. Agent/adapter terpisah dibuat bila privilege vendor memerlukan, bukan untuk berpura-pura memperoleh privilege dengan menambah APK.

## 5 Journey dan kontrak lintas modul

### 5.1 Aktivasi properti reseller

ISP menerima order yang disetujui, membuat customer/property dalam scope, mengisi lokasi/timezone, memilih profil dan quantity. Installer melakukan inventaris SKU/firmware, preflight jaringan/source, lalu memasangkan device ke endpoint. Sistem menguji seat serta hak sebelum binding. CMS memublikasikan konfigurasi umum; endpoint melaporkan applied dan hasil smoke test. Tanggal aktivasi komersial mengikuti order/acceptance, bukan waktu download pertama.

Jika seat habis, pairing tidak menghasilkan aktivasi ganda. Jika perangkat hanya Compatible, keterbatasan ditampilkan sebelum acceptance. Jika provider belum siap, branding dapat diperiksa tetapi status channel belum diterima. Handover menyimpan PIC L1/L2, daftar perangkat, versi, source dan risiko yang diketahui.

### 5.2 Corporate group tanpa PMS

Front office membuat grup dengan label aman, periode, bahasa dan media sambutan, memilih daftar kamar, lalu preview audience. Individual stay dapat memakai display name opsional tanpa menyimpan identitas lengkap. Penggantian kamar menghasilkan assignment baru. Publish hanya menjangkau endpoint yang memiliki assignment sesuai, dan berakhir pada checkout/expiry.

Room yang belum dipastikan tidak menerima nama personal. Corporate logo/label tetap merupakan konten berizin. Grup tidak memberi hak kepada perusahaan untuk membaca data tamu lain. Preview menunjukkan aturan prioritas individual, group dan sambutan umum; operator memutuskan hasil sebelum publish.

### 5.3 Update setelah checkout

GOJJA menguji rilis dan technical approver memublikasikannya. Pemilik properti menyetujui rilis/scope/jadwal atau standing policy. Checkout menutup stay, lalu staf atau sumber readiness yang sah menyatakan Ready for Maintenance. Worker mengunduh dan memverifikasi paket. Sebelum installer dimulai, device dan server memeriksa kembali konteks, approval, window, aktivitas dan kemampuan.

Check-in baru membatalkan eligibility lama. Offline saat window berlalu berarti menunggu jadwal sah berikutnya; bukan memasang begitu tersambung. Layar status besar muncul pada tahap yang dapat dikendalikan aplikasi, sementara OS installer atau reboot dapat mengambil alih. Kartu kamar tetap dapat memutus listrik; notifikasi bukan jaminan catu daya.

### 5.4 Checkout dan event terlambat

Checkout yang sah mengakhiri konteks stay dan mengirim purge personal data. Device menyembunyikan personalisasi bila konteks/validitas tidak dapat diverifikasi sesuai policy. Pada boot atau reassignment, welcome personal tidak dipulihkan dari cache lama tanpa validasi. Event checkout stay A yang tiba setelah stay B tidak menutup B. Reset credential app OTT hanya dinyatakan selesai jika adapter memang mendukung dan memverifikasinya.

### 5.5 Billing dan transfer partner

Quantity berlangganan mengikuti order dan effective date. Pada committed pool, alokasi ke properti tidak menghasilkan tagihan seat kedua. Invoice posted dikoreksi melalui adjustment/credit yang terhubung. Pergantian ISP mencatat cutover, akses lama, invoice akhir, sumber konten dan penugasan support baru. Pelanggan tidak dipindahkan hanya karena seseorang mengetahui nomor seri box.

### 5.6 Residence dan Home

Residence move-in menghubungkan household dengan unit melalui occupancy yang berizin; building mengendalikan layanan/aset gedung sesuai kontrak. Move-out mengakhiri hubungan tersebut tanpa menghapus akun rumah tangga pribadi. Home owner memasangkan perangkat dan memilih kendali update; tidak ada checkout atau kiosk hotel default. Konten hospitality tidak otomatis sah untuk rumah.

## 6 Aturan bisnis dan invariant platform

| ID | Aturan wajib | Pemeriksaan utama |
| --- | --- | --- |
| BR01 | Satu device memiliki paling banyak satu assignment aktif dalam scope layanan | Aktivasi paralel dan RMA lama ditolak |
| BR02 | Seat billed, assigned, reserved dan online adalah ukuran berbeda | Ledger quantity dapat direkonsiliasi |
| BR03 | Satu seat tidak dipakai paralel di luar allowance bertanggal | Race seat terakhir dan replacement diuji |
| BR04 | Reseller, ISP internet, provider dan pembayar merupakan relasi terpisah | Perubahan satu relasi tidak membuka seluruh data |
| BR05 | Hak efektif tidak melebihi semua sumber izin yang berlaku | API/worker/export menolak scope palsu |
| BR06 | Checkout bukan bukti kamar fisik siap maintenance | Readiness dan freshness terpisah |
| BR07 | Event lama tidak boleh menimpa context version lebih baru | Event out of order dan duplicate |
| BR08 | Nama guest opsional dan tidak masuk analytics umum | Log dan export disanitasi |
| BR09 | Publish applied harus dibedakan dari submitted/received | ACK dan health menyimpan versi |
| BR10 | Aset baru dipakai setelah validasi dan commit atomik | Download terputus tidak merusak tema aktif |
| BR11 | Penambahan channel memerlukan hak source dan capability | URL valid saja belum cukup |
| BR12 | Software plan tidak mengaktifkan seluruh channel premium | Entitlement provider diuji terpisah |
| BR13 | Kiosk/silent update/power merupakan capability per profil | Klaim mengikuti hasil certification |
| BR14 | Rilis teknis dan izin install pelanggan merupakan dua keputusan | Tidak ada tombol publish yang melewati consent |
| BR15 | Eligibility diulang menjelang langkah yang mengubah perangkat | Context berubah menunda install |
| BR16 | Job expired tidak dijalankan di luar window | Reconnect sesudah expiry |
| BR17 | Applied version tanpa health bukan update sukses | Crash setelah install menahan rollout |
| BR18 | Campaign hanya tayang dengan izin atas creative/scope yang valid | Revoke dan material creative change |
| BR19 | Proof of play bukan audience manusia | Deduplikasi dan definisi metrik |
| BR20 | Invoice posted dan ledger tidak ditimpa diam-diam | Koreksi menyimpan referensi asal |
| BR21 | Payment notification belum tentu settlement final | Signature, idempotency dan reconciliation |
| BR22 | Cancel software bukan otomatis retur hardware | State dan pihak fulfilment terpisah |
| BR23 | Building tidak menghapus household pribadi pada move-out | Ownership dan akses diuji |
| BR24 | AI tidak memiliki signing key atau hak deploy bebas | Tool policy dan approval manusia |
| BR25 | Secret provider tidak tampil dalam log/QR/export umum | Masking dan credential reference |
| BR26 | Offline tidak memperpanjang personal consent atau kontrak tanpa policy | Expiry dan waktu tidak dipercaya |
| BR27 | Suspension tidak melakukan brick/physical lock atau hapus data sewenang-wenang | Aksi mengikuti kontrak dan izin |
| BR28 | Semua aksi penting memiliki actor, scope, versi dan correlation ID | Audit lintas portal dan worker |

## 7 Katalog modul dan dependensi

ID M01–M26 mempertahankan Blueprint. Penjabaran modul ada pada bab 8–33. Semua modul bergantung pada M23/M26 untuk izin serta governance; bukan berarti fitur keamanan baru dimulai setelah modul lain selesai. P1 menggunakan representasi minimum CustomerAccount type dan ExperienceProfile untuk menghindari migrasi yang menjadikan setiap pelanggan sebagai hotel.

| Modul | Kapabilitas | Fase utama | Ketergantungan penting |
| --- | --- | --- | --- |
| M01 | Organisasi dan relasi | P1 | M23 M26 |
| M02 | Lisensi dan billing | P1 | M01 M23 M24 |
| M03 | Onboarding device | P1 | M01 M02 M10 |
| M04 | Pengalaman TV | P1 | M03 M05 M07 M23 |
| M05 | Brand dan media CMS | P1 | M01 M23 M24 |
| M06 | Guest dan stay | P1 | M01 M03 M23 |
| M07 | Provider dan channel | P1/P1C | M01 M23 M24 |
| M08 | Monitoring perangkat | P1 | M03 M24 M26 |
| M09 | Rilis dan update | P1/P1C | M08 M10 M23 M26 |
| M10 | Managed controls | P1C | Registry dan akses OEM/DPC |
| M11 | Ticket dan knowledge | P1 | M01 M08 M26 |
| M12 | AI operations | P1 terbatas/P2 | M11 M24 M26 |
| M13 | Promosi lokal | P1 | M04 M05 M23 |
| M14 | PMS connector | P1C/P2 | M06 M24 |
| M15 | OTT dan casting | P1C/P2 | M03 M06 M07 M10 |
| M16 | Ad network | P2 | M13 M22 M23 |
| M17 | Marketplace | P2/P3 | M22 M24 M26 |
| M18 | Home profile | P3 | M19 M02 M07 |
| M19 | Household membership | Model P1, fitur P3 | M01 M23 M26 |
| M20 | Residence | Model P1, pilot P2 | M19 M23 |
| M21 | Hardware commerce | P3 | M02 M03 M22 |
| M22 | Revenue settlement | P2/P3 | M02 M16 M17 M24 |
| M23 | Policy dan consent | P1 lalu perluasan | M01 M26 |
| M24 | Integration gateway | P1 lalu perluasan | M01 M26 |
| M25 | Analytics | P1 lalu perluasan | Fakta seluruh domain |
| M26 | Security governance | P1 lalu perluasan | Identitas dan infrastruktur |

Aktivasi endpoint memerlukan alokasi seat dan izin. TV menampilkan channel yang diberikan M07, bukan seluruh konfigurasi provider. Update membaca readiness/konteks M06/M20 serta health M08. Campaign tidak menambah saldo langsung dari event TV; M22 memvalidasi eligibility terlebih dahulu. Analytics bukan sumber kebenaran invoice.

## 8 M01 Organisasi pelanggan dan partner

### 8.1 Tujuan dan kontrak modul

Platform admin membuat customer organization, partner dan property; partner hanya membuat/mengelola customer yang ditugaskan. Input mencakup identitas organisasi, kontak bisnis, lokasi/timezone, model penjualan dan relationship efektif. Prasyaratnya akun actor aktif serta izin scope. Modul menghasilkan struktur customer, property, unit dan delegation yang dipakai aktivasi, billing serta support.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR01-01 | P1 | Buat CustomerAccount bertipe organization atau household; pisahkan legal entity dan operator | Akun organization tidak memerlukan guest; household tidak dipaksa mengisi hotel |
| FR01-02 | P1 | Simpan reseller, internet ISP, provider, installer, support owner dan billed-to sebagai hubungan terpisah | Satu property memakai ISP A dan provider B tanpa duplikasi customer |
| FR01-03 | P1 | Bentuk lokasi/property/unit/endpoint dengan timezone IANA dan external reference | Dua hotel bernama sama tetap memiliki ID serta scope berbeda |
| FR01-04 | P1 | Kelola undangan user, membership, role dan masa delegation | Installer expired ditolak API meskipun halaman lama masih terbuka |
| FR01-05 | P1 | Gunakan search/filter/pagination berbasis scope dan status | Partner tidak menemukan customer lain melalui pencarian atau export |
| FR01-06 | P1 | Dukung transfer reseller melalui cutover dan approval pihak berhak | Akses lama dicabut; history invoice serta customer identity tetap |
| FR01-07 | P1 | Archive entity tanpa menghapus catatan keuangan atau assignment history | Property archived tidak menerima pairing baru; histori masih terbaca sesuai izin |
| FR01-08 | P1 | Validasi optimistic version pada perubahan relasi dan lokasi | Edit bertabrakan menghasilkan conflict yang dapat dipulihkan, bukan silent overwrite |

### 8.2 Alur dan kegagalan

Create customer menghasilkan scope kosong yang belum boleh memutar source premium atau memakai lisensi. Operator mengisi property, memilih profile, menugaskan staff dan menyelesaikan readiness. Relasi partner berakhir berdasarkan tanggal efektif; perubahan owner/billed-to memerlukan review tagihan serta akses. Duplicate external reference ditolak dalam namespace yang sama. Kontak billing tidak otomatis menerima izin membaca stay.

## 9 M02 Katalog lisensi subscription dan billing

### 9.1 Tujuan dan batas

Commercial owner mengelola plan version; finance mengelola invoice dan collection; customer/ISP mengajukan quantity. Input adalah order yang sah, plan, effective date, billing timezone, quantity, add-on dan tax profile yang ditinjau. Modul menghasilkan entitlement, seat ledger, invoice serta payment allocation. Aplikasi tidak menagih dari heartbeat. Pajak serta payment channel final ditetapkan fungsi berwenang, bukan angka contoh di PRD.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR02-01 | P1 | Versioned catalog menyimpan harga, currency, unit, scope, quota, term dan effective date | Harga baru tidak menimpa subscription dengan versi kontrak lama |
| FR02-02 | P1 | Catat order/subscription software terpisah dari content/hardware/services | Cancel software tidak otomatis menandai hardware returned |
| FR02-03 | P1 | Bedakan committed, billed, assigned, reserved, trial dan online | Dashboard dan export memiliki definisi serta quantity konsisten |
| FR02-04 | P1 | Dukung per-property dan committed pool dengan allocation limit | Pool 1.000, assigned 950, online 700 ditagih 1.000 hanya jika kontraknya committed |
| FR02-05 | P1 | Cegah alokasi melebihi allowance melalui transaksi/version check | Dua request seat terakhir menghasilkan satu sukses dan satu penolakan jelas |
| FR02-06 | P1 | Penambahan/pengurangan memakai change order dan effective date | Penurunan tidak mengurangi invoice periode lampau secara diam-diam |
| FR02-07 | P1 | Prorata memakai hari kalender dan billing timezone, rounding per line tervalidasi | Contoh 20 seat ×15.000 ×15/30 menghasilkan Rp150.000 sebelum pajak |
| FR02-08 | P1 | Invoice draft dapat direview; issued/posted dikoreksi dengan credit/adjustment | Invoice asal tetap ada dan adjustment memiliki alasan serta reference |
| FR02-09 | P1 | Rekam transfer bank/gateway, partial payment dan unapplied cash | Payment sebagian tidak mengubah seluruh invoice menjadi paid |
| FR02-10 | P1 | Signature, idempotency dan rekonsiliasi wajib sebelum payment posting | Webhook dua kali hanya menghasilkan satu penerimaan dan entitlement effect |
| FR02-11 | P1 | Kelola due/grace, reminder, dispute, suspension dan reinstatement berdasarkan policy | Grace bukan parameter hardcode; suspension tidak brick TV atau hapus guest database sewenang-wenang |
| FR02-12 | P1 | Trial memerlukan tanggal akhir dan persetujuan paid terpisah | Trial expired tanpa order paid tidak melakukan auto-charge |
| FR02-13 | P1 | Ekspor invoice/statement dan quantity audit untuk scope pembeli | ISP melihat invoice wholesale; hotel direct tidak melihat wholesale ISP lain |
| FR02-14 | P1 | Terapkan approval exception untuk diskon, waiver, minimum dan kredit | Quote di luar limit tertahan sampai decision record sah tersedia |

### 9.2 Aturan billing rinci

Usulan [I03] adalah kalender bulanan, invoice di muka, penambahan tengah bulan true-up berikutnya, pengurangan efektif periode berikutnya, due 10 hari serta grace 7 hari setelah due. Semua R sampai disahkan pada order. Quantity reserved dapat dibayar jika kontrak mengaturnya; jangan menampilkan delapan perangkat sebagai sepuluh perangkat aktif untuk memenuhi minimum.

Contoh acceptance: November 120 seat ×Rp15.000 = Rp1.800.000; tambah 20 pada 16 November = Rp150.000; kurangi 10 mulai Desember sehingga base Desember 130 seat = Rp1.950.000. Bila tambahan November ditagih true-up Desember, total invoice Desember sebelum pajak Rp2.100.000. Tiga penggantian RMA tidak menambah quantity. Payment screenshot bukan bukti settlement; koreksi invoice tidak mengubah histori tanpa jejak.

### 9.3 Scope kanal

P1 dapat merekonsiliasi transfer bank dengan approval finance; gateway diaktifkan jika kontrak/adapter siap. Retail invoice ISP berada di luar baseline ERP GOJJA kecuali SOW terpisah. Tarif serta kebijakan store untuk transaksi digital ditinjau sebelum Home checkout; tidak diasumsikan satu metode pembayaran boleh dipakai pada semua kanal.

## 10 M03 Onboarding pairing dan assignment

### 10.1 Tujuan dan prasyarat

Installer memasangkan device pada endpoint yang benar melalui wizard. Property, seat allowance, profil serta penugasan installer harus aktif. Device melaporkan identitas teknis, app version dan capability observation; serial bukan credential pemilik. Pairing tidak memerlukan mengetik kredensial CMS di TV. Sistem menyimpan siapa yang mengaktifkan, bukti preflight dan assignment version.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR03-01 | P1 | Tampilkan short code/QR pairing berumur terbatas, sekali pakai dan rate-limited | Code expired, reused atau brute force tidak memberi binding |
| FR03-02 | P1 | Konfirmasi property/unit/endpoint dan identitas device sebelum commit | Installer melihat lokasi yang akan diikat; scope lain tidak dapat dipilih |
| FR03-03 | P1 | Preflight OS/firmware, storage, network, time, decoder dan jalur install yang tersedia | Unsupported atau Limited disertai alasan serta tindakan, bukan lulus palsu |
| FR03-04 | P1 | Alokasi seat dan assignment aktif diproses konsisten | Retry pairing tidak membuat seat kedua atau assignment ganda |
| FR03-05 | P1 | Provisioning mengambil konfigurasi umum dan channel eligible, lalu melaporkan health | Status Ready memerlukan smoke test yang ditentukan, bukan hanya token diterbitkan |
| FR03-06 | P1 | Dukung room mapping/import tervalidasi dengan dry run | Room duplikat dalam scope ditandai; baris gagal tidak diam-diam dipetakan |
| FR03-07 | P1 | RMA/rebind mencabut identitas lama dan mengaktifkan pengganti | Box lama kembali online tidak memperoleh data stay terbaru |
| FR03-08 | P1 | Decommission memutus binding, mencabut token dan menjadwalkan purge data GOJJA | History audit tetap; purge offline ditandai pending, bukan selesai |
| FR03-09 | P1 | Wizard menyediakan checklist, panduan self-install dan export hasil acceptance | ISP menyelesaikan sample install; exception tersimpan dengan PIC |

### 10.2 Self-install dan recovery

Wizard membedakan install aplikasi, pengaturan launcher yang diizinkan, enrolment managed yang tersedia dan acceptance properti. App tidak mengklaim bahwa download APK memberi device-owner. Perubahan provisioning dapat memerlukan reset/vendor action; jelaskan sebelum tindakan tersebut. Jika internet putus saat provisioning, lanjutkan dari langkah aman dengan code/token yang masih valid; jangan menghasilkan pasangan separuh aktif yang menerima guest data.

## 11 M04 Shell dan pengalaman TV

### 11.1 Pengalaman utama

Tamu memakai remote untuk membuka Televisi, Informasi Hotel, Promosi dan Bantuan; layanan tambahan muncul sesuai hak. Home harus terbaca dari jarak menonton, memprioritaskan brand properti dan tidak membuat tamu melewati banyak langkah untuk menonton. TV app quality Android menekankan navigasi D-pad; standar ini dipakai sebagai acuan pengujian [S01].

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR04-01 | P1 | Semua fungsi guest Core dapat diakses dengan D-pad, OK dan Back | Tidak ada keyboard/mouse wajib atau focus trap pada alur inti |
| FR04-02 | P1 | Home merender brand, welcome umum serta menu eligible dari konfigurasi aktif | Menu tanpa entitlement disembunyikan atau menjelaskan kebutuhan sesuai konteks |
| FR04-03 | P1 | Navigasi Televisi menyediakan daftar, kategori, urutan dan indikator channel | Pilihan tetap fokus setelah kembali; channel invalid memberi alasan aman |
| FR04-04 | P1 | Kontrol player menangani loading, buffering, retry terbatas dan error source | Gagal satu channel tidak menyebabkan retry storm atau seluruh app crash |
| FR04-05 | P1 | Bahasa ID/EN dipilih sesuai konteks dan fallback konten | Teks yang belum diterjemahkan memakai fallback yang konsisten |
| FR04-06 | P1 | Cache shell/media umum mendukung Offline Ready | Tanpa internet, informasi umum tetap terbuka; live internet tidak dijanjikan offline |
| FR04-07 | P1 | Splash/motion/sound tidak berulang pada retry/resume atau tiap channel | Silent/reduced motion bekerja; status loading tetap jujur |
| FR04-08 | P1 | Pengaturan guest dibatasi pada opsi aman dalam aplikasi | Guest tidak dapat membuka panel admin melalui deep link internal |
| FR04-09 | P1 | Maintenance/recovery menampilkan tahap, alasan dan pilihan yang relevan | Tidak ada progress persen fiktif; health failure berbeda dari download gagal |
| FR04-10 | P1 | Minimisasi data pada layar setelah boot/rebind/konteks tidak terpercaya | Nama lama tidak muncul sebelum konteks personal valid; Home tidak di-reset sebagai hotel |

### 11.2 Batas kendali

Menu aplikasi bukan bukti Android Settings terkunci. Remote Home, Settings, input dan OEM shortcut diuji pada M10. Jika third-party app dibuka, GOJJA tidak selalu mengendalikan tampilannya atau tombol kembali. Sleep, standby dan full AC boot harus dibedakan dalam lab. Aplikasi tidak menyalakan panel TV yang tidak mendapat daya.

## 12 M05 Branding template media dan publish

### 12.1 Tujuan dan input

Editor mengunggah logo/foto/video, memilih preset, menulis informasi dan mengatur menu; publisher meninjau audience lalu menerbitkan. Input mencakup hak media, locale, validity, timezone serta quota. Output adalah manifest versioned dan laporan perangkat. Layout bebas/code injection bukan editor P1; preset membatasi perubahan agar fokus dan keterbacaan tetap aman.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR05-01 | P1 | Brand settings menyimpan logo, warna, background, label dan informasi properti | Preview menampilkan resolved values dan tidak mewarnai ulang logo GOJJA |
| FR05-02 | P1 | Preset mengatur menu, layout serta safe region yang diizinkan | Operator tidak dapat menyembunyikan seluruh akses Televisi/Bantuan karena konfigurasi invalid |
| FR05-03 | P1 | Media upload memeriksa MIME, ukuran, checksum, quota dan metadata playback | File palsu/rusak ditolak; quota dihitung atas aset unik sesuai scope |
| FR05-04 | P1 | Asset lifecycle membedakan upload, validation, ready, in use dan retired | Media yang masih dipakai manifest aktif tidak dihapus tanpa dependency check |
| FR05-05 | P1 | Preview properti/room/group menampilkan versi, bahasa dan audience sebelum publish | Operator melihat jumlah endpoint target serta pengecualian yang dijelaskan |
| FR05-06 | P1 | Draft/approve/schedule/publish mempunyai permission serta version conflict | Editor tanpa publish role tidak dapat menerbitkan lewat API |
| FR05-07 | P1 | Publish membuat immutable manifest, checksum dan waktu valid | Perangkat mempertahankan versi lama saat unduhan aset baru gagal |
| FR05-08 | P1 | Rollback konten memilih snapshot valid sebagai publish baru | Histori tidak dihapus; applied acknowledgement mengikuti versi baru |
| FR05-09 | P1 | Quota, file limit, template/user allowance dan retention dapat dikonfigurasi per plan version | Melewati limit menghasilkan opsi/penjelasan; tidak memotong file diam-diam |

### 12.2 Urutan publish

Editor menyimpan draft, menjalankan validasi, memilih scope, memeriksa preview, lalu publisher menyetujui. Worker membentuk manifest dan menandai scheduled/active sesuai timezone lokasi. Device mengunduh aset ke staging cache, memverifikasi, lalu memindahkan pointer konfigurasi secara atomik. CMS membedakan queued, received, verified, applied dan failed. Tidak ada label seluruh properti berhasil hanya karena satu broadcast terkirim.

Konfigurasi personal stay disalurkan sebagai konteks terpisah dari template umum. Desain yang memuat nama tamu tidak dibuat menjadi screenshot media permanen yang tersebar lintas kamar. Public media path tidak boleh menjadi jalan membaca informasi personal.

## 13 M06 Guest stay dan corporate group

### 13.1 Tujuan dan model konteks

Front office menjalankan check-in/out manual ketika PMS tidak tersedia. Nama tampilan bersifat opsional dan dapat disamarkan; data identitas lengkap bukan input wajib TV. Stay, room assignment serta group merupakan entitas berbeda. Setiap perubahan menyimpan context version agar event lama dan perpindahan kamar tidak mencampurkan tamu.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR06-01 | P1 | Buat stay manual dengan tanggal, room, bahasa dan display name opsional | Welcome umum tetap bekerja tanpa nama atau PMS |
| FR06-02 | P1 | Check-in memvalidasi konflik stay dan endpoint profile | Dua stay aktif tidak diam-diam menguasai room yang sama |
| FR06-03 | P1 | Group welcome memakai label/media/periode dan daftar assignment terpilih | Hanya kamar yang dipilih dan eligible menerima konteks grup |
| FR06-04 | P1 | Resolver mendukung default properti, grup dan individual dengan preview prioritas | Hasil konflik dapat diprediksi sebelum publish; override tercatat |
| FR06-05 | P1 | Room move mengakhiri assignment lama dan membuat assignment tujuan secara konsisten | Kamar lama tidak menerima perubahan guest baru; target konflik ditolak |
| FR06-06 | P1 | Extend/cancel stay memperbarui validity dan context version | Expiry lama tidak menutup stay yang sudah diperpanjang |
| FR06-07 | P1 | Checkout menutup stay yang dimaksud dan memulai purge personal GOJJA | Retry checkout idempotent; checkout lama tidak menutup stay baru |
| FR06-08 | P1 | Bedakan room occupancy, privacy reset dan Ready for Maintenance | Checkout tidak langsung memberi hak install; staf dapat menahan readiness |
| FR06-09 | P1 | Device hanya menampilkan personalisasi dengan assignment serta validity yang dipercaya | Boot offline/rebind tidak menampilkan nama cached tanpa validasi sesuai policy |
| FR06-10 | P1 | UI memperlihatkan freshness, source dan pending reset bagi operator | Device offline tidak dilabel reset complete hanya karena command queued |
| FR06-11 | P1 | Batch CSV manual menyediakan preview, validasi scope dan hasil per baris | File duplikat tidak membuat stay ganda; error kamar ditunjukkan |
| FR06-12 | P1 | Audit akses/perubahan guest tanpa menyalin nama ke log umum | Export dan log aplikasi tidak membocorkan nama ke ISP yang tidak berhak |

### 13.2 Offline dan keterbatasan

Perangkat offline tidak mengetahui checkout baru secara instan. Rancangan mengurangi risiko melalui boot redaction, expiry lokal, lease konteks personal singkat, invalidasi saat reassignment dan fallback umum. Nilai lease, freshness readiness dan retention ditetapkan melalui DR sebelum pilot; tidak dipilih diam-diam sebagai janji keamanan. Jika persyaratan properti menuntut tidak ada kemungkinan nama lama saat offline, nonaktifkan personal display ketika konteks tidak dapat divalidasi atau batasi fitur sampai mekanisme lokal yang sesuai tersedia.

Purge hanya menguasai data GOJJA serta third-party adapter yang memang memiliki hak. Sesi Netflix/OTT tidak dianggap bersih hanya karena stay ditutup. Properti tidak boleh menjual anonymous guest experience dengan sesi akun tamu sebelumnya masih terbuka tanpa prosedur recovery yang diterima.

## 14 M07 Provider konten channel dan hak siaran

### 14.1 Tujuan dan batas integrasi

Content manager yang sah menetapkan ProviderConnection milik GOJJA/ISP/property, kontrak, use case, channel package dan target. Property memilih urutan channel di dalam haknya. Sumber dapat berupa integrasi player, app resmi/deep link, atau headend yang diotorisasi; masing-masing memiliki pengalaman dan batas berbeda. Transvision, MNC Vision/Indovision, Vision+ dan provider lain adalah kandidat komersial, bukan daftar adapter produksi.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR07-01 | P1 | Provider registry menyimpan owner, contract ref, use case, region, expiry dan support owner | Source hotel tidak otomatis tersedia pada Home |
| FR07-02 | P1 | Tambah connection dengan secret reference dan validation status | Credential tidak muncul pada list/export/log; validasi gagal tidak menjadi Active |
| FR07-03 | P1 | Channel map mempunyai stable ID, nomor, nama, kategori, logo, locale dan source reference | Perubahan urutan tidak mengubah entitlement channel |
| FR07-04 | P1 | Property/partner hanya menerapkan package yang berada dalam contract scope | ISP tidak memasang paket milik partner lain melalui manipulasi ID |
| FR07-05 | P1 | Channel publish versioned dan melaporkan applied/error endpoint | Channel dihapus/expired tidak bertahan karena cache lama tanpa policy |
| FR07-06 | P1C | Player HLS/DASH/DRM diuji per source dan device sesuai adapter | Sample authorized lulus startup, token renewal dan contract expiry; URL saja bukan bukti |
| FR07-07 | P1C | EPG, audio track, subtitle dan favorit mengikuti source support | Fitur unavailable tidak menampilkan data jadwal atau subtitle palsu |
| FR07-08 | P1 | Status membedakan network, authentication, entitlement, codec/DRM dan provider failure | Tamu menerima copy aman; support menerima reason code teredaksi |
| FR07-09 | P1C | Headend/local source diizinkan hanya dengan profil jaringan serta hak yang tervalidasi | Unicast/multicast/DRM tidak dijanjikan identik; contoh network diuji |
| FR07-10 | P1 | Kontrak expired/disabled mengurangi hak baru sesuai policy dan memberikan notifikasi operasional | Software subscription aktif tidak melewati expiry source premium |

### 14.2 Bentuk integrasi

Native stream membutuhkan manifest/protocol, auth/token, DRM license, concurrency, device policy dan hak hospitality yang sesuai. App provider resmi membutuhkan instalasi yang diizinkan, akun/activation serta jalur kembali. Headend memerlukan sumber berhak, kapasitas jaringan, routing/IGMP bila relevan dan receiver kompatibel. Box provider yang tertutup mungkin hanya dapat diakses melalui input HDMI terpisah dengan kontrol terbatas; jangan menyebutnya player GOJJA terintegrasi jika memang tidak ada API.

Media3 mendukung konfigurasi DRM tertentu tetapi kemampuan decoder, format dan persyaratan provider tetap perlu diuji [S02]. Sertifikasi media atau Widevine level bukan bukti izin redistribusi atau jaminan Netflix. Live TV provider mengalir langsung ke device/headend sesuai topologi; relay cloud GOJJA bukan default.

## 15 M08 Monitoring health dan diagnosis perangkat

### 15.1 Scope telemetry

Support dan operator memantau last seen, versi, capability, konfigurasi applied, storage serta status player yang dapat diobservasi. Heartbeat bukan bukti TV panel menyala, kamar berpenghuni atau orang menonton. Data yang tidak tersedia pada suatu OEM ditampilkan Unknown/Unsupported, bukan angka perkiraan. Owner data mengikuti scope; ISP tidak menerima viewing history pribadi secara default.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR08-01 | P1 | Heartbeat membawa device/assignment ID, versi app, waktu dan sequence | Last seen memakai penerimaan server dan tidak maju karena event replay |
| FR08-02 | P1 | Dashboard membedakan desired, received, applied dan healthy | Perbedaan versi terlihat tanpa menyatakan publish gagal hanya karena endpoint offline |
| FR08-03 | P1 | Tampilkan storage/network/player diagnostic hanya jika tersedia | Nilai unsupported tidak ditampilkan sebagai nol atau sehat |
| FR08-04 | P1 | Status online/stale/offline memakai threshold policy yang terlihat | Mengubah threshold tidak mengubah billable quantity |
| FR08-05 | P1 | Diagnostic bundle terikat ticket, scope, consent bila perlu dan expiry | Token/guest name tidak masuk bundle umum; akses unduh tercatat |
| FR08-06 | P1 | Alert dideduplikasi dan dapat dikaitkan dengan incident sumber yang sama | Gangguan satu provider tidak membuat ribuan tiket identik |
| FR08-07 | P1 | Fleet filter per lokasi, customer, partner, model, firmware dan versi | Filter tidak membuka customer di luar hubungan aktif |
| FR08-08 | P1 | Monitoring mencatat missing data dan stale readiness secara eksplisit | Tidak ada keputusan install berdasarkan health/readiness yang sudah kedaluwarsa |

### 15.2 Backpressure

Device membatasi log dan antrean lokal; event penting tidak tersingkir oleh debug noise. Server menolak payload berlebihan, memberi retry policy serta rate limit yang dapat dipulihkan. Data pribadi tidak menjadi label metrics. Health rules memiliki versi supaya perubahan definisi online tidak menyembunyikan regresi kualitas.

## 16 M09 Rilis approval dan update

### 16.1 Model rilis

Engineering menyiapkan signed artifact dan release note; technical approver GOJJA menilai pengujian serta target. Pelanggan menyetujui install sesuai scope atau standing policy. Worker/device melakukan eligibility ulang. Model memisahkan update TV app, agent, firmware OEM, konten dan backend; satu tombol rilis tidak memberi izin atas semuanya.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR09-01 | P1 | Release registry menyimpan artifact, package, version code, signature identity, checksum dan target profile | Artifact berbeda tidak dapat diam-diam menggantikan binary approved |
| FR09-02 | P1 | Draft/Tested/Technically Approved/Published/Paused/Retired mempunyai hak transisi | Publisher tanpa approval teknis ditolak; agent AI tidak memiliki signing authority |
| FR09-03 | P1 | Approval pelanggan menyimpan release/policy, scope, window, timezone dan expiry | Izin property A tidak berlaku property B atau rilis di luar standing policy |
| FR09-04 | P1 | Bedakan channel Store, assisted APK, managed/OEM dan vendor firmware | CMS menunjukkan mode aktual dan tindakan manusia bila diperlukan |
| FR09-05 | P1 | Download dan verifikasi dapat dipisahkan dari izin menjalankan installer | Paket staged tidak dihitung installed; download tidak otomatis mengganggu tamu |
| FR09-06 | P1 | Eligibility memeriksa izin, capability, context version, freshness, storage, aktivitas dan waktu | Perubahan check-in/binding/window menyebabkan job menunggu atau batal |
| FR09-07 | P1C | Silent install hanya dipakai saat privilege dan jalur distribusi terbukti | Compatible tanpa privilege berstatus Assisted Required, bukan gagal silent universal |
| FR09-08 | P1 | Job state, reason, attempt dan timestamp dapat dipantau GOJJA serta customer sesuai hak | Downloading, Installing dan Health Check terlihat berbeda |
| FR09-09 | P1 | Canary/batch rollout memiliki concurrency, pause dan stop condition | Satu kegagalan kritis yang ditentukan menahan batch berikutnya |
| FR09-10 | P1 | Status layar menjelaskan maintenance tanpa persentase atau jaminan power palsu | UI tidak menimpa OS installer dengan overlay yang tidak diizinkan |
| FR09-11 | P1 | Success memerlukan reported version dan health check sesudah restart | App crash/bootloop tidak dihitung sukses walau installer memberi result installed |
| FR09-12 | P1 | Recovery memiliki runbook forward fix, data migration dan adapter-specific rollback bila sah | Kegagalan power/download/install mempunyai owner serta langkah yang diuji |
| FR09-13 | P1 | Offline/expired job tidak langsung dijalankan saat reconnect | Job memeriksa window dan approval baru; retry memakai backoff serta batas |

### 16.2 State dan race condition

Release bergerak Draft → Tested → Technically Approved → Published; Paused menghentikan penugasan/langkah baru yang masih dapat ditahan. Job bergerak Pending Approval → Scheduled → Downloading → Verified → Waiting for Conditions → Installing → Restarting → Health Check → Succeeded. Failed, Cancelled dan Expired menyimpan tahap serta alasan. Satu job dapat menunggu kondisi tanpa mengulang download valid.

Sebelum Installing, worker memakai lease pendek dan expected assignment/context version. Device memeriksa kembali kondisi lokal. Jika check-in baru terjadi sebelum langkah tersebut, install ditahan. Jika installer sudah memasuki langkah yang tidak dapat diinterupsi, sistem tidak menjanjikan pembatalan instan; status serta prosedur staf menjelaskan batas itu. Concurrency lease tidak mencegah kartu kamar memutus listrik.

### 16.3 Distribusi dan aturan platform

Aplikasi yang didistribusikan melalui Google Play tidak boleh memperbarui dirinya di luar mekanisme Play [S03]. Karena itu build/channel harus mempunyai jalur updater yang sesuai; jangan menyisipkan sideload self-updater ke build Play lalu menganggap approval hotel mengesahkan mekanismenya. Store-managed update mungkin tidak dapat dijadwalkan persis oleh CMS; jika kontrol jadwal merupakan kebutuhan wajib, pilih perangkat serta jalur managed yang benar-benar mendukungnya sebelum penawaran.

Google juga menerapkan developer verification bertahap di sejumlah wilayah, termasuk Indonesia, mulai 30 September 2026 melalui participating stores pada certified Android devices [S04]. Applicability persis terhadap TV/box, kanal enterprise dan provisioning harus diverifikasi pada SKU serta jalur distribusi yang dipilih. PRD tidak menyimpulkan seluruh TV otomatis terdampak sama atau bahwa direct APK pasti selalu tersedia. Identity/package registration menjadi bagian checklist distribusi; tanggal dan aturan diperiksa ulang sebelum release.

WorkManager membantu pekerjaan persisten tetapi bukan jaminan eksekusi pada detik tertentu di semua perangkat [S05]. Signed package, migrasi data dan recovery diuji pada hardware nyata. Downgrade APK bukan janji universal.

## 17 M10 Capability registry dan managed controls

### 17.1 Profil dan evidence

CapabilityProfile mencatat vendor/model exact SKU, firmware build, Android version/API, app build, jalur enrolment/install, remote, network, media/DRM serta hasil uji. Setiap kemampuan mempunyai status Supported, Limited, Unsupported atau Unknown, dengan evidence/date/owner. Compatible dan Managed merupakan ringkasan profil; Managed tetap dapat memiliki batas tertentu yang tercantum pada penawaran.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR10-01 | P1 | Registry menyimpan hasil per capability dan certification evidence | Firmware baru menandai revalidation; badge model lama tidak diwariskan otomatis |
| FR10-02 | P1C | Atur Home/launcher default hanya melalui mekanisme yang diizinkan | Remote Home dan cold boot kembali sesuai profil tervalidasi |
| FR10-03 | P1C | Kiosk/restriction menggunakan DPC/OEM/management privilege yang sah | Settings/shortcut escape diuji; screen pinning tidak disebut lock task terkelola |
| FR10-04 | P1C | Power-on/input/CEC/recovery dicatat sebagai kemampuan terpisah | AC recovery, standby dan HDMI return mempunyai hasil uji berbeda |
| FR10-05 | P1C | Safe admin escape memakai autentikasi, rate limit dan audit | Tidak ada PIN default universal; operator berwenang dapat memulihkan akses |
| FR10-06 | P1C | Remote command memakai allowlist, authorization, expiry dan acknowledgement | Command stale/duplikat tidak reboot/wipe berulang; arbitrary shell tidak tersedia |
| FR10-07 | P1C | Reset GOJJA/third-party state membedakan requested, supported dan verified | Logout unsupported diarahkan ke SOP; tidak dilabel sukses palsu |

### 17.2 Batas hardware

Android lock task memerlukan allowlisting serta pengelolaan yang sesuai; dokumentasinya tidak membuktikan device-owner provisioning tersedia pada seluruh TV konsumen [S06]. Google TV/Android TV bersertifikat media dapat tetap tidak mendukung managed enrolment yang dibutuhkan. Samsung Tizen/LG webOS memerlukan aplikasi/adapter tersendiri; P1 native Android tidak diklaim mendukungnya. Box eksternal dengan HDMI dapat menjadi jalur standardisasi tetapi fungsi power/input bergantung juga pada TV panel dan instalasinya.

Lab menguji profil exact perangkat sebelum dijual. Jika kontrol penuh tidak tersedia, pilih box/professional TV yang memenuhi atau tawarkan Compatible dengan batas. Hak root/exploit bukan strategi produk. Gagal uji tidak disembunyikan di balik label beta.

## 18 M11 Ticket knowledge dan incident

### 18.1 Tujuan dan operasi

Hotel/ISP membuat tiket melalui portal; support menerima konteks perangkat yang diizinkan serta bukti gangguan. L1 menguji power/remote/network sesuai kontrak, L2 GOJJA diagnosis aplikasi/CMS, L3 engineering memperbaiki kode. Provider menangani source/entitlement yang menjadi tanggungannya. Modul menjaga owner tunggal proses koordinasi meski resolver teknis berbeda.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR11-01 | P1 | Ticket memuat customer, lokasi/endpoint, dampak, waktu, kategori dan attachment aman | User tidak dapat melampirkan endpoint customer lain untuk membaca diagnosis |
| FR11-02 | P1 | Severity, queue, owner, status dan escalation tercatat | P1 incident memiliki manusia penanggung jawab dan next update |
| FR11-03 | P1 | Tautkan ticket ke incident/problem/provider tanpa menghilangkan tiket pelapor | Gangguan massal mempunyai incident induk dan komunikasi konsisten |
| FR11-04 | P1 | Human response, auto-ack, containment, resolution dan confirmation diukur terpisah | Balasan AI tidak memenuhi metrik human response |
| FR11-05 | P1 | Knowledge mempunyai scope, versi, provenance dan tanggal review | SOP partner privat tidak muncul pada jawaban tenant lain |
| FR11-06 | P1 | Request bug/configuration/change mempunyai klasifikasi dan jalur dispute | AI tidak memutuskan sendiri seluruh tiket sebagai pekerjaan berbayar |
| FR11-07 | P1 | Close/reopen memerlukan alasan dan evidence/konfirmasi sesuai policy | Chat selesai tanpa bukti tidak otomatis menjadi resolved incident |

### 18.2 Service window

Commercial Model mengusulkan dukungan manusia Senin–Jumat 09.00–18.00 WIB, dengan target respons berbasis jam layanan; bukan janji 24/7. Kalender, zona waktu, pause reason dan SLA schedule disimpan versioned setelah disahkan. Portal membedakan intake otomatis tersedia dari kehadiran teknisi. Service credit memerlukan bukti dan approval finance sesuai kontrak; tidak diposting agent karena keluhan saja.

## 19 M12 AI operations dan bantuan engineering

### 19.1 Batas P1

AI P1 merangkum tiket, mengklasifikasi, mengambil knowledge dan menyarankan diagnosis read-only. Input berasal dari ticket serta data yang memang boleh dibaca actor, setelah secret/PII redaction. Jawaban memuat sumber, uncertainty dan langkah eskalasi. Ticket/attachment/web content merupakan data tidak terpercaya, bukan instruksi sistem atau otorisasi tool.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR12-01 | P1 | Retrieval dan diagnosis read-only terikat scope ticket/user/service identity | Prompt meminta customer lain tetap ditolak pada tool dan retrieval |
| FR12-02 | P1 | Jawaban memisahkan fakta observasi, inferensi dan usulan | Ketika telemetry tidak cukup, AI menyatakan keterbatasan dan mengeskalasi |
| FR12-03 | P1 | Catat model/config version, sumber, tool calls, biaya dan hasil yang diverifikasi | Ringkasan AI dapat ditelusuri tanpa menyimpan credential mentah |
| FR12-04 | P1 | Evaluasi injection, secret leakage, salah scope dan hallucinated fix | Kasus kritis memblokir tool capability sebelum diaktifkan |
| FR12-05 | P2 | Tool tindakan allowlist memakai approval, expiry, dry run dan audit | Restart target memerlukan scope/izin; arbitrary shell serta bulk wipe tidak tersedia |
| FR12-06 | P2 | Patch assistant membuat branch/proposal, test evidence dan review request | Tidak dapat sign APK, merge protected branch atau promote production tanpa manusia |
| FR12-07 | P1 | Quota AI, timeout, fallback dan human handoff menjaga support tetap berjalan | Provider AI down tidak menutup intake tiket atau mengklaim resolved |

### 19.2 Siklus perbaikan

Ticket → reproduksi → diagnosis → patch proposal → review/test → technical approval → release pipeline → izin pemasangan pelanggan → health monitoring. Keputusan teknis manusia dan izin pelanggan tetap dua tahap. Pipeline memeriksa artifact provenance dan regression. Cost per confirmed resolution memasukkan inference, retrieval, tool execution, sandbox, evaluasi serta review manusia; pengurangan pekerjaan tidak disimpulkan hanya dari jumlah chat.

## 20 M13 Promosi hotel dan slot signage lokal

### 20.1 Slot aplikasi

Property publisher mengelola welcome video, promosi fasilitas serta informasi pada slot GOJJA. Target dapat berupa room/group atau shared display dengan profil sesuai. P1 berfokus pada media milik/berizin properti; bukan jaringan advertiser berbayar. Slot sebelum masuk Televisi dapat diusulkan, tetapi interupsi setiap ganti channel tidak menjadi default.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR13-01 | P1 | Definisikan slot, ukuran/media, durasi, priority dan fallback | Creative yang tidak sesuai slot ditolak sebelum publish |
| FR13-02 | P1 | Playlist memiliki schedule timezone lokal, validity dan target scope | Promosi berakhir tidak tayang lagi setelah validity yang dipercaya berakhir |
| FR13-03 | P1 | Frequency cap, skip/return behavior serta aturan sesi dapat dikonfigurasi | Channel change cepat tidak memicu loop iklan atau menutup akses menonton |
| FR13-04 | P1 | Preview audience dan konflik welcome/group/promo sebelum publish | Publisher melihat konten yang mengalahkan slot lain dan alasan prioritas |
| FR13-05 | P1 | Offline playback hanya memakai media umum valid yang lengkap terunduh | Aset corrupt dilewati; expiry/clock anomaly memakai fallback aman |
| FR13-06 | P1 | Shared display tidak membawa guest personalization | Lobby screen tidak menampilkan nama dari room assignment |
| FR13-07 | P1 | Playback reporting menyimpan technical play facts tanpa klaim audience | Dashboard tidak menyamakan satu play dengan satu orang melihat |

### 20.2 Batas pengalaman dan hak

Slot GOJJA tidak memberi hak menyisipkan iklan di stream atau aplikasi OTT pihak ketiga. Konfigurasi promosi tidak boleh menutup pesan kesalahan penting atau admin escape. Policy quiet hours serta sound diperiksa di properti. Nilai cap/durasi final ditentukan prototype dan uji tamu; aplikasi menyediakan pengaman, bukan kebebasan membuat layar tidak dapat dipakai.

## 21 M14 Integrasi PMS dan rekonsiliasi stay

### 21.1 Kontrak adapter

PMS adapter bersyarat setelah akses vendor, sandbox, izin data, mapping property/room dan kontrak tersedia. Mode manual tetap tersedia sebagai sumber operasi yang dikendalikan. External stay ID, assignment ID, source version dan effective time wajib dipisahkan; nama guest bukan primary key. Konektor pertama dipilih melalui discovery, bukan sekadar daftar nama sistem hotel.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR14-01 | P1C | Mapping property/room/external stay divalidasi sebelum menerima event live | Room tidak dikenal masuk exception queue, bukan ditebak dari label |
| FR14-02 | P1C | Check-in/out/room move/extend memakai version serta idempotency | Event lama tidak menghapus stay baru; duplicate move tidak menduplikasi assignment |
| FR14-03 | P1C | Field ownership dan conflict policy manual-vendor ditetapkan per property | Manual override mempunyai alasan, expiry dan hasil reconciliation yang terlihat |
| FR14-04 | P1C | Webhook/polling memverifikasi asal, replay window/cursor dan retry | Vendor outage tidak membuat event palsu atau retry tanpa batas |
| FR14-05 | P1C | Reconciliation menyediakan dry run, backlog dan exception review | Operator melihat perbedaan source tanpa automatic destructive overwrite |
| FR14-06 | P1C | Minimisasi nama/data sesuai tujuan dan retention property | Field identitas yang tidak diperlukan tidak disimpan atau diekspor |

PMS checkout tidak otomatis menetapkan Ready for Maintenance. Saat konektor down, UI menampilkan freshness serta prosedur manual, kemudian operator meninjau konflik ketika sync pulih. Status manual dan vendor tidak digabung berdasarkan timestamp jaringan semata.

## 22 M15 OTT resmi casting dan pembersihan sesi

### 22.1 Jalur bersyarat

OTT shortcut bukan paket lisensi. Casting memerlukan discovery serta isolasi kamar yang dibuktikan, dengan peran jaringan/receiver/vendor jelas. P1C dapat membuka app resmi yang tersedia dan diizinkan, tetapi kemampuan login/logout serta return ke GOJJA dicatat per profil. P2 memperluas casting setelah acceptance isolasi dan reset.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR15-01 | P1C | Katalog shortcut menyimpan package/deep link, vendor rights dan capability | App tidak tersedia menghasilkan pesan aman, bukan link instalasi sembarang |
| FR15-02 | P1C | Navigasi eksternal serta return diuji per remote/kiosk profile | Pengguna dapat kembali sesuai batas yang dipasarkan |
| FR15-03 | P1C | Session cleanup mempunyai support declaration dan verification | Logout unsupported tidak diberi badge clean; SOP staf dapat dipicu |
| FR15-04 | P2 | Casting pairing terikat assignment/stay dan token berumur terbatas | Tamu kamar A tidak menemukan/mengontrol receiver kamar B |
| FR15-05 | P2 | Checkout/reassign mencabut pairing dan menghapus data yang dikuasai | Token stay lama tidak berlaku untuk stay baru; pending reset terlihat |
| FR15-06 | P2 | Residence/Home mempunyai pilihan persistence owner dan network isolation | Tidak menjalankan checkout reset hotel pada perangkat household pribadi |

GOJJA tidak mengumpulkan password Netflix/layanan lain ke CMS. App/account approval provider, keamanan receiver serta hak komersial harus terpenuhi sebelum bundling. Kegagalan isolasi atau session cleanup kritis menunda fitur, bukan diluluskan sebagai keterbatasan visual.

## 23 M16 Ad network penawaran dan consent

### 23.1 Kontrak produk P2

Advertiser/GOJJA menyiapkan campaign; hotel meninjau creative, slot, periode, kategori dan manfaat lalu menerima/menolak. Approval hotel berlaku hanya untuk aset/scope yang dikuasainya. Household Residence/Home tidak diikutsertakan otomatis oleh building. Modul menghasilkan OfferAcceptance versioned dan eligible play facts untuk M22, bukan saldo dari counter tayang mentah.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR16-01 | P2 | Campaign menyimpan advertiser, creative version, kategori, wilayah, slot, periode, cap dan terms | Campaign belum approved tidak dapat ditayangkan walau aset sudah diunduh |
| FR16-02 | P2 | Portal hotel menyediakan accept/reject dengan benefit, tarif dan hak menghentikan tayang | Consent mencatat actor berwenang, versi terms dan effective time |
| FR16-03 | P2 | Material creative/terms change memerlukan approval sesuai policy | Persetujuan creative A tidak otomatis berlaku creative B |
| FR16-04 | P2 | Revoke/expiry menghentikan penayangan baru saat policy valid dapat diterapkan | Device offline memakai lease/expiry; tidak dijanjikan revoke instan tanpa koneksi |
| FR16-05 | P2 | Moderasi dan targeting tidak memakai nama guest atau profil anak | Advertiser tidak melihat guest list atau granular household viewing history |
| FR16-06 | P2 | PlayEvent memiliki event ID, creative, slot, assignment, duration, completion dan clock trust | Duplicate/replay/anomaly tidak menjadi eligible revenue ganda |
| FR16-07 | P2 | Reporting membedakan submitted, valid, eligible, rejected dan settled plays | Hotel dapat meninjau alasan koreksi sebelum periode settlement ditutup |

### 23.2 Pengaman komersial

Revenue share 50/50 pada Commercial Model adalah contoh H, bukan tarif final. Contract menentukan basis eligible revenue, potongan, bagian ISP bila ada, cutoff event, refund advertiser dan dispute. Semua bagian waterfall menjumlah menjadi 100 persen dari basis yang sama. Kredit invoice dan payout merupakan manfaat berbeda dan tidak dibayar dua kali. Proof of play tetap bukti teknis playback, bukan manusia melihat.

## 24 M17 Marketplace katalog order dan fulfilment

### 24.1 Scope bertahap

P2 dapat memulai referral/QR berlabel jelas atau permintaan layanan internal tanpa pembayaran. Transaksi penuh P2/P3 memerlukan merchant owner, katalog, ketersediaan, harga, payment, fulfilment, pembatalan, refund dan support. Kategori awal dipilih setelah operasi siap, misalnya layanan hotel, wisata, transportasi, laundry atau maintenance unit. Modul bukan syarat menonton Core.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR17-01 | P2 | Merchant/katalog menyimpan seller, service area, jam, kapasitas, harga dan eligibility | Penawaran di luar wilayah/waktu tidak dapat dipesan sebagai tersedia |
| FR17-02 | P2 | Referral membedakan click/lead/confirmed booking dari paid order | QR scan tidak menghasilkan GMV atau komisi terkonfirmasi |
| FR17-03 | P2 | Internal request memiliki target room/context, owner, status dan bantuan | Request stay lama tidak dikirim ke penghuni baru setelah reassignment |
| FR17-04 | P3 | Checkout menjelaskan penjual, penerima pembayaran, pembatalan dan fulfilment | Pengguna menyetujui terms version sebelum order dikonfirmasi |
| FR17-05 | P3 | Order dan payment state terpisah serta idempotent | Paid tidak otomatis Completed; callback duplikat tidak menggandakan order |
| FR17-06 | P3 | Cancel/refund/dispute mengikuti kontrak dengan evidence dan owner | Refund gagal tidak ditampilkan Refunded; partial refund direkonsiliasi |
| FR17-07 | P3 | Komisi/versioned fee dan settlement melalui M22 | Order Rp200.000 dengan fee 10% menghasilkan Rp20.000 fee sebelum biaya, bukan Rp200.000 revenue GOJJA |

### 24.2 Data dan ekosistem

Konektor ekosistem pariwisata GOJJA memerlukan kontrak API, persetujuan data, ID merchant dan rekonsiliasi. Tidak diasumsikan SSO, wallet atau payment balance bersama sudah ada. QR yang membawa konteks guest memakai token singkat dan scope minimum, bukan nama/tanggal stay dalam URL publik. Penjual yang tidak tersedia harus dapat menolak atau menawarkan pemulihan sesuai terms.

## 25 M18 Home profile dan B2C

### 25.1 Produk rumah P3

Household membeli software saja, bundle resmi atau hardware dengan aktivasi software terpisah. Owner memilih perangkat/anggota serta kendali pengguna. Harga Home, allowance, billing channel dan support konsumen harus disahkan dalam business case sebelum launch. Model minimum household disiapkan di P1; fitur konsumen tidak otomatis dibuka oleh feature flag tanpa gate.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR18-01 | P3 | Home onboarding tidak meminta PMS, room number atau checkout | Owner dapat memakai label lokasi sederhana sesuai kebutuhan |
| FR18-02 | P3 | Home menyajikan profil, channel/package dan layanan eligible | Paket hospitality tidak diwariskan sebagai hak konten rumah |
| FR18-03 | P3 | Pengaturan update, akses app dan preferensi milik pengguna sesuai kanal | Tidak ada kiosk hotel default atau remote reset dari pengelola gedung |
| FR18-04 | P3 | Checkout/payment mengikuti kanal distribusi dan terms konsumen | Store/external payment dipilih setelah policy review, bukan bypass otomatis |
| FR18-05 | P3 | Bantuan, cancel, device replacement dan refund memiliki alur konsumen | Pembelian box tanpa subscription aktif tidak diklaim sebagai household paid |
| FR18-06 | P3 | Family control membatasi fitur yang dikuasai GOJJA dengan recovery owner | Tidak mengklaim parental control atas semua app/OS tanpa capability |

Harga software-only Rp30.000 dan contoh biaya Rp6.000 pada Commercial Model adalah H untuk menghitung contribution, bukan penawaran Home. Hak olahraga/film, minimum provider serta beban support dapat mengubah produk. Olshop memerlukan fulfilment serta retur M21 sebelum penjualan umum.

## 26 M19 Household membership dan ownership

### 26.1 Hak pribadi

Household memiliki owner, anggota, device allowance, preferensi dan consent. Hubungan ke building/ISP tidak memindahkan ownership data pribadi. Owner terakhir tidak dapat dihapus tanpa transfer/recovery yang sah. Verifikasi email/nomor/credential dipilih saat spesifikasi identity; nomor seri hardware tidak menjadi bukti tunggal ownership.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR19-01 | P1 | Model customer dan relationship mendukung household tanpa role hotel | Seed/test entity household tidak diwarisi guest reset policy |
| FR19-02 | P3 | Invite/accept/remove member memiliki scope dan expiry | Undangan expired tidak menambah anggota; member tidak mengangkat diri menjadi owner |
| FR19-03 | P3 | Owner mengelola device, allowance dan pencabutan session | Device revoked tidak mengambil konfigurasi pribadi baru |
| FR19-04 | P3 | Ownership transfer memerlukan autentikasi serta acceptance penerima | Owner lama tidak mempertahankan admin token tanpa delegation sah |
| FR19-05 | P3 | Consent, privacy/export dan family preference berlaku pada akun pribadi | Building/ISP tidak dapat mengubah pilihan personal melalui tema atau billing |
| FR19-06 | P3 | Recovery memakai bukti akun dan audit anti takeover | Orang yang memegang box bekas tidak otomatis mengambil household sebelumnya |

## 27 M20 Residence building dan occupancy

### 27.1 Kontrak building dan penghuni

PropertyType tidak menentukan ExperienceProfile. Apartemen short stay dapat memakai Hospitality; long stay memakai occupancy dan hak building/household terpisah. Operator mengelola informasi, fasilitas dan aset yang memang dikuasai. Penghuni mengelola akun serta paket pribadi. Tagihan building dan household mempunyai pembayar serta entitlement masing-masing.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR20-01 | P1 | Model unit/profile mendukung perbedaan short stay, long stay dan shared display | Satu building dapat mempunyai beberapa profil tanpa scope data bercampur |
| FR20-02 | P2 | Move-in membentuk occupancy assignment melalui undangan/verifikasi | Building tidak menguasai akun penghuni hanya karena nomor unit cocok |
| FR20-03 | P2 | Building services dan personal package dipisah pada menu, policy dan invoice | Pembayar building tidak melihat payment pribadi penghuni |
| FR20-04 | P2 | Move-out mencabut layanan/akses yang terkait occupancy | Akun serta perangkat pribadi household tidak dihapus massal |
| FR20-05 | P2 | Reset aset operator dan update mengikuti kepemilikan serta capability | Perangkat milik penghuni memerlukan izin yang sesuai; checkout hotel tidak dipakai |
| FR20-06 | P2 | Perubahan profil unit membutuhkan review data, konten, ownership dan consent | Short stay ke long stay tidak membawa guest name atau kiosk lama otomatis |
| FR20-07 | P2 | Pengumuman layanan gedung dibedakan dari iklan komersial | Izin pengumuman tidak menjadi opt-in ad network pribadi |

Operator dapat menawarkan layanan atau campaign kepada penghuni, tetapi tidak menggantikan consent mereka atas layar pribadi. Akses vendor/install sementara berakhir sesuai delegation. Occupancy baru tidak mewarisi data penghuni lama; assignment version memblokir event move-out yang terlambat.

## 28 M21 Hardware commerce fulfilment dan RMA

### 28.1 Gate retail

P1 hardware milik hotel/ISP atau disediakan partner; registry device bukan toko hardware. P3 menambah order, serial, shipment, stock, warranty, retur serta seller responsibility. Box unified dapat membantu instalasi tetapi hanya SKU yang sudah disertifikasi boleh membawa klaim Managed. Logo pada kemasan bukan sertifikasi media atau izin provider.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR21-01 | P3 | Hardware SKU menyimpan exact model/firmware, seller, landed cost dan warranty terms | Pergantian model tidak memakai certification lama otomatis |
| FR21-02 | P3 | Order/payment/shipment/activation software memiliki state terpisah | Delivered belum berarti subscription aktif atau media telah lulus |
| FR21-03 | P3 | Serial tracking menghubungkan order, shipment dan device tanpa memberi akses akun | Serial yang tersebar tidak dapat dipakai mengambil ownership |
| FR21-04 | P3 | Retur/RMA memiliki eligibility, evidence, status, replacement dan owner biaya | Replacement tidak menambah seat; barang returned belum otomatis refunded |
| FR21-05 | P3 | Stock, shipping, fee, reserve warranty dan support masuk reporting contribution | Laba tidak dihitung hanya harga jual dikurangi harga beli |
| FR21-06 | P3 | Box bekas mempunyai unbind/purge serta aktivasi pemilik baru yang sah | Buyer baru tidak menerima household/stay history lama |

Sewa/pinjaman hardware membutuhkan kontrak aset tersendiri. Cancel software, cancel content dan retur fisik mengikuti line masing-masing. Marketplace eksternal memerlukan adapter/order reconciliation serta terms yang sesuai; tidak diasumsikan inventory nasional tersedia.

## 29 M22 Ledger revenue share dan settlement

### 29.1 Batas domain keuangan

Billing P1 di M02 menangani invoice software. M22 memperluas ledger untuk ad, commission, credit dan payout saat monetisasi dibuka. Finance menyetujui settlement; actor pembuat usulan dan reviewer transaksi berisiko dipisahkan. Modul harus dapat menelusuri uang, hak dan koreksi tanpa menghitung event mentah sebagai pendapatan final.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR22-01 | P2 | Versioned waterfall menyimpan basis eligible revenue, deduction, share dan periode | Semua bagian pada basis yang sama berjumlah 100%; perubahan tidak retroaktif |
| FR22-02 | P2 | Ledger memisahkan accrued, eligible, approved, settled dan reversed | Event duplikat tidak menggandakan accrual; correction merujuk record asal |
| FR22-03 | P2 | Invoice credit dan cash payout memiliki benefit ID yang tidak dapat dipakai dua kali | Kredit yang telah dipakai tidak dibayar lagi sebagai tunai |
| FR22-04 | P2 | Settlement statement memperlihatkan eligible/rejected/correction serta cutoff | Hotel dapat mengajukan dispute pada record yang ditentukan |
| FR22-05 | P2 | Verifikasi rekening, reviewer, pajak dan payment reference sebelum payout | Email perubahan rekening saja tidak memindahkan dana |
| FR22-06 | P3 | Komisi marketplace memakai order/fee/refund state yang benar | Refund sebagian mengoreksi fee sesuai terms, bukan menghapus history |
| FR22-07 | P2 | Rekonsiliasi cash gateway/bank, advertiser receivable dan payables | Status Approved tanpa transfer bank tidak disebut Paid Out |

Rekomendasi model accounting final, principal/agent dan perlakuan pajak memerlukan finance/legal review. GOJJA tidak otomatis mencatat GMV atau seluruh uang referral sebagai revenue. Sistem menyimpan decimal currency-safe, bukan floating point uang. Signing/payout secret dipisah dari agent AI serta portal konten.

## 30 M23 Policy consent dan authorization resolver

### 30.1 Kontrak lintas profil

Policy resolver menentukan tindakan efektif dari identitas, hubungan, software, konten, capability, profile dan consent. Policy bukan pengaturan visual. Approval update, persetujuan campaign, akses support dan persetujuan billing merupakan record berbeda. Model harus dapat menjelaskan alasan allow/deny tanpa membocorkan secret atau keberadaan customer lain.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR23-01 | P1 | Resolver menghitung irisan izin dengan provenance dan policy version | Feature flag tidak mengangkat hak yang ditolak kontrak/capability |
| FR23-02 | P1 | Delegation mempunyai actor/principal, scope, tujuan, expiry dan revoke | Credential valid tetapi delegation expired tetap ditolak |
| FR23-03 | P1 | Approval spesifik/standing menyimpan jenis tindakan, target dan kondisi | Izin minor update tidak menjadi izin factory reset |
| FR23-04 | P1 | Hierarki config per domain menetapkan field yang dapat di-override | Hotel dapat mengubah tema; tidak dapat menghapus safety/focus constraints |
| FR23-05 | P1 | Bulk action preview memuat audience, jumlah, exclusions dan required approvals | Scope berbeda atau stale preview memicu revalidation sebelum commit |
| FR23-06 | P2 | Consent campaign/support personal menyimpan terms/creative version dan expiry | Revoke menolak penggunaan baru pada resolver yang sudah menerima perubahan |
| FR23-07 | P1 | Deny decision dan konflik policy menyediakan reason code serta audit | Alasan aman dapat ditampilkan pada CMS tanpa enumerasi data lintas tenant |
| FR23-08 | P1 | Policy/context changes menginvalidasi cached permission sebelum tindakan berisiko | Job dengan expected version lama tidak langsung dieksekusi |

Bulk preview bukan otorisasi permanen. Worker memeriksa ulang scope saat berjalan. Kebijakan aplikasi tidak dapat memperluas privilege OS yang tidak dimiliki. Household consent pribadi tidak tunduk pada override building. TTL cache dan revocation latency harus diputuskan dan diukur sesuai risiko; operasi berisiko gagal aman ketika sumber izin tidak dapat dipercaya.

## 31 M24 Integration gateway API dan event delivery

### 31.1 Adapter contract

Adapter memuat capability declaration, owner, secret reference, sandbox/production settings, timeout, retry classification, schema version dan contract tests. Baseline P1 menyediakan mekanisme internal; tidak perlu public SDK. Provider/PMS/OEM/payment/merchant nyata baru aktif setelah akses serta pengujian. Nama vendor pada dropdown tidak sama dengan adapter siap pakai.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR24-01 | P1 | Semua connector memiliki registry/status serta health freshness | Belum configured tampil unavailable, bukan green health palsu |
| FR24-02 | P1 | Secret disimpan di secret manager dengan akses scoped serta rotation | Masked secret tidak dapat dikembalikan lewat export/config umum |
| FR24-03 | P1 | Webhook memverifikasi autentikasi/signature dan replay sesuai kemampuan vendor | Request palsu/duplikat tidak mengubah state bisnis |
| FR24-04 | P1 | Outbox serta consumer idempotency dipakai untuk transaksi penting | Commit domain tanpa pengiriman sesaat dapat diretry tanpa duplikasi |
| FR24-05 | P1 | Retry dengan backoff/jitter, attempt limit dan dead-letter queue | Vendor down tidak menyebabkan retry storm atau kehilangan exception |
| FR24-06 | P1 | Polling menyimpan cursor dan reconciliation bila webhook tidak tersedia | Restart worker melanjutkan proses tanpa memutar ulang efek finansial |
| FR24-07 | P1 | API versioning, pagination, validation dan optimistic conflict konsisten | Client lawas dalam support window mendapat respons yang terdokumentasi |
| FR24-08 | P2 | Public partner API/SDK baru dibuka dengan scope, quota, sandbox dan revocation | API key partner tidak membaca seluruh platform; contract tests lulus |

### 31.2 Connector lokal

Edge connector opsional untuk PMS/headend/cache jaringan lokal. Identitas, update, health dan support connector harus dikelola tersendiri. Jangan mengharuskan edge pada properti yang dapat bekerja langsung melalui cloud. Connector tidak memberi silent install pada TV dan tidak menjadi relay seluruh channel tanpa hak/desain kapasitas. Outbound secure connection diprioritaskan; akses LAN tidak dibuka sebagai proxy bebas.

## 32 M25 Analytics KPI dan decision dashboard

### 32.1 Fakta dan definisi

Analytics membaca fakta domain yang telah diotorisasi, bukan mengubah invoice atau entitlement. Owner melihat bisnis serta kualitas; partner melihat portofolio yang ditugaskan; property melihat operasi dan tagihan relevan; household melihat datanya sendiri. Guest name dan viewing history pribadi tidak menjadi dashboard bisnis default.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR25-01 | P1 | Dashboard membedakan customer/property/household, paid seat, assigned dan online | Tiga perangkat pada satu household tidak menjadi tiga pelanggan |
| FR25-02 | P1 | MRR, invoice, cash, receivable, credit dan churn mempunyai kamus metrik | Setup/hardware/GMV tidak dimasukkan MRR software |
| FR25-03 | P1 | Device, publish, update dan source health memakai denominator serta timestamp | Offline tidak dikeluarkan diam-diam untuk membuat success rate tinggi |
| FR25-04 | P1 | Cost to serve mencatat human time, AI, cloud/vendor dan property count | Cost report tidak menghitung gaji/support hour yang sama dua kali |
| FR25-05 | P1 | Filter lokasi/partner/plan/profile dan export menerapkan scope | Aggregate/drill-down tidak membocorkan customer lain |
| FR25-06 | P2 | Ad dan marketplace metrics membedakan play, eligibility, booking, GMV dan fee | QR clicks bukan paid orders; counter TV bukan payout final |
| FR25-07 | P1 | Data freshness, timezone, cohort dan definisi versi ditampilkan | Laporan dapat direkonsiliasi ke sumber dan periode aslinya |

### 32.2 Pengukuran pilot

Catat elapsed setup dan jam bantuan manusia per properti, install completion, ticket rate per 100 endpoint/per property, config applied latency, channel startup pada source uji, update healthy, retention serta collection. Pisahkan failure jaringan, provider, hardware dan aplikasi untuk diagnosis tetapi jangan menghapus dampak pelanggan. Survey usability hotel menguji tugas nyata, bukan hanya kesukaan pada gambar Home.

## 33 M26 Security privasi dan governance

### 33.1 Batas keamanan

Identity manusia, device dan service memakai credential berbeda. Tenancy enforcement berlaku pada database query, object storage, event payload, worker, export dan retrieval AI. Akun admin memerlukan autentikasi kuat serta audit. Tidak ada secret provider, token pairing atau signing key di media manifest umum. Data guest minimum dipisahkan dari telemetry dan billing.

| ID | Fase | Kebutuhan | Bukti penerimaan |
| --- | --- | --- | --- |
| FR26-01 | P1 | Authentication, session expiry, MFA untuk privileged role dan session revoke | Staff dicabut tidak melanjutkan aksi melalui session lama |
| FR26-02 | P1 | Tenant/scope authorization wajib pada setiap resource termasuk blob/job/export | Uji IDOR lintas tenant ditolak pada seluruh surface |
| FR26-03 | P1 | Device identity menggunakan key/token scoped yang dapat diputar dan dicabut | Cloned token lama atau RMA revoked tidak menerima konfigurasi baru |
| FR26-04 | P1 | Encryption transport/storage serta secret manager memiliki owner dan rotation | Tidak ada credential di URL/log/diagnostic bundle umum |
| FR26-05 | P1 | Audit append-only/tamper-evident untuk aksi berisiko dengan retensi yang disahkan | Actor, scope, before/after reference serta approval dapat ditelusuri |
| FR26-06 | P1 | Retention/deletion/export policy dibedakan per kelas data dan tujuan | Guest checkout tidak menghapus invoice; log retention tidak memperpanjang guest display |
| FR26-07 | P1 | File/content input divalidasi, disanitasi dan dibatasi | Upload palsu, script injection dan SSRF source URL ditangani tanpa membuka jaringan internal |
| FR26-08 | P1 | Security incident mempunyai containment, notification assessment dan manusia owner | Kebocoran scope menjadi release blocker dan tidak ditutup oleh auto-ack |
| FR26-09 | P1 | Backup/restore, key custody dan akses production diverifikasi melalui drill | Backup sukses tanpa restore test belum diterima sebagai recovery capability |
| FR26-10 | P1 | Dependency/security scanning dan protected release pipeline berlaku sejak awal | Build dengan isu kritis tanpa disposition sah tidak dipromosikan |

### 33.2 Data governance

Property menentukan tujuan guest personalization yang sah dalam batas kontrak; GOJJA tetap bertanggung jawab atas kontrol platform dan pemrosesan yang menjadi domainnya. Peran pengendali/prosesor, transfer data, vendor AI, privacy notice serta permintaan hak subjek data ditinjau sesuai transaksi dan UU Pelindungan Data Pribadi [I03]. PRD tidak menggantikan penilaian legal. TV bukan sistem penyimpanan identitas tamu lengkap.

Support access memerlukan tujuan/ticket, scope minimum, masa berlaku dan audit; impersonation tanpa label tidak diizinkan. Break-glass memerlukan alasan insiden dan review. Informasi pribadi di free-text/attachment perlu redaction dan pembatasan akses, bukan sekadar larangan menulis nama di field terstruktur.

## 34 Struktur layar UX dan design requirements

### 34.1 Portal pusat GOJJA

Navigasi utama mencakup Overview; Customers dan Relationships; Partners; Locations dan Endpoints; Product Catalog dan Subscriptions; Billing dan Collections; Fleet Health; Provider/Integrations; Content Templates; Releases dan Update Jobs; Tickets/Knowledge; Analytics; Audit dan Settings. Ads/Merchant/Settlement baru muncul bagi role serta fase yang sah. Menu yang belum diimplementasi tidak ditampilkan sebagai fitur produksi aktif.

| Surface | Layar inti | Aksi serta state penting |
| --- | --- | --- |
| Pusat bisnis | Customer list/detail, subscription, seat ledger, invoice detail | Draft/review/issued, quantity efektif, arrears, credit dan payment allocation |
| Pusat operasi | Fleet list/detail, certification, release/job detail | Desired/reported version, last seen, scope, approval dan recovery |
| Portal ISP | Portofolio property, installer assignment, seat pool, wholesale statement | Pelanggan ditugaskan, remaining allowance, installation evidence dan L1 escalation |
| CMS properti | Dashboard, rooms/stays/groups, brand/media, channel, devices | Preview audience, conflict, apply status, reset pending, maintenance readiness |
| Approval properti | Release note, impacted endpoints, window dan policy | Accept/defer, exclusions, expiry, changed context serta job stage |
| Support | Ticket list/detail, incident, knowledge, diagnostic view | Severity, manusia owner, evidence, safe AI recommendation serta audit |
| Residence/Home | Occupancy/member/device/package/consent | Building vs personal scope, invite, revoke, transfer serta recovery |

Detail customer harus mempunyai ringkasan identitas/relasi, kontrak, lokasi, perangkat, billing, support dan audit yang terhubung; jangan hanya daftar terpisah tanpa konteks. Detail device memuat assignment history, certification, actual mode update dan limitations. Invoice detail menghubungkan quantity snapshot, periode line, adjustment serta penerimaan kas.

### 34.2 TV information architecture

Hospitality Home menampilkan logo properti, sambutan aman, akses Televisi yang dominan, Informasi, Promosi dan Bantuan. Menu tambahan menggunakan entitlement. Live player mempunyai channel list/overlay dan Back yang dapat diprediksi. Guest settings hanya mengatur pilihan aman yang memang dikuasai aplikasi. Unpaired/Provisioning/Offline/Maintenance/Recovery memiliki desain khusus, bukan semua diberi modal error generik.

Residence memisahkan Layanan Gedung dan area pribadi household. Home memprioritaskan pilihan konten serta pengguna; pengaturan pribadi lebih luas. Shared display memakai playlist tanpa guest identity. Handheld web/QR melanjutkan konteks melalui token berumur terbatas, bukan mengekspos data personal dalam URL.

### 34.3 Brand dan accessibility

Gunakan arah Open Future [I04]: wordmark lowercase gojja dengan celah diagonal o, pasangan jj dan terminal diagonal. Palet brand baseline #0050F5, #4F3FE5, #7C35E0, #CA3596, #FF5E70; neutrals #10172F, #FFFFFF dan #F5F6FA. Logo tidak diketik ulang dari font UI dan tidak direka sebagai master produksi. Hotel dominan pada welcome; GOJJA dominan pada portal pusat. Hak white-label mengikuti kontrak.

Plus Jakarta Sans untuk heading dan Inter untuk UI merupakan arah guideline; file/versi/lisensi diverifikasi saat implementasi. Logo berwarna bukan satu-satunya sumber token status. Warna error/warning/success memakai teks/ikon pendamping dan diuji kontras. CMS memakai komponen konsisten untuk search, filter, form, table, empty state, loading, validation dan destructive action.

| ID | Kebutuhan UX | Acceptance |
| --- | --- | --- |
| UX01 | Fokus selalu terlihat, urutan D-pad stabil dan kembali ke konteks sebelumnya | Seluruh tugas guest Core selesai dengan remote standar tanpa trap |
| UX02 | Teks/controls TV diuji pada layar dan jarak nyata, bukan ukuran CMS | Pilot menguji keterbacaan menu, error dan status pada SKU target |
| UX03 | Kontras teks dan focus memakai target WCAG AA yang relevan dengan surface | Tidak ada warna brand terang dipakai sebagai teks kecil tanpa hasil pemeriksaan |
| UX04 | CMS keyboard, label form, error terkait field dan screen reader semantics tersedia | Form utama dapat dioperasikan tanpa mouse; error bukan warna saja |
| UX05 | Bahasa ID/EN dan string panjang mempunyai fallback/layout yang aman | Tidak ada label terpotong yang mengubah arti atau tombol hilang |
| UX06 | Splash 2–3 detik dan sonic 0,8–1,2 detik merupakan arah kreatif, dapat silent/reduced | Tidak menunda fungsi wajib atau berulang pada retry; final artwork sama dengan master |
| UX07 | Bulk, finansial dan perubahan scope menampilkan konsekuensi konkret | User melihat target, quantity, effective date dan required approvals sebelum commit |
| UX08 | Loading, empty, partial, stale, offline, permission denied dan unsupported dibedakan | Tidak ada empty table tanpa alasan saat sebenarnya scope ditolak atau data belum dimuat |

Ukuran font/focus/padding final ditetapkan Design System dan uji device, bukan diklaim universal dalam master ini. Sound startup tidak dipaksa ketika properti memilih silent. Informasi darurat TV hanya kanal tambahan; tidak menggantikan sistem keselamatan gedung.

## 35 Model data minimum dan lifecycle

### 35.1 Identitas dan ownership

Semua resource bisnis menggunakan ID stabil, scope/customer reference, created/updated actor, timestamps UTC dan version bila mutable. ID tidak menjadi bukti izin. Property menyimpan timezone IANA untuk jadwal dan billing account menyimpan timezone invoice sendiri. Jangan memakai nomor kamar sebagai globally unique key atau serial sebagai password. Foreign keys serta authorization tidak boleh menghubungkan resource tenant berbeda tanpa relation yang sah.

| Entitas | Field minimum konseptual | Invariant |
| --- | --- | --- |
| UserAccount/Membership | user ID, verified contact, auth ref, role, scope, status, expiry | Satu orang dapat beberapa scope; sesi bertindak jelas |
| CustomerAccount | type, legal/display identity, lifecycle, privacy/billing contacts | Organization berbeda dari household |
| PartnerRelationship | parties, type, scope, effective interval, approval, status | Reseller bukan otomatis pemilik data |
| Property/Unit/Endpoint | customer, location, timezone, type/profile, external refs | Unit dapat beberapa endpoint sesuai plan |
| Device | key/identity ref, SKU, firmware, OS, app versions, capability ref | Credential dapat dicabut; serial bukan akses akun |
| EndpointAssignment | device, endpoint, scope, active interval, assignment version | Assignment aktif tidak tumpang tindih |
| Stay/RoomAssignment | external/source refs, optional display name, locale, validity, version | Perpindahan room tidak menimpa history stay |
| GroupStay | label/media, membership assignments, validity, override rule | Target berdasarkan assignment yang sah |
| OccupancyAssignment | household, unit, building service scope, interval, consent refs | Berakhir tidak menghapus household pribadi |
| Subscription/PlanVersion | buyer, SKU/version, quantity, billing dates, allowances, status | Harga/hak historis immutable reference |
| SeatAllocation | pool/property, quantity/reservation, assignment refs, interval | Tidak ditagih dua kali pada pool dan alokasi |
| ProviderConnection/Contract | owner, use case, package, expiry, secret ref, capability | Secret tidak masuk media manifest umum |
| MediaAsset/Template/Publish | checksum, ownership, locale, versions, scope, validity, status | Snapshot publish tidak ditimpa |
| Release/Approval/UpdateJob | artifact, profile, policy/scope, expected versions, stage, attempts | Install memerlukan authorization serta eligibility terkini |
| Ticket/Incident/Knowledge | scope, impact, owner, severity, evidence, provenance | Public/private knowledge dibedakan |
| Invoice/Payment/Credit | account, period, line snapshots, currency, state, references | Posting dan correction dapat ditelusuri |
| Campaign/Play/Settlement | creative/terms, consent, event IDs, eligibility, waterfall, benefit ID | Play mentah tidak menjadi payout |
| Hardware/ServiceOrder | seller, items, fulfilment, payment/refund, warranties | Delivered/Paid/Completed berbeda |
| Audit/Consent/Retention | actor, purpose, scope, versions, effective/revoke, policy | Penggunaan baru mengikuti hak efektif |

### 35.2 State machines

| Entitas | Transisi utama | Pengaman |
| --- | --- | --- |
| Customer | Prospect → Trial → Active → Restricted/Closed | Closed bukan penghapusan invoice legal |
| Subscription | Trial → Active → Past Due → Grace → Suspended/Cancelled | Aktivasi paid memerlukan order; reinstatement direkonsiliasi |
| Assignment | Pending → Active → Ended/Revoked | Binding lama tidak mengambil konteks baru |
| Stay | Planned → In House → Checked Out/Cancelled | Room move memakai assignment/version, bukan re-open event lama |
| Occupancy | Invited → Confirmed → Active → Ended/Revoked | Bukan checkout harian dan bukan delete household |
| Publish | Draft → Approved → Scheduled → Active → Superseded/Retired | Manifest active dapat dilaporkan per endpoint |
| Provider connection | Draft → Validating → Active/Degraded → Expired/Disabled | Degraded source tidak menjadi credential bypass |
| Release | Draft → Tested → Technically Approved → Published → Paused/Retired | Artifact identity tetap |
| Update job | Pending Approval → Scheduled → Verified → Waiting → Installing → Health → Succeeded | Download/restart detail disimpan; gagal/cancel/expiry tercatat |
| Service order | Draft → Quoted → Awaiting Payment → Paid → Accepted → Fulfilment → Completed | Cancel/refund/dispute memiliki status dan bukti tersendiri |
| Settlement | Accrued → Eligible → Approved → Settled atau Reversed | Transfer bank dan adjustment dipisahkan |

### 35.3 Konsistensi dan transaksi

Transaksi database melindungi alokasi seat serta binding. Outbox berada pada commit bisnis yang sama bila event harus diterbitkan. Worker memegang lease dan idempotency reference; database constraint tetap pengaman akhir. Optimistic locking mengembalikan conflict dengan versi terbaru, bukan menimpa perubahan orang lain. Snapshot invoice/terms/manifest immutable setelah publikasi yang relevan; correction membuat record baru.

Migration mendukung versi aplikasi TV dalam support window. Field baru tidak langsung wajib bagi TV lama tanpa fallback. Data pribadi tidak disalin ke analytics warehouse tanpa purpose dan minimisasi. Detail schema/index/encryption diturunkan ke Technical Architecture; model konseptual ini wajib dipertahankan maknanya.

## 36 Kontrak API command dan event

### 36.1 Prinsip API

HTTPS adalah jalur otorisasi/data; WSS dapat memberi sinyal perubahan ketika app aktif tetapi bukan sumber kebenaran satu-satunya. Device reconcile melalui API setelah boot/reconnect. Setiap mutation penting menerima idempotency key dan expected version bila diperlukan. Response menyertakan correlation ID serta safe error code. Pagination, filter scope, request size, timeout dan rate limit konsisten.

Rute berikut adalah rancangan kontrak, belum API yang telah diimplementasi. OpenAPI dan AsyncAPI/event schemas menjadi deliverable teknis sebelum implementasi integrasi. Endpoint finance serta device menggunakan credential/scope berbeda.

| Area dan contoh rute | Input penting | Hasil serta aturan |
| --- | --- | --- |
| POST /v1/pairing-sessions | device public identity, app/capability observation | Short code/token expiry; belum assignment aktif |
| POST /v1/endpoint-assignments | code ref, endpoint, expected version, seat context | Binding/credential scoped setelah validasi dan transaksi |
| GET /v1/device-state | device identity, assignment, last applied version | Signed/authorized manifest references, context validity, desired version |
| POST /v1/device-acks | publish/job, stage, applied version, health, sequence | Dedup stage transition; ACK tidak mengubah invoice |
| POST /v1/stays dan /room-moves | property, source ID, room, context version, dates | Assignment baru/updated dengan conflict yang eksplisit |
| POST /v1/publishes | draft version, scope preview ref, validity | Publish immutable dan per-target status |
| POST /v1/releases dan /approvals | artifact ref atau policy/release, scope, window | Dua approval domain tidak dicampur |
| POST /v1/update-jobs | release, assignment, expected context, approval ref | Pending/scheduled sesuai capability; eligibility dievaluasi lagi |
| POST /v1/subscription-changes | order, quantity, effective date, expected version | Change ledger/prorata, bukan edit quantity posted tanpa history |
| POST /v1/payment-events | provider transaction, signature, invoice/order, amount | Inbox verification/dedup, allocation dan reconciliation |
| POST /v1/tickets/diagnostic-runs | ticket, scope, purpose, bundle type | Scoped job/bundle expiry; secret redaction |
| POST /v1/campaign-acceptances | campaign/creative/terms version, target, validity | Consent record; belum payout |

### 36.2 Event envelope

Envelope minimum: event_id, event_type, schema_version, occurred_at, received_at, producer, customer/scope reference, aggregate_id, aggregate_version, assignment_id/context_version bila relevan, correlation_id dan payload minimal. Timestamp bukan pengganti aggregate ordering. Device sequence dan clock trust diperlukan untuk telemetry/play; event finance memakai vendor reference serta nilai uang yang diverifikasi.

| Event | Consumer utama | Aturan pemrosesan |
| --- | --- | --- |
| EndpointAssigned/Revoked | Config, entitlement, monitoring | Binding version menentukan data yang dapat diterima |
| StayChanged/Ended | Personalization, reset, readiness workflow | Event akhir hanya berlaku pada stay/assignment yang dituju |
| PublishActivated | Device state service | Signal lalu fetch snapshot; received bukan applied |
| ReleasePublished/Paused | Rollout worker | Policy target dan technical approval diperiksa |
| UpdateHealthReported | Rollout, incident, analytics | Success memerlukan version/health; duplicate tidak menambah denominator |
| SubscriptionChanged | Entitlement dan billing | Effective date serta plan version menjadi sumber |
| PaymentVerified/Reconciled | Finance, entitlement | Satu transaksi tidak diposting dua kali |
| ConsentChanged | Campaign/policy/support | Revoke menolak penggunaan baru; offline latency diukur |
| PlayCompleted | Eligibility dan settlement | Dedup, cutoff, creative/consent version serta fraud check |
| OccupancyEnded | Building access, notification | Akun pribadi household tetap terpisah |

### 36.3 Error dan operabilitas

401 untuk credential tidak sah, 403 untuk scope/permission, 409 untuk conflict, 422 untuk input/domain invalid, 429 untuk quota/rate limit dan 5xx untuk kegagalan server menggunakan struktur yang konsisten. Detail reason_code bisa lebih spesifik: SeatUnavailable, ContextChanged, ApprovalExpired, CapabilityUnsupported, ProviderEntitlementExpired atau AssetInvalid. Response tidak menyebut keberadaan resource tenant lain kepada caller yang tidak berhak.

Retryable dan terminal error dibedakan. Dead-letter memerlukan owner serta replay action yang mengulang otorisasi dan idempotency. Replaying event lama tidak boleh menciptakan stay aktif baru atau payout ganda. Public SDK bukan deliverable P1; interface internal cukup sampai kebutuhan partner nyata terkonfirmasi.

## 37 Arsitektur aplikasi dan deployment requirements

### 37.1 Baseline teknologi

| Komponen | Baseline rancangan | Tanggung jawab produk |
| --- | --- | --- |
| TV app | Kotlin, Compose for TV, Media3 | Shell/remote, player, state, local cache dan telemetry |
| Portal web | React dan TypeScript | Pusat, ISP, properti serta household sesuai fase |
| Backend | NestJS dan TypeScript modular monolith | Auth/policy, katalog, stay, media, billing, device dan support |
| Data primer | PostgreSQL | Transaksi, relasi, versioning serta audit references |
| Queue/cache | Redis dan worker queue | Retry, job scheduling, lease, throttling dan event processing |
| Media/artifact | Object storage dengan akses scoped | Media hotel, manifest dan paket sesuai kanal |
| Store lokal TV | Room atau setara | Manifest valid, cache index, context lease dan antrean event |
| Adapter | Worker/gateway modular | PMS, provider, OEM, payment serta ecosystem APIs |
| AI service | Model/tool adapter yang dapat diganti | Retrieval, diagnosis/evaluation dan proposal sesuai izin |

Laravel bukan baseline backend. Versi framework/runtime dipilih, dipin dan diuji pada implementasi. Hindari memecah domain menjadi banyak microservice tanpa alasan beban/isolasi/operasi. CMS React tidak dipasang sebagai OS TV; ia mengirim konfigurasi melalui API yang dikonsumsi aplikasi TV native. Native mobile app serta SDK publik bukan komponen wajib P1.

### 37.2 Topologi cloud dan media

Cloud control plane mengelola identitas, desired state, manifest, approval, jobs, billing serta monitoring. Device menerima sinyal WSS lalu fetch/reconcile HTTPS, mengunduh media umum melalui delivery yang sah dan memainkan source live provider/headend langsung. Media plane tidak otomatis melewati compute/API GOJJA. Diagram pada versi Word/PDF memperlihatkan pemisahan ini.

Shared multi-tenant cloud menjadi default. Dedicated/partner-hosted membutuhkan kebutuhan, biaya, penanggung jawab backup/security serta upgrade cadence. Tidak boleh membuat fork kode bebas per ISP. Region dan data location diputuskan sebelum produksi berdasarkan kebutuhan hukum, latency dan layanan; jangan menetapkan lokasi tanpa keputusan.

### 37.3 Persyaratan deployment

Development, staging dan production memakai akun/secret/data terpisah. IaC, migrations, artifact provenance, protected approvals dan rollback/forward fix backend wajib disiapkan. Cloud deployment tidak memerlukan approval properti untuk setiap internal patch, tetapi pemberitahuan dampak dan maintenance mengikuti kontrak. Device install tetap mengikuti approval serta capability.

Backend harus kompatibel dengan TV dalam support window; retire API version memerlukan telemetry penggunaan, notice dan jalur upgrade. CDN/cache private tidak menyebarkan guest data. Object URLs scoped, short-lived sesuai risiko dan tidak menyimpan secret provider di public asset path. Offline delivery tidak menjadi alasan mengirim seluruh database customer ke device.

## 38 Nonfunctional requirements dan definisi pengukuran

### 38.1 Target kandidat

Semua angka berikut adalah R/H target validasi, bukan SLA atau benchmark yang sudah dicapai. Baseline performance diukur pada exact certified SKU, app/firmware, network/source uji dan dataset yang didokumentasikan. p95 menyertakan jumlah sampel serta window; hasil median saja tidak cukup.

| ID | Area dan target kandidat | Pengukuran dan batas |
| --- | --- | --- |
| NFR01 | D-pad response p95 <200 ms | Dari input key diterima aplikasi sampai fokus/frame berubah pada menu Core; bukan network playback |
| NFR02 | Cached Home siap ≤5 detik | Dari activity siap hingga menu interaktif dengan konfigurasi valid; boot OS dilaporkan terpisah |
| NFR03 | Channel startup p95 <5 detik | Dari select eligible source sampai first frame; pisahkan DRM, network dan source failures |
| NFR04 | Config apply ACK p95 ≤60 detik | App aktif online, payload kecil/aset tersedia; unduhan media besar dan offline dilaporkan terpisah |
| NFR05 | Managed update healthy ≥98% eligible jobs | Cohort eligible saat mulai install; gagal install/health tetap denominator, deferred/offline dilaporkan terpisah |
| NFR06 | Control plane SLO kandidat 99,5% per bulan | Synthetic checks serta error rate layanan kritis; ISP/provider/device tidak dijanjikan sama |
| NFR07 | Pilot business recovery RPO ≤24 jam, RTO ≤8 jam | Restore drill scope pilot dan backlog; bukan otomatis cukup untuk transaksi finance produksi |
| NFR08 | Financial production membutuhkan RPO/RTO yang disahkan lebih ketat | Tetapkan backup/PITR, gateway reconciliation serta downtime budget sebelum menerima transaksi material |
| NFR09 | Tidak ada isu tenant/guest/signature kritis terbuka | Negative test dan review security memblokir release |
| NFR10 | Cached umum dan manifest atomik tahan interruption | Kill/download/power test tidak mengaktifkan paket parsial atau guest context lama |
| NFR11 | Reconnect memakai jitter, backoff dan bounded local queue | Burst test tidak membuat API/queue gagal tak terkendali |
| NFR12 | Telemetry dan log dibatasi quota serta retention | Debug noise tidak memenuhi disk; secret/PII tidak menjadi label metrics |
| NFR13 | Web form/list utama responsif pada dataset uji yang disepakati | Kandidat p95 API baca sederhana <1 detik pada beban pilot; media upload/report berat terpisah |
| NFR14 | Compatibility support window ditetapkan sebelum launch | Daftar OS/SKU/firmware/build dipublikasikan internal; minSdk bukan dukungan semua model |
| NFR15 | Accessibility serta locale memenuhi UX01–UX08 | D-pad, keyboard web, contrast, font scaling yang relevan dan ID/EN diuji |
| NFR16 | Biaya operasi dapat dialokasikan ke endpoint/property/account | Usage, AI cost dan human time tersedia untuk model biaya tanpa double counting |

### 38.2 Beban dan skenario scale

Contoh H 1.000 device online dengan heartbeat 60 detik menghasilkan rata-rata sekitar 16,7 event/detik, sebelum retry. Ini input uji, bukan kebutuhan produk fixed atau bukti kapasitas. Heartbeat interval ditetapkan dari freshness dan biaya. Uji mencakup reconnect serentak, token renewal, publish ke seluruh cohort, queue backlog, export/report serta tenant denial. Load control plane dipisahkan dari bandwidth live TV yang berasal dari provider.

Kapasitas media ditentukan oleh ukuran aset unik, cache churn, download concurrency dan quota. Storage 5 GB usulan properti bukan 5 GB per device; cache device mempunyai budget sendiri. Pada scale, biaya tetap serta staffing dapat naik bertingkat. Tidak ada kesimpulan server murah menjamin operasi seluruh fleet.

### 38.3 Restore dan reliability

Backup database, metadata media, konfigurasi dan key custody direncanakan terpisah. Restore drill memverifikasi quantity, invoice, approval, assignment serta replay outbox. Lost telemetry berbeda dampaknya dari lost payment ledger. Sebelum production finance, owner menyetujui RPO/RTO dan reconciliation yang memadai; target pilot 24 jam tidak diwariskan diam-diam.

Health metrics mencakup crash/ANR, playback failure, manifest mismatch, pending reset, update failed stage, integration freshness dan unresolved severity. Semua severity kritis mempunyai stop condition dan manusia owner. Layar cached tidak membuktikan backend sehat, tetapi membantu pengalaman dasar saat cloud terganggu.

## 39 Offline recovery dan data lifecycle

### 39.1 Kelas data dan kebijakan

| Kelas data | Penyimpanan lokal | Perilaku saat tidak dapat divalidasi |
| --- | --- | --- |
| Shell/template/media umum | Cache versioned dan quota | Pakai last known valid yang belum melanggar expiry; fallback bawaan bila rusak |
| Channel map | Versi dan metadata minimum | Tampilkan hanya hak yang masih valid; source internet tetap butuh koneksi |
| Guest personal display | Minimum, protected, lease/expiry/context version | Redact pada boot/rebind/uncertain context; fallback welcome umum |
| Provider credential/token | Token scoped sesuai adapter, bukan secret global | Refresh sesuai hak; gagal auth tidak di-bypass |
| Approval/update job | Reference, window, expiry dan expected versions | Jangan install bila izin/context/readiness tidak dapat dipercaya |
| Telemetry/play events | Antrean bounded dengan event ID dan clock trust | Kirim ulang dengan dedup; late/ineligible play dapat ditolak |
| Household preferences | Cache sesuai ownership dan privacy | Tidak dihapus karena hotel checkout; perubahan member/akses direkonsiliasi |
| Finance ledger | Server sebagai sumber, offline bukan otorisasi posting | Tidak membuat saldo/payout final dari event lokal semata |

### 39.2 Waktu dan freshness

UTC untuk penyimpanan, timezone lokasi untuk tampilan/jadwal dan timezone billing untuk periode invoice. Server time terakhir serta monotonic elapsed time membantu lease dalam sesi yang sama; reboot atau clock jump menurunkan trust. Jangan memakai jam device sebagai satu-satunya alasan memperpanjang guest welcome, campaign consent atau content rights.

Durasi personal context lease, readiness freshness, config stale threshold, offline entitlement grace, token expiry, local log retention dan revocation latency adalah keputusan produk/security yang harus ditetapkan sebelum fitur terkait diterima. Jika belum disahkan, perilaku berisiko menggunakan fallback paling terbatas dan status not ready, bukan nilai placeholder yang dianggap kebijakan final.

### 39.3 Power dan crash recovery

Unduhan memakai temporary file, checksum, commit manifest atomik dan cache eviction yang tidak membuang last known valid sebelum pengganti siap. Database lokal/migration diuji dengan process kill serta listrik putus terkontrol. Reboot melaporkan applied/health state dan tidak mengulang command efek samping karena belum menerima ACK. Pending install/purge tidak dianggap selesai sampai bukti relevan tersedia.

Aplikasi tidak dapat mempertahankan daya saat kartu kamar memutus listrik, menjamin HDMI input benar pada seluruh panel, atau membatalkan installer OS di tengah proses. Hardware/adapter dan SOP staf melengkapi software. Jika recovery membutuhkan tindakan lapangan, job menyebut owner, langkah dan dampak; bukan retry tanpa batas.

### 39.4 Retention dan penghapusan

Stay end menghentikan personal display dan memicu purge sesuai purpose. Retensi operasional/keuangan/legal tidak otomatis sama dengan retensi nama di TV. Usulan 30 hari diagnostic log di Commercial Model bukan izin menyimpan guest personal selama 30 hari. Hapus/revoke pada device offline dilaporkan pending; setelah reconnect gunakan assignment version untuk mencegah data lama hidup kembali. Privacy request tidak menghapus seluruh invoice sah tanpa assessment.

## 40 QA acceptance dan traceability

### 40.1 Strategi verifikasi

Pengujian mencakup domain rules, API authorization, transaksi/race, adapter contract, end-to-end web–backend–device, device lab, privacy lifecycle, performance, recovery dan user acceptance. Unit test menargetkan keputusan bisnis penting, bukan hanya menyalin kode. Emulator tidak menggantikan remote/decoder/HDMI/power pada hardware nyata. Setiap hasil memuat versi, lingkungan, input, expected/actual, evidence, denominator dan pemilik keputusan.

Developer/QA menghubungkan setiap FR ke test case terperinci dalam test management. Tabel UAT berikut adalah skenario lintas modul dan release blockers, bukan pengganti seluruh tes per baris FR. Requirement fase masa depan diberi Deferred by Phase, bukan Passed. P1C diberi Not Enabled bila vendor belum siap; tidak dipasarkan sebagai lulus.

### 40.2 Acceptance lintas domain

| ID | Skenario dan modul | Hasil yang harus dibuktikan |
| --- | --- | --- |
| UAT01 | Partner mengakses customer lain, M01 M23 M26 | Ditolak pada API, media, export, worker dan tool AI |
| UAT02 | Installer scope expired, M01 M03 | Binding baru ditolak meski halaman CMS masih terbuka |
| UAT03 | Pairing code reused/expired, M03 | Tidak ada binding atau credential tambahan |
| UAT04 | Dua aktivasi memakai seat terakhir, M02 M03 | Satu commit; tidak ada over-allocation |
| UAT05 | RMA device lama kembali online, M03 M26 | Token/assignment lama tidak mengambil data atau hak baru |
| UAT06 | Property 8 TV dan minimum quote 10, M02 | 8 assigned dan 2 reserved; tidak ada perangkat palsu |
| UAT07 | Pool 1.000, assigned 950, online 700, M02 M25 | Invoice committed 1.000 jika order sah; allocation tidak ditagih lagi |
| UAT08 | Tambah 20 pada 16 November, M02 | Prorata Rp150.000 pada contoh; December true-up tidak double bill |
| UAT09 | Webhook duplicate/partial payment, M02 M24 | Satu receipt; partial allocation dan saldo invoice benar |
| UAT10 | Invoice issued perlu koreksi, M02 | Credit/adjustment merujuk asal; bukan overwrite |
| UAT11 | Trial habis tanpa paid acceptance, M02 | Tidak auto-charge atau menghitung sebagai paid MRR |
| UAT12 | Media corrupt/storage rendah, M04 M05 | Last known valid tetap dipakai; error jelas |
| UAT13 | Editor tidak punya publish role, M05 M23 | API publish ditolak; draft tetap dapat disimpan sesuai izin |
| UAT14 | Publish ke subset kamar, M05 M06 | Preview dan applied targets tepat; received bukan applied |
| UAT15 | Corporate group dan individual override, M06 | Audience, bahasa, prioritas serta expiry sesuai preview |
| UAT16 | Manual check-in tanpa PMS/nama, M06 | Welcome umum/manual berfungsi tanpa field identitas wajib |
| UAT17 | Room move duplicate/conflict, M06 | Assignment konsisten; kamar tujuan aktif tidak ditimpa diam-diam |
| UAT18 | Checkout A setelah check-in B, M06 M14 | B tidak terhapus atau ditutup event lama |
| UAT19 | Boot offline sesudah stay end yang belum tersinkron, M04 M06 | Personal display tidak dipulihkan tanpa validasi policy; fallback umum |
| UAT20 | Provider token/contract expired, M07 | Channel tidak berhak ditolak walau software paid |
| UAT21 | Satu source gagal dan source lain sehat, M04 M07 M08 | App tetap berjalan; klasifikasi gangguan tidak disamaratakan |
| UAT22 | Heartbeat masuk tetapi panel TV tidak diketahui, M08 | Tidak mengklaim panel menyala atau tamu menonton |
| UAT23 | Update tanpa approval pelanggan, M09 M23 | Tidak menjalankan installer |
| UAT24 | Checkout tetapi belum Ready for Maintenance, M06 M09 | Update menunggu readiness; checkout saja tidak cukup |
| UAT25 | Check-in/rebind baru menjelang install, M03 M06 M09 | Eligibility/context version diuji ulang; job lama ditahan |
| UAT26 | Approval expired/device reconnect terlambat, M09 | Tidak install di luar window; menunggu izin/jadwal sah |
| UAT27 | Signature/hash/package salah, M09 M26 | Paket ditolak dan insiden tercatat sebelum install |
| UAT28 | Installer sukses tetapi app health gagal, M09 | Tidak dihitung healthy; pause cohort sesuai stop condition |
| UAT29 | Power loss saat download/install, M09 M10 | Recovery sesuai profile/runbook; tidak menjanjikan rollback universal |
| UAT30 | Kiosk dan remote Settings/Home/input, M10 | Hasil sesuai exact capability; mode screen pinning tidak disebut Managed penuh |
| UAT31 | AI menerima injection/secret dalam ticket, M11 M12 M26 | Tool scope tetap; secret tidak keluar di jawaban/log umum |
| UAT32 | AI mengusulkan patch/deploy, M12 M09 | Branch/test/review; tidak sign atau promote tanpa technical approval |
| UAT33 | Auto-ack ticket, M11 M25 | Tidak memenuhi human response/resolution metric |
| UAT34 | Promo channel switching cepat, M13 | Cap berlaku, tidak loop interstitial atau menyisip ke stream OTT |
| UAT35 | PMS out of order dan manual override, M14 | Reconciliation memakai source/context rules; stale event tidak menang |
| UAT36 | Casting/session cleanup antar kamar, M15 | Tidak membuka receiver/sesi kamar lain; unsupported cleanup terlihat |
| UAT37 | Creative berubah/consent revoked, M16 M23 | New play mengikuti creative/terms/lease sah; tidak memakai approval lama diam-diam |
| UAT38 | Duplicate/clock anomaly PlayEvent, M16 M22 | Eligibility menolak/dedup, revenue tidak ganda |
| UAT39 | Credit invoice sudah digunakan lalu payout diminta, M22 | Benefit ID mencegah pembayaran kedua |
| UAT40 | Order paid tetapi merchant belum menerima, M17 | Tidak disebut completed; bantuan/refund mengikuti terms |
| UAT41 | Move-out Residence, M19 M20 | Building access berakhir; akun/perangkat pribadi tidak dihapus |
| UAT42 | Short stay menjadi long stay, M20 M23 | Profile change meninjau ownership, personal data, provider rights dan reset policy |
| UAT43 | Home revoke member/transfer ISP, M18 M19 | Hak pribadi konsisten; tidak menerapkan checkout/kiosk hotel default |
| UAT44 | Cancel subscription dan retur box, M02 M21 | Efek software/content/hardware terpisah; replacement tidak menambah seat |
| UAT45 | Restore backup dan replay outbox, M24 M26 | Assignment/invoice/approval pulih sesuai target; efek bisnis tidak duplikat |
| UAT46 | Reconnect 1.000 device pada skenario uji, M08 M24 | Rate limit/backoff bekerja; backlog/failure terukur dan pulih |
| UAT47 | Privacy export/delete request, M26 | Scope, purpose, retention dan pending offline purge jelas |
| UAT48 | Remote UI dan ID/EN, M04 M05 | Core dapat dipakai dengan D-pad, focus/contrast/layout lulus |

### 40.3 Traceability kebutuhan pengguna

| Kebutuhan awal | Requirement utama | Bukti UAT atau gate |
| --- | --- | --- |
| Premium, brand hotel dan menu custom | FR04, FR05, UX | UAT12–15 dan UAT48 |
| Channel pusat dan provider berbeda | FR01, FR07, FR24 | UAT01, UAT20–21, G2 |
| Download/install mandiri oleh hotel/ISP | FR03, FR10 | UAT02–05 dan exact profile evidence |
| Power kartu kamar lalu welcome | FR04, FR10, recovery | UAT29–30, G1; bukan klaim universal |
| Update atas approval hotel saat kamar siap | FR06, FR09, FR23 | UAT23–29 |
| Corporate welcome dan nama guest opsional | FR06, FR14 | UAT15–19 dan UAT35 |
| Tidak punya PMS tetap dapat bekerja | FR06 | UAT16–19 tanpa connector |
| Lock settings tamu | FR04, FR10 | UAT30 hanya pada kemampuan yang terbukti |
| Subscription, invoice, lokasi dan lisensi pusat | FR01, FR02, FR25 | UAT06–11 dan reconciliation |
| ISP margin sendiri serta direct customer | FR01, FR02, Commercial policy | UAT01, UAT07 dan transfer acceptance |
| OTT/casting add-on resmi | FR07, FR15 | UAT20, UAT36 dan provider/device gate |
| Iklan diterima hotel dengan manfaat | FR13, FR16, FR22 | UAT34, UAT37–39 |
| Ekosistem marketplace pariwisata/property | FR17, FR22, FR24 | UAT40 dan merchant/settlement gate |
| Apartemen dan Home/B2C/olshop | FR18–21, FR23 | UAT41–44, G6/G7 |
| AI tiket, perbaikan dan approval teknis | FR11, FR12, FR09, FR26 | UAT31–33 |

### 40.4 Strategi lab dan pilot

Inventaris lab memilih kandidat dari device aktual calon ISP/property: TV Android existing, box standardisasi dan managed/professional candidate bila tersedia. Jumlah model tidak menggantikan exact certification. Uji remote, full AC cycle, sleep/wake, input/CEC, network loss, crash, storage penuh, decoder/DRM, installer serta purge. Rencana power-cycle/soak menentukan jumlah sampel setelah SKU dipilih; hasil tidak diekstrapolasi sebagai reliabilitas seluruh pasar.

Pilot awal disarankan 1–2 properti dengan batch kamar terbatas, bukan langsung seluruh pool 1.000 TV. Catat room types, concurrency source, shift front office, kemampuan installer dan incident. Go/no-go ditetapkan dari critical tests, usability tasks, support ownership, cost evidence serta batas komersial yang diterima. Known limitations harus muncul di matrix dan materi sales.

### 40.5 Release blockers dan definisi selesai

Blocker mencakup kebocoran tenant, salah guest/household, signature bypass, install tanpa izin, finance effect ganda, sesi casting lintas kamar, kehilangan hak pribadi, atau recovery tanpa prosedur yang dapat dijalankan. Setiap fitur selesai bila requirement/test/evidence terhubung, API serta UI state konsisten, observability tersedia, runbook dan ownership ada, migration/recovery diuji, serta limitations tercatat. Desain layar selesai bukan fitur produksi selesai.

## 41 Delivery plan dependensi dan gate

### 41.1 Epic implementasi awal

| Epic | Scope dan hasil | Prasyarat serta acceptance |
| --- | --- | --- |
| E01 Identity tenancy policy | M01, M23, M26 fondasi | Negative auth tests sebelum data customer live |
| E02 Property endpoint pairing | M03 dan model M10 | Seat contract, scope, preflight dan RMA lulus |
| E03 TV shell cache | M04 dan offline umum | Remote navigation, cached Home dan safe boot |
| E04 Brand content publish | M05 dan M13 | Preview, immutable manifest, applied ACK dan corrupt recovery |
| E05 Source channel | M07 M24 | Source resmi, contract/use case serta sample playback |
| E06 Manual stay group | M06 | Context version, lifecycle, room move dan offline privacy |
| E07 Fleet monitoring | M08 M25 | Freshness dan meaningful metrics tanpa private viewing data |
| E08 Update approval | M09 dan M10 bersyarat | Technical/customer approval, readiness serta recovery |
| E09 Seats finance | M02 | Quantity, prorata, invoice correction dan payment reconciliation |
| E10 Ticket AI terbatas | M11 M12 | Scope retrieval, redaction, escalation serta evaluasi |
| E11 Reliability security | M26 lintas epic | Backup restore, secrets, audit, pipeline dan incident |
| E12 Pilot certification | Lintas semua epic | Device matrix, UAT evidence, support owner dan actual cost |

E01/E11 dimulai sejak awal. Vertical slice pertama sebaiknya membuktikan property → pair device → publish Home/channel → applied health → manual stay → checkout → update approval pada source/perangkat yang sah. Backend billing dapat dibangun paralel secara implementasi tim, tetapi acceptance aktivasi tetap memakai entitlement yang benar. Tidak ada kebutuhan mempekerjakan tim untuk seluruh P2/P3 sebelum P1 terbukti.

### 41.2 Gate keputusan

| Gate | Bukti yang diperlukan | Keputusan produk |
| --- | --- | --- |
| G0 kebutuhan | Calon property/ISP, masalah, willingness to pilot dan PIC | Lanjut discovery terarah |
| G1 perangkat | Exact SKU, install, launcher/control, power dan recovery | Certified profile dan batas penawaran |
| G2 source | Provider contract/access, use case, test playback serta biaya | Channel/source apa yang dapat dijual |
| G3 platform | Tenant isolation, pairing, privacy, finance, backup dan approval | Izin pilot terbatas |
| G4 hospitality pilot | UAT, operator tasks, incident, support dan cost actual | Launch Core terbatas atau perbaiki |
| G5 scale operasi | Load/reconnect, staffing, collection, partner quality dan margins | Perluas fleet bertahap |
| G6 Residence | Ownership, occupancy, move-out dan split billing/data | Pilot hunian berizin |
| G7 Home dan retail | Content rumah, payment channel, user control, fulfilment/retur dan economics | Buka B2C/olshop sesuai scope |
| G8 monetisasi | Consent, merchant/advertiser, proof, ledger, dispute dan payout | Aktifkan kategori campaign/marketplace tertentu |

G8 adalah gate turunan Master PRD untuk monetisasi, melengkapi gate G0–G7 Blueprint; bukan perubahan arti gate terdahulu. Kegagalan G7 menunda Home tanpa otomatis menghentikan Hospitality yang layak. P1C boleh dirilis per capability setelah G1/G2 terkait; tidak harus seluruh vendor serentak.

### 41.3 Estimasi dan sumber daya

Foundation menyebut hipotesis 14–22 minggu untuk rangkaian awal discovery–pilot; itu bukan tanggal atau estimasi seluruh master scope. Rencana delivery baru dibekukan setelah G1/G2 dan backlog P1 memiliki person-week, vendor lead time, risk buffer serta capacity nyata. Fungsi yang diperlukan: product/BA, Android/device, backend, frontend, UX, QA/integration lab, DevOps/security, partnership, finance dan support. Fungsi dapat dirangkap; pemisahan approval serta ownership tetap jelas.

Deliverable turunan mencakup Phase 1 PRD, UI Design System/prototype, Technical Architecture, API/data specification, Device Certification Matrix, Provider/PMS adapter specifications, QA/Release Plan, Support Playbook dan pricebook/contract schedules yang disahkan. Master PRD menjadi pengikat traceability, bukan alasan menghilangkan dokumen operasional tersebut.

## 42 Risiko keputusan terbuka dan change control

### 42.1 Risk register

| Risiko | Dampak produk | Kontrol dan pemilik fungsi |
| --- | --- | --- |
| TV existing tidak mendukung managed | Lock/update/power tidak memenuhi positioning | Device owner: certification dan pilihan Compatible/box |
| Provider belum memberi akses/hak | Channel tidak dapat diputar/dijual sah | Partnership: G2 sebelum klaim integrasi |
| Guest context stale offline | Nama atau session milik stay lama | Product/security: lease, redaction, assignment version dan UAT |
| Checkout disamakan kamar kosong | Update mengganggu check-in/tamu | Ops/product: readiness, freshness dan recheck |
| Billing memakai online count | Revenue dan invoice keliru | Finance/backend: seat ledger serta reconciliation |
| Reseller dianggap pemilik data | Customer/household terekspos | Security: relationship scope dan transfer workflow |
| Rumah diperlakukan seperti hotel | Reset/kiosk menghilangkan kendali owner | Residence/Home owner: profil dan ownership policy |
| AI diberi tool berlebih | Data bocor, salah patch, gangguan produksi | Technical/security: allowlist, evaluation dan human approval |
| Banyak property kecil murah | Support melampaui margin | Business/ops: cost to serve dan policy Commercial Model |
| Campaign membayar play palsu | Sengketa serta kerugian settlement | Monetization/finance: dedup, eligibility dan reconciliation |
| Store/OEM policy berubah | Distribusi/update tidak sesuai janji | Release owner: review kanal serta revalidation |
| Semua roadmap masuk P1 | Core terlambat dan investasi membesar | Product owner: phase freeze dan gate per ekspansi |

### 42.2 Decision register sebelum implementasi terkait

| ID | Keputusan yang harus ditetapkan | Status serta pemilik usulan |
| --- | --- | --- |
| DR01 | Exact TV/box SKU, firmware dan support window pertama | V; Android/device dan calon ISP |
| DR02 | Jalur distribusi app, developer identity/package serta updater per SKU | V; release/security/OEM |
| DR03 | Provider/source pertama, rights/use case dan commercial integration | V; partnership/business |
| DR04 | Hotel pilot, batch endpoint, PIC dan acceptance scope | R/V; product/ops/partner |
| DR05 | Harga final, Core feature schedule, quota, minimum dan trial | R/H; business/finance |
| DR06 | Billing terms, approval exception, pajak dan kanal penerimaan awal | R/V; finance/legal |
| DR07 | Personal context lease, readiness freshness dan guest retention | R/V; product/security/property |
| DR08 | Offline entitlement grace, cache expiry serta revocation latency | R/V; product/security/content owner |
| DR09 | Maintenance readiness authority, window, standing approval dan stopping rules | R/V; property/technical owner |
| DR10 | Canary size, health observation window dan eligible denominator detail | R; QA/release setelah lab |
| DR11 | Support window, severity target, SLA add-on dan service credit | R; ops/finance/legal |
| DR12 | Region, data processing roles, vendors dan privacy notice | V; business/security/legal |
| DR13 | Financial production backup/PITR serta RPO/RTO | R/V; finance/DevOps sebelum uang material diproses |
| DR14 | AI provider/BYoK, retention, budget, tools dan evaluation set | R/V; technical/security/finance |
| DR15 | First PMS/OTT/casting adapter serta cleanup proof | V; integration/device/vendor |
| DR16 | Master logo vector, icon, motion/audio dan Design System detail | Arah K, aset V; brand/design |
| DR17 | Residence ownership/billing dan operator pilot | R/V; business/product |
| DR18 | Home price, device allowance, store billing serta consumer support | Terbuka; Home business owner |
| DR19 | Hardware seller, warranty, fulfilment, retur serta working capital | Terbuka; hardware/finance |
| DR20 | Ad waterfall, cap/skip, fraud cutoff, commission dan payout terms | H/R; monetization/finance/legal |

Keputusan terbuka tidak menghentikan pekerjaan independen seperti model domain, mockup state atau interface adapter. Namun fitur yang bergantung pada nilainya tidak dinyatakan production ready dengan default asumtif. Owner merekam pilihan, evidence, tanggal, scope, requirement serta dokumen kontrak yang terpengaruh.

### 42.3 Change control dan baseline

P1 baseline freeze memuat daftar FR/NFR/UX, vendor/SKU enabled, exclusions, target kualitas dan known limitations. Change request menyebut problem, alternatif, dampak biaya/jadwal/privasi/kontrak serta test yang berubah. Product owner memutuskan scope; technical owner memutuskan kelayakan teknis; finance/legal meninjau bidangnya. Approval PRD bukan approval deploy produksi.

Perubahan editorial menggunakan patch; perluasan kompatibel minor; perubahan material pada kepemilikan/hak/model produk memerlukan major/review. Penguncian versi tidak berarti seluruh parameter DR sudah disahkan. Requirement retired tetap dapat dilacak. Setiap release menghubungkan product baseline, build, migrations, device profile dan evidence.

## 43 Referensi glosarium dan riwayat versi

### 43.1 Dokumen internal

- [I01] GOJJA SmartTV Product Foundation and Feasibility v1.0, 23 Oktober 2026. Acuan masalah, feasibility, hipotesis Core, perangkat, source dan pilot.
- [I02] GOJJA SmartTV Master Product Blueprint and Grand Design v1.0, 23 Oktober 2026. Acuan M01–M26, multi-profile domain, arsitektur, G0–G7 serta benchmark GMEDIA/Smartiv.
- [I03] GOJJA SmartTV Commercial and Operating Model v1.0, 23 Oktober 2026. Acuan pricebook usulan, seat/billing, support, partner, SOP, acceptance komersial dan model biaya.
- [I04] GOJJA Design and Brand Guideline v1.0, 23 Oktober 2026. Acuan Open Future, palet, wordmark, co-branding dan motion/sonic direction. Master vector/aset produksi belum dinyatakan selesai.

Master PRD menurunkan baseline tersebut menjadi requirement. Jika parameter komersial masih R/H pada [I03], kemunculannya dalam PRD tidak mengubahnya menjadi tarif kontrak. Nama provider/kandidat pada [I01]/[I02] tetap V sampai akses, kontrak dan pengujian tersedia.

### 43.2 Sumber resmi teknis

Sumber berikut diperiksa 23 Oktober 2026. Aturan platform dapat berubah; release owner memeriksa applicability terhadap SKU, negara serta kanal sebelum distribusi. Rancangan GOJJA dan angka target tidak diklaim sebagai hasil dari vendor.

- [S01] Android Developers. TV app quality. https://developer.android.com/docs/quality-guidelines/tv-app-quality — acuan remote navigation, experience dan kualitas TV. Kesesuaian GOJJA perlu diuji sendiri.
- [S02] Android Developers. Digital rights management. https://developer.android.com/media/media3/exoplayer/drm — konfigurasi DRM serta kombinasi format yang didukung; bukan izin komersial provider.
- [S03] Google Play Console Help. Device and Network Abuse. https://support.google.com/googleplay/android-developer/answer/16559646?hl=en — pembatasan self-update serta executable code pada distribusi Play.
- [S04] Android Developers. Android developer verification guides. https://developer.android.com/developer-verification/guides dan FAQ https://developer.android.com/developer-verification/guides/faq — rollout wilayah/participating stores dan registrasi developer; applicability device/distribusi tetap diverifikasi.
- [S05] Android Developers. Task scheduling. https://developer.android.com/develop/background-work/background-tasks/persistent — persistent work, constraints dan scheduling; bukan jaminan eksekusi tepat detik.
- [S06] Android Developers. Lock task mode. https://developer.android.com/work/dpc/dedicated-devices/lock-task-mode — allowlisting DPC serta batas mode terkelola; tidak membuktikan provisioning universal Android TV.

### 43.3 Glosarium inti

| Istilah | Definisi |
| --- | --- |
| Master PRD | Kebutuhan lintas platform dan fase beserta invariant/acceptance |
| Phase 1 PRD | Baseline implementasi awal yang dibekukan dari master |
| ExperienceProfile | Perilaku Hospitality, Residence, Home atau Shared Display |
| CapabilityProfile | Kemampuan per SKU/firmware/app serta evidence |
| Device dan endpoint | Perangkat teknis dan peran layar yang ditempatinya |
| Assignment/context version | Identitas pengikatan dan urutan konteks untuk mencegah event lama |
| Stay dan occupancy | Kunjungan sementara serta relasi penghuni jangka panjang |
| Seat dan entitlement | Hak deployment dan hak fitur/konten yang berlaku |
| Desired/applied/healthy | Kondisi yang dituju, versi diterapkan dan hasil pemeriksaan |
| Readiness | Bukti kondisi maintenance, terpisah dari checkout/online |
| Lease | Izin/lock berumur terbatas dengan kondisi yang harus masih valid |
| SLO dan SLA | Target internal dan komitmen layanan yang diperjanjikan |
| RPO dan RTO | Target kehilangan data dan waktu pemulihan |
| Outbox/idempotency | Pengiriman setelah transaksi dan pencegahan efek bisnis ganda |
| Proof of play | Bukti playback teknis, bukan perhatian manusia |
| Gate | Keputusan lanjut/tunda berdasarkan bukti yang ditentukan |

### 43.4 Riwayat versi dan dokumen berikutnya

v1.0, 23 Oktober 2026. Master kebutuhan GOJJA SmartTV, mempertahankan M01–M26 dan arah Hospitality–Residence–Home. Menambahkan requirement teridentifikasi, API/data contract konseptual, aturan UX, NFR, acceptance lintas modul serta keputusan terbuka. Harga, kemampuan perangkat, akses vendor dan SLA yang belum disahkan tetap ditandai.

Langkah berikutnya adalah memutuskan DR01–DR09 untuk discovery/pilot, menyusun Phase 1 PRD serta backlog yang memiliki estimasi, lalu menjalankan G1/G2 sebelum menjanjikan kendali perangkat atau channel premium kepada pelanggan. Residence/Home dan monetisasi mengikuti gate masing-masing tanpa mengurangi kelengkapan fondasi P1.
