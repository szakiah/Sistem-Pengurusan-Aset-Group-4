import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Search,
  AlertCircle,
  VideoOff,
} from 'lucide-react';
import { Asset, Language } from '../types';
import { translations } from '../utils/i18n';
import { StorageService } from '../services/storage';

interface QRScannerModalProps {
  lang: Language;
  onClose: () => void;
  onAssetFound: (asset: Asset) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  lang,
  onClose,
  onAssetFound,
}) => {
  const t = translations[lang];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState<string>('');
  const [searchingError, setSearchingError] = useState<string | null>(null);

  const sampleAssets = StorageService.getAssets().slice(0, 4);

  useEffect(() => {
    let isMounted = true;

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          if (isMounted) {
            setHasCamera(false);
            setCameraError('Kamera tidak disokong pada pelayar ini.');
          }
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });

        if (!isMounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch((e) => console.log('Video play error:', e));
        }

        if ('BarcodeDetector' in window) {
          // @ts-ignore
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const scan = async () => {
            if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
              try {
                const barcodes = await detector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  const raw = barcodes[0].rawValue;
                  handleCodeDetected(raw);
                  return;
                }
              } catch {
                // Ignore detection frame error
              }
            }
            animationFrameRef.current = requestAnimationFrame(scan);
          };
          animationFrameRef.current = requestAnimationFrame(scan);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Camera access prevented or not available:', err);
          setHasCamera(false);
          setCameraError(
            err.name === 'NotAllowedError'
              ? 'Akses kamera disekat oleh pelayar. Sila berikan kebenaran kamera atau gunakan pilihan imbasan pantas di bawah.'
              : 'Tidak dapat menyambung ke kamera. Sila gunakan simulasi atau carian nombor siri di bawah.'
          );
        }
      }
    }

    startCamera();

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleCodeDetected = (code: string) => {
    setSearchingError(null);
    let serial = code.trim();

    if (serial.includes('serial=')) {
      try {
        const url = new URL(serial);
        const s = url.searchParams.get('serial');
        if (s) serial = s;
      } catch {
        // Fallback
      }
    }

    const asset = StorageService.getAssetBySerial(serial);
    if (asset) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      onAssetFound(asset);
      onClose();
    } else {
      setSearchingError(`Kod QR tidak sah atau aset "${serial}" tidak ditemui.`);
    }
  };

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleCodeDetected(manualCode);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="bg-white rounded-lg max-w-sm w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-blue-400" />
            <h3 className="font-bold text-xs">{t.qrScannerTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder Stage */}
        <div className="relative bg-slate-950 aspect-square w-full max-h-64 overflow-hidden flex items-center justify-center">
          {hasCamera && !cameraError ? (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {/* Aiming Reticle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 border border-blue-400/80 rounded-lg relative shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                  <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-blue-400" />
                  <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-blue-400" />
                  <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-blue-400" />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-blue-400" />
                  <div className="absolute inset-x-0 top-1/2 h-px bg-rose-500/80" />
                </div>
              </div>
              <div className="absolute bottom-2.5 inset-x-0 text-center pointer-events-none">
                <span className="text-[10px] bg-slate-900/80 text-slate-200 px-2.5 py-0.5 rounded font-mono">
                  Halakan ke Kod QR instrumen
                </span>
              </div>
            </>
          ) : (
            <div className="p-4 text-center text-slate-300 flex flex-col items-center gap-2 text-xs">
              <VideoOff className="w-5 h-5 text-slate-500" />
              <p className="max-w-xs text-slate-400 text-[11px]">
                {cameraError || t.cameraPermissionNeeded}
              </p>
            </div>
          )}
        </div>

        {searchingError && (
          <div className="m-3 p-2 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
            <span>{searchingError}</span>
          </div>
        )}

        {/* Quick Test Sample QR Buttons */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Imbasan Pantas Sampel Makmal:
          </div>
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {sampleAssets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => handleCodeDetected(asset.serial_no)}
                className="p-1.5 text-left bg-white hover:bg-slate-100 border border-slate-200 rounded text-xs transition-colors"
              >
                <span className="font-mono font-bold text-blue-700 block text-[10px]">
                  {asset.serial_no}
                </span>
                <span className="text-slate-800 truncate block text-[11px]">
                  {asset.name}
                </span>
              </button>
            ))}
          </div>

          {/* Manual Input Form */}
          <form onSubmit={handleManualSearch} className="flex gap-1.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="No. Siri (cth: UPKS-MP-001)"
                className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md font-mono text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2 top-2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0"
            >
              Cari
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
