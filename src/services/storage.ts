import {
  Asset,
  LoanTransaction,
  AuditLog,
  AppSettings,
  PhysicalConditionOut,
  PhysicalConditionIn,
} from '../types';

const STORAGE_KEYS = {
  ASSETS: 'upks_track_assets_v1',
  LOANS: 'upks_track_loans_v1',
  AUDIT: 'upks_track_audit_v1',
  SETTINGS: 'upks_track_settings_v1',
};

const DEFAULT_SETTINGS: AppSettings = {
  adminPin: '1234',
  adminWhatsApp: '60192345678',
  adminEmail: 'admin.upks@lgm.gov.my',
  enableEmailSimulation: true,
  locationsList: [
    'Makmal Razlin',
    'Makmal Kimia UPKS',
    'Makmal Biologi UPKS',
    'Makmal Analisis UPKS',
    'Makmal Spektroskopi',
    'Tapak Lapangan Stesen Sg. Buloh',
    'Tapak Lapangan Kota Tinggi',
    'Stor Pusat UPKS',
  ],
  knownStaffList: [
    'Dr. Razlin (Ketua Makmal)',
    'Pn. Siti Zakiah (Pegawai Penyelidik)',
    'En. Mohd Hafiz (Pegawai Sains)',
    'En. Ahmad Farhan (Penolong Pegawai Sains)',
    'Pn. Faridah Hanim (Juruteknologi Makmal)',
    'En. Azman Shah (Pegawai Makmal)',
    'Cik Nurul Izzati (Penyelidik Pascasiswazah)',
  ],
  cloudSyncEnabled: true,
  cloudProvider: 'firebase',
};

