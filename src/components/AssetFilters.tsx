import React from 'react';
import { Search, X, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface AssetFiltersProps {
  lang: Language;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  locationFilter: string;
  onLocationChange: (loc: string) => void;
  calibrationFilter: string;
  onCalibrationChange: (calib: string) => void;
  locationsList: string[];
  totalResults: number;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const AssetFilters: React.FC<AssetFiltersProps> = ({
  lang,
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  locationFilter,
  onLocationChange,
  calibrationFilter,
  onCalibrationChange,
  locationsList,
  totalResults,
  onResetFilters,
  hasActiveFilters,
}) => {
  const t = translations[lang];

  return (
    <div className="bg-white rounded-lg border border-slate-200/90 p-3 sm:p-4 mb-4 space-y-3">
      {/* Primary Toolbar: Search + Quick Selectors */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-md text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={locationFilter}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full sm:w-auto px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
          >
            <option value="all">{t.filterLocationAll}</option>
            {locationsList.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Calibration filter */}
          <select
            value={calibrationFilter}
            onChange={(e) => onCalibrationChange(e.target.value)}
            className={`w-full sm:w-auto px-2.5 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 ${
              calibrationFilter === 'alert'
                ? 'bg-rose-50 border-rose-300 text-rose-800 font-semibold'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <option value="all">{t.filterCalibAll}</option>
            <option value="alert">{t.filterCalibExpiredOrSoon}</option>
            <option value="valid">{t.filterCalibValid}</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="px-2 py-2 text-xs text-slate-500 hover:text-slate-800 border border-slate-200 rounded-md hover:bg-slate-100 transition-colors shrink-0"
              title={t.resetFilters}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Secondary Bar: Segmented Status Buttons + Result count */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1 border-t border-slate-100">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto scrollbar-none py-0.5">
          {[
            { id: 'all', label: t.filterAll },
            { id: 'Available', label: 'Available' },
            { id: 'On Loan', label: 'On Loan' },
            { id: 'In Use', label: 'In Use' },
            { id: 'Under Maintenance', label: 'Maintenance' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onStatusChange(item.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === item.id
                  ? 'bg-slate-900 text-white shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 font-mono shrink-0">
          <strong className="text-slate-800">{totalResults}</strong> rekod instrumen
        </div>
      </div>
    </div>
  );
};
