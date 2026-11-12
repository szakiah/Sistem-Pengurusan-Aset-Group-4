# Dasar Data & Privasi UPKS Track

Dokumen ini menerangkan pengendalian data, simpanan, tahap keselamatan capaian, dan privasi bagi aplikasi UPKS Track.

---

## 1. Kategori Data yang Dikumpulkan

Aplikasi ini hanya mengendalikan data yang berkaitan secara langsung dengan operasi penjejakan instrumen makmal dan penyelidikan UPKS:

1. **Maklumat Peralatan & Instrumen Makmal:**
   - Nama instrumen, jenama dan model (contoh: *Micro Pipette Eppendorf*, *Data Logger Hioki*).
   - Nombor siri unik / tag aset makmal (contoh: *UPKS-MP-001*).
   - Lokasi simpanan fizikal (contoh: *Makmal Razlin*, *Makmal Kimia UPKS*).
   - Pegawai Bertanggungjawab (*Person-in-Charge* / PIC).
   - Harga perolehan rasmi (RM) dan tahun belian.
   - Rekod tarikh kalibrasi terakhir dan tarikh luput penentukuran.
2. **Maklumat Transaksi Pinjaman (Pergerakan Keluar/Masuk):**
   - Nama peminjam dan nombor ID staf.
   - Tujuan penggunaan atau nama projek penyelidikan.
   - Lokasi tapak lapangan atau makmal destinasi.
   - Tarikh keluar dan jangkaan tarikh pulang.
   - Rekod keadaan fizikal peralatan sebelum keluar dan selepas pemulangan.
3. **Log Jejak Audit (Audit Trail):**
   - Cap masa aktiviti, jenis tindakan (*Create*, *Update*, *Delete*, *Request Loan*, *Approve*, *Reject*, *Return*), nama pelaku/admin, dan ringkasan aktiviti.

---

## 2. Lokasi & Kaedah Penyimpanan Data

- **Penyimpanan Tempatan Selamat (*Local-First Persistent Storage*):**  
  Pada fasa semasa, rekod disimpan secara selamat di dalam storan pelayar tempatan (*Browser Local Storage*) bagi memastikan masa tindak balas yang amat pantas ($< 50\text{ milisaat}$) tanpa kebergantungan kepada talian internet di dalam bilik makmal bertutup atau di tapak lapangan.
- **Ketahanan Data (*Data Persistence*):**  
  Data tidak akan hilang apabila halaman dimuat semula (*page refresh*) atau apabila aplikasi ditutup dan dibuka kembali.
- **Penyambungan Awan Luar (*External Cloud Database*):**  
  Lapisan seni bina aplikasi telah bersedia untuk disambungkan ke pangkalan data awan berpusat seperti Firebase Firestore atau Supabase. Apabila diaktifkan oleh pihak pentadbir IT, data akan disegerakkan secara masa nyata (*real-time sync*) merentas pelbagai peranti.

---

## 3. Komunikasi Perkhidmatan Luaran & AI

- **Model Kecerdasan Buatan (AI):**  
  Aplikasi ini memfokuskan kepada kelajuan carian pangkalan data berstruktur dan aliran kerja deterministik. **Tiada sebarang data makmal, nama staf, atau rekod pinjaman yang dihantar kepada mana-mana model AI luaran.**
- **Pautan Pantas WhatsApp (`wa.me`):**  
  Pautan WhatsApp dijana secara tempatan di dalam pelayar peranti peminjam menggunakan protokol URL rasmi (`https://wa.me/[NoAdmin]?text=[Mesej]`). Mesej dihantar secara terus antara peranti staf dan peranti telefon Admin melalui aplikasi WhatsApp rasmi tanpa melalui mana-mana pelayan perantara berbayar.
- **Notifikasi Emel:**  
  Dalam mod semasa, notifikasi emel disimulasikan secara dalaman untuk mengesahkan aliran kerja tanpa membocorkan kelayakan emel peribadi.

---

## 4. Kawalan Capaian & Kebenaran (*Access Control*)

- **Staf Am (Tanpa Log Masuk):**  
  Hanya boleh melihat senarai direktori peralatan, status ketersediaan, lokasi makmal, dan mengimbas Kod QR. Staf am disekat sepenuhnya daripada mengubah, menyunting, atau memadam sebarang rekod aset.
- **Staf Peminjam:**  
  Boleh mengisi borang pinjaman dan pemulangan dengan memasukkan nama dan mengisytiharkan keadaan fizikal peralatan.
- **Pentadbir UPKS (Mod Admin):**  
  Dilindungi oleh PIN keselamatan pentadbir. Hanya pentadbir yang disahkan dibenarkan meluluskan atau menolak permohonan pinjaman, mendaftar instrumen baharu, mengemas kini rekod kalibrasi, memadam rekod, serta memuat turun laporan rasmi.

---

## 5. Pemadaman & Penetapan Semula Data

- **Integriti Jejak Audit (BR-005):**  
  Sekiranya sesuatu rekod aset dipadam daripada senarai aktif, rekod transaksi pinjaman lepas dan sejarah audit berkaitan instrumen tersebut akan dikekalkan secara kekal (*append-only*) bagi mematuhi piawaian integriti audit dan penjejakan makmal ISO.
- **Penetapan Semula Data Contoh (*Reset Demo Data*):**  
  Bagi tujuan ujian atau pembersihan data ujian, Pentadbir boleh menggunakan butang **Tetapkan Semula Data Lalai** di dalam tab Tetapan Mod Admin untuk memulihkan senarai instrumen sampel asal Makmal Razlin.
