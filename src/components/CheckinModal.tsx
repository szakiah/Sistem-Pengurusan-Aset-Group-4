import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  AlertTriangle,
  User,
  MapPin,
  CheckCircle2,
  Wrench,
  Gauge,
} from 'lucide-react';
import { Asset, Language, PhysicalConditionIn } from '../types';
import { translations } from '../utils/i18n';
import { StorageService } from '../services/storage';

interface CheckinModalProps {
  asset: Asset;
  lang: Language;
  onClose: () => void;
  onSuccess: () => void;
  currentUser?: string;
}

export const CheckinModal: React.FC<CheckinModalProps> = ({
  asset,
  lang,
  onClose,
  onSuccess,
  currentUser,
}) => {
  const t = translations[lang];
  const settings = StorageService.getSettings();

  const [returnerName, setReturnerName] = useState(
    asset.current_borrower || currentUser || ''
  );
  const [returnLocation, setReturnLocation] = useState(asset.location || 'Makmal Razlin');
  const [conditionIn, setConditionIn] = useState<PhysicalConditionIn>('Baik');
  const [returnNotes, setReturnNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!returnerName.trim()) {
      setErrorMessage('Sila masukkan nama pegawai yang memulangkan instrumen.');
      return;
    }
    if (!returnLocation.trim()) {
      setErrorMessage('Sila nyatakan lokasi simpanan semula instrumen.');
      return;
    }

    const result = StorageService.returnLoan(
      asset.id,
      {
        returner_name: returnerName,
        return_location: returnLocation,
        physical_condition_in: conditionIn,
        return_notes: returnNotes,
      },
      currentUser || returnerName
    );

    if (!result.success) {
      setErrorMessage(result.error || 'Gagal merekodkan pemulangan.');
    } else {
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold text-emerald-400 block mb-1">
              {asset.serial_no} · {asset.name}
            </span>
            <h2 className="text-lg font-bold tracking-tight text-white">{t.checkinTitle}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 text-xs">
          {errorMessage && (
            <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800">
              {errorMessage}
            </div>
          )}

          {/* Returning Officer */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {t.returnerNameLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                required
                value={returnerName}
                onChange={(e) => setReturnerName(e.target.value)}
                list="staff-list-return"
                placeholder="Nama pegawai yang memulangkan aset..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
              />
              <datalist id="staff-list-return">
                {settings.knownStaffList.map((st) => (
                  <option key={st} value={st} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Return Storage Location */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {t.returnLocationLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                required
                value={returnLocation}
                onChange={(e) => setReturnLocation(e.target.value)}
                list="locations-return"
                placeholder="Contoh: Makmal Razlin (Rak A-2)"
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
              />
              <datalist id="locations-return">
                {settings.locationsList.map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Physical Condition Upon Return */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {t.conditionInLabel} <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Baik */}
              <button
                type="button"
                onClick={() => setConditionIn('Baik')}
                className={`p-2 rounded-md border text-left flex items-center gap-1.5 transition-colors ${
                  conditionIn === 'Baik'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className={`w-3.5 h-3.5 ${conditionIn === 'Baik' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                <span className="font-medium">{t.conditionInGood}</span>
              </button>

              {/* Rosak */}
              <button
                type="button"
                onClick={() => setConditionIn('Rosak')}
                className={`p-2 rounded-md border text-left flex items-center gap-1.5 transition-colors ${
                  conditionIn === 'Rosak'
                    ? 'bg-rose-900 text-white border-rose-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Wrench className={`w-3.5 h-3.5 ${conditionIn === 'Rosak' ? 'text-rose-300' : 'text-rose-600'}`} />
                <span className="font-medium">{t.conditionInDamaged}</span>
              </button>

              {/* Perlu Kalibrasi */}
              <button
                type="button"
                onClick={() => setConditionIn('Perlu Kalibrasi')}
                className={`p-2 rounded-md border text-left flex items-center gap-1.5 transition-colors ${
                  conditionIn === 'Perlu Kalibrasi'
                    ? 'bg-amber-900 text-white border-amber-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Gauge className={`w-3.5 h-3.5 ${conditionIn === 'Perlu Kalibrasi' ? 'text-amber-300' : 'text-amber-600'}`} />
                <span className="font-medium">{t.conditionInNeedCalib}</span>
              </button>
            </div>
          </div>

          {/* BR-003 Warning notice if damaged or needs calibration */}
          {(conditionIn === 'Rosak' || conditionIn === 'Perlu Kalibrasi') && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Amaran Peraturan Makmal (BR-003):</span>
                <p className="mt-0.5 text-rose-800 leading-relaxed">
                  {t.damagedWarningAlert}
                </p>
              </div>
            </div>
          )}

          {/* Return Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {t.returnNotesLabel}
            </label>
            <textarea
              rows={2}
              value={returnNotes}
              onChange={(e) => setReturnNotes(e.target.value)}
              placeholder="Contoh: Instrumen telah dibersihkan; tiada kecacatan fizikal."
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
            />
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 font-medium rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.submitCheckinBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
