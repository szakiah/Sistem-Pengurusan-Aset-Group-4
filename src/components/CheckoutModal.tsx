import React, { useState } from 'react';
import {
  X,
  ArrowUpRight,
  MessageCircle,
  Mail,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  ClipboardList,
  User,
} from 'lucide-react';
import { Asset, Language, PhysicalConditionOut, LoanTransaction } from '../types';
import { translations } from '../utils/i18n';
import { StorageService } from '../services/storage';

interface CheckoutModalProps {
  asset: Asset;
  lang: Language;
  onClose: () => void;
  onSuccess: (loan: LoanTransaction) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  asset,
  lang,
  onClose,
  onSuccess,
}) => {
  const t = translations[lang];
  const settings = StorageService.getSettings();

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultReturnDate = new Date(Date.now() + 3 * 86400000)
    .toISOString()
    .split('T')[0];

  const [borrowerName, setBorrowerName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [destinationLocation, setDestinationLocation] = useState(
    'Tapak Lapangan Stesen Sg. Buloh'
  );
  const [expectedReturnDate, setExpectedReturnDate] = useState(defaultReturnDate);
  const [conditionOut, setConditionOut] = useState<PhysicalConditionOut>('Baik');
  const [conditionNotes, setConditionNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedLoan, setSubmittedLoan] = useState<LoanTransaction | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!borrowerName.trim()) {
      setErrorMessage('Sila masukkan Nama Staf / ID Staf peminjam.');
      return;
    }
    if (!purpose.trim()) {
      setErrorMessage('Sila nyatakan Tujuan Penggunaan atau Projek.');
      return;
    }
    if (!destinationLocation.trim()) {
      setErrorMessage('Sila nyatakan Lokasi Destinasi / Tapak Lapangan.');
      return;
    }
    if (!expectedReturnDate || expectedReturnDate < todayStr) {
      setErrorMessage('Jangkaan Tarikh Pulang mesti sama atau selepas tarikh semasa.');
      return;
    }
    if (conditionOut === 'Lain-lain' && !conditionNotes.trim()) {
      setErrorMessage('Sila lengkapkan catatan wajib untuk pilihan keadaan fizikal "Lain-lain".');
      return;
    }

    setIsSubmitting(true);

    const result = StorageService.requestLoan({
      asset_id: asset.id,
      borrower_name: borrowerName,
      purpose,
      destination_location: destinationLocation,
      expected_return_date: expectedReturnDate,
      physical_condition_out: conditionOut,
      physical_condition_out_notes: conditionNotes,
    });

    setIsSubmitting(false);

    if (!result.success || !result.loan) {
      setErrorMessage(result.error || 'Gagal menghantar permohonan pinjaman.');
    } else {
      setSubmittedLoan(result.loan);
      onSuccess(result.loan);
    }
  };

  const getWhatsAppLink = (loan: LoanTransaction) => {
    const rawNumber = settings.adminWhatsApp.replace(/\D/g, '');
    const message = `*PERMOHONAN PINJAMAN ASET UPKS TRACK*\n\n` +
      `*Aset:* ${asset.name} (${asset.serial_no})\n` +
      `*Peminjam:* ${loan.borrower_name}\n` +
      `*Tujuan:* ${loan.purpose}\n` +
      `*Destinasi:* ${loan.destination_location}\n` +
      `*Tarikh Keluar:* ${loan.checkout_date}\n` +
      `*Jangkaan Pulang:* ${loan.expected_return_date}\n` +
      `*Keadaan Fizikal Awal:* ${loan.physical_condition_out}${loan.physical_condition_out_notes ? ` (${loan.physical_condition_out_notes})` : ''}\n\n` +
      `Mohon semakan dan kelulusan Admin UPKS dalam sistem UPKS Track. Terima kasih.`;
    return `https://wa.me/${rawNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 no-print">
      <div className="bg-white rounded-lg max-w-lg w-full shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-start justify-between gap-4">
          <div>
            <div className="font-mono text-xs font-bold text-blue-400 mb-1">
              {asset.serial_no} · {asset.name}
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white">
              {submittedLoan ? t.checkoutSuccessTitle : t.checkoutTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {submittedLoan ? t.checkoutSuccessDesc : t.checkoutSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {submittedLoan ? (
            /* Post-Submission Success State */
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 mb-0.5">
                    Permohonan Didaftarkan [ID: {submittedLoan.id}]
                  </h4>
                  <p className="text-emerald-800">
                    Status aset kini berstatus <strong>Menunggu Kelulusan Pinjaman</strong>.
                    Admin UPKS akan meluluskan sebelum pergerakan keluar dimulakan.
                  </p>
                </div>
              </div>

              {/* Notification Badges / Triggers */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-800">
                  <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900">Notifikasi Emel Pentadbir:</span>
                    <p className="text-slate-600 mt-0.5">
                      Dihantar ke peti masuk Admin UPKS (<span className="font-mono">{settings.adminEmail}</span>).
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-900 block">
                      Tindakan Pantas WhatsApp:
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Hantar maklumat ke WhatsApp Admin ({settings.adminWhatsApp}).
                    </span>
                  </div>
                  <a
                    href={getWhatsAppLink(submittedLoan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t.whatsappNotifyBtn}</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-md bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                >
                  {t.close}
                </button>
              </div>
            </div>
          ) : (
            /* Check-out Form */
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {errorMessage && (
                <div className="p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Borrower Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.borrowerNameLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    placeholder={t.borrowerPlaceholder}
                    list="staff-list"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                  />
                  <datalist id="staff-list">
                    {settings.knownStaffList.map((staff) => (
                      <option key={staff} value={staff} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Purpose / Project */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.purposeLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <ClipboardList className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    placeholder={t.purposePlaceholder}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Destination Location */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.destLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="text"
                    required
                    value={destinationLocation}
                    onChange={(e) => setDestinationLocation(e.target.value)}
                    placeholder={t.destPlaceholder}
                    list="destination-list"
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                  />
                  <datalist id="destination-list">
                    {settings.locationsList.map((loc) => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                </div>
              </div>

              {/* Expected Return Date */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.expectedReturnLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={expectedReturnDate}
                    onChange={(e) => setExpectedReturnDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Physical Condition Before Checkout */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t.conditionOutLabel} <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Baik', 'Calar / Kesan Guna', 'Lain-lain'] as PhysicalConditionOut[]).map(
                    (cond) => (
                      <button
                        type="button"
                        key={cond}
                        onClick={() => setConditionOut(cond)}
                        className={`py-1.5 px-2 text-xs font-medium rounded-md border text-center transition-colors ${
                          conditionOut === cond
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {cond}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Condition Notes */}
              {(conditionOut === 'Lain-lain' || conditionOut === 'Calar / Kesan Guna') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.conditionNotesLabel}{' '}
                    {conditionOut === 'Lain-lain' && (
                      <span className="text-rose-500 font-normal">(Wajib diisi)</span>
                    )}
                  </label>
                  <textarea
                    rows={2}
                    value={conditionNotes}
                    onChange={(e) => setConditionNotes(e.target.value)}
                    placeholder="Contoh: Kesan calar pada permukaan badan; kabel penyambung lengkap."
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 focus:bg-white"
                  />
                </div>
              )}

              {/* Bottom Buttons */}
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
                  disabled={isSubmitting}
                  className="px-4 py-2 font-semibold rounded-md bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Menghantar...' : t.submitCheckoutBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
