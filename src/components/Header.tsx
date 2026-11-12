import React from 'react';
import {
  QrCode,
  Shield,
  ShieldCheck,
  Languages,
  FlaskConical,
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  onOpenQRScanner: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  onOpenAdminDashboard: () => void;
  onLogoutAdmin: () => void;
  pendingLoansCount: number;
  activeView: 'directory' | 'admin';
  onNavigateHome: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  onOpenQRScanner,
  isAdmin,
  onOpenAdminLogin,
  onOpenAdminDashboard,
  onLogoutAdmin,
  pendingLoansCount,
  activeView,
  onNavigateHome,
}) => {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
          {/* Zone 1: Brand title (Clean single element with subtle institutional badge) */}
          <div
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold tracking-tight text-white">
                UPKS <span className="text-blue-400 font-semibold">Track</span>
              </span>
              <span className="hidden md:inline text-[11px] font-mono text-slate-400">
                · LGM Makmal Razlin
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Single-line, unboxed or clean segmented) */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={onNavigateHome}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeView === 'directory'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {t.navAssets}
            </button>

            <button
              onClick={onOpenQRScanner}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors whitespace-nowrap"
              title={t.navScanQR}
            >
              <QrCode className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.navScanQR}</span>
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Switch */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2 py-1 text-xs font-mono font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Tukar Bahasa / Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-slate-400" />
              <span>{lang.toUpperCase()}</span>
            </button>

            {/* Admin Action */}
            {isAdmin ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenAdminDashboard}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
                    activeView === 'admin'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{t.navAdminActive}</span>
                  <span className="sm:hidden">Admin</span>
                  {pendingLoansCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                      {pendingLoansCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={onLogoutAdmin}
                  className="text-xs px-2 py-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                  title={t.logoutBtn}
                >
                  {t.logoutBtn}
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <Shield className="w-3.5 h-3.5 text-blue-200" />
                <span>{t.navAdmin}</span>
                {pendingLoansCount > 0 && (
                  <span className="ml-1 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full">
                    {pendingLoansCount}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
