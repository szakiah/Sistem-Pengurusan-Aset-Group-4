import React from 'react';
import { Language, Asset } from '../types';
import { translations } from '../utils/i18n';

interface StatSummaryProps {
  assets: Asset[];
  lang: Language;
  onFilterStatus: (status: string) => void;
  onFilterCalibration: (val: 'all' | 'alert' | 'valid') => void;
  activeStatusFilter: string;
  activeCalibFilter: string;
}

export const StatSummary: React.FC<StatSummaryProps> = ({
  assets,
  lang,
  onFilterStatus,
  onFilterCalibration,
  activeStatusFilter,
  activeCalibFilter,
}) => {
  const t = translations[lang];

  const thirtyDaysLater = new Date(Date.now() + 30 * 86400000);

  const total = assets.length;
  const available = assets.filter((a) => a.status === 'Available').length;
  const onLoan = assets.filter((a) => a.status === 'On Loan').length;

  const calibAlerts = assets.filter((a) => {
    if (!a.next_calibration_due) return false;
    const dueDate = new Date(a.next_calibration_due);
    return dueDate <= thirtyDaysLater;
  }).length;

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 shadow-2xs divide-y sm:divide-y-0 sm:divide-x divide-slate-100 grid grid-cols-2 lg:grid-cols-4 my-4">
      {/* 1. Total Assets */}
      <button
        type="button"
        onClick={() => {
          onFilterStatus('all');
          onFilterCalibration('all');
        }}
        className={`p-3.5 text-left transition-colors relative ${
          activeStatusFilter === 'all' && activeCalibFilter === 'all'
            ? 'bg-blue-50/50'
            : 'hover:bg-slate-50/70'
        }`}
      >
        <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
          {t.totalAssets}
        </span>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {total}
          </span>
          <span className="text-[11px] text-slate-400">unit</span>
        </div>
        {activeStatusFilter === 'all' && activeCalibFilter === 'all' && (
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600" />
        )}
      </button>

      {/* 2. Available */}
      <button
        type="button"
        onClick={() => {
          onFilterStatus('Available');
          onFilterCalibration('all');
        }}
        className={`p-3.5 text-left transition-colors relative ${
          activeStatusFilter === 'Available' && activeCalibFilter === 'all'
            ? 'bg-emerald-50/50'
            : 'hover:bg-slate-50/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            {t.availableCount}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-800">
            {available}
          </span>
          <span className="text-[11px] text-emerald-600/80">sedia</span>
        </div>
        {activeStatusFilter === 'Available' && activeCalibFilter === 'all' && (
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-emerald-600" />
        )}
      </button>

      {/* 3. On Loan */}
      <button
        type="button"
        onClick={() => {
          onFilterStatus('On Loan');
          onFilterCalibration('all');
        }}
        className={`p-3.5 text-left transition-colors relative ${
          activeStatusFilter === 'On Loan' && activeCalibFilter === 'all'
            ? 'bg-amber-50/50'
            : 'hover:bg-slate-50/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            {t.onLoanCount}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-amber-800">
            {onLoan}
          </span>
          <span className="text-[11px] text-amber-600/80">di luar</span>
        </div>
        {activeStatusFilter === 'On Loan' && activeCalibFilter === 'all' && (
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-amber-600" />
        )}
      </button>

      {/* 4. Calibration Alert */}
      <button
        type="button"
        onClick={() => {
          onFilterCalibration('alert');
          onFilterStatus('all');
        }}
        className={`p-3.5 text-left transition-colors relative ${
          activeCalibFilter === 'alert'
            ? 'bg-rose-50/50'
            : 'hover:bg-slate-50/70'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
            {t.calibAlertCount}
          </span>
          {calibAlerts > 0 && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
        </div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-2xl font-bold font-mono tabular-nums text-rose-700">
            {calibAlerts}
          </span>
          <span className="text-[11px] text-rose-600/80">perlu semakan</span>
        </div>
        {activeCalibFilter === 'alert' && (
          <div className="absolute bottom-0 inset-x-0 h-0.5 bg-rose-600" />
        )}
      </button>
    </div>
  );
};
