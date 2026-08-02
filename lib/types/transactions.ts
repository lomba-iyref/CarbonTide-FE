// lib/types/transactions.ts

// Harus persis sama dengan Transaction.PaymentMethod.choices di backend
export type PaymentMethod = "card" | "bank_transfer";

export type TransactionStatus = "completed" | "failed";

/**
 * Bentuk response dari TransactionSerializer.
 * NOTE: field DecimalField di DRF diserialize sebagai string secara default
 * (misal "150.00"), bukan number — jadi jangan lupa Number(...) saat dipakai
 * untuk kalkulasi/format di UI.
 */
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