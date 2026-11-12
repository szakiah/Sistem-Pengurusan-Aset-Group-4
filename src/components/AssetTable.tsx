import React, { useState } from 'react';
import {
  ArrowUpDown,
  AlertTriangle,
  QrCode,
  ArrowUpRight,
  RotateCcw,
  Hourglass,
  Eye,
} from 'lucide-react';
import { Asset, Language, LoanTransaction } from '../types';
import { translations } from '../utils/i18n';
import { getStatusBadge, checkCalibrationStatus } from '../utils/statusHelper';

interface AssetTableProps {
  assets: Asset[];
  lang: Language;
  onViewDetails: (asset: Asset) => void;
  onCheckout: (asset: Asset) => void;
  onCheckin: (asset: Asset) => void;
  onViewQR: (asset: Asset) => void;
  pendingLoans: LoanTransaction[];
}

type SortField =
  | 'name'
  | 'serial_no'
  | 'location'
  | 'pic_name'
  | 'purchase_price'
  | 'status'
  | 'next_calibration_due';

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  lang,
  onViewDetails,
  onCheckout,
  onCheckin,
  onViewQR,
  pendingLoans,
}) => {
  const t = translations[lang];
  const [sortField, setSortField] = useState<SortField>('serial_no');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedAssets = [...assets].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'purchase_price') {
      return sortAsc
        ? a.purchase_price - b.purchase_price
        : b.purchase_price - a.purchase_price;
    }

    aVal = (aVal || '').toString().toLowerCase();
    bVal = (bVal || '').toString().toLowerCase();
    return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 select-none">
            <tr>
              <th
                onClick={() => handleSort('serial_no')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>{t.colSerial}</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>{t.colName}</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('location')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>{t.colLocation}</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('pic_name')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>{t.colPic}</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('status')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>{t.colStatus}</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('next_calibration_due')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>{t.colCalibDue}</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th
                onClick={() => handleSort('purchase_price')}
                className="py-3 px-3.5 cursor-pointer hover:bg-slate-100 transition-colors whitespace-nowrap text-right"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{t.colPrice}</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-3.5 text-right whitespace-nowrap">
                {t.colActions}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedAssets.map((asset) => {
              const statusInfo = getStatusBadge(asset.status);
              const calib = checkCalibrationStatus(asset.next_calibration_due);
              const pending = pendingLoans.find((l) => l.asset_id === asset.id);

              return (
                <tr
                  key={asset.id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Serial No */}
                  <td className="py-3 px-3.5 whitespace-nowrap font-mono text-xs font-semibold text-blue-700">
                    {asset.serial_no}
                  </td>

                  {/* Name & Model */}
                  <td className="py-3 px-3.5">
                    <div
                      onClick={() => onViewDetails(asset)}
                      className="font-medium text-slate-900 group-hover:text-blue-700 cursor-pointer transition-colors max-w-sm truncate"
                    >
                      {asset.name}
                    </div>
                    {asset.model_brand && (
                      <div className="text-[11px] text-slate-400 truncate">
                        {asset.model_brand}
                      </div>
                    )}
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-600">
                    {asset.location}
                  </td>

                  {/* PIC */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-slate-700">
                    {asset.pic_name}
                  </td>

                  {/* Status & Borrower */}
                  <td className="py-3 px-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`} />
                      <span className="font-medium text-slate-800">{statusInfo.label}</span>
                    </div>
                    {pending && (
                      <span className="text-[10px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                        <Hourglass className="w-2.5 h-2.5 animate-spin" />
                        Menunggu Kelulusan
                      </span>
                    )}
                    {asset.status === 'On Loan' && asset.current_borrower && (
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {asset.current_borrower}
                      </div>
                    )}
                  </td>

                  {/* Calibration Due */}
                  <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={
                          calib.isExpired
                            ? 'text-rose-700 font-semibold'
                            : calib.isDueSoon
                            ? 'text-amber-700 font-medium'
                            : 'text-slate-600'
                        }
                      >
                        {asset.next_calibration_due || '-'}
                      </span>
                      {(calib.isExpired || calib.isDueSoon) && (
                        <span title={calib.badgeText}>
                          <AlertTriangle
                            className={`w-3 h-3 ${
                              calib.isExpired ? 'text-rose-600' : 'text-amber-600'
                            }`}
                          />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Price (RM) */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-right font-mono tabular-nums text-slate-700">
                    RM {asset.purchase_price.toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3.5 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onViewDetails(asset)}
                        className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                        title={t.btnViewDetails}
                      >
                        {t.btnViewDetails}
                      </button>

                      {asset.status === 'Available' && !pending && (
                        <button
                          onClick={() => onCheckout(asset)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Pinjam</span>
                        </button>
                      )}

                      {(asset.status === 'On Loan' || asset.status === 'In Use') && (
                        <button
                          onClick={() => onCheckin(asset)}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Pulang</span>
                        </button>
                      )}

                      <button
                        onClick={() => onViewQR(asset)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                        title={t.btnPrintSticker}
                      >
                        <QrCode className="w-3.5 h-3.5" />
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
  );
};
