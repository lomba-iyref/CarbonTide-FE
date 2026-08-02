// lib/types/projects.ts
import { ProjectTypeValue, RegistryValue, RiskLevelValue } from "@/interfaces/interface";

/** Sesuai ProjectCreateSerializer */
/** GET /api/projects/dashboard-summary/ */
export interface CreditInventoryAPI {
  id: string;
  total_issued: string;
  available: string;
  sold: string;
  reserved: string;
  retired: string;
  buffer: string;
}

// NOTE: choices Visibility belum dikonfirmasi dari model -- asumsi "public"/"private".
export type ListingVisibility = "public" | "private";

export interface MarketplaceListingAPI {
  id: string;
  price_per_credit: string;
  visibility: ListingVisibility;
  status: "draft" | "published" | "unpublished";
  published_at: string | null;
  credit_inventory: CreditInventoryAPI | null;
}

export interface TransactionAuditAPI {
  id: string;
  buyer_name: string;
  quantity: string;
  total_price: string;
  status: string;
  created_at: string;
}

export interface MRVRecordAPI {
  id: string;
  project: string;
  tree_count: number;
  average_dbh: string;
  average_height: string;
  root_to_shoot_ratio: string;
  soil_organic_carbon: string;
  above_ground_biomass: string;
  below_ground_biomass: string;
  total_gross_carbon_stock: string;
  risk_level: "low" | "medium" | "high";
  issuable_credits: string;
  status: "draft" | "calculated" | "verified";
  created_at: string;
  updated_at: string;
}

/** GET /api/projects/{id}/ (ProjectDetailSerializer) */
export interface ProjectDetailAPI {
  id: string;
  project_name: string;
  project_type: string;
  description: string;
  country: string;
  location: string;
  methodology: string;
  registry: string;
  verification_status: string;
  area_hectares: string | null;
  deforestation_rate: string | null;
  expected_credits: string | null;
  status: string;
  thumbnail_url: string | null;
  vintage_year: number | null;
  verified_by: string | null;
  serial_range: string | null;
  created_at: string;
  updated_at: string;
  documents: { id: string; document_type: string; file_url: string; uploaded_at: string }[];
  listing: MarketplaceListingAPI | null;
  audit_trail: TransactionAuditAPI[];
  mrv_records: MRVRecordAPI[];
}

/** PATCH /api/projects/{id}/listing/ */
export interface UpdateListingPayload {
  price_per_credit?: number;
  visibility?: ListingVisibility;
  status?: "draft" | "published" | "unpublished";
}

export interface DashboardSummaryAPI {
  total_revenue: string;
  total_credits_sold: string;
  total_projects: number;
}

export type ListingStatus = "draft" | "published" | "unpublished" | null;

/** Item dalam GET /api/projects/ (list, ProjectListSerializer) */
export interface ProjectListItemAPI {
  id: string;
  project_name: string;
  project_type: string;
  methodology: string;
  thumbnail_url: string | null;
  status: string; // Project.Status (draft/pending/verified/dst -- belum dikonfirmasi choices lengkapnya)
  listing_status: ListingStatus;
  price_per_credit: string | null;
  available_credits: string | null;
  total_issued_credits: string | null;
}

export interface ProjectCreatePayload {
  project_name: string;
  project_type: ProjectTypeValue;
  description: string;
  country: string;
  location: string;
  methodology: string;
  registry: RegistryValue;
  area_hectares: number;
  deforestation_rate: number;
  expected_credits: number;
  thumbnail_url: string | null;
}

/** Sesuai MRVCreateSerializer */
export interface MRVCreatePayload {
  tree_count: number;
  average_dbh: number;
  average_height: number;
  root_to_shoot_ratio: number;
  soil_organic_carbon: number;
  above_ground_biomass: number;
  below_ground_biomass: number;
  total_gross_carbon_stock: number;
  risk_level: RiskLevelValue;
  issuable_credits: number;
}

/** Body untuk POST /api/projects/create-full/ (ProjectWithMRVCreateSerializer) */
export interface ProjectFullCreatePayload {
  project: ProjectCreatePayload;
  mrv: MRVCreatePayload;
}

/**
 * Response shape dari ProjectWithMRVCreateSerializer.to_representation():
 *   { "project": ProjectDetailSerializer(...).data }
 * Field lengkap ProjectDetailSerializer tidak semua dipakai di frontend
 * sekarang, jadi cuma didefinisikan yang pasti dipakai (id) + index signature
 * untuk sisanya.
 */
export interface ProjectFullCreateResponse {
  project: {
    id: string;
    project_name: string;
    status: string;
    [key: string]: unknown;
  };
}