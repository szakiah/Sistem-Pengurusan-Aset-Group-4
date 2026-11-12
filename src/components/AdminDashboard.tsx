import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  FileSpreadsheet,
  FileText,
  Settings,
  AlertTriangle,
  Calendar,
  Save,
  Database,
  ArrowLeft,
} from 'lucide-react';
import {
  Asset,
  LoanTransaction,
  AuditLog,
  Language,
  AppSettings,
  AssetStatus,
} from '../types';
import { translations } from '../utils/i18n';
import { StorageService } from '../services/storage';
import { checkCalibrationStatus, getStatusBadge } from '../utils/statusHelper';
import { PrintableReportModal } from './PrintableReportModal';

interface AdminDashboardProps {
  lang: Language;
  onClose: () => void;
  assets: Asset[];
  loans: LoanTransaction[];
  auditLogs: AuditLog[];
  settings: AppSettings;
  onRefresh: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  onClose,
  assets,
  loans,
  auditLogs,
  settings,
  onRefresh,
}) => {
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<
    'approvals' | 'assets' | 'audit' | 'import_export' | 'settings'
  >('approvals');

  // Approvals State
  const pendingLoans = loans.filter((l) => l.approval_status === 'Pending');
  const pastLoans = loans.filter((l) => l.approval_status !== 'Pending');
  const [rejectingLoanId, setRejectingLoanId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  // Asset CRUD State
  const [isAddAssetModalOpen, setIsAddAssetModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState<Asset | null>(null);
  const [calibratingAsset, setCalibratingAsset] = useState<Asset | null>(null);

  // New Asset Form State
  const [formName, setFormName] = useState('');
  const [formSerial, setFormSerial] = useState('');
  const [formLocation, setFormLocation] = useState('Makmal Razlin');
  const [formPic, setFormPic] = useState('Dr. Razlin');
  const [formPrice, setFormPrice] = useState<number>(2500);
  const [formYear, setFormYear] = useState<number>(new Date().getFullYear());
  const [formStatus, setFormStatus] = useState<AssetStatus>('Available');
  const [formLastCalib, setFormLastCalib] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [formNextDue, setFormNextDue] = useState(
    new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
  );
  const [formModel, setFormModel] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [assetFormError, setAssetFormError] = useState<string | null>(null);

  // Calibration Quick Form
  const [quickCalibLast, setQuickCalibLast] = useState('');
  const [quickCalibNext, setQuickCalibNext] = useState('');

  // Audit Filter
  const [auditAssetFilter, setAuditAssetFilter] = useState<string>('all');

  // Import / Export State
  const [importResult, setImportResult] = useState<{
    totalRows: number;
    importedCount: number;
    skippedCount: number;
    errors: string[];
  } | null>(null);
  const [printableReport, setPrintableReport] = useState<
    'assets' | 'loans' | 'calibration' | null
  >(null);

  // Settings State
  const [adminPhone, setAdminPhone] = useState(settings.adminWhatsApp);
  const [adminEmail, setAdminEmail] = useState(settings.adminEmail);
  const [adminPin, setAdminPin] = useState(settings.adminPin);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Actions
  const handleApprove = (loanId: string) => {
    StorageService.approveLoan(loanId, 'Dr. Razlin (Admin UPKS)');
    onRefresh();
  };

  const handleReject = (loanId: string) => {
    StorageService.rejectLoan(
      loanId,
      rejectionReason || 'Ditolak oleh Admin UPKS.',
      'Dr. Razlin (Admin UPKS)'
    );
    setRejectingLoanId(null);
    setRejectionReason('');
    onRefresh();
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormName('');
    setFormSerial('');
    setFormLocation('Makmal Razlin');
    setFormPic('Dr. Razlin');
    setFormPrice(2500);
    setFormYear(new Date().getFullYear());
    setFormStatus('Available');
    setFormLastCalib(new Date().toISOString().split('T')[0]);
    setFormNextDue(
      new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
    );
    setFormModel('');
    setFormNotes('');
    setAssetFormError(null);
    setIsAddAssetModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setFormName(asset.name);
    setFormSerial(asset.serial_no);
    setFormLocation(asset.location);
    setFormPic(asset.pic_name);
    setFormPrice(asset.purchase_price);
    setFormYear(asset.purchase_year);
    setFormStatus(asset.status);
    setFormLastCalib(asset.last_calibration_date || '');
    setFormNextDue(asset.next_calibration_due || '');
    setFormModel(asset.model_brand || '');
    setFormNotes(asset.notes || '');
    setAssetFormError(null);
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setAssetFormError(null);

    if (!formName.trim() || !formSerial.trim() || !formLocation.trim() || !formPic.trim()) {
      setAssetFormError('Semua medan bertanda (*) wajib diisi.');
      return;
    }

    if (formPrice < 0) {
      setAssetFormError('Harga belian mestilah nombor 0 atau lebih.');
      return;
    }

    if (formYear < 1950 || formYear > 2050) {
      setAssetFormError('Tahun belian mestilah 4 digit tahun yang sah.');
      return;
    }

    if (editingAsset) {
      const res = StorageService.updateAsset(
        editingAsset.id,
        {
          name: formName,
          serial_no: formSerial,
          location: formLocation,
          pic_name: formPic,
          purchase_price: formPrice,
          purchase_year: formYear,
          status: formStatus,
          last_calibration_date: formLastCalib,
          next_calibration_due: formNextDue,
          model_brand: formModel,
          notes: formNotes,
        },
        'Dr. Razlin (Admin UPKS)'
      );

      if (!res.success) {
        setAssetFormError(
          res.error === 'serialUniqueError'
            ? t.serialUniqueError
            : 'Gagal mengemaskini maklumat aset.'
        );
        return;
      }
      setEditingAsset(null);
    } else {
      const res = StorageService.createAsset(
        {
          name: formName,
          serial_no: formSerial,
          location: formLocation,
          pic_name: formPic,
          purchase_price: formPrice,
          purchase_year: formYear,
          status: formStatus,
          last_calibration_date: formLastCalib,
          next_calibration_due: formNextDue,
          model_brand: formModel,
          notes: formNotes,
        },
        'Dr. Razlin (Admin UPKS)'
      );

      if (!res.success) {
        setAssetFormError(
          res.error === 'serialUniqueError'
            ? t.serialUniqueError
            : 'Gagal mendaftar instrumen baharu.'
        );
        return;
      }
      setIsAddAssetModalOpen(false);
    }

    onRefresh();
  };

  const handleDeleteConfirm = () => {
    if (!deletingAsset) return;
    StorageService.deleteAsset(deletingAsset.id, 'Dr. Razlin (Admin UPKS)');
    setDeletingAsset(null);
    onRefresh();
  };

  const openCalibModal = (asset: Asset) => {
    setCalibratingAsset(asset);
    setQuickCalibLast(new Date().toISOString().split('T')[0]);
    setQuickCalibNext(
      new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
    );
  };

  const handleSaveCalibration = () => {
    if (!calibratingAsset) return;
    StorageService.updateCalibration(
      calibratingAsset.id,
      quickCalibLast,
      quickCalibNext,
      'Dr. Razlin (Admin UPKS)'
    );
    setCalibratingAsset(null);
    onRefresh();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSettings({
      adminWhatsApp: adminPhone,
      adminEmail: adminEmail,
      adminPin: adminPin,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
    onRefresh();
  };

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = StorageService.importAssetsFromCSV(text, 'Dr. Razlin (Admin UPKS)');
      setImportResult(res);
      onRefresh();
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'name,serial_no,location,pic_name,purchase_price,purchase_year,last_calibration_date,next_calibration_due\n' +
      '"Micro Pipette 20-200 uL","UPKS-MP-009","Makmal Razlin","Dr. Razlin",1800,2024,"2026-01-10","2027-01-10"\n' +
      '"Digital Thermometer","UPKS-TH-010","Makmal Kimia UPKS","En. Mohd Hafiz",850,2023,"2026-03-15","2027-03-15"\n' +
      '"Vortex Mixer","UPKS-VM-011","Makmal Razlin","Pn. Faridah Hanim",1200,2022,"2026-02-01","2027-02-01"';

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'templat_import_instrumen_upks.csv';
    link.click();
  };

  const handleExportCSV = (type: 'assets' | 'loans') => {
    let csv = '';
    if (type === 'assets') {
      csv = 'id,name,serial_no,location,pic_name,purchase_price,purchase_year,status,last_calibration_date,next_calibration_due,current_borrower\n';
      assets.forEach((a) => {
        csv += `"${a.id}","${a.name}","${a.serial_no}","${a.location}","${a.pic_name}",${a.purchase_price},${a.purchase_year},"${a.status}","${a.last_calibration_date}","${a.next_calibration_due}","${a.current_borrower || ''}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `senarai_aset_upks_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    } else {
      csv = 'id,asset_name,asset_serial_no,borrower_name,purpose,destination_location,checkout_date,expected_return_date,approval_status,actual_return_date,physical_condition_out,physical_condition_in\n';
      loans.forEach((l) => {
        csv += `"${l.id}","${l.asset_name}","${l.asset_serial_no}","${l.borrower_name}","${l.purpose}","${l.destination_location}","${l.checkout_date}","${l.expected_return_date}","${l.approval_status}","${l.actual_return_date || ''}","${l.physical_condition_out}","${l.physical_condition_in || ''}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `sejarah_pinjaman_upks_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    }
  };

  const filteredAuditLogs =
    auditAssetFilter === 'all'
      ? auditLogs
      : auditLogs.filter((l) => l.asset_id === auditAssetFilter);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16 no-print">
      {/* Administrative Console Top Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  {t.adminDashboardTitle}
                </h1>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/80 text-emerald-300 border border-emerald-700">
                  Sesi Disahkan
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Unit Penyelidikan Kawalan & Standard (UPKS) · Makmal Razlin
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Direktori</span>
          </button>
        </div>

        {/* Console Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 overflow-x-auto scrollbar-none border-t border-slate-800">
          {[
            { id: 'approvals', label: t.tabApprovals, badge: pendingLoans.length },
            { id: 'assets', label: t.tabAssets, badge: 0 },
            { id: 'audit', label: t.tabAudit, badge: 0 },
            { id: 'import_export', label: t.tabImportExport, badge: 0 },
            { id: 'settings', label: t.tabSettings, badge: 0 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2.5 px-3.5 text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 border-b-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-white bg-slate-800/60'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5">
        {/* TAB 1: KELULUSAN PINJAMAN */}
        {activeTab === 'approvals' && (
          <div className="space-y-5">
            {/* Pending Approvals */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-2xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Permohonan Pinjaman Menunggu Kelulusan ({pendingLoans.length})
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Semak peminjam, destinasi lapangan, dan keadaan fizikal instrumen sebelum meluluskan.
                  </p>
                </div>
              </div>

              {pendingLoans.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs bg-slate-50 rounded-md border border-dashed border-slate-200">
                  <CheckCircle2 className="w-6 h-6 mx-auto text-emerald-500 mb-1.5 opacity-80" />
                  {t.noPendingLoans}
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingLoans.map((loan) => (
                    <div
                      key={loan.id}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-blue-700">
                            {loan.asset_serial_no}
                          </span>
                          <span className="font-semibold text-slate-900">
                            {loan.asset_name}
                          </span>
                          <span className="text-[10px] text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded font-medium">
                            Menunggu Kelulusan
                          </span>
                        </div>

                        <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 text-slate-600 text-[11px] pt-0.5">
                          <span>
                            Peminjam: <strong className="text-slate-800">{loan.borrower_name}</strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Destinasi: <strong className="text-slate-800">{loan.destination_location}</strong>
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>
                            Jangkaan Pulang:{' '}
                            <strong className="text-slate-800 font-mono">
                              {loan.expected_return_date}
                            </strong>
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 mt-1">
                          <span className="font-medium text-slate-800">Tujuan:</span> {loan.purpose}
                          <span className="mx-1 text-slate-300">|</span>
                          <span>
                            Keadaan Awal: <strong>{loan.physical_condition_out}</strong>
                            {loan.physical_condition_out_notes && ` (${loan.physical_condition_out_notes})`}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                        <button
                          onClick={() => handleApprove(loan.id)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Luluskan</span>
                        </button>
                        <button
                          onClick={() => setRejectingLoanId(loan.id)}
                          className="px-2.5 py-1.5 text-xs font-medium rounded-md bg-white border border-slate-300 hover:bg-rose-50 text-rose-700 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Tolak</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rejection Modal */}
            {rejectingLoanId && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-sm w-full p-4 space-y-3 shadow-xl border border-slate-200 text-xs">
                  <h3 className="font-bold text-slate-900">
                    {t.rejectReasonPrompt}
                  </h3>
                  <textarea
                    rows={3}
                    autoFocus
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder={t.rejectReasonPlaceholder}
                    className="w-full p-2 bg-slate-50 border rounded-md focus:outline-none focus:ring-1 focus:ring-rose-500"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setRejectingLoanId(null)}
                      className="px-3 py-1.5 font-medium bg-slate-100 rounded-md"
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => handleReject(rejectingLoanId)}
                      className="px-3 py-1.5 font-bold bg-rose-600 text-white rounded-md"
                    >
                      Sahkan Tolak
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Processed Loans Ledger */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-2xs">
              <h2 className="text-sm font-bold text-slate-900 mb-3">
                Sejarah Transaksi Pinjaman Diproses ({pastLoans.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">No. Siri</th>
                      <th className="py-2.5 px-3">Instrumen</th>
                      <th className="py-2.5 px-3">Peminjam</th>
                      <th className="py-2.5 px-3">Tarikh Keluar</th>
                      <th className="py-2.5 px-3">Tarikh Pulang</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pastLoans.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-mono font-bold text-blue-700">
                          {l.asset_serial_no}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-900">
                          {l.asset_name}
                        </td>
                        <td className="py-2 px-3">{l.borrower_name}</td>
                        <td className="py-2 px-3 font-mono text-[11px]">{l.checkout_date}</td>
                        <td className="py-2 px-3 font-mono text-[11px]">
                          {l.actual_return_date || `Dijadualkan: ${l.expected_return_date}`}
                        </td>
                        <td className="py-2 px-3">
                          <span
                            className={`font-medium ${
                              l.approval_status === 'Approved'
                                ? l.actual_return_date
                                  ? 'text-slate-600'
                                  : 'text-emerald-700 font-semibold'
                                : 'text-rose-700'
                            }`}
                          >
                            {l.approval_status === 'Approved'
                              ? l.actual_return_date
                                ? 'Selesai Pulang'
                                : 'Aktif (On Loan)'
                              : `Ditolak`}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PENGURUSAN REKOD ASET (CRUD) */}
        {activeTab === 'assets' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Direktori Induk Instrumen Makmal (CRUD)
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Pendaftaran aset baharu, kemas kini penentukuran kalibrasi, dan penyelenggaraan inventori.
                  </p>
                </div>
                <button
                  onClick={openAddModal}
                  className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.btnAddAsset}</span>
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">No. Siri</th>
                      <th className="py-2.5 px-3">Nama Instrumen</th>
                      <th className="py-2.5 px-3">Lokasi</th>
                      <th className="py-2.5 px-3">PIC</th>
                      <th className="py-2.5 px-3 text-right">Harga (RM)</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Kalibrasi Due</th>
                      <th className="py-2.5 px-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assets.map((asset) => {
                      const statusInfo = getStatusBadge(asset.status);
                      const calib = checkCalibrationStatus(asset.next_calibration_due);

                      return (
                        <tr key={asset.id} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3 font-mono font-semibold text-blue-700">
                            {asset.serial_no}
                          </td>
                          <td className="py-2 px-3 font-medium text-slate-900">
                            {asset.name}
                          </td>
                          <td className="py-2 px-3 text-slate-600">{asset.location}</td>
                          <td className="py-2 px-3 text-slate-700">{asset.pic_name}</td>
                          <td className="py-2 px-3 text-right font-mono tabular-nums">
                            {asset.purchase_price.toLocaleString()}
                          </td>
                          <td className="py-2 px-3">
                            <span className="font-medium text-slate-800">{statusInfo.label}</span>
                          </td>
                          <td className="py-2 px-3 font-mono text-[11px]">
                            <span
                              className={
                                calib.isExpired
                                  ? 'text-rose-700 font-bold'
                                  : calib.isDueSoon
                                  ? 'text-amber-700 font-semibold'
                                  : 'text-slate-600'
                              }
                            >
                              {asset.next_calibration_due || '-'}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openCalibModal(asset)}
                                className="p-1 rounded text-amber-700 hover:bg-amber-50"
                                title="Kemas Kini Kalibrasi"
                              >
                                <Calendar className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => openEditModal(asset)}
                                className="p-1 rounded text-blue-700 hover:bg-blue-50"
                                title="Sunting Aset"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingAsset(asset)}
                                className="p-1 rounded text-rose-600 hover:bg-rose-50"
                                title="Padam Aset"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ADD / EDIT ASSET MODAL */}
            {(isAddAssetModalOpen || editingAsset) && (
              <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
                <div className="bg-white rounded-lg max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden text-xs">
                  <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
                    <h3 className="font-bold text-sm">
                      {editingAsset ? t.editAssetTitle : t.addAssetTitle}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddAssetModalOpen(false);
                        setEditingAsset(null);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveAsset} className="p-4 space-y-3">
                    {assetFormError && (
                      <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{assetFormError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Nama / Jenis Instrumen *
                        </label>
                        <input
                          type="text"
                          required
                          value={formName}
                          onChange={(e) => setFormName(e.target.value)}
                          placeholder="cth: Micro Pipette 100-1000 µL"
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          No. Siri / Tag Aset (Unik) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formSerial}
                          onChange={(e) => setFormSerial(e.target.value)}
                          placeholder="cth: UPKS-MP-005"
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono font-bold text-blue-700 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Lokasi Terkini *
                        </label>
                        <input
                          type="text"
                          required
                          list="locations-admin"
                          value={formLocation}
                          onChange={(e) => setFormLocation(e.target.value)}
                          placeholder="cth: Makmal Razlin"
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                        <datalist id="locations-admin">
                          {settings.locationsList.map((loc) => (
                            <option key={loc} value={loc} />
                          ))}
                        </datalist>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Pegawai Bertanggungjawab (PIC) *
                        </label>
                        <input
                          type="text"
                          required
                          value={formPic}
                          onChange={(e) => setFormPic(e.target.value)}
                          placeholder="cth: Dr. Razlin"
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Harga Belian (RM) *
                        </label>
                        <input
                          type="number"
                          min={0}
                          required
                          value={formPrice}
                          onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Tahun Belian *
                        </label>
                        <input
                          type="number"
                          required
                          value={formYear}
                          onChange={(e) => setFormYear(parseInt(e.target.value, 10) || 2024)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Status Semasa
                        </label>
                        <select
                          value={formStatus}
                          onChange={(e) => setFormStatus(e.target.value as any)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-blue-600"
                        >
                          <option value="Available">Available (Tersedia)</option>
                          <option value="In Use">In Use (Diguna di Makmal)</option>
                          <option value="On Loan">On Loan (Dipinjam Keluar)</option>
                          <option value="Under Maintenance">Under Maintenance / Calibration</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Jenama & Model
                        </label>
                        <input
                          type="text"
                          value={formModel}
                          onChange={(e) => setFormModel(e.target.value)}
                          placeholder="cth: Eppendorf Research Plus"
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Kalibrasi Terakhir
                        </label>
                        <input
                          type="date"
                          value={formLastCalib}
                          onChange={(e) => setFormLastCalib(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Kalibrasi Seterusnya (Due Date)
                        </label>
                        <input
                          type="date"
                          value={formNextDue}
                          onChange={(e) => setFormNextDue(e.target.value)}
                          className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-900 focus:ring-1 focus:ring-blue-600"
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddAssetModalOpen(false);
                          setEditingAsset(null);
                        }}
                        className="px-3 py-1.5 font-medium rounded-md text-slate-600 hover:bg-slate-100"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 font-bold rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 shadow-2xs"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* DELETE ASSET CONFIRMATION (BR-005) */}
            {deletingAsset && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-sm w-full p-4 space-y-3 shadow-xl border border-slate-200 text-xs">
                  <h3 className="font-bold text-slate-900">
                    {t.deleteAssetConfirmTitle}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {t.deleteAssetConfirmText}
                  </p>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200 font-mono text-[11px]">
                    <strong>{deletingAsset.name}</strong> ({deletingAsset.serial_no})
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setDeletingAsset(null)}
                      className="px-3 py-1.5 font-medium bg-slate-100 rounded-md"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      className="px-3 py-1.5 font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-md"
                    >
                      Sahkan Padam
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* QUICK CALIBRATION UPDATE MODAL */}
            {calibratingAsset && (
              <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg max-w-sm w-full p-4 space-y-3 shadow-xl border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Kemas Kini Tarikh Kalibrasi</span>
                  </div>
                  <p className="text-slate-600">
                    {calibratingAsset.name} [{calibratingAsset.serial_no}]
                  </p>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tarikh Kalibrasi Dijalankan
                    </label>
                    <input
                      type="date"
                      value={quickCalibLast}
                      onChange={(e) => setQuickCalibLast(e.target.value)}
                      className="w-full p-2 bg-slate-50 border rounded-md font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Tarikh Luput Kalibrasi (Due Date)
                    </label>
                    <input
                      type="date"
                      value={quickCalibNext}
                      onChange={(e) => setQuickCalibNext(e.target.value)}
                      className="w-full p-2 bg-slate-50 border rounded-md font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      onClick={() => setCalibratingAsset(null)}
                      className="px-3 py-1.5 font-medium bg-slate-100 rounded-md"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveCalibration}
                      className="px-4 py-1.5 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: JEJAK AUDIT (FR-007) */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-2xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{t.auditTrailTitle}</h2>
                  <p className="text-[11px] text-slate-500">
                    Log aktiviti append-only kekal bagi integriti semakan akreditasi makmal.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Tapis:</span>
                  <select
                    value={auditAssetFilter}
                    onChange={(e) => setAuditAssetFilter(e.target.value)}
                    className="p-1.5 text-xs bg-slate-50 border rounded-md text-slate-800"
                  >
                    <option value="all">{t.allAssets}</option>
                    {assets.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.serial_no} — {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">{t.timeHeader}</th>
                      <th className="py-2.5 px-3">{t.actionHeader}</th>
                      <th className="py-2.5 px-3">Aset</th>
                      <th className="py-2.5 px-3">{t.actorHeader}</th>
                      <th className="py-2.5 px-3">{t.detailsHeader}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString('ms-MY')}
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap font-medium text-slate-900">
                          {log.action_type}
                        </td>
                        <td className="py-2 px-3 text-slate-800">
                          {log.asset_name || log.asset_id}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-900 whitespace-nowrap">
                          {log.actor_name}
                        </td>
                        <td className="py-2 px-3 text-slate-600 leading-snug">
                          {log.details_summary}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: IMPORT & EKSPORT (FR-008) */}
        {activeTab === 'import_export' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Import */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-0.5">
                  Import Pukal CSV / Excel
                </h3>
                <p className="text-xs text-slate-500">
                  Daftarkan senarai instrumen sedia ada secara pukal.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-md text-center space-y-2">
                <input
                  type="file"
                  accept=".csv,.txt"
                  id="csv-file-input"
                  onChange={handleCSVUpload}
                  className="hidden"
                />
                <label
                  htmlFor="csv-file-input"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-colors shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{t.uploadCSVBtn}</span>
                </label>
                <p className="text-[11px] text-slate-400">
                  Format .csv (UTF-8) dengan tajuk lajur piawai
                </p>
              </div>

              {importResult && (
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="font-semibold text-slate-800">Keputusan Import:</div>
                  <div className="flex gap-4 font-mono text-[11px]">
                    <span>Dibaca: {importResult.totalRows}</span>
                    <span className="text-emerald-700 font-bold">Berjaya: {importResult.importedCount}</span>
                    <span className="text-rose-700">Dilangkau: {importResult.skippedCount}</span>
                  </div>
                  {importResult.errors.length > 0 && (
                    <div className="mt-1 text-[11px] text-rose-700 max-h-20 overflow-y-auto">
                      {importResult.errors.map((err, i) => (
                        <div key={i}>• {err}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={handleDownloadTemplate}
                  className="w-full py-1.5 text-xs font-medium rounded-md border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{t.downloadTemplateBtn}</span>
                </button>
              </div>
            </div>

            {/* Eksport */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-0.5">
                  {t.exportSectionTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  Laporan rasmi bagi audit kualiti standard dan perakaunan LGM.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleExportCSV('assets')}
                  className="w-full p-2.5 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-xs text-slate-800 transition-colors"
                >
                  <span className="font-medium">{t.exportAssetsCSV}</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => handleExportCSV('loans')}
                  className="w-full p-2.5 rounded-md border border-slate-200 hover:bg-slate-50 flex items-center justify-between text-xs text-slate-800 transition-colors"
                >
                  <span className="font-medium">{t.exportLoansCSV}</span>
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => setPrintableReport('assets')}
                  className="w-full p-2.5 rounded-md border border-blue-200 bg-blue-50/40 hover:bg-blue-50 flex items-center justify-between text-xs font-semibold text-blue-900 transition-colors"
                >
                  <span>{t.exportAssetsPDF}</span>
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                </button>

                <button
                  onClick={() => setPrintableReport('calibration')}
                  className="w-full p-2.5 rounded-md border border-amber-200 bg-amber-50/40 hover:bg-amber-50 flex items-center justify-between text-xs font-semibold text-amber-900 transition-colors"
                >
                  <span>{t.exportCalibPDF}</span>
                  <FileText className="w-3.5 h-3.5 text-amber-700" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TETAPAN SISTEM */}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-2xs">
              <h3 className="font-bold text-sm text-slate-900 mb-3">{t.settingsTitle}</h3>

              {settingsSaved && (
                <div className="mb-3 p-2.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tetapan berjaya disimpan.</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.adminPhoneLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.adminEmailLabel}
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.adminPinLabel}
                  </label>
                  <input
                    type="password"
                    maxLength={10}
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-slate-900 text-center tracking-widest"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 text-xs font-bold rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{t.saveSettingsBtn}</span>
                </button>
              </form>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col justify-between text-xs space-y-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-2">
                  {t.cloudDbStatusTitle}
                </h3>
                <div className="p-3 rounded-md bg-slate-50 border border-slate-200 space-y-1 mb-3">
                  <div className="font-semibold text-slate-800">
                    Penyimpanan Terjamin Tempatan Aktif
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    Sistem beroperasi dengan enjin simpanan sub-50ms untuk operasi pantas di makmal dan lapangan.
                  </p>
                </div>

                <div className="text-[11px] font-mono text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 space-y-0.5">
                  <div>PROJEK ID: lgm-upks-track-2026</div>
                  <div>WILAYAH: asia-southeast1 (Malaysia)</div>
                  <div>STATUS ENJIN: Sedia Disambungkan</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (confirm('Tetapkan semula semua data kepada sampel makmal lalai?')) {
                      StorageService.resetToDefault();
                      onRefresh();
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium"
                >
                  Tetapkan Semula Data Lalai (Reset Demo)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Printable Report Modal */}
      {printableReport && (
        <PrintableReportModal
          reportType={printableReport}
          assets={assets}
          loans={loans}
          lang={lang}
          onClose={() => setPrintableReport(null)}
        />
      )}
    </div>
  );
};
