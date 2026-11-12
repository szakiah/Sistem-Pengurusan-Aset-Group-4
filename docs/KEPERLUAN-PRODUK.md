# Spesifikasi Keperluan Produk (Product Requirements Document - PRD)

Dokumen ini merumuskan keperluan fungsian, peraturan perniagaan, model data, dan kriteria penerimaan bagi sistem **UPKS Track — Sistem Pengurusan & Penjejakan Aset Instrumen** berdasarkan spesifikasi PRD Versi 1.0.

*Rujukan Fail PRD Asal:* `public/assets/aistudio/UPKS-Track-PRD-v1.0_fbf012b1.pdf`

---

## 1. Tujuan Produk & Pengguna Sasaran

### Tujuan Utama
Menyediakan sistem pengurusan dan penjejakan aset dalaman yang pantas, mudah dicapai, dan berketepatan tinggi untuk unit UPKS LGM. Sistem ini mengatasi kekangan pangkalan data utama LGM sedia ada yang terlalu besar dan perlahan untuk kegunaan harian staf di meja makmal (seperti Makmal Razlin) dan di tapak lapangan.

### Tiga Tahap Akses & Peranan Pengguna
1. **Staf UPKS (Viewer):** Akses terbuka dalaman tanpa log masuk untuk semakan status dan carian pantas. Dilarang mengubah data induk.
2. **Staf UPKS (Peminjam):** Pengesahan identiti melalui borang transaksi pinjaman (*Check-out*) dan pemulangan (*Check-in*) berserta pengisytiharan keadaan fizikal peralatan.
3. **Admin UPKS:** Kawalan selamat (*PIN / Kata Laluan*) untuk pengurusan penuh rekod instrumen (*CRUD*), kelulusan pinjaman, pengemaskinian tarikh kalibrasi, penjanaan kod QR, serta import/eksport laporan.

---

## 2. Keperluan Fungsian (Functional Requirements - FR)

- **FR-001: Direktori Aset & Carian Pantas Tanpa Login (Must Have)**  
  Menyediakan carian masa nyata mengikut nama instrumen, no. siri, PIC, dan lokasi dengan masa tindak balas $< 2\text{ saat}$. Menyokong penapisan status dan status kalibrasi.
- **FR-002: Penjanaan & Imbasan Kod QR Instrumen (Must Have)**  
  Menjana pelekat Kod QR berlabel nama & no. siri untuk cetakan fizikal. Menyokong pengimbas kamera web untuk membuka halaman profil instrumen secara automatik (*Deep Linking*).
- **FR-003: Permohonan Pinjaman / Bawa Keluar (Check-out) dengan Rekod Fizikal (Must Have)**  
  Borang pinjaman mewajibkan nama peminjam, tujuan projek, lokasi destinasi, tarikh pulang ($\ge$ hari ini), dan pilihan keadaan fizikal awal (*Baik*, *Calar Ringan*, atau *Lain-lain* berserta catatan wajib).
- **FR-004: Aliran Kelulusan Admin & Notifikasi Pelbagai Saluran (Must Have)**  
  Permohonan baharu menambah bilangan pada *In-App Badge* Admin, menghantar notifikasi emel automatik, dan menyediakan pautan pantas WhatsApp rasmi (`wa.me`). Status aset bertukar kepada *On Loan* hanya selepas Admin menekan butang *Luluskan*.
- **FR-005: Pemulangan Instrumen (Check-in) & Pengesahan Keadaan Selepas Guna (Must Have)**  
  Merekodkan pegawai pemulang, lokasi simpanan semula, dan keadaan fizikal akhir. Menutup rekod transaksi dengan cap masa sebenar.
- **FR-006: Pengurusan Rekod Aset Penuh & Penyelenggaraan Kalibrasi (Must Have)**  
  Admin boleh menambah instrumen baharu, menyunting data, mengemas kini tarikh penentukuran, dan memadam rekod tidak sah (dengan dialog pengesahan 2-langkah).
- **FR-007: Log Aktiviti & Jejak Audit (Must Have)**  
  Setiap tindakan pinjaman, kelulusan, pemulangan, dan pengemaskinian aset direkodkan secara kekal (*append-only*) dalam jadual jejak audit bersama nama pelaku dan masa tepat.
- **FR-008: Import Pukal (CSV/Excel) & Eksport Laporan (Should Have)**  
  Menyokong import senarai peralatan secara pukal dengan pengesanan baris duplikat serta eksport laporan ke fail Excel/CSV dan dokumen PDF berkepala surat rasmi Lembaga Getah Malaysia.
- **FR-009: Penukar Dwibahasa (BM / EN) & Kawalan Akses Mod Admin (Must Have)**  
  Penukaran bahasa segera antara Bahasa Melayu dan Bahasa Inggeris tanpa memuat semula halaman, sambil mengekalkan istilah teknikal makmal piawai.

---

## 3. Peraturan Perniagaan (Business Rules - BR)

