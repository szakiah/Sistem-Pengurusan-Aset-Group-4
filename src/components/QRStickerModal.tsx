import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { X, Printer, Download, Tag, FlaskConical } from 'lucide-react';
import { Asset, Language } from '../types';
import { translations } from '../utils/i18n';

interface QRStickerModalProps {
  asset: Asset;
  lang: Language;
  onClose: () => void;
}

export const QRStickerModal: React.FC<QRStickerModalProps> = ({
  asset,
  lang,
  onClose,
}) => {
  const t = translations[lang];
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const appBaseUrl = window.location.origin;
    const qrPayload = `${appBaseUrl}?serial=${encodeURIComponent(asset.serial_no)}`;

    QRCode.toDataURL(qrPayload, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0f172a', // Slate 900
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [asset.serial_no]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `UPKS-QR-${asset.serial_no}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      {/* On print, this container becomes the physical label */}
      <div className="bg-white rounded-lg max-w-sm w-full shadow-xl border border-slate-200 overflow-hidden print-sheet">
        {/* Header - Hidden during print */}
        <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-blue-400" />
            <h3 className="font-bold text-xs">Pelekat Kod QR Instrumen Makmal</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* The Printable Sticker Sheet */}
        <div className="p-5 flex flex-col items-center text-center bg-white">
          {/* LGM UPKS Lab Sticker Header */}
          <div className="w-full pb-2 mb-2.5 border-b border-slate-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-left">
              <div className="w-7 h-7 rounded bg-slate-900 text-white flex items-center justify-center shrink-0">
                <FlaskConical className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-bold tracking-tight text-slate-900 uppercase block">
                  UPKS TRACK · LGM
                </span>
                <span className="text-[9px] text-slate-500 block">
                  Makmal Razlin / Standard Kualiti
                </span>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-900 border border-slate-300 px-1.5 py-0.2 rounded">
              ASET MAKMAL
            </span>
          </div>

          {/* QR Code image */}
          <div className="p-1.5 rounded-md bg-white border border-slate-200 shadow-2xs mb-2.5">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Kod QR bagi ${asset.name}`}
                className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
              />
            ) : (
              <div className="w-44 h-44 flex items-center justify-center text-xs text-slate-400">
                Menjana Kod QR...
              </div>
            )}
          </div>

          {/* Serial & Name Info */}
          <div className="w-full bg-slate-50 p-2.5 rounded-md border border-slate-200 text-left space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-slate-400 uppercase font-mono font-bold">
                NO. SIRI / TAG
              </span>
              <span className="font-mono font-bold text-blue-700">
                {asset.serial_no}
              </span>
            </div>

            <div className="font-semibold text-slate-900 leading-tight">
              {asset.name}
            </div>

            <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-600">
              <span>Lokasi: <strong>{asset.location}</strong></span>
              <span>PIC: <strong>{asset.pic_name}</strong></span>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls - Hidden during print */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 no-print text-xs">
          <button
            onClick={handleDownload}
            className="px-2.5 py-1.5 font-medium rounded-md bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Muat Turun PNG</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 font-bold rounded-md bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Pelekat</span>
          </button>
        </div>
      </div>
    </div>
  );
};