const SEED_ASSETS: Asset[] = [
  {
    id: 'ast-001',
    name: 'Micro Pipette Variable Volume 100-1000 µL',
    serial_no: 'UPKS-MP-001',
    location: 'Makmal Razlin',
    pic_name: 'Dr. Razlin',
    purchase_price: 1850,
    purchase_year: 2023,
    status: 'Available',
    last_calibration_date: '2026-05-10',
    next_calibration_due: '2027-05-10',
    qr_code_value: 'UPKS-MP-001',
    updated_at: '2026-11-01T09:00:00Z',
    category: 'Liquid Handling',
    model_brand: 'Eppendorf Research Plus',
    notes: 'Disimpan dalam rak kabinet instrumen A-2 Makmal Razlin.',
  },
  {
    id: 'ast-002',
    name: 'Multi-Channel Data Logger 10ch',
    serial_no: 'UPKS-DL-001',
    location: 'Tapak Lapangan Stesen Sg. Buloh',
    pic_name: 'En. Mohd Hafiz',
    purchase_price: 9400,
    purchase_year: 2022,
    status: 'On Loan',
    last_calibration_date: '2026-01-15',
    next_calibration_due: '2027-01-15',
    current_borrower: 'Pn. Siti Zakiah',
    current_loan_id: 'loan-seed-active',
    qr_code_value: 'UPKS-DL-001',
    updated_at: '2026-11-08T11:20:00Z',
    category: 'Field Data Acquisition',
    model_brand: 'Hioki Memory HiLogger LR8431',
    notes: 'Digunakan bersama sensor termogandingan K-type.',
  },
  {
    id: 'ast-003',
    name: 'Digital Benchtop pH / Ion Meter',
    serial_no: 'UPKS-PH-002',
    location: 'Makmal Kimia UPKS',
    pic_name: 'Dr. Razlin',
    purchase_price: 4200,
    purchase_year: 2024,
    status: 'Available',
    last_calibration_date: '2026-08-20',
    next_calibration_due: '2027-08-20',
    qr_code_value: 'UPKS-PH-002',
    updated_at: '2026-10-15T14:30:00Z',
    category: 'Electrochemistry',
    model_brand: 'Mettler Toledo SevenDirect SD20',
    notes: 'Elektrod InLab Expert Pro-ISM.',
  },
  {
    id: 'ast-004',
    name: 'Portable UV-Vis Spectrophotometer',
    serial_no: 'UPKS-SP-003',
    location: 'Makmal Analisis UPKS',
    pic_name: 'En. Ahmad Farhan',
    purchase_price: 14800,
    purchase_year: 2021,
    status: 'Under Maintenance',
    last_calibration_date: '2025-10-15',
    next_calibration_due: '2026-10-15', // Overdue!
    qr_code_value: 'UPKS-SP-003',
    updated_at: '2026-10-16T08:00:00Z',
    category: 'Spectroscopy',
    model_brand: 'Hach DR1900 Portable',
    notes: 'Lampu xenon perlukan pemeriksaan kuadran. Kalibrasi tamat tempoh.',
  },
  {
    id: 'ast-005',
    name: 'Analytical Precision Balance 0.1 mg',
    serial_no: 'UPKS-AB-004',
    location: 'Makmal Razlin',
    pic_name: 'Pn. Faridah Hanim',
    purchase_price: 6500,
    purchase_year: 2023,
    status: 'In Use',
    last_calibration_date: '2026-03-01',
    next_calibration_due: '2027-03-01',
    qr_code_value: 'UPKS-AB-004',
    updated_at: '2026-11-05T10:15:00Z',
    category: 'Weighing',
    model_brand: 'Sartorius Entris II Advanced',
    notes: 'Terpasang di atas meja anti-getaran Makmal Razlin.',
  },
  {
    id: 'ast-006',
    name: 'Benchtop High-Speed Centrifuge',
    serial_no: 'UPKS-CF-005',
    location: 'Makmal Biologi UPKS',
    pic_name: 'En. Azman Shah',
    purchase_price: 18200,
    purchase_year: 2022,
    status: 'Available',
    last_calibration_date: '2026-06-12',
    next_calibration_due: '2027-06-12',
    qr_code_value: 'UPKS-CF-005',
    updated_at: '2026-06-12T16:00:00Z',
    category: 'Separation',
    model_brand: 'Thermo Scientific Sorvall ST8',
    notes: 'Dilengkapi rotor bucu hayun TX-150.',
  },
  {
    id: 'ast-007',
    name: 'Halogen Moisture Analyzer',
    serial_no: 'UPKS-MA-006',
    location: 'Makmal Razlin',
    pic_name: 'En. Mohd Hafiz',
    purchase_price: 5100,
    purchase_year: 2024,
    status: 'Available',
    last_calibration_date: '2025-11-28',
    next_calibration_due: '2026-11-28', // Due in < 30 days!
    qr_code_value: 'UPKS-MA-006',
    updated_at: '2026-10-30T10:00:00Z',
    category: 'Thermal & Moisture',
    model_brand: 'Kern DAB 200-2',
    notes: 'Pemanas halogen 400W untuk penentuan kandungan pepejal getah.',
  },
  {
    id: 'ast-008',
    name: 'Micro Pipette Variable Volume 10-100 µL',
    serial_no: 'UPKS-MP-002',
    location: 'Makmal Razlin',
    pic_name: 'Dr. Razlin',
    purchase_price: 1750,
    purchase_year: 2023,
    status: 'Available',
    last_calibration_date: '2026-04-18',
    next_calibration_due: '2027-04-18',
    qr_code_value: 'UPKS-MP-002',
    updated_at: '2026-04-18T09:00:00Z',
    category: 'Liquid Handling',
    model_brand: 'Gilson Pipetman L',
    notes: 'Autoclavable sepenuhnya.',
  },
];

