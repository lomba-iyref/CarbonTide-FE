// lib/types/transactions.ts

// Harus persis sama dengan Transaction.PaymentMethod.choices di backend
export type PaymentMethod = "card" | "bank_transfer";

export type TransactionStatus = "completed" | "failed";

// NOTE: semua field DecimalField dari DRF diserialize sebagai string
// (misal "150.00"), bukan number — jangan lupa Number(...) saat dipakai
// untuk kalkulasi/format di UI.

/** GET /api/transactions/summary/ */
export interface PortfolioSummaryAPI {
  total_offset_tons: string;
  equivalent_trees: number;
  equivalent_cars: number;
  total_contribution: string;
}

/** Item dalam GET /api/transactions/ (list) */
export interface TransactionListItemAPI {
  id: string;
  invoice_number: string;
  project_name: string;
  quantity: string;
  status: TransactionStatus;
  certificate_url: string | null;
  created_at: string;
}

export interface TransactionAPI {
  id: string;
  invoice_number: string;
  project_name: string;
  project_location: string;
  project_thumbnail: string | null;
  quantity: string;
  price_per_credit: string;
  subtotal: string;
  platform_fee: string;
  total_price: string;
  payment_method: PaymentMethod;
  status: TransactionStatus;
  certificate_number: string | null;
  certificate_url: string | null;
  retired_at: string | null;
  created_at: string;
}