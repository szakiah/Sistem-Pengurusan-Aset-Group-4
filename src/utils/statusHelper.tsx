import { AssetStatus } from '../types';

export function getStatusBadge(status: AssetStatus) {
  switch (status) {
    case 'Available':
      return {
        label: 'Available',
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500',
        desc: 'Sedia dipinjam',
      };
    case 'In Use':
      return {
        label: 'In Use',
        bg: 'bg-sky-50 text-sky-800 border-sky-200',
        dot: 'bg-sky-500',
        desc: 'Sedang diguna di makmal',
      };
    case 'On Loan':
      return {
        label: 'On Loan',
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        dot: 'bg-amber-500',
        desc: 'Dipinjam keluar / lapangan',
      };
    case 'Under Maintenance':
      return {
        label: 'Under Maintenance',
        bg: 'bg-rose-50 text-rose-800 border-rose-300',
        dot: 'bg-rose-500',
        desc: 'Penyelenggaraan / Kalibrasi',
      };
    default:
      return {
        label: status,
        bg: 'bg-slate-50 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        desc: '',
      };
  }
}

export function checkCalibrationStatus(nextDueDateStr?: string): {
  isExpired: boolean;
  isDueSoon: boolean;
  daysRemaining: number;
  badgeText?: string;
  badgeClass?: string;
} {
  if (!nextDueDateStr) {
    return { isExpired: false, isDueSoon: false, daysRemaining: 999 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(nextDueDateStr);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      isExpired: true,
      isDueSoon: false,
      daysRemaining: diffDays,
      badgeText: 'Kalibrasi Tamat Tempoh',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-300 font-semibold',
    };
  } else if (diffDays <= 30) {
    return {
      isExpired: false,
      isDueSoon: true,
      daysRemaining: diffDays,
      badgeText: `Luput dlm ${diffDays} hari`,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-medium',
    };
  }

  return {
    isExpired: false,
    isDueSoon: false,
    daysRemaining: diffDays,
    badgeText: 'Kalibrasi Sah',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
}
