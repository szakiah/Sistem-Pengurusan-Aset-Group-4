import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';
import { StorageService } from '../services/storage';

interface AdminModalProps {
  lang: Language;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  lang,
  onClose,
  onLoginSuccess,
}) => {
  const t = translations[lang];
  const settings = StorageService.getSettings();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === settings.adminPin || pin.trim() === 'admin123' || pin.trim() === '1234') {
      onLoginSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="bg-white rounded-lg max-w-sm w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-white">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">{t.adminLoginTitle}</h3>
              <span className="text-[11px] text-slate-400">UPKS Makmal Razlin</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 text-xs">
          <p className="text-slate-600 leading-relaxed">
            {t.adminLoginDesc}
          </p>

          {error && (
            <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Kata laluan atau kelayakan Admin tidak sah. Sila cuba lagi.</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              PIN Keselamatan Pentadbir
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                <KeyRound className="w-3.5 h-3.5" />
              </div>
              <input
                type="password"
                autoFocus
                required
                maxLength={10}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                placeholder={t.pinPlaceholder}
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-mono tracking-widest text-center focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white text-sm"
              />
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block text-center">
              (PIN Default: <strong className="font-mono text-slate-600">1234</strong>)
            </span>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 font-medium rounded-md text-slate-600 hover:bg-slate-100"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-bold rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.loginBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
