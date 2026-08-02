// lib/services/transactions.ts
import { api, ApiError } from "@/lib/api";
import {
  PaymentMethod,
  PortfolioSummaryAPI,
  TransactionAPI,
  TransactionListItemAPI,
} from "@/lib/types/transactions";

/**
 * GET /api/transactions/summary/
 * Butuh auth. Dipakai untuk 4 kartu ringkasan di halaman Portofolio.
 */
export async function getPortfolioSummary(): Promise<PortfolioSummaryAPI> {
  const data = await api.get<PortfolioSummaryAPI>("/api/transactions/summary/");
  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", { status: 401 });
  }
  return data;
}

/**
 * GET /api/transactions/
 * ReadOnlyModelViewSet -> response bisa berupa array langsung atau
 * paginated ({ results: [...] }) tergantung DEFAULT_PAGINATION_CLASS
 * di settings DRF. Kita handle dua-duanya.
 */
export async function listTransactions(): Promise<TransactionListItemAPI[]> {
  const data = await api.get<
    TransactionListItemAPI[] | { results: TransactionListItemAPI[] }
  >("/api/transactions/");

  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", { status: 401 });
  }

  return Array.isArray(data) ? data : data.results ?? [];
}

export interface CreatePurchasePayload {
  listing_id: string;
  quantity: number;
  payment_method: PaymentMethod;
}

/**
 * POST /api/transactions/purchase/
 * Butuh auth (IsAuthenticated). api.post() otomatis kirim Bearer token
 * dari localStorage (lihat lib/api.ts, auth: true adalah default).
 *
 * Kalau user belum login / token gak bisa direfresh, apiRequest() akan
 * return null (bukan throw) untuk kasus 401 tanpa refresh token — jadi
 * kita cek itu secara eksplisit di sini.
 */
export async function createPurchase(
  payload: CreatePurchasePayload
): Promise<TransactionAPI> {
  const data = await api.post<TransactionAPI>(
    "/api/transactions/purchase/",
    payload
  );

  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", {
      status: 401,
    });
  }

  return data;
}