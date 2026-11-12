# Status Projek Semasa & Pelan Hala Tuju (Roadmap)

Dokumen ini merekodkan status sebenar pelaksanaan sistem UPKS Track, senarai perkara yang telah diuji, had atau batasan semasa, dan perancangan penambahbaikan untuk fasa seterusnya.

---

## 1. Status Pelaksanaan Semasa (Fasa 1 - MVP)

### Modul yang Sudah Dibina & Telah Diuji Secara Fungsian:
- [x] **Direktori Utama Aset (FR-001):** Carian masa nyata mengikut kata kunci nama, no. siri, PIC, dan lokasi. Penapisan mengikut status instrumen dan amaran tarikh kalibrasi.
- [x] **Papan Pemuka Statistik KPI:** Bar metrik padat dengan 4 petunjuk utama (*Total*, *Available*, *On Loan*, *Calibration Due*) berserta penapis interaktif satu klik.
- [x] **Penjanaan Kod QR (FR-002):** Penjanaan kod QR tajam berasaskan vektor dan paparan lembaran pelekat makmal sedia cetak (*Print Sticker*).
- [x] **Pengimbas Kod QR Kamera Web (FR-002):** Pengimbas kamera berasaskan pelayar web berserta sokongan *Deep Link* URL (`?serial=...`) dan butang simulasi imbasan sampel makmal.
- [x] **Aliran Permohonan Pinjaman / Check-out (FR-003):** Borang pinjaman dengan autolengkap senarai nama staf UPKS, jangkaan tarikh pulang, dan pengisytiharan keadaan fizikal awal.
- [x] **Kelulusan Pentadbir & Notifikasi Pantas (FR-004):** Lencana merah (*badge*) pada mod Admin, notifikasi emel automatik, dan penjanaan pautan pantas WhatsApp rasmi (`wa.me`) dengan teks pra-isi.
- [x] **Aliran Pemulangan / Check-in (FR-005):** Merekodkan pegawai pemulang, lokasi simpanan semula, dan keadaan fizikal akhir.
- [x] **Peraturan Perniagaan Automatik BR-003:** Pertukaran status automatik kepada *Under Maintenance / Calibration* sekiranya instrumen dipulangkan dalam keadaan Rosak atau Perlu Kalibrasi.
- [x] **Pengurusan Penuh Aset Pentadbir / CRUD (FR-006):** Tambah aset baharu dengan semakan keunikan no. siri, sunting maklumat, kemas kini kalibrasi pantas, dan padam aset dengan pengesahan 2-langkah (BR-005).
- [x] **Jejak Audit Aktiviti Kekal (FR-007):** Rekod *append-only* bagi semua aktiviti pinjaman, kelulusan, pemulangan, pendaftaran, dan pemadaman aset.
- [x] **Import & Eksport Laporan Rasmi (FR-008):** Muat turun templat CSV, import pukal dengan pengesahan ralat, eksport data ke CSV, dan format cetakan laporan rasmi Lembaga Getah Malaysia (PDF/Print).
- [x] **Penukar Dwibahasa Segera (FR-009):** Tukar antara Bahasa Melayu dan Bahasa Inggeris secara masa nyata.
- [x] **Reka Bentuk Saintifik Klinikal (UI Overhaul):** Antaramuka profesional berstandard tinggi, bersih daripada *AI slop*, responsif untuk paparan mudah alih dan komputer meja.

---

## 2. Perkara yang Belum Disahkan & Batasan Semasa

1. **Akses Kamera Perkakasan Sebenar:**  
   Pengimbas kamera berfungsi menggunakan API piawai pelayar (`navigator.mediaDevices.getUserMedia`). Namun, sesetengah pelayar dalaman atau persekitaran *sandbox/iFrame* mungkin menyekat perkakasan kamera. Pilihan carian nombor siri manual dan simulasi sampel makmal disediakan sebagai sandaran yang berfungsi sepenuhnya.
2. **Nombor Rasmi WhatsApp & Emel Admin:**  
   Nilai semasa menggunakan nombor lalai contoh (`60192345678`) dan emel contoh `admin.upks@lgm.gov.my`. Pentadbir boleh mengemas kini butiran sebenar pada bila-bila masa melalui menu **Mod Admin $\rightarrow$ Tab Tetapan**.
3. **Penyambungan Pangkalan Data Awan Luar:**  
   Data operasi semasa disimpan menggunakan enjin simpanan reaktif tempatan (*local-first storage*) dengan ketahanan data merentas muat semula skrin (*persisted across refresh*). Tab Tetapan menyediakan panduan ID projek dan konfigurasi untuk penyambungan pangkalan data awan berpusat (Firebase Firestore atau Supabase) apabila akaun luar dimuktamadkan oleh pihak pentadbir IT LGM.

---

## 3. Pelan Hala Tuju (Roadmap Perancangan Seterusnya)

### Fasa 2 (Peningkatan Keupayaan Automasi):
- [ ] **Peringatan Kalibrasi Automatik Berjadual (Cron Job):** Penghantaran emel amaran automatik kepada pegawai bertanggungjawab (PIC) dan Admin 30 hari sebelum tarikh luput kalibrasi sesuatu instrumen.
- [ ] **Muat Naik Lampiran Foto Keadaan Fizikal:** Membenarkan staf mengambil gambar keadaan fizikal instrumen (contohnya calar atau kerosakan) semasa borang *Check-out* dan *Check-in*.
- [ ] **Integrasi Kalendar Tempahan Makmal:** Paparan kalendar visual bagi tempahan tarikh pinjaman peralatan yang bakal digunakan di lapangan bagi mengelakkan pertindihan jadual penyelidikan.

### Fasa 3 (Integrasi Korporat):
- [ ] **Single Sign-On (SSO) Direktori Emel Korporat LGM:** Mengintegrasikan log masuk akaun rasmi warga LGM (@lgm.gov.my) untuk pengesahan identiti peminjam secara automatik tanpa perlu memasukkan nama manual.
- [ ] **Penyegerakan Data Aset Berpusat LGM:** Modul integrasi berkala untuk menyegerakkan rekod inventori unit UPKS dengan sistem pengurusan aset induk Lembaga Getah Malaysia.
