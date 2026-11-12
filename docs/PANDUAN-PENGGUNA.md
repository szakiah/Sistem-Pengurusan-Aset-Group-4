# Panduan Pengguna UPKS Track

Dokumen ini menyediakan panduan terperinci langkah demi langkah untuk staf UPKS dan pentadbir makmal dalam mengendalikan aplikasi UPKS Track.

---

## 1. Maksud Status & Penunjuk Makmal

Setiap instrumen di dalam sistem ditandakan dengan status operasi yang jelas:

| Status Instrumen | Warna Penunjuk | Penerangan Maksud |
| :--- | :--- | :--- |
| **Available** | Hijau (*Emerald*) | Instrumen berada di makmal simpanan asal, dalam keadaan baik, dan sedia untuk dipinjam atau digunakan. |
| **In Use** | Biru Muda (*Sky*) | Sedang digunakan di dalam makmal berkenaan oleh pegawai bertugas. |
| **On Loan** | Kuning / Ambar (*Amber*) | Sedang dipinjam keluar atau dibawa ke tapak lapangan (*fieldwork*). Memaparkan nama peminjam semasa. |
| **Under Maintenance** | Merah (*Rose*) | Instrumen tidak boleh dipinjam kerana rosak, sedang dibaiki, atau tarikh *calibration* telah tamat tempoh. |

### Penunjuk Status Kalibrasi (*Calibration Status*)
- **Kalibrasi Sah:** Tarikh luput penentukuran melebihi 30 hari dari tarikh semasa.
- **Luput dlm X Hari:** Amaran kuning sekiranya tarikh luput penentukuran kurang daripada 30 hari bagi persediaan awal penghantaran kalibrasi.
- **Kalibrasi Tamat Tempoh:** Amaran merah apabila tarikh luput telah melepasi tarikh semasa. Instrumen tidak selamat untuk bacaan standard ISO.

---

## 2. Panduan Staf (Tanpa Perlu Log Masuk)

### A. Carian & Semakan Lokasi Instrumen
1. Buka pautan UPKS Track melalui telefon pintar atau komputer pejabat.
2. Anda akan terus dibawa ke **Direktori Aset** tanpa perlu mengisi kata laluan.
3. Taip kata kunci pada bar carian, seperti:
   - Nama instrumen: `Micro Pipette`, `Data Logger`, `pH Meter`
   - No. Siri unik: `UPKS-MP-001`, `UPKS-DL-001`
   - Lokasi: `Makmal Razlin`, `Makmal Kimia`, `Stesen Sg. Buloh`
   - Nama PIC: `Dr. Razlin`, `En. Mohd Hafiz`
4. Hasil carian akan ditapis secara langsung dalam masa nyata. Klik pada kad atau baris instrumen untuk membuka **Spesifikasi Lengkap (8 Medan Aset)** dan sejarah jejak audit instrumen tersebut.

### B. Mengimbas Kod QR Menggunakan Telefon
1. Tekan butang **Imbas QR** pada bar navigasi atas atau bar navigasi bawah telefon.
2. Halakan kamera telefon ke arah pelekat Kod QR yang ditampal pada badan instrumen makmal.
3. Sebaik kod dikesan, sistem akan terus membuka profil instrumen tersebut tanpa perlu menaip carian.
4. *Pilihan Sandaran:* Sekiranya pelayar menyekat kamera, anda boleh menaip nombor siri secara manual atau memilih sampel ujian pantas yang disediakan.

---

## 3. Aliran Permohonan Pinjaman (Check-out)

### Langkah Membuat Permohonan:
1. Cari instrumen yang ingin dipinjam (pastikan statusnya adalah **Available**).
2. Tekan butang biru **Pinjam / Bawa Keluar (Check-out)**.
3. Lengkapkan borang permohonan:
   - **Nama Staf / ID Staf:** Pilih nama anda daripada senarai cadangan autolengkap warga UPKS.
   - **Tujuan Penggunaan / Projek:** Nyatakan tujuan (contoh: *Analisis Sampel Titrasi Lateks RRIM 3001*).
   - **Lokasi Destinasi:** Nyatakan tapak lapangan atau makmal destinasi (contoh: *Tapak Lapangan Stesen Sg. Buloh*).
   - **Jangkaan Tarikh Pulang:** Pilih tarikh jangkaan instrumen akan dipulangkan (mesti sama atau selepas tarikh hari ini).
   - **Keadaan Fizikal Sebelum Keluar:** Pilih *Baik*, *Calar / Kesan Guna*, atau *Lain-lain* (wajib isi catatan jika memilih Lain-lain).
4. Tekan **Hantar Permohonan Pinjaman**.
5. Sistem akan mencipta transaksi berstatus **Pending Approval**.
6. Pada skrin pengesahan, tekan butang hijau **Maklumkan Admin via WhatsApp**. Aplikasi WhatsApp akan dibuka secara automatik dengan mesej pra-isi yang mengandungi butiran permohonan anda untuk dihantar terus kepada Admin UPKS.

---

## 4. Aliran Pemulangan Instrumen (Check-in)

