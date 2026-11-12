import React from 'react';
import { X, Printer, Download, FlaskConical } from 'lucide-react';
import { Asset, LoanTransaction, Language } from '../types';
import { translations } from '../utils/i18n';
import { checkCalibrationStatus } from '../utils/statusHelper';

interface PrintableReportModalProps {
  reportType: 'assets' | 'loans' | 'calibration';
  assets: Asset[];
  loans: LoanTransaction[];
  lang: Language;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  reportType,
  assets,
  loans,
  lang,
  onClose,
}) => {
  const t = translations[lang];
  const currentDate = new Date().toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const getTitle = () => {
    switch (reportType) {
      case 'assets':
        return 'LAPORAN REKOD INDUK INSTRUMEN & ASET MAKMAL';
      case 'loans':
        return 'LAPORAN REKOD PERGERAKAN & PINJAMAN ASET';
      case 'calibration':
        return 'LAPORAN PEMATUHAN KALIBRASI & PENYELENGGARAAN INSTRUMEN';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full shadow-xl border border-slate-200 overflow-hidden print-sheet">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-xs">Pratonton Dokumen Rasmi UPKS LGM</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-blue-950 text-blue-200 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document */}
        <div className="p-8 sm:p-10 bg-white text-slate-900 text-xs">
          {/* Official Letterhead */}
          <div className="border-b-2 border-slate-900 pb-4 mb-6 flex items-start justify-between">
            <div>
              <div className="text-base font-extrabold tracking-tight text-blue-950 uppercase font-sans">
                LEMBAGA GETAH MALAYSIA (MALAYSIAN RUBBER BOARD)
              </div>
              <div className="text-xs font-bold text-slate-700">
                Unit Penyelidikan Kawalan & Standard (UPKS)
              </div>
              <div className="text-[11px] text-slate-500">
                Sistem Penjejakan & Pengurusan Aset Instrumen (UPKS Track) · Makmal Razlin
              </div>
            </div>
            <div className="text-right text-[11px] font-mono">
              <div>Tarikh Laporan: <strong>{currentDate}</strong></div>
              <div>Status: <strong>Disahkan</strong></div>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6 text-center">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-wide underline underline-offset-4">
              {getTitle()}
            </h2>
          </div>

          {/* Table based on Report Type */}
          {reportType === 'assets' && (
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                <tr>
                  <th className="border border-slate-300 p-2">No. Siri</th>
                  <th className="border border-slate-300 p-2">Nama Instrumen</th>
                  <th className="border border-slate-300 p-2">Lokasi</th>
                  <th className="border border-slate-300 p-2">PIC</th>
                  <th className="border border-slate-300 p-2 text-right">Harga (RM)</th>
                  <th className="border border-slate-300 p-2 text-center">Tahun</th>
                  <th className="border border-slate-300 p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {assets.map((a) => (
                  <tr key={a.id}>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-blue-900">
                      {a.serial_no}
                    </td>
                    <td className="border border-slate-300 p-2 font-medium">{a.name}</td>
                    <td className="border border-slate-300 p-2">{a.location}</td>
                    <td className="border border-slate-300 p-2">{a.pic_name}</td>
                    <td className="border border-slate-300 p-2 text-right font-mono tabular-nums">
                      {a.purchase_price.toLocaleString()}
                    </td>
                    <td className="border border-slate-300 p-2 text-center font-mono">
                      {a.purchase_year}
                    </td>
                    <td className="border border-slate-300 p-2 font-semibold">{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'loans' && (
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                <tr>
                  <th className="border border-slate-300 p-2">Aset</th>
                  <th className="border border-slate-300 p-2">Peminjam</th>
                  <th className="border border-slate-300 p-2">Tujuan / Projek</th>
                  <th className="border border-slate-300 p-2">Destinasi</th>
                  <th className="border border-slate-300 p-2">Tarikh Keluar</th>
                  <th className="border border-slate-300 p-2">Jangkaan Pulang</th>
                  <th className="border border-slate-300 p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {loans.map((l) => (
                  <tr key={l.id}>
                    <td className="border border-slate-300 p-2 font-mono">
                      {l.asset_serial_no}
                    </td>
                    <td className="border border-slate-300 p-2 font-bold">{l.borrower_name}</td>
                    <td className="border border-slate-300 p-2">{l.purpose}</td>
                    <td className="border border-slate-300 p-2">{l.destination_location}</td>
                    <td className="border border-slate-300 p-2 font-mono">{l.checkout_date}</td>
                    <td className="border border-slate-300 p-2 font-mono">{l.expected_return_date}</td>
                    <td className="border border-slate-300 p-2 font-semibold">
                      {l.approval_status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'calibration' && (
            <table className="w-full text-left border-collapse border border-slate-300">
              <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 uppercase">
                <tr>
                  <th className="border border-slate-300 p-2">No. Siri</th>
                  <th className="border border-slate-300 p-2">Nama Instrumen</th>
                  <th className="border border-slate-300 p-2">Lokasi</th>
                  <th className="border border-slate-300 p-2">Kalibrasi Terakhir</th>
                  <th className="border border-slate-300 p-2">Tarikh Luput Kalibrasi</th>
                  <th className="border border-slate-300 p-2">Status Pematuhan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {assets.map((a) => {
                  const calib = checkCalibrationStatus(a.next_calibration_due);
                  return (
                    <tr key={a.id}>
                      <td className="border border-slate-300 p-2 font-mono font-bold">
                        {a.serial_no}
                      </td>
                      <td className="border border-slate-300 p-2 font-medium">{a.name}</td>
                      <td className="border border-slate-300 p-2">{a.location}</td>
                      <td className="border border-slate-300 p-2 font-mono">
                        {a.last_calibration_date || '-'}
                      </td>
                      <td className="border border-slate-300 p-2 font-mono font-bold">
                        {a.next_calibration_due || '-'}
                      </td>
                      <td className="border border-slate-300 p-2 font-semibold">
                        {calib.badgeText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* Official Signatures Footer */}
          <div className="mt-12 pt-8 border-t border-slate-300 grid grid-cols-2 gap-8 text-[11px]">
            <div>
              <p className="text-slate-500 mb-10">Disediakan oleh:</p>
              <div className="w-48 border-b border-slate-700" />
              <p className="mt-1 font-bold">Pegawai Pengurus Aset</p>
              <p className="text-slate-500">Unit Penyelidikan Kawalan & Standard (UPKS)</p>
            </div>
            <div className="text-right">
              <p className="text-slate-500 mb-10">Disahkan oleh:</p>
              <div className="w-48 border-b border-slate-700 ml-auto" />
              <p className="mt-1 font-bold">Dr. Razlin / Ketua Makmal</p>
              <p className="text-slate-500">Lembaga Getah Malaysia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