const SEED_LOANS: LoanTransaction[] = [
  {
    id: 'loan-seed-active',
    asset_id: 'ast-002',
    asset_name: 'Multi-Channel Data Logger 10ch',
    asset_serial_no: 'UPKS-DL-001',
    borrower_name: 'Pn. Siti Zakiah',
    borrower_id: 'UPKS-P042',
    purpose: 'Pemantauan Profil Suhu & Kelembapan Kluster Klon Lateks RRIM 3001',
    destination_location: 'Tapak Lapangan Stesen Sg. Buloh',
    checkout_date: '2026-11-08',
    expected_return_date: '2026-11-20',
    physical_condition_out: 'Baik',
    physical_condition_out_notes: 'Termasuk wayar sensor 10 unit lengkap dalam beg kalis hentakan.',
    approval_status: 'Approved',
    approved_by: 'Dr. Razlin (Admin UPKS)',
    created_at: '2026-11-08T10:30:00Z',
  },
  {
    id: 'loan-seed-pending',
    asset_id: 'ast-008',
    asset_name: 'Micro Pipette Variable Volume 10-100 µL',
    asset_serial_no: 'UPKS-MP-002',
    borrower_name: 'En. Ahmad Farhan',
    borrower_id: 'UPKS-T019',
    purpose: 'Ujian Persediaan Sampel Titrasi Lateks Pekat (Projek Standard ISO 2007)',
    destination_location: 'Makmal Analisis UPKS (Bilik 204)',
    checkout_date: '2026-11-12',
    expected_return_date: '2026-11-16',
    physical_condition_out: 'Baik',
    physical_condition_out_notes: 'Keadaan mekanikal piston lancar dan bersih.',
    approval_status: 'Pending',
    created_at: '2026-11-11T14:20:00Z',
  },
  {
    id: 'loan-seed-completed',
    asset_id: 'ast-001',
    asset_name: 'Micro Pipette Variable Volume 100-1000 µL',
    asset_serial_no: 'UPKS-MP-001',
    borrower_name: 'Cik Nurul Izzati',
    purpose: 'Aliquoting Reagen Pencerna Lateks Makmal Razlin',
    destination_location: 'Makmal Razlin',
    checkout_date: '2026-10-25',
    expected_return_date: '2026-10-28',
    physical_condition_out: 'Baik',
    approval_status: 'Approved',
    approved_by: 'Dr. Razlin (Admin UPKS)',
    actual_return_date: '2026-10-28',
    physical_condition_in: 'Baik',
    return_notes: 'Dipulangkan dalam keadaan bersih dan disimpan di rak A-2.',
    created_at: '2026-10-25T08:30:00Z',
  },
];

const SEED_AUDIT: AuditLog[] = [
  {
    id: 'aud-001',
    timestamp: '2026-10-25T08:35:00Z',
    asset_id: 'ast-001',
    asset_name: 'Micro Pipette Variable Volume 100-1000 µL',
    action_type: 'Approve',
    actor_name: 'Dr. Razlin (Admin UPKS)',
    details_summary: 'Meluluskan pinjaman untuk Cik Nurul Izzati (Aliquoting Reagen Pencerna Lateks).',
  },
  {
    id: 'aud-002',
    timestamp: '2026-10-28T16:10:00Z',
    asset_id: 'ast-001',
    asset_name: 'Micro Pipette Variable Volume 100-1000 µL',
    action_type: 'Return',
    actor_name: 'Cik Nurul Izzati',
    details_summary: 'Pemulangan selesai. Keadaan fizikal: Baik. Disimpan semula di Makmal Razlin.',
  },
  {
    id: 'aud-003',
    timestamp: '2026-11-08T11:20:00Z',
    asset_id: 'ast-002',
    asset_name: 'Multi-Channel Data Logger 10ch',
    action_type: 'Approve',
    actor_name: 'Dr. Razlin (Admin UPKS)',
    details_summary: 'Meluluskan pinjaman ke Tapak Lapangan Sg. Buloh untuk Pn. Siti Zakiah sehingga 2026-11-20.',
  },
  {
    id: 'aud-004',
    timestamp: '2026-11-11T14:20:00Z',
    asset_id: 'ast-008',
    asset_name: 'Micro Pipette Variable Volume 10-100 µL',
    action_type: 'Request Loan',
    actor_name: 'En. Ahmad Farhan',
    details_summary: 'Menghantar permohonan pinjaman ke Makmal Analisis UPKS. Status: Pending Approval.',
  },
];

