# Panduan Setup & Penyelenggaraan Sistem

Dokumen ini menyediakan panduan teknikal untuk memasang, menjalankan, membina (*build*), dan menyelenggara aplikasi UPKS Track di persekitaran tempatan (*local development*) atau pelayan produksi.

---

## 1. Keperluan Sistem

Sebelum memulakan, pastikan komputer anda telah dipasang dengan perisian berikut:
- **Node.js:** Versi 20.x ke atas (disyorkan LTS)
- **Pengurus Pakej (*Package Manager*):** `npm` (versi 10.x ke atas)
- **Git:** Untuk pengurusan versi kod sumber
- **Pelayar Web Moden:** Google Chrome, Mozilla Firefox, Microsoft Edge, atau Safari dengan sokongan ECMAScript 2022

---

## 2. Struktur Direktori Projek

```
├── docs/                             # Dokumentasi komprehensif projek
│   ├── DATA-DAN-PRIVASI.md           # Polisi data, simpanan & kawalan privasi
│   ├── KEPERLUAN-PRODUK.md           # Ringkasan PRD, model entiti & kriteria penerimaan
│   ├── PANDUAN-PENGGUNA.md           # Manual operasi langkah demi langkah
│   ├── SETUP-DAN-PENYELENGGARAAN.md  # Panduan teknikal pemasangan & konfigurasi
│   └── STATUS-DAN-ROADMAP.md         # Status fungsian & pelan Fasa 2/3
├── public/                           # Aset statik awam (termasuk salinan PDF PRD asal)
│   └── assets/aistudio/UPKS-Track-PRD-v1.0_fbf012b1.pdf
├── src/                              # Kod sumber aplikasi React TypeScript
│   ├── components/                   # Komponen antaramuka pengguna
│   │   ├── AdminDashboard.tsx        # Konsol kelulusan, CRUD aset, audit & laporan
│   │   ├── AdminModal.tsx            # Pengesahan PIN keselamatan pentadbir
│   │   ├── AssetCard.tsx             # Kad instrumen mudah alih dengan metadata bersih
│   │   ├── AssetDetailModal.tsx      # Lembaran spesifikasi 8 medan & sejarah aset
│   │   ├── AssetFilters.tsx          # Bar carian & penapis pantas instrumen
│   │   ├── AssetTable.tsx            # Jadual lejar inventori komputer meja
│   │   ├── CheckinModal.tsx          # Borang pemulangan & semakan kerosakan (BR-003)
│   │   ├── CheckoutModal.tsx         # Borang permohonan pinjaman & pautan WhatsApp
│   │   ├── Header.tsx                # Bar atas institusi mengikut 3-Zone Contract
│   │   ├── PrintableReportModal.tsx  # Format cetakan laporan rasmi berkepala surat LGM
│   │   ├── QRScannerModal.tsx        # Pengimbas kod QR kamera & simulasi ujian
│   │   ├── QRStickerModal.tsx        # Penjana pelekat Kod QR fizikal sedia cetak
│   │   └── StatSummary.tsx           # Jalur metrik statistik KPI berketepatan tinggi
│   ├── services/
│   │   └── storage.ts                # Perkhidmatan storan reaktif, audit & import/eksport
│   ├── utils/
│   │   ├── i18n.ts                   # Kamus dwibahasa (Bahasa Melayu & English)
│   │   └── statusHelper.tsx          # Pengiraan amaran tarikh tamat tempoh kalibrasi
│   ├── App.tsx                       # Titik masuk utama aplikasi React
│   ├── index.css                     # Gaya global Tailwind CSS v4 & peraturan cetakan
│   ├── main.tsx                      # Titik mula pendaftaran DOM React
│   └── types.ts                      # Definisi jenis data TypeScript (Asset, Loan, Audit)
├── .env.example                      # Contoh pembolehubah persekitaran selamat
├── .gitignore                        # Senarai fail dikecualikan daripada Git
├── CHANGELOG.md                      # Rekod sejarah perubahan versi
├── index.html                        # Templat HTML dengan tajuk dan fon makmal
├── metadata.json                     # Metadata identiti aplikasi
├── package.json                      # Konfigurasi dependensi dan skrip npm
├── README.md                         # Pengenalan utama projek untuk orang awam
├── tsconfig.json                     # Konfigurasi pengkompil TypeScript
└── vite.config.ts                    # Konfigurasi Vite & Tailwind CSS
```

---

## 3. Langkah Pemasangan & Menjalankan Projek

### Langkah 1: Klon Repositori
```bash
git clone https://github.com/[NAMA-AKAUN-ANDA]/upks-track.git
cd upks-track
```

### Langkah 2: Pasang Dependensi
Jalankan arahan berikut untuk memuat turun pakej yang diperlukan:
```bash
npm install
```

### Langkah 3: Konfigurasi Persekitaran (.env)
Salin fail contoh `.env.example` ke `.env`:
```bash
cp .env.example .env
```
*Nota: Tiada kunci API rahsia diperlukan untuk menjalankan fungsi teras aplikasi MVP.*

### Langkah 4: Mulakan Pelayan Pembangunan (*Dev Server*)
```bash
npm run dev
```
Pelayan akan bermula secara pantas di alamat `http://localhost:3000`. Buka alamat tersebut di pelayar web anda untuk mencuba aplikasi.

---

## 4. Arahan Semakan Kod & Pembinaan (*Build*)

Sebelum membuat penghantaran kod baharu, jalankan semakan kualiti berikut:

### Semakan Jenis Data & Linter (TypeScript Check):
```bash
npm run lint
```
Arahan ini menjalankan `tsc --noEmit` untuk mengesahkan tiada sebarang ralat sintaks atau jenis data yang rosak.

### Pembinaan untuk Produksi (*Production Build*):
```bash
npm run build
```
Hasil binaan yang dioptimumkan sepenuhnya akan dihasilkan di dalam direktori `dist/` sedia untuk dihoskan di mana-mana pelayan web statik atau kontena *Cloud Run*.

---

## 5. Pilihan Penggunaan di Pelayan Pengeluaran (*Production Deployment*)

Aplikasi ini dibina sebagai *Single Page Application* (SPA) berasaskan Vite yang amat ringan dan boleh dihoskan di pelbagai platform:

- **Google Cloud Run / Firebase Hosting:** Sesuai untuk persekitaran awan agensi kerajaan.
- **Docker / Nginx:** Salin kandungan folder `dist/` ke dalam imej web server Nginx standard:
  ```dockerfile
  FROM nginx:alpine
  COPY dist /usr/share/nginx/html
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```

---

## 6. Penyelesaian Masalah Pemasangan (*Troubleshooting*)

1. **Ralat "Port 3000 already in use":**  
   Periksa aplikasi lain yang sedang menggunakan port 3000 atau tetapkan port lain dalam `vite.config.ts`.
2. **Ralat Versi Node.js:**  
   Pastikan versi Node.js anda adalah $\ge 20.0.0$. Semak versi menggunakan `node -v`.
3. **Pelekat QR atau Laporan PDF Tidak Memaparkan Format Betul Semasa Cetakan:**  
   Pastikan pilihan "Background Graphics" diaktifkan pada tetingkap cetakan pelayar (*Browser Print Settings*) supaya warna penunjuk status kelihatan jelas.
