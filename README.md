# UPKS Track — Sistem Pengurusan & Penjejakan Aset Instrumen

Aplikasi web *mobile-first* dan dwibahasa (BM/EN) untuk membantu warga Unit Penyelidikan Kawalan & Standard (UPKS) Lembaga Getah Malaysia (LGM) mencari, menyemak status ketersediaan, mengimbas Kod QR, dan merekod pergerakan pinjaman instrumen makmal berketepatan tinggi secara pantas berserta kawalan kelulusan pentadbir (*Admin*) dan jejak audit penuh (*100% audit trail*).

---

## A. Nama Projek & Penerangan Ringkas

**UPKS Track** ialah sistem direktori dan penjejakan pergerakan instrumen makmal dalaman (seperti *micro pipette*, *data logger*, meter pH, dan *spectrophotometer*) yang membolehkan staf menyemak lokasi dan pegawai bertanggungjawab (*Person-in-Charge* / PIC) dalam masa kurang 10 saat tanpa halangan log masuk, di samping memastikan setiap pinjaman ke lapangan direkodkan dengan teliti.

## B. Masalah yang Diselesaikan

Di peringkat operasi harian makmal (seperti Makmal Razlin, Makmal Kimia UPKS, dan Makmal Biologi):
- Pangkalan data aset berpusat utama LGM terlalu besar dan perlahan untuk semakan harian di lapangan atau di meja makmal.
- Staf sukar mengenal pasti dengan pantas di mana sesuatu peralatan berada, siapa yang sedang memegangnya, atau bila tarikh akhir penentukuran (*calibration due date*).
- Tiada rekod digital pantas mengenai keadaan fizikal peralatan sebelum dibawa keluar ke tapak penyelidikan dan selepas dipulangkan semula.

UPKS Track menyelesaikan isu ini dengan menyediakan carian pantas sub-50 milisaat, imbasan Kod QR terus dari telefon pintar, borang pinjaman digital berserta semakan keadaan fizikal, dan amaran tarikh tamat tempoh *calibration*.

## C. Untuk Siapa?

1. **Staf UPKS (Viewer):** Akses terbuka dalaman tanpa log masuk untuk mencari instrumen, menyemak lokasi makmal, mengenal pasti PIC, dan membaca status ketersediaan.
2. **Staf UPKS (Peminjam):** Pegawai penyelidik atau penolong sains yang mengisi borang pinjaman (*Check-out*), merekodkan keadaan fizikal awal barang, dan mencatatkan pemulangan (*Check-in*).
3. **Admin UPKS (Dr. Razlin / Pentadbir Makmal):** Pegawai yang memegang PIN keselamatan untuk meluluskan permohonan pinjaman, mendaftar instrumen baharu (*CRUD*), mengemas kini tarikh *calibration*, mencetak pelekat Kod QR, dan memuat turun laporan rasmi unit.

## D. Apa yang Boleh Dibuat?

- **Direktori & Carian Pantas Tanpa Login:** Cari instrumen mengikut nama, nombor siri unik, lokasi, atau nama PIC. Dilengkapi penapis status (*Available*, *On Loan*, *In Use*, *Under Maintenance*) dan status kalibrasi.
- **Penjanaan & Imbasan Kod QR:** Jana pelekat Kod QR sedia cetak bagi setiap instrumen dan imbas terus menggunakan kamera telefon untuk membuka profil instrumen secara automatik (*Deep Linking*).
- **Aliran Permohonan Pinjaman (Check-out):** Isi borang pinjaman dengan autolengkap nama staf, tujuan projek, tapak lapangan, tarikh jangka pulang, dan pengisytiharan keadaan fizikal awal (*Baik*, *Calar Ringan*, atau *Lain-lain*).
- **Kelulusan Pentadbir & Notifikasi Segera:** Permohonan baharu memaparkan lencana merah pada papan pemuka Admin, notifikasi emel automatik, serta pautan terus ke WhatsApp rasmi Admin (`wa.me`) dengan teks permohonan pra-isi.
- **Pemulangan (Check-in) & Peraturan Automatik (BR-003):** Merekodkan lokasi simpanan semula dan keadaan fizikal. Sekiranya dipilih *Rosak* atau *Perlu Kalibrasi*, sistem secara automatik menukar status instrumen kepada *Under Maintenance / Calibration*.
- **Papan Pemuka Admin Lengkap:** Pengurusan rekod instrumen (*Tambah, Sunting, Padam* dengan pengesahan 2-langkah), pengemaskinian tarikh kalibrasi, dan log jejak audit kekal (*append-only*).
- **Import Pukal & Eksport Laporan Rasmi:** Muat naik fail CSV dengan semakan nombor siri duplikat serta eksport laporan ke fail Excel/CSV dan dokumen PDF rasmi berkepala surat LGM.
- **Penukar Dwibahasa Segera:** Tukar antara Bahasa Melayu dan Bahasa Inggeris dengan mengekalkan istilah piawai makmal.

## E. Contoh Cara Penggunaan (Senario Sebenar)

