export type AssetStatus = 'Available' | 'In Use' | 'On Loan' | 'Under Maintenance';

export type PhysicalConditionOut = 'Baik' | 'Calar / Kesan Guna' | 'Lain-lain';
export type PhysicalConditionIn = 'Baik' | 'Rosak' | 'Perlu Kalibrasi';

export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Asset {
  id: string;
  name: string;
  serial_no: string;
  location: string;
  pic_name: string;
  purchase_price: number;
  purchase_year: number;
  status: AssetStatus;
  last_calibration_date: string; // YYYY-MM-DD
  next_calibration_due: string; // YYYY-MM-DD
  current_borrower?: string;
  current_loan_id?: string;
  qr_code_value: string;
  updated_at: string;
  category?: string;
  model_brand?: string;
  notes?: string;
}

export interface LoanTransaction {
  id: string;
  asset_id: string;
  asset_name: string;
  asset_serial_no: string;
  borrower_name: string;
  borrower_id?: string;
  purpose: string;
  destination_location: string;
  checkout_date: string; // YYYY-MM-DD
  expected_return_date: string; // YYYY-MM-DD
  physical_condition_out: PhysicalConditionOut;
  physical_condition_out_notes?: string;
  approval_status: ApprovalStatus;
  approved_by?: string;
  rejection_reason?: string;
  actual_return_date?: string; // YYYY-MM-DD
  physical_condition_in?: PhysicalConditionIn;
  return_notes?: string;
  created_at: string;
}

export type AuditActionType =
  | 'Create'
  | 'Update'
  | 'Delete'
  | 'Request Loan'
  | 'Approve'
  | 'Reject'
  | 'Return'
  | 'Calibration Update'
  | 'Bulk Import';

export interface AuditLog {
  id: string;
  timestamp: string;
  asset_id: string;
  asset_name?: string;
  action_type: AuditActionType;
  actor_name: string;
  details_summary: string;
}

export interface AppSettings {
  adminPin: string;
  adminWhatsApp: string; // e.g. "60191234567"
  adminEmail: string; // e.g. "admin.upks@lgm.gov.my"
  enableEmailSimulation: boolean;
  locationsList: string[];
  knownStaffList: string[];
  cloudSyncEnabled: boolean;
  cloudProvider?: 'firebase' | 'supabase';
}

export type Language = 'ms' | 'en';
