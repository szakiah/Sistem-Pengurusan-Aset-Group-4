import React, { useState, useEffect, useMemo } from 'react';
import {
  FlaskConical,
  QrCode,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { Asset, Language, LoanTransaction, AuditLog, AppSettings } from './types';
import { StorageService } from './services/storage';
import { translations } from './utils/i18n';
import { Header } from './components/Header';
import { StatSummary } from './components/StatSummary';
import { AssetFilters } from './components/AssetFilters';
import { AssetCard } from './components/AssetCard';
import { AssetTable } from './components/AssetTable';
import { AssetDetailModal } from './components/AssetDetailModal';
import { CheckoutModal } from './components/CheckoutModal';
import { CheckinModal } from './components/CheckinModal';
import { QRScannerModal } from './components/QRScannerModal';
import { QRStickerModal } from './components/QRStickerModal';
import { AdminModal } from './components/AdminModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const [lang, setLang] = useState<Language>('ms');
  const t = translations[lang];

  // Data states
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loans, setLoans] = useState<LoanTransaction[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [calibrationFilter, setCalibrationFilter] = useState<string>('all');

  // View & Admin states
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<'directory' | 'admin'>('directory');

  // Modal states
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [selectedAssetForCheckout, setSelectedAssetForCheckout] = useState<Asset | null>(null);
  const [selectedAssetForCheckin, setSelectedAssetForCheckin] = useState<Asset | null>(null);
  const [selectedAssetForQR, setSelectedAssetForQR] = useState<Asset | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState<boolean>(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);

  // Refresh data from storage
  const loadData = () => {
    setAssets(StorageService.getAssets());
    setLoans(StorageService.getLoans());
    setAuditLogs(StorageService.getAuditLogs());
    setSettings(StorageService.getSettings());
  };

  useEffect(() => {
    loadData();
    setIsLoading(false);

    // Subscribe to storage changes
    const unsubscribe = StorageService.subscribe(() => {
      loadData();
    });

    // Check URL parameters for deep link (e.g. ?serial=UPKS-MP-001)
    const params = new URLSearchParams(window.location.search);
    const serialParam = params.get('serial');
    if (serialParam) {
      const match = StorageService.getAssetBySerial(serialParam);
      if (match) {
        setSelectedAssetForDetail(match);
      }
    }

    return () => {
      unsubscribe();
    };
  }, []);

  const pendingLoans = useMemo(
    () => loans.filter((l) => l.approval_status === 'Pending'),
    [loans]
  );

  // Filtered Assets logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = asset.name.toLowerCase().includes(query);
        const matchesSerial = asset.serial_no.toLowerCase().includes(query);
        const matchesPic = asset.pic_name.toLowerCase().includes(query);
        const matchesLocation = asset.location.toLowerCase().includes(query);
        const matchesModel = asset.model_brand?.toLowerCase().includes(query);
        if (!matchesName && !matchesSerial && !matchesPic && !matchesLocation && !matchesModel) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== 'all' && asset.status !== statusFilter) {
        return false;
      }

      // Location filter
      if (locationFilter !== 'all' && asset.location !== locationFilter) {
        return false;
      }

      // Calibration filter
      if (calibrationFilter !== 'all') {
        const thirtyDaysLater = new Date(Date.now() + 30 * 86400000);
        const dueDate = asset.next_calibration_due ? new Date(asset.next_calibration_due) : null;

        if (calibrationFilter === 'alert') {
          if (!dueDate || dueDate > thirtyDaysLater) return false;
        } else if (calibrationFilter === 'valid') {
          if (!dueDate || dueDate <= thirtyDaysLater) return false;
        }
      }

      return true;
    });
  }, [assets, searchTerm, statusFilter, locationFilter, calibrationFilter]);

  const hasActiveFilters =
    searchTerm.trim().length > 0 ||
    statusFilter !== 'all' ||
    locationFilter !== 'all' ||
    calibrationFilter !== 'all';

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setLocationFilter('all');
    setCalibrationFilter('all');
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ms' ? 'en' : 'ms'));
  };

  const handleOpenAssetFromScanner = (asset: Asset) => {
    setSelectedAssetForDetail(asset);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans antialiased">
      {/* 1. Header (Clean 3-zone Top Bar Contract) */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        onOpenQRScanner={() => setIsQRScannerOpen(true)}
        isAdmin={isAdmin}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminDashboard={() => setActiveView('admin')}
        onLogoutAdmin={() => {
          setIsAdmin(false);
          setActiveView('directory');
        }}
        pendingLoansCount={pendingLoans.length}
        activeView={activeView}
        onNavigateHome={() => setActiveView('directory')}
      />

      {/* 2. Main Content Views */}
      {activeView === 'admin' && isAdmin ? (
        <AdminDashboard
          lang={lang}
          onClose={() => setActiveView('directory')}
          assets={assets}
          loans={loans}
          auditLogs={auditLogs}
          settings={settings}
          onRefresh={loadData}
        />
      ) : (
        /* Standard Open Viewer Directory */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 md:pb-12">
          {/* Functional Operational Toolbar (Replaces generic AI hero banner) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-1 border-b border-slate-200">
            <div>
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Unit Penyelidikan Kawalan & Standard (UPKS)
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                Direktori Aset & Instrumen Makmal
              </h1>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsQRScannerOpen(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{t.navScanQR}</span>
              </button>
            </div>
          </div>

          {/* 3. Stat Summary (Precision ribbon) */}
          <StatSummary
            assets={assets}
            lang={lang}
            onFilterStatus={(st) => setStatusFilter(st)}
            onFilterCalibration={(cal) => setCalibrationFilter(cal)}
            activeStatusFilter={statusFilter}
            activeCalibFilter={calibrationFilter}
          />

          {/* 4. Filters & Live Search */}
          <AssetFilters
            lang={lang}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            locationFilter={locationFilter}
            onLocationChange={setLocationFilter}
            calibrationFilter={calibrationFilter}
            onCalibrationChange={setCalibrationFilter}
            locationsList={settings.locationsList}
            totalResults={filteredAssets.length}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          {/* 5. Assets View: Skeleton loading, Empty state, or Data presentation */}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-slate-200/60 rounded-md animate-pulse" />
              ))}
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-lg border border-slate-200 my-4">
              <FlaskConical className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-800 mb-0.5">{t.emptyTitle}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-3">{t.emptyDesc}</p>
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetFilters}</span>
              </button>
            </div>
          ) : (
            <>
              {/* Desktop View (>= 768px): Tabular Ledger */}
              <div className="hidden md:block">
                <AssetTable
                  assets={filteredAssets}
                  lang={lang}
                  onViewDetails={(a) => setSelectedAssetForDetail(a)}
                  onCheckout={(a) => setSelectedAssetForCheckout(a)}
                  onCheckin={(a) => setSelectedAssetForCheckin(a)}
                  onViewQR={(a) => setSelectedAssetForQR(a)}
                  pendingLoans={pendingLoans}
                />
              </div>

              {/* Mobile View (< 768px): Ergonomic Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:hidden">
                {filteredAssets.map((asset) => {
                  const pending = pendingLoans.find((l) => l.asset_id === asset.id);
                  return (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      lang={lang}
                      onViewDetails={(a) => setSelectedAssetForDetail(a)}
                      onCheckout={(a) => setSelectedAssetForCheckout(a)}
                      onCheckin={(a) => setSelectedAssetForCheckin(a)}
                      onViewQR={(a) => setSelectedAssetForQR(a)}
                      pendingLoan={pending}
                    />
                  );
                })}
              </div>
            </>
          )}
        </main>
      )}

      {/* Mobile Sticky Navigation (< 768px) */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around gap-2 no-print shadow-sm">
        <button
          onClick={() => {
            setActiveView('directory');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 text-[11px] font-medium ${
            activeView === 'directory' ? 'text-blue-700 font-semibold' : 'text-slate-600'
          }`}
        >
          <FlaskConical className="w-4 h-4 mb-0.5" />
          <span>Direktori</span>
        </button>

        <button
          onClick={() => setIsQRScannerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center py-1 text-[11px] font-semibold text-blue-700"
        >
          <QrCode className="w-4 h-4 mb-0.5 text-blue-700" />
          <span>Imbas QR</span>
        </button>

        {isAdmin ? (
          <button
            onClick={() => setActiveView('admin')}
            className={`flex-1 flex flex-col items-center justify-center py-1 text-[11px] font-medium relative ${
              activeView === 'admin' ? 'text-blue-700 font-semibold' : 'text-slate-600'
            }`}
          >
            <Shield className="w-4 h-4 mb-0.5" />
            <span>Admin</span>
            {pendingLoans.length > 0 && (
              <span className="absolute top-0 right-4 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {pendingLoans.length}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => setIsAdminLoginOpen(true)}
            className="flex-1 flex flex-col items-center justify-center py-1 text-[11px] font-medium text-slate-600"
          >
            <Shield className="w-4 h-4 mb-0.5" />
            <span>Login</span>
            {pendingLoans.length > 0 && (
              <span className="absolute top-0 right-4 w-3.5 h-3.5 bg-rose-600 text-white rounded-full text-[9px] flex items-center justify-center font-bold">
                {pendingLoans.length}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Clean Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 text-xs text-center border-t border-slate-800 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>UPKS Track · Sistem Pengurusan & Penjejakan Aset Instrumen</span>
          <span className="text-slate-400">Unit Penyelidikan Kawalan & Standard · Lembaga Getah Malaysia</span>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Asset Detail Modal */}
      {selectedAssetForDetail && (
        <AssetDetailModal
          asset={selectedAssetForDetail}
          lang={lang}
          onClose={() => setSelectedAssetForDetail(null)}
          onCheckout={(a) => {
            setSelectedAssetForCheckout(a);
          }}
          onCheckin={(a) => {
            setSelectedAssetForCheckin(a);
          }}
          onViewQR={(a) => {
            setSelectedAssetForQR(a);
          }}
          isAdmin={isAdmin}
          pendingLoan={pendingLoans.find((l) => l.asset_id === selectedAssetForDetail.id)}
        />
      )}

      {/* 2. Check-out (Loan) Modal */}
      {selectedAssetForCheckout && (
        <CheckoutModal
          asset={selectedAssetForCheckout}
          lang={lang}
          onClose={() => setSelectedAssetForCheckout(null)}
          onSuccess={() => {
            loadData();
          }}
        />
      )}

      {/* 3. Check-in (Return) Modal */}
      {selectedAssetForCheckin && (
        <CheckinModal
          asset={selectedAssetForCheckin}
          lang={lang}
          onClose={() => setSelectedAssetForCheckin(null)}
          onSuccess={() => {
            loadData();
          }}
          currentUser={isAdmin ? 'Dr. Razlin (Admin UPKS)' : undefined}
        />
      )}

      {/* 4. QR Scanner Modal */}
      {isQRScannerOpen && (
        <QRScannerModal
          lang={lang}
          onClose={() => setIsQRScannerOpen(false)}
          onAssetFound={handleOpenAssetFromScanner}
        />
      )}

      {/* 5. QR Sticker Printable Modal */}
      {selectedAssetForQR && (
        <QRStickerModal
          asset={selectedAssetForQR}
          lang={lang}
          onClose={() => setSelectedAssetForQR(null)}
        />
      )}

      {/* 6. Admin Authentication PIN Modal */}
      {isAdminLoginOpen && (
        <AdminModal
          lang={lang}
          onClose={() => setIsAdminLoginOpen(false)}
          onLoginSuccess={() => {
            setIsAdmin(true);
            setActiveView('admin');
          }}
        />
      )}
    </div>
  );
}
