// lib/services/projects.ts
import { api, ApiError } from "@/lib/api";
import {
  DashboardSummaryAPI,
  MarketplaceListingAPI,
  ProjectDetailAPI,
  ProjectFullCreatePayload,
  ProjectFullCreateResponse,
  ProjectListItemAPI,
  UpdateListingPayload,
  DeforestationCheckAPI,
} from "@/lib/types/projects";

/** GET /api/projects/{id}/ */
export async function getProjectDetail(id: string): Promise<ProjectDetailAPI> {
  const data = await api.get<ProjectDetailAPI>(`/api/projects/${id}/`);
  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", { status: 401 });
  }
  return data;
}

/**
 * PATCH /api/projects/{id}/listing/
 * Kalau listing belum ada, backend otomatis buat baru (lihat _get_or_create_listing).
 */
export async function updateListing(
  id: string,
  payload: UpdateListingPayload
): Promise<MarketplaceListingAPI> {
  const data = await api.patch<MarketplaceListingAPI>(
    `/api/projects/${id}/listing/`,
    payload
  );
  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", { status: 401 });
  }
  return data;
}

/** POST /api/projects/{id}/listing/publish/ */
export async function publishListing(id: string): Promise<MarketplaceListingAPI> {
  const data = await api.post<MarketplaceListingAPI>(
    `/api/projects/${id}/listing/publish/`
  );
  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", { status: 401 });
  }
  return data;
}

/** POST /api/projects/{id}/listing/unpublish/ */
export async function unpublishListing(id: string): Promise<MarketplaceListingAPI> {
  const data = await api.post<MarketplaceListingAPI>(
    `/api/projects/${id}/listing/unpublish/`
  );
  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", { status: 401 });
  }
  return data;
}

/**
 * GET /api/projects/dashboard-summary/
 * Butuh auth. Dipakai untuk 3 kartu ringkasan di Dashboard Penjual.
 */
export async function getDashboardSummary(): Promise<DashboardSummaryAPI> {
  const data = await api.get<DashboardSummaryAPI>(
    "/api/projects/dashboard-summary/"
  );
  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", { status: 401 });
  }
  return data;
}

/**
 * GET /api/projects/
 * ModelViewSet -> bisa berupa array langsung atau paginated ({results: [...]}).
 */
export async function listProjects(): Promise<ProjectListItemAPI[]> {
  const data = await api.get<
    ProjectListItemAPI[] | { results: ProjectListItemAPI[] }
  >("/api/projects/");

  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", { status: 401 });
  }

  return Array.isArray(data) ? data : data.results ?? [];
}

/**
 * POST /api/projects/create-full/
 * Butuh auth (IsAuthenticated) -> api.post() otomatis kirim Bearer token.
 * Dipanggil sekali di step terakhir wizard create-project (Report -> Submit).
 */
export async function createFullProject(
  payload: ProjectFullCreatePayload
): Promise<ProjectFullCreateResponse> {
  const data = await api.post<ProjectFullCreateResponse>(
    "/api/projects/create-full/",
    payload
  );

  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", {
      status: 401,
    });
  }

  return data;
}

export async function checkDeforestation(
  id: string,
  year?: number
): Promise<DeforestationCheckAPI> {
  const data = await api.post<DeforestationCheckAPI>(
    `/api/projects/${id}/check-deforestation/`,
    year ? { year } : undefined
  );
  if (!data) {
    throw new ApiError("Sesi login berakhir. Silakan login kembali.", { status: 401 });
  }
  return data;
}
