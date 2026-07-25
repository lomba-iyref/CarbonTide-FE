// lib/types/marketplace.ts
export interface ProjectImpactAPI {
  id: string;
  impact_type: "trees" | "species" | "people" | "other";
  icon: string;
  label: string;
  order: number;
}

export interface ProjectFAQAPI {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface ProjectDocumentAPI {
  id: string;
  document_type:
    | "pdd"
    | "validation_report"
    | "monitoring_report"
    | "verification_report"
    | "legal_document"
    | "other";
  file_url: string;
  uploaded_at: string;
}

export interface MarketplaceDetailAPI {
  id: string;
  project_name: string;
  project_type: string;
  location: string;
  country: string;
  description: string;
  thumbnail_url: string | null;
  developer_name: string;
  registry: string;
  vintage_year: number | null;
  methodology: string;
  verified_by: string | null;
  serial_range: string | null;
  verification_status: string;
  price_per_credit: string;
  platform_fee_percentage: string;
  available_tons: string | null;
  area_hectares: string | null;
  mrv_baseline_label: string | null;
  mrv_confidence: string | null;
  impacts: ProjectImpactAPI[];
  faqs: ProjectFAQAPI[];
  documents: ProjectDocumentAPI[];
}