- **BR-001 (Kawalan Pinjaman Bertindih):** Instrumen yang berstatus *On Loan* atau *Under Maintenance* tidak boleh dimohon untuk pinjaman baharu. Sekiranya ada permohonan berstatus *Pending Approval*, sistem memaparkan amaran bahawa instrumen sedang dalam proses tempahan.
- **BR-002 (Keunikan Nombor Siri / Tag Aset):** Sistem menolak pendaftaran atau import aset baharu sekiranya nombor siri (`serial_no`) telah wujud dalam pangkalan data.
- **BR-003 (Perubahan Status Automatik Berdasarkan Keadaan Fizikal):** Semasa pemulangan (*Check-in*), pemilihan keadaan fizikal *Rosak* atau *Perlu Kalibrasi* akan menukar status instrumen secara automatik kepada *Under Maintenance / Calibration* supaya tidak dipinjam oleh staf lain sebelum diperiksa Admin.
- **BR-004 (Amaran Tamat Tempoh Kalibrasi):** Sekiranya `next_calibration_due` telah melepasi tarikh semasa atau kurang daripada 30 hari, sistem memaparkan lencana amaran pada kad instrumen dan borang pinjaman sebagai peringatan keselamatan pengukuran standard ISO.
- **BR-005 (Pengesahan Tindakan Memadam):** Tindakan memadam aset memerlukan pengesahan dua-langkah; rekod transaksi dan log audit berkaitan kekal disimpan untuk rujukan sejarah.

---

## 4. Model Entiti Data

### Entiti: `assets` (Rekod Induk Aset)
- `id` (PK)
- `name` (Nama / Jenis Instrumen)
- `serial_no` (Unik, cth: UPKS-MP-001)
- `location` (Lokasi Terkini cth: Makmal Razlin)
- `pic_name` (Pegawai Bertanggungjawab)
- `purchase_price` (Harga Belian dalam RM)
- `purchase_year` (Tahun Belian, 4 digit)
- `status` (`Available` | `In Use` | `On Loan` | `Under Maintenance`)
- `last_calibration_date` (Tarikh Kalibrasi Terakhir: YYYY-MM-DD)
- `next_calibration_due` (Tarikh Luput Kalibrasi: YYYY-MM-DD)
- `current_borrower` (Nama peminjam semasa jika On Loan)
- `qr_code_value` (Nilai teks Kod QR)
- `updated_at` (Cap masa kemas kini)

### Entiti: `loan_transactions` (Rekod Transaksi Pinjaman)
- `id` (PK)
- `asset_id` (FK merujuk kepada assets)
- `borrower_name` (Nama Peminjam)
- `purpose` (Tujuan / Projek)
- `destination_location` (Lokasi Destinasi / Tapak Lapangan)
- `checkout_date` (Tarikh Keluar)
- `expected_return_date` (Jangkaan Tarikh Pulang)
- `physical_condition_out` (`Baik` | `Calar / Kesan Guna` | `Lain-lain`)
- `approval_status` (`Pending` | `Approved` | `Rejected`)
- `approved_by` (Nama Admin yang meluluskan)
- `actual_return_date` (Tarikh Pulang Sebenar)
- `physical_condition_in` (`Baik` | `Rosak` | `Perlu Kalibrasi`)
- `return_notes` (Catatan Pemulangan)

### Entiti: `audit_logs` (Jejak Audit Aktiviti)
- `id` (PK)
- `timestamp` (Cap masa aktiviti)
- `asset_id` (FK)
- `action_type` (`Create` | `Update` | `Delete` | `Request Loan` | `Approve` | `Reject` | `Return`)
- `actor_name` (Nama staf / admin yang melakukan tindakan)
- `details_summary` (Ringkasan perincian aktiviti)

---

## 5. Kriteria Penerimaan (Acceptance Criteria & Verification Checklist)

| ID | Kriteria Pengesahan | Status Pelaksanaan |
| :--- | :--- | :--- |
| **VC-001** | Staf boleh membuka aplikasi, mencari instrumen mengikut nama/no. siri, dan melihat lokasi, PIC, harga, tahun, dan status tanpa log masuk. | **Disahkan (Pass)** |
| **VC-002** | Penukaran bahasa BM $\leftrightarrow$ EN mengemas kini label antaramuka secara konsisten tanpa ralat paparan. | **Disahkan (Pass)** |
| **VC-003** | Staf tanpa log masuk Admin disekat daripada menambah, menyunting, atau memadam rekod aset. | **Disahkan (Pass)** |
| **VC-004** | Permohonan Check-out mewajibkan nama staf, tarikh pulang, dan keadaan fizikal awal sebelum dihantar. | **Disahkan (Pass)** |
| **VC-005** | Permohonan baharu mencetuskan notifikasi badge Admin, emel, dan pautan WhatsApp; kelulusan Admin menukar status kepada On Loan. | **Disahkan (Pass)** |
| **VC-006** | Pemulangan Check-in dengan keadaan Rosak menukar status aset kepada Under Maintenance / Calibration (BR-003). | **Disahkan (Pass)** |
| **VC-007** | Setiap tindakan pinjaman, kelulusan, pemulangan, dan suntingan direkodkan dalam Audit Trail. | **Disahkan (Pass)** |
| **VC-008** | Imbasan Kod QR terus membuka profil instrumen berkaitan; import CSV dan eksport Excel/PDF berfungsi dengan tepat. | **Disahkan (Pass)** |