type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Error notifying storage listener:', e);
    }
  });
}

export const StorageService = {
  subscribe(listener: StorageListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.ASSETS)) {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(SEED_ASSETS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOANS)) {
      localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(SEED_LOANS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(SEED_AUDIT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    }
  },

  getAssets(): Asset[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
      return data ? JSON.parse(data) : SEED_ASSETS;
    } catch {
      return SEED_ASSETS;
    }
  },

  getAssetById(id: string): Asset | undefined {
    return this.getAssets().find((a) => a.id === id);
  },

  getAssetBySerial(serialNo: string): Asset | undefined {
    const clean = serialNo.trim().toLowerCase();
    return this.getAssets().find(
      (a) => a.serial_no.toLowerCase() === clean || a.qr_code_value.toLowerCase() === clean
    );
  },

  createAsset(
    assetData: Omit<Asset, 'id' | 'updated_at' | 'qr_code_value'>,
    actorName: string
  ): { success: boolean; error?: string; asset?: Asset } {
    const assets = this.getAssets();
    const cleanSerial = assetData.serial_no.trim();

    // BR-002: Check serial number uniqueness
    const exists = assets.some(
      (a) => a.serial_no.toLowerCase() === cleanSerial.toLowerCase()
    );
    if (exists) {
      return { success: false, error: 'serialUniqueError' };
    }

    const newAsset: Asset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      serial_no: cleanSerial,
      qr_code_value: cleanSerial,
      updated_at: new Date().toISOString(),
    };

    const updated = [newAsset, ...assets];
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(updated));

    // Audit log
    this.addAuditLog({
      asset_id: newAsset.id,
      asset_name: newAsset.name,
      action_type: 'Create',
      actor_name: actorName,
      details_summary: `Pendaftaran instrumen baharu: ${newAsset.name} [${newAsset.serial_no}] di ${newAsset.location}.`,
    });

    notifyListeners();
    return { success: true, asset: newAsset };
  },

  updateAsset(
    id: string,
    updates: Partial<Asset>,
    actorName: string
  ): { success: boolean; error?: string } {
    const assets = this.getAssets();
    const index = assets.findIndex((a) => a.id === id);
    if (index === -1) return { success: false, error: 'Asset not found' };

    // Check serial uniqueness if changing serial_no
    if (updates.serial_no && updates.serial_no !== assets[index].serial_no) {
      const cleanSerial = updates.serial_no.trim();
      const duplicate = assets.some(
        (a) => a.id !== id && a.serial_no.toLowerCase() === cleanSerial.toLowerCase()
      );
      if (duplicate) return { success: false, error: 'serialUniqueError' };
      updates.serial_no = cleanSerial;
      updates.qr_code_value = cleanSerial;
    }

    const updatedAsset: Asset = {
      ...assets[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    assets[index] = updatedAsset;
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));

    this.addAuditLog({
      asset_id: id,
      asset_name: updatedAsset.name,
      action_type: 'Update',
      actor_name: actorName,
      details_summary: `Kemas kini maklumat aset ${updatedAsset.name} [${updatedAsset.serial_no}].`,
    });

    notifyListeners();
    return { success: true };
  },

  updateCalibration(
    id: string,
    lastCalib: string,
    nextDue: string,
    actorName: string,
    notes?: string
  ) {
    const assets = this.getAssets();
    const asset = assets.find((a) => a.id === id);
    if (!asset) return { success: false, error: 'Asset not found' };

    // If it was in Under Maintenance due to calibration and is now updated, restore to Available if not on loan
    let newStatus = asset.status;
    if (newStatus === 'Under Maintenance') {
      newStatus = 'Available';
    }

    return this.updateAsset(
      id,
      {
        last_calibration_date: lastCalib,
        next_calibration_due: nextDue,
        status: newStatus,
      },
      actorName
    );
  },

  deleteAsset(id: string, actorName: string): { success: boolean } {
    const assets = this.getAssets();
    const target = assets.find((a) => a.id === id);
    if (!target) return { success: false };

    const filtered = assets.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(filtered));

    // BR-005: Audit log must permanently retain deletion record
    this.addAuditLog({
      asset_id: id,
      asset_name: target.name,
      action_type: 'Delete',
      actor_name: actorName,
      details_summary: `Memadam rekod aset: ${target.name} [${target.serial_no}] daripada direktori.`,
    });

    notifyListeners();
    return { success: true };
  },

  // Loans
  getLoans(): LoanTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOANS);
      return data ? JSON.parse(data) : SEED_LOANS;
    } catch {
      return SEED_LOANS;
    }
  },

  getPendingLoans(): LoanTransaction[] {
    return this.getLoans().filter((l) => l.approval_status === 'Pending');
  },

  requestLoan(
    data: {
      asset_id: string;
      borrower_name: string;
      borrower_id?: string;
      purpose: string;
      destination_location: string;
      expected_return_date: string;
      physical_condition_out: PhysicalConditionOut;
      physical_condition_out_notes?: string;
    }
  ): { success: boolean; error?: string; loan?: LoanTransaction } {
    const asset = this.getAssetById(data.asset_id);
    if (!asset) return { success: false, error: 'Instrumen tidak ditemui' };

    // BR-001: Check collision
    if (asset.status === 'On Loan') {
      return { success: false, error: 'Instrumen ini sedang dipinjam keluar.' };
    }
    if (asset.status === 'Under Maintenance') {
      return { success: false, error: 'Instrumen ini sedang dalam penyelenggaraan / kalibrasi.' };
    }

    // Check if there is already an active pending request
    const loans = this.getLoans();
    const hasPending = loans.some(
      (l) => l.asset_id === data.asset_id && l.approval_status === 'Pending'
    );
    if (hasPending) {
      return {
        success: false,
        error: 'Instrumen ini sedang dalam proses permohonan yang menunggu kelulusan Admin.',
      };
    }

    const newLoan: LoanTransaction = {
      id: `loan-${Date.now()}`,
      asset_id: asset.id,
      asset_name: asset.name,
      asset_serial_no: asset.serial_no,
      borrower_name: data.borrower_name.trim(),
      borrower_id: data.borrower_id?.trim() || undefined,
      purpose: data.purpose.trim(),
      destination_location: data.destination_location.trim(),
      checkout_date: new Date().toISOString().split('T')[0],
      expected_return_date: data.expected_return_date,
      physical_condition_out: data.physical_condition_out,
      physical_condition_out_notes: data.physical_condition_out_notes?.trim() || undefined,
      approval_status: 'Pending',
      created_at: new Date().toISOString(),
    };

    const updatedLoans = [newLoan, ...loans];
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(updatedLoans));

    // Audit log
    this.addAuditLog({
      asset_id: asset.id,
      asset_name: asset.name,
      action_type: 'Request Loan',
      actor_name: newLoan.borrower_name,
      details_summary: `Permohonan pinjaman dihantar untuk ${asset.name} (${newLoan.destination_location}) sehingga ${newLoan.expected_return_date}. Keadaan awal: ${newLoan.physical_condition_out}.`,
    });

    notifyListeners();
    return { success: true, loan: newLoan };
  },

  approveLoan(loanId: string, adminName: string): { success: boolean; error?: string } {
    const loans = this.getLoans();
    const loanIndex = loans.findIndex((l) => l.id === loanId);
    if (loanIndex === -1) return { success: false, error: 'Permohonan tidak dijumpai' };

    const loan = loans[loanIndex];
    const asset = this.getAssetById(loan.asset_id);
    if (!asset) return { success: false, error: 'Aset tidak dijumpai' };

    loan.approval_status = 'Approved';
    loan.approved_by = adminName;
    loans[loanIndex] = loan;
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

    // Update asset status to 'On Loan' and set current_borrower
    const assets = this.getAssets();
    const assetIndex = assets.findIndex((a) => a.id === loan.asset_id);
    if (assetIndex !== -1) {
      assets[assetIndex].status = 'On Loan';
      assets[assetIndex].current_borrower = loan.borrower_name;
      assets[assetIndex].current_loan_id = loan.id;
      assets[assetIndex].location = loan.destination_location;
      assets[assetIndex].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    }

    this.addAuditLog({
      asset_id: asset.id,
      asset_name: asset.name,
      action_type: 'Approve',
      actor_name: adminName,
      details_summary: `Admin meluluskan pinjaman untuk ${loan.borrower_name}. Lokasi: ${loan.destination_location}. Status aset bertukar kepada On Loan.`,
    });

    notifyListeners();
    return { success: true };
  },

  rejectLoan(loanId: string, reason: string, adminName: string): { success: boolean; error?: string } {
    const loans = this.getLoans();
    const loanIndex = loans.findIndex((l) => l.id === loanId);
    if (loanIndex === -1) return { success: false, error: 'Permohonan tidak dijumpai' };

    const loan = loans[loanIndex];
    loan.approval_status = 'Rejected';
    loan.rejection_reason = reason.trim() || 'Ditolak oleh Admin UPKS.';
    loan.approved_by = adminName;
    loans[loanIndex] = loan;
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));

    this.addAuditLog({
      asset_id: loan.asset_id,
      asset_name: loan.asset_name,
      action_type: 'Reject',
      actor_name: adminName,
      details_summary: `Permohonan pinjaman oleh ${loan.borrower_name} ditolak. Sebab: ${loan.rejection_reason}`,
    });

    notifyListeners();
    return { success: true };
  },

  returnLoan(
    assetId: string,
    returnData: {
      returner_name: string;
      return_location: string;
      physical_condition_in: PhysicalConditionIn;
      return_notes?: string;
    },
    actorName: string
  ): { success: boolean; error?: string } {
    const asset = this.getAssetById(assetId);
    if (!asset) return { success: false, error: 'Aset tidak dijumpai' };

    const loans = this.getLoans();
    // Find active approved loan
    const loanIndex = loans.findIndex(
      (l) => l.asset_id === assetId && l.approval_status === 'Approved' && !l.actual_return_date
    );

    const returnDate = new Date().toISOString().split('T')[0];
    if (loanIndex !== -1) {
      loans[loanIndex].actual_return_date = returnDate;
      loans[loanIndex].physical_condition_in = returnData.physical_condition_in;
      loans[loanIndex].return_notes = returnData.return_notes?.trim() || undefined;
      localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans));
    }

    // BR-003: If condition is Rosak or Perlu Kalibrasi, automatically set status to Under Maintenance
    let nextStatus: Asset['status'] = 'Available';
    if (
      returnData.physical_condition_in === 'Rosak' ||
      returnData.physical_condition_in === 'Perlu Kalibrasi'
    ) {
      nextStatus = 'Under Maintenance';
    }

    const assets = this.getAssets();
    const assetIndex = assets.findIndex((a) => a.id === assetId);
    if (assetIndex !== -1) {
      assets[assetIndex].status = nextStatus;
      assets[assetIndex].current_borrower = undefined;
      assets[assetIndex].current_loan_id = undefined;
      assets[assetIndex].location = returnData.return_location;
      assets[assetIndex].updated_at = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    }

    this.addAuditLog({
      asset_id: asset.id,
      asset_name: asset.name,
      action_type: 'Return',
      actor_name: actorName || returnData.returner_name,
      details_summary: `Pemulangan direkodkan oleh ${returnData.returner_name}. Lokasi simpanan: ${returnData.return_location}. Keadaan fizikal selepas pulang: ${returnData.physical_condition_in}. Status terkini aset: ${nextStatus}.`,
    });

    notifyListeners();
    return { success: true };
  },

  // Audit Logs
  getAuditLogs(assetId?: string): AuditLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUDIT);
      const logs: AuditLog[] = data ? JSON.parse(data) : SEED_AUDIT;
      if (assetId) {
        return logs.filter((l) => l.asset_id === assetId);
      }
      return logs;
    } catch {
      return SEED_AUDIT;
    }
  },

  addAuditLog(entry: Omit<AuditLog, 'id' | 'timestamp'>) {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newLog, ...logs];
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(updated));
  },

  // Settings
  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings(settings: Partial<AppSettings>): { success: boolean } {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyListeners();
    return { success: true };
  },

  // Bulk Import CSV
  importAssetsFromCSV(
    csvText: string,
    adminName: string
  ): {
    totalRows: number;
    importedCount: number;
    skippedCount: number;
    errors: string[];
  } {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length <= 1) {
      return { totalRows: 0, importedCount: 0, skippedCount: 0, errors: ['Fail CSV kosong atau tiada baris data.'] };
    }

    const currentAssets = this.getAssets();
    const existingSerials = new Set(currentAssets.map((a) => a.serial_no.toLowerCase()));

    // Skip header line
    const dataLines = lines.slice(1);
    const newAssets: Asset[] = [];
    const errors: string[] = [];

    dataLines.forEach((line, idx) => {
      // Split by comma handling quotes simply
      const cols = line.split(',').map((c) => c.replace(/^["']|["']$/g, '').trim());
      if (cols.length < 4) {
        errors.push(`Baris ${idx + 2}: Format tidak mencukupi (minimum 4 lajur diperlukan).`);
        return;
      }

      const [name, serial_no, location, pic_name, priceStr, yearStr, lastCalib, nextDue] = cols;

      if (!name || !serial_no || !location || !pic_name) {
        errors.push(`Baris ${idx + 2}: Medan wajib (Nama, No. Siri, Lokasi, PIC) tidak lengkap.`);
        return;
      }

      const cleanSerial = serial_no.trim();
      if (existingSerials.has(cleanSerial.toLowerCase())) {
        errors.push(`Baris ${idx + 2}: No. Siri "${cleanSerial}" telah wujud dalam pangkalan data.`);
        return;
      }

      existingSerials.add(cleanSerial.toLowerCase());

      const price = parseFloat(priceStr) || 0;
      const year = parseInt(yearStr, 10) || new Date().getFullYear();
      const lastCal = lastCalib || new Date().toISOString().split('T')[0];
      const dueCal = nextDue || new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];

      newAssets.push({
        id: `ast-imp-${Date.now()}-${idx}`,
        name,
        serial_no: cleanSerial,
        location,
        pic_name,
        purchase_price: price >= 0 ? price : 0,
        purchase_year: year,
        status: 'Available',
        last_calibration_date: lastCal,
        next_calibration_due: dueCal,
        qr_code_value: cleanSerial,
        updated_at: new Date().toISOString(),
      });
    });

    if (newAssets.length > 0) {
      const merged = [...newAssets, ...currentAssets];
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(merged));

      this.addAuditLog({
        asset_id: 'bulk',
        action_type: 'Bulk Import',
        actor_name: adminName,
        details_summary: `Import pukal ${newAssets.length} rekod instrumen berjaya daripada fail CSV.`,
      });

      notifyListeners();
    }

    return {
      totalRows: dataLines.length,
      importedCount: newAssets.length,
      skippedCount: dataLines.length - newAssets.length,
      errors,
    };
  },

  resetToDefault() {
    localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(SEED_ASSETS));
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(SEED_LOANS));
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(SEED_AUDIT));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    notifyListeners();
  },
};

// Initialize default storage immediately
StorageService.init();
