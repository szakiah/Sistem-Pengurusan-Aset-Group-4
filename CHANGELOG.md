# Rekod Perubahan (Changelog)

Semua perubahan dan penambahbaikan penting pada projek **UPKS Track** didokumentasikan di dalam fail ini mengikut susunan kronologi versi.

Format rekod ini berpandukan prinsip [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.2] - 12 November 2026

### Ditambah (*Added*)
- **Pakej Dokumentasi Lengkap untuk Repositori GitHub:**
  - `README.md`: Pintu masuk utama dwibahasa untuk orang awam dan staf makmal.
  - `docs/PANDUAN-PENGGUNA.md`: Manual terperinci langkah demi langkah bagi setiap user flow.
  - `docs/KEPERLUAN-PRODUK.md`: Spesifikasi penuh berdasarkan PRD v1.0, kriteria penerimaan, dan peraturan bisnes.
  - `docs/STATUS-DAN-ROADMAP.md`: Status fungsian semasa dan perancangan Fasa 2 (peringatan cron kalibrasi, lampiran foto).
  - `docs/DATA-DAN-PRIVASI.md`: Polisi pengendalian data, kawalan capaian, dan integriti jejak audit.
  - `docs/SETUP-DAN-PENYELENGGARAAN.md`: Panduan teknikal pemasangan, pembinaan kod, dan penggunaan di pelayan pengeluaran.
- Inisialisasi cawangan Git `main` dengan pembersihan fail sementara.

---

## [1.0.1] - 12 November 2026

### Ditambah (*Added*)
- Disiplin reka bentuk *Clinical Scientific & Precision Laboratory Ledger* bertema Biru Royal & Cool Slate (nisbah warna 60-30-10).
- Jalur metrik statistik padat (*compact precision metric ribbon*) dengan angka monospace *tabular-nums*.
- Bar carian dan penapis inventori bersepadu (*integrated search & filter toolbar*).

### Diubah (*Changed*)
- Membuang kotak gradien hero bersaiz besar (*AI hero banner*) bagi memberi laluan terus kepada data peralatan makmal.
- Menggantikan lencana kapsul bertingkat (*pill badge sandwich*) dengan penunjuk status titik-teks (*dot-and-label*) yang tenang dan berketepatan tinggi mengikut piawaian WCAG AA.
- Memperkemas paparan jadual komputer meja dan kad mobil dengan sasaran sentuh ergonomik ($\ge 44\text{px}$).

### Dibaiki (*Fixed*)
- Membaiki isu jenis data TypeScript pada ikon amaran kalibrasi dalam komponen `AssetTable`.

---

## [1.0.0] - 12 November 2026

### Ditambah (*Added*)
- **Pelepasan Awal Versi MVP (Berdasarkan PRD v1.0 UPKS Track):**
  - **FR-001:** Direktori instrumen makmal pantas tanpa perlu log masuk.
  - **FR-002:** Penjanaan pelekat Kod QR fizikal sedia cetak dan pengimbas kod QR kamera berasaskan pelayar web berserta pautan pantas (*Deep Link*).
  - **FR-003:** Borang permohonan pinjaman (*Check-out*) dengan rekod keadaan fizikal awal dan autolengkap nama staf UPKS.
  - **FR-004:** Aliran kelulusan pentadbir (*Admin*) berserta lencana merah (*In-App Badge*), notifikasi emel automatik, dan butang mesej pra-isi ke WhatsApp Admin rasmi (`wa.me`).
  - **FR-005:** Aliran pemulangan (*Check-in*) dengan pelaksanaan Peraturan Perniagaan BR-003 (peralatan rosak automatik ditukar status kepada *Under Maintenance*).
  - **FR-006:** Pengurusan rekod penuh aset (*CRUD*) dan kemas kini tarikh penentukuran kalibrasi oleh Admin.
  - **FR-007:** Log aktiviti jejak audit kekal (*append-only*).
  - **FR-008:** Modul import pukal CSV dengan semakan nombor siri duplikat dan eksport laporan rasmi LGM (CSV dan PDF sedia cetak).
  - **FR-009:** Penukar dwibahasa segera (Bahasa Melayu dan Bahasa Inggeris) dan mod log masuk pentadbir selamat menggunakan PIN.