1. **Semakan:** Penolong Pegawai Sains membuka pautan UPKS Track di telefon pintar dan menaip `Micro Pipette` pada bar carian. Sistem terus memaparkan instrumen `UPKS-MP-001` berstatus *Available* di Makmal Razlin.
2. **Permohonan Pinjaman:** Pegawai menekan butang **Pinjam**, memilih nama beliau daripada senarai staf, menetapkan destinasi `Tapak Lapangan Stesen Sg. Buloh`, memilih keadaan fizikal *Baik*, dan menekan **Hantar Permohonan Pinjaman**.
3. **Notifikasi WhatsApp:** Pada skrin pengesahan, pegawai menekan butang **Maklumkan Admin via WhatsApp**. Aplikasi WhatsApp terbuka dengan teks permohonan lengkap sedia untuk dihantar ke nombor Admin.
4. **Kelulusan Admin:** Dr. Razlin (Admin UPKS) membuka Mod Admin dengan PIN keselamatan `1234`, melihat permohonan di bawah tab **Kelulusan Pinjaman**, dan menekan **Luluskan (Approve)**. Status instrumen bertukar secara rasmi kepada **On Loan**.
5. **Pemulangan:** Selepas selesai kerja lapangan, pegawai membuka rekod instrumen dan menekan **Pulangkan (Check-in)**. Keadaan fizikal disahkan *Baik* dan status instrumen kembali kepada **Available**.

## F. Cara Mencuba Aplikasi

Pautan aplikasi sedia ada yang sedang aktif:
- **Pautan Perkongsian (Shared Preview):** [https://ais-pre-f6izkfvywdlyfayefuhse4-995614718199.asia-southeast1.run.app](https://ais-pre-f6izkfvywdlyfayefuhse4-995614718199.asia-southeast1.run.app)
- **Pautan Pembangunan (Dev Preview):** [https://ais-dev-f6izkfvywdlyfayefuhse4-995614718199.asia-southeast1.run.app](https://ais-dev-f6izkfvywdlyfayefuhse4-995614718199.asia-southeast1.run.app)

*PIN Lalai Mod Pentadbir (Admin):* `1234`

## G. Status Projek Semasa

- **Tahap Pembangunan:** Versi 1.0 (MVP Specification siap dibina mengikut dokumen PRD).
- **Fungsi yang Sudah Dibina & Diuji:**
  - Direktori & penapisan pantas tanpa log masuk.
  - Aliran pinjaman (*Check-out* $\rightarrow$ Kelulusan Admin $\rightarrow$ *Check-in*).
  - Pengesanan kerosakan automatik mengikut peraturan perniagaan BR-003.
  - Penjana pelekat Kod QR berasaskan vektor & sokongan cetakan *print-to-PDF*.
  - Import pukal CSV dan eksport data ke fail CSV dan paparan laporan PDF LGM.
  - Pengimbas Kod QR berasaskan pelayar web berserta mod simulasi ujian pantas.
- **Batasan & Perkara Belum Lengkap:**
  - Nombor telefon WhatsApp dan alamat emel rasmi Admin masih menggunakan nilai lalai contoh yang boleh dikemas kini dalam Tab Tetapan.
  - Menggunakan enjin simpanan reaktif tempatan (*local-first storage*) yang tersimpan merentas muat semula; penyambungan awan luar (Firebase / Supabase) disediakan dalam lapisan konfigurasi.

## H. Panduan Lanjut

Untuk dokumentasi terperinci, sila rujuk dokumen berikut dalam direktori `docs/`:
- [Panduan Pengguna Lengkap](docs/PANDUAN-PENGGUNA.md) — Panduan bergambar langkah demi langkah untuk staf dan pentadbir.
- [Spesifikasi Keperluan Produk](docs/KEPERLUAN-PRODUK.md) — Huraian penuh keperluan bisnes, PRD asal, model entiti data, dan kriteria penerimaan.
- [Status & Pelan Hala Tuju (Roadmap)](docs/STATUS-DAN-ROADMAP.md) — Status semasa setiap modul dan perancangan Fasa 2.
- [Dasar Data & Privasi](docs/DATA-DAN-PRIVASI.md) — Kawalan capaian data makmal, ketelusan log audit, dan pengendalian privasi.
- [Panduan Setup & Penyelenggaraan](docs/SETUP-DAN-PENYELENGGARAAN.md) — Arahan menjalankan kod sumber di komputer pembangunan.
- [Rekod Perubahan (Changelog)](CHANGELOG.md) — Sejarah versi dan perubahan kod.

## I. Ringkasan Teknologi

Aplikasi ini dibina berasaskan teknologi web moden yang ringan dan pantas:
- **React 19:** Pustaka JavaScript untuk membina paparan antaramuka pengguna yang reaktif dan pantas.
- **TypeScript:** Bahasa pengaturcaraan yang menambah semakan jenis data (*type safety*) untuk mengelakkan ralat kod.
- **Vite:** Alat pembina (*bundler & build tool*) generasi baharu yang memuatkan aplikasi dalam masa milisaat.
- **Tailwind CSS v4:** Kerangka kerja gaya visual untuk reka bentuk kemas bertema makmal sains (*Royal Blue & Cool Slate*).
- **Lucide React:** Set ikon antaramuka moden yang konsisten.
- **QRCode:** Enjin penjana imej Kod QR berketepatan tinggi untuk cetakan pelekat makmal.

## J. Maklum Balas & Bantuan

Sekiranya anda menemui sebarang pepijat (*bug*) atau mempunyai cadangan penambahbaikan untuk unit UPKS, sila buka isu baharu melalui tab **Issues** di repositori GitHub ini atau hubungi Pentadbir Makmal UPKS.
