// lib/services/transactions.ts
import { api, ApiError } from "@/lib/api";
import { PaymentMethod, TransactionAPI } from "@/lib/types/transactions";

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