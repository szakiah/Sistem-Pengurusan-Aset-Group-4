import React from 'react';
import {
  MapPin,
  Calendar,
  AlertTriangle,
  QrCode,
  ArrowUpRight,
  RotateCcw,
  Hourglass,
} from 'lucide-react';
import { Asset, Language, LoanTransaction } from '../types';
import { translations } from '../utils/i18n';
import { getStatusBadge, checkCalibrationStatus } from '../utils/statusHelper';

interface AssetCardProps {
  asset: Asset;
  lang: Language;
  onViewDetails: (asset: Asset) => void;
  onCheckout: (asset: Asset) => void;
  onCheckin: (asset: Asset) => void;
  onViewQR: (asset: Asset) => void;
  pendingLoan?: LoanTransaction;
}

export const AssetCard: React.FC<AssetCardProps> = ({
  asset,
  lang,
  onViewDetails,
  onCheckout,
  onCheckin,
  onViewQR,
  pendingLoan,
}) => {
  const t = translations[lang];
  const statusInfo = getStatusBadge(asset.status);
  const calib = checkCalibrationStatus(asset.next_calibration_due);

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 p-3.5 flex flex-col justify-between gap-3 shadow-2xs">
      {/* Top Header: Serial No, Status, Name */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="font-mono text-xs font-bold text-blue-700">
            {asset.serial_no}
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
            <span className="font-medium text-slate-800">{statusInfo.label}</span>
          </div>
        </div>

        <h3
          onClick={() => onViewDetails(asset)}
          className="text-sm font-semibold text-slate-900 hover:text-blue-700 cursor-pointer transition-colors leading-snug"
        >
          {asset.name}
        </h3>

        {/* Unboxed Metadata (Zero-pill discipline) */}
        <div className="mt-2 flex items-center flex-wrap gap-1 text-[11px] text-slate-500">
          <span className="text-slate-700">{asset.location}</span>
          <span aria-hidden="true">·</span>
          <span>PIC: {asset.pic_name}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">RM {asset.purchase_price.toLocaleString()}</span>
        </div>

        {/* Pending loan ribbon */}
        {pendingLoan && (
          <div className="mt-2 text-[11px] text-amber-800 bg-amber-50 p-1.5 rounded border border-amber-200 flex items-center gap-1.5">
            <Hourglass className="w-3 h-3 text-amber-600 animate-spin" />
            <span>Menunggu kelulusan Admin ({pendingLoan.borrower_name})</span>
          </div>
        )}

        {/* Current borrower indicator */}
        {asset.status === 'On Loan' && asset.current_borrower && !pendingLoan && (
          <div className="mt-1.5 text-[11px] text-amber-900 bg-amber-50/60 px-2 py-0.5 rounded">
            Peminjam: <strong>{asset.current_borrower}</strong>
          </div>
        )}

        {/* Calibration footer line */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Due:</span>
            <span
              className={`font-mono ${
                calib.isExpired
                  ? 'text-rose-700 font-bold'
                  : calib.isDueSoon
                  ? 'text-amber-700 font-medium'
                  : 'text-slate-600'
              }`}
            >
              {asset.next_calibration_due || '-'}
            </span>
            {(calib.isExpired || calib.isDueSoon) && (
              <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0" />
            )}
          </div>
          <span className="font-mono text-slate-400 text-[10px]">{asset.purchase_year}</span>
        </div>
      </div>

      {/* Action Buttons (Ergonomic touch targets) */}
      <div className="pt-1 flex items-center gap-2">
        <button
          onClick={() => onViewDetails(asset)}
          className="flex-1 min-h-[38px] px-2 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center"
        >
          {t.btnViewDetails}
        </button>

        {asset.status === 'Available' && !pendingLoan && (
          <button
            onClick={() => onCheckout(asset)}
            className="flex-1 min-h-[38px] px-2.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-1 shadow-2xs"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Pinjam</span>
          </button>
        )}

        {(asset.status === 'On Loan' || asset.status === 'In Use') && (
          <button
            onClick={() => onCheckin(asset)}
            className="flex-1 min-h-[38px] px-2.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center justify-center gap-1 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Pulang</span>
          </button>
        )}

        <button
          onClick={() => onViewQR(asset)}
          className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors shrink-0"
          title={t.btnPrintSticker}
        >
          <QrCode className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