### Langkah Merekodkan Pemulangan:
1. Buka rekod instrumen yang sedang dipinjam (berstatus **On Loan**).
2. Tekan butang **Pulangkan (Check-in)**.
3. Lengkapkan maklumat pemulangan:
   - **Nama Pegawai Pemulang:** Nama anda atau wakil yang memulangkan peralatan.
   - **Lokasi Simpanan Semula:** Tempat instrumen disimpan kembali (contoh: *Makmal Razlin - Rak Kabinet A-2*).
   - **Keadaan Fizikal Selepas Pulang:**
     - **Baik:** Status aset automatik kembali kepada **Available** dan sedia dipinjam oleh staf lain.
     - **Rosak / Perlu Kalibrasi:** Status aset automatik bertukar kepada **Under Maintenance / Calibration** mengikut Peraturan Perniagaan BR-003. Sistem akan menghalang staf lain daripada meminjam instrumen tersebut sehingga diperiksa oleh Admin.
   - **Catatan Pemulangan:** Catatan tambahan mengenai kebersihan atau aksesori peralatan.
4. Tekan **Sahkan Pemulangan**. Transaksi ditutup dan dicatatkan ke dalam log jejak audit kekal.

---

## 5. Panduan Pentadbir (Admin UPKS)

### A. Log Masuk Mod Pentadbir
1. Tekan butang **Mod Admin** di penjuru atas kanan aplikasi.
2. Masukkan PIN keselamatan pentadbir (PIN *default*: `1234`).
3. Tekan **Log Masuk**. Lencana pentadbir aktif akan dipaparkan bersama lencana merah sekiranya ada permohonan menunggu kelulusan.

### B. Meluluskan atau Menolak Pinjaman
1. Buka papan pemuka Admin pada tab **Kelulusan Pinjaman**.
2. Anda akan melihat kad permohonan yang mengandungi nama peminjam, destinasi, dan keadaan fizikal yang diisytiharkan.
3. **Untuk Meluluskan:** Tekan butang **Luluskan (Approve)**. Status instrumen bertukar kepada *On Loan* dan peminjam direkodkan secara rasmi.
4. **Untuk Menolak:** Tekan butang **Tolak (Reject)** dan masukkan sebab penolakan (contoh: *Peralatan dijadualkan untuk penentukuran rutin*).

### C. Menambah, Menyunting & Memadam Aset (CRUD)
- **Tambah Aset Baharu:** Buka tab **Pengurusan Rekod Aset** dan tekan **Tambah Instrumen Baharu**. Lengkapkan 8 medan wajib. Nombor siri mestilah unik.
- **Kemas Kini Kalibrasi Pantas:** Tekan ikon kalendar di baris instrumen untuk memasukkan tarikh kalibrasi terkini dan tarikh luput baharu.
- **Padam Rekod Aset:** Tekan ikon tong sampah. Sahkan dialog amaran 2-langkah. Walaupun rekod dipadam daripada senarai aktif, rekod audit dan transaksi lepas kekal disimpan bagi integriti sejarah.

### D. Menjana Pelekat Kod QR & Cetakan
1. Pada mana-mana profil instrumen atau senarai aset, tekan ikon **Pelekat Kod QR**.
2. Lembaran pelekat standard makmal LGM UPKS akan dipaparkan bersama kod QR dan maklumat instrumen.
3. Tekan **Cetak Pelekat (Print)** untuk mencetak terus ke atas kertas pelekat makmal, atau tekan **Muat Turun PNG** untuk fail imej digital.

### E. Import Pukal & Eksport Laporan Rasmi
1. Buka tab **Import & Eksport**.
2. **Import Pukal:** Tekan *Muat Turun Templat CSV* untuk mendapatkan format fail standard. Isi data instrumen anda dan tekan *Pilih Fail CSV / Excel* untuk memuat naik senarai peralatan sekaligus.
3. **Eksport Laporan:**
   - Tekan *Eksport Senarai Aset (CSV)* atau *Eksport Rekod Pinjaman (CSV)* untuk data mentah perakaunan.
   - Tekan *Cetak / Jana Laporan PDF Aset* atau *Laporan Pematuhan Kalibrasi* untuk memaparkan dokumen rasmi berkepala surat Lembaga Getah Malaysia sedia cetak (*print-to-PDF*).

### F. Menukar Tetapan & Nombor WhatsApp
1. Buka tab **Tetapan Sistem**.
2. Masukkan nombor telefon WhatsApp rasmi Admin (contoh: `60191234567`) dan emel rasmi.
3. Anda juga boleh menukar PIN keselamatan Admin di ruangan ini.
4. Tekan **Simpan Tetapan**.

---

## 6. Penyelesaian Masalah Lazim (*Troubleshooting*)

- **Kamera Pengimbas QR Tidak Berfungsi:**  
  Pastikan anda telah membenarkan kebenaran (*allow camera permission*) pada pelayar telefon anda (Chrome / Safari). Jika menggunakan pelayar dalam aplikasi tertentu yang menyekat perkakasan, gunakan kotak carian nombor siri manual.
- **Ralat "Nombor Siri telah wujud":**  
  Setiap instrumen makmal mesti mempunyai tanda pengenalan (*asset tag*) yang unik untuk mengelakkan pertindihan antara dua unit model yang sama. Sila semak nombor siri yang telah didaftarkan.
- **Terlupa PIN Admin:**  
  PIN lalai sistem ialah `1234` atau `admin123`. Sekiranya telah diubah dan terlupa, anda boleh merujuk fail simpanan sistem atau menetapkan semula ke nilai lalai melalui butang *Tetapkan Semula Data Lalai* dalam mod pembangunan.
