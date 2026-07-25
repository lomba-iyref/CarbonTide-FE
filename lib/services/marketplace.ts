// lib/services/marketplace.ts
import { api, ApiError } from "@/lib/api";
import { MarketplaceDetailAPI } from "@/lib/types/marketplace";

export async function getMarketplaceProject(
  id: string
): Promise<MarketplaceDetailAPI> {
  // endpoint AllowAny di backend -> auth: false, tidak perlu kirim token
  const data = await api.get<MarketplaceDetailAPI>(
    `/api/marketplace/${id}/`,
    { auth: false }
  );

  if (!data) {
    throw new ApiError("Proyek tidak ditemukan.", { status: 404 });
  }

  return data;
}