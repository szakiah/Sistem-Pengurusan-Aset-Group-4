import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  User,
  Calendar,
  AlertTriangle,
  QrCode,
  ArrowUpRight,
  RotateCcw,
  Tag,
  Edit2,
  Trash2,
  Clock,
  History,
  FileText,
} from 'lucide-react';
import { Asset, Language, LoanTransaction, AuditLog } from '../types';
import { translations } from '../utils/i18n';
import { getStatusBadge, checkCalibrationStatus } from '../utils/statusHelper';
import { StorageService } from '../services/storage';

interface AssetDetailModalProps {
  asset: Asset;
  lang: Language;
  onClose: () => void;
  onCheckout: (asset: Asset) => void;
  onCheckin: (asset: Asset) => void;
  onViewQR: (asset: Asset) => void;
  isAdmin: boolean;
  onEditAsset?: (asset: Asset) => void;
  onDeleteAsset?: (asset: Asset) => void;
  onUpdateCalibration?: (asset: Asset) => void;
  pendingLoan?: LoanTransaction;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  lang,
  onClose,
  onCheckout,
  onCheckin,
  onViewQR,
  isAdmin,
  onEditAsset,
  onDeleteAsset,
  onUpdateCalibration,
  pendingLoan,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setAuditLogs(StorageService.getAuditLogs(asset.id));
  }, [asset.id]);

  const statusInfo = getStatusBadge(asset.status);
  const calib = checkCalibrationStatus(asset.next_calibration_due);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="bg-white rounded-lg max-w-xl w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Top Header - Solid slate laboratory document header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-blue-400">
                {asset.serial_no}
              </span>
              <span className="text-slate-400 text-xs">·</span>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                <span className="font-medium text-slate-200">{statusInfo.label}</span>
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              {asset.name}
            </h2>
            {asset.model_brand && (
              <p className="text-xs text-slate-400 mt-0.5">{asset.model_brand}</p>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Spesifikasi Instrumen</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Jejak Audit ({auditLogs.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-5 max-h-[60vh] overflow-y-auto">
          {activeTab === 'details' ? (
            <div className="space-y-4">
              {/* Alert if Pending Approval */}
              {pendingLoan && (
                <div className="p-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2 text-xs">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Permohonan Pinjaman Menunggu Kelulusan</span>
                    <p className="mt-0.5 text-amber-800">
                      Dimohon oleh <strong>{pendingLoan.borrower_name}</strong> untuk tujuan{' '}
                      <em>{pendingLoan.purpose}</em> sehingga{' '}
                      <strong>{pendingLoan.expected_return_date}</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* 8 Mandatory Data Fields - Structured List with Hairlines */}
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 text-xs">
                {/* 1. Nama / Jenis */}
                <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500 font-medium sm:w-1/3">1. {t.colName}</span>
                  <span className="font-semibold text-slate-900 sm:w-2/3">{asset.name}</span>
                </div>

                {/* 2. No. Siri */}
                <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500 font-medium sm:w-1/3">2. {t.colSerial}</span>
                  <span className="font-mono font-bold text-blue-700 sm:w-2/3">{asset.serial_no}</span>
                </div>

                {/* 3. Lokasi Terkini */}
                <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500 font-medium sm:w-1/3">3. {t.colLocation}</span>
                  <span className="text-slate-900 font-medium sm:w-2/3">{asset.location}</span>
                </div>

                {/* 4. PIC */}
                <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500 font-medium sm:w-1/3">4. {t.colPic}</span>
                  <span className="text-slate-900 font-medium sm:w-2/3">{asset.pic_name}</span>
                </div>

                {/* 5. Harga Belian */}
                <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500 font-medium sm:w-1/3">5. {t.colPrice}</span>
                  <span className="font-mono font-semibold text-slate-900 sm:w-2/3">
                    RM {asset.purchase_price.toLocaleString()}
                  </span>
                </div>

                {/* 6. Tahun Belian */}
                <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500 font-medium sm:w-1/3">6. {t.colYear}</span>
                  <span className="font-mono text-slate-900 sm:w-2/3">{asset.purchase_year}</span>
                </div>

                {/* 7. Status Semasa */}
                <div className="p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-slate-500 font-medium sm:w-1/3">7. {t.colStatus}</span>
                  <div className="sm:w-2/3 flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                    <span className="font-semibold text-slate-900">{statusInfo.label}</span>
                    {asset.status === 'On Loan' && asset.current_borrower && (
                      <span className="text-slate-500 font-mono text-[11px]">
                        ({asset.current_borrower})
                      </span>
                    )}
                  </div>
                </div>

                {/* 8. Rekod Kalibrasi */}
                <div className="p-3 flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <span className="text-slate-500 font-medium sm:w-1/3">
                    8. Rekod Kalibrasi
                  </span>
                  <div className="sm:w-2/3 space-y-1">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500 text-[11px]">Terakhir:</span>
                      <span className="text-slate-800">{asset.last_calibration_date || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500 text-[11px]">Due Date:</span>
                      <span
                        className={
                          calib.isExpired
                            ? 'text-rose-700 font-bold'
                            : calib.isDueSoon
                            ? 'text-amber-700 font-semibold'
                            : 'text-slate-800'
                        }
                      >
                        {asset.next_calibration_due || '-'}
                      </span>
                      {(calib.isExpired || calib.isDueSoon) && (
                        <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-sans font-semibold">
                          {calib.badgeText}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra Notes */}
              {asset.notes && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-semibold text-slate-800 block mb-0.5">Catatan Makmal:</span>
                  <p>{asset.notes}</p>
                </div>
              )}
            </div>
          ) : (
            /* History & Audit Tab */
            <div className="space-y-2.5">
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Tiada sejarah aktiviti direkodkan lagi untuk instrumen ini.
                </div>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs space-y-0.5"
                  >
                    <div className="flex items-center justify-between text-slate-400 text-[11px] font-mono">
                      <span>{new Date(log.timestamp).toLocaleString('ms-MY')}</span>
                      <span className="font-semibold text-blue-700">{log.action_type}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{log.details_summary}</p>
                    <div className="text-[11px] text-slate-500">
                      Oleh: <strong className="text-slate-700">{log.actor_name}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewQR(asset)}
              className="py-1.5 px-2.5 text-xs font-semibold rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <QrCode className="w-3.5 h-3.5 text-blue-700" />
              <span>{t.btnPrintSticker}</span>
            </button>

            {isAdmin && onEditAsset && (
              <button
                onClick={() => onEditAsset(asset)}
                className="py-1.5 px-2.5 text-xs font-semibold rounded-md bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3 h-3 text-blue-600" />
                <span>Sunting</span>
              </button>
            )}

            {isAdmin && onDeleteAsset && (
              <button
                onClick={() => onDeleteAsset(asset)}
                className="py-1.5 px-2.5 text-xs font-semibold rounded-md bg-white border border-slate-200 hover:bg-rose-50 text-rose-700 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3 text-rose-600" />
                <span>Padam</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {asset.status === 'Available' && !pendingLoan && (
              <button
                onClick={() => {
                  onClose();
                  onCheckout(asset);
                }}
                className="py-1.5 px-3.5 text-xs font-bold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{t.btnCheckout}</span>
              </button>
            )}

            {(asset.status === 'On Loan' || asset.status === 'In Use') && (
              <button
                onClick={() => {
                  onClose();
                  onCheckin(asset);
                }}
                className="py-1.5 px-3.5 text-xs font-bold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.btnCheckin}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="py-1.5 px-3 text-xs font-medium rounded-md bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
