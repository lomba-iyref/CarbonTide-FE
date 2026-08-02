"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MapPin, TreePine, Users, Loader2, AlertCircle, SearchX } from "lucide-react";
import { api, ApiError } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Bentuk mentah dari MarketplaceCatalogueSerializer.
 * NOTE: field di sini adalah ASUMSI — sesuaikan dengan serializer asli.
 * Semua field selain `id` dibuat optional supaya normalizeProject() bisa
 * fallback dengan aman kalau nama field sedikit berbeda.
 */
interface RawMarketplaceProject {
  id: number | string;
  project_name?: string;
  name?: string;
  project_type?: string;
  location?: string;
  country?: string;
  registry?: string;
  image?: string;
  image_url?: string;
  cover_image?: string;
  price_per_credit?: number | string;
  marketplace_listing?: {
    price_per_credit?: number | string;
  };
  trees_planted?: number | string;
  trees_count?: number | string;
  beneficiaries_count?: number | string;
  fishers_count?: number | string;
}

interface PaginatedResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
}

/** Bentuk yang dipakai untuk render kartu proyek. */
interface MarketplaceProject {
  id: number | string;
  type: string;
  name: string;
  location: string;
  trees: string;
  fishers: string;
  pricePerTon: number;
  img: string;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80";

function normalizeProject(raw: RawMarketplaceProject): MarketplaceProject {
  const price =
    raw.price_per_credit ?? raw.marketplace_listing?.price_per_credit ?? 0;

  const trees = raw.trees_planted ?? raw.trees_count;
  const fishers = raw.beneficiaries_count ?? raw.fishers_count;

  return {
    id: raw.id,
    type: (raw.project_type || "BLUE CARBON / ARR").toString().toUpperCase(),
    name: raw.project_name || raw.name || "Proyek tanpa nama",
    location: [raw.location, raw.country].filter(Boolean).join(", ") || "-",
    trees: trees !== undefined ? String(trees) : "-",
    fishers: fishers !== undefined ? `${fishers} Nelayan` : "-",
    pricePerTon: Number(price) || 0,
    img: raw.image || raw.image_url || raw.cover_image || FALLBACK_IMG,
  };
}

// ---------------------------------------------------------------------------
// Filter option constants
// NOTE: value di sini ASUMSI mengikuti `choices` pada model Project.
// Sesuaikan value (bukan label) dengan nilai asli di backend.
// ---------------------------------------------------------------------------

const PROJECT_TYPE_OPTIONS = [
  { value: "", label: "Semua Tipe Proyek" },
  { value: "blue_carbon", label: "Blue Carbon / ARR" },
  { value: "forestry", label: "Forestry / ARR" },
  { value: "renewable_energy", label: "Renewable Energy" },
  { value: "agriculture", label: "Agriculture" },
  { value: "waste_management", label: "Waste Management" },
  { value: "energy_efficiency", label: "Energy Efficiency" },
  { value: "other", label: "Lainnya" },
];
 

const REGISTRY_OPTIONS = [
  { value: "", label: "Standar Verifikasi" },
  { value: "verra", label: "Verra (VCS)" },
  { value: "gold_standard", label: "Gold Standard" },
  { value: "plan_vivo", label: "Plan Vivo" },
];

export default function BeliKredit() {
  const [search, setSearch] = useState("");
  const [projectType, setProjectType] = useState("");
  const [registry, setRegistry] = useState("");

  const [projects, setProjects] = useState<MarketplaceProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (projectType) params.set("project_type", projectType);
      if (registry) params.set("registry", registry);

      const query = params.toString();
      const data = await api.get<RawMarketplaceProject[] | PaginatedResponse<RawMarketplaceProject>>(
        `/api/marketplace/${query ? `?${query}` : ""}`,
        { auth: false }
      );

      const results: RawMarketplaceProject[] = Array.isArray(data)
        ? data
        : data?.results ?? [];

      setProjects(results.map(normalizeProject));
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Gagal memuat daftar proyek. Coba lagi.";
      setError(message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [search, projectType, registry]);

  // Debounce fetch supaya tidak spam request tiap ketikan.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchProjects();
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, projectType, registry]);

  return (
    <main className="pt-[130px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-h1 font-bold text-text-primary mb-3">
          Jelajahi Proyek Blue Carbon
        </h1>
        <p className="text-sh-m text-text-secondary max-w-2xl">
          Dukung komunitas lokal dan pulihkan ekosistem dengan kredit karbon
          berkualitas tinggi dan terverifikasi.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl border border-border shadow-sm p-4 mb-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="flex items-center gap-3 flex-1 border border-border rounded-2xl px-4 py-3 bg-surface">
          <svg
            className="shrink-0 text-text-secondary"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari lokasi atau tempat proyek..."
            className="w-full bg-transparent text-c-l text-text-primary placeholder:text-text-secondary outline-none"
          />
        </div>

        {/* Filter: tipe proyek */}
        <div className="relative">
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="appearance-none border border-border rounded-2xl px-4 py-3 pr-10 text-c-l text-text-primary bg-white outline-none cursor-pointer min-w-[180px]"
          >
            {PROJECT_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Filter: standar verifikasi */}
        <div className="relative">
          <select
            value={registry}
            onChange={(e) => setRegistry(e.target.value)}
            className="appearance-none border border-border rounded-2xl px-4 py-3 pr-10 text-c-l text-text-primary bg-white outline-none cursor-pointer min-w-[180px]"
          >
            {REGISTRY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Error state */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 mb-8">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-c-l flex-1">{error}</p>
          <button
            onClick={fetchProjects}
            className="text-c-l font-semibold underline underline-offset-2 shrink-0"
          >
            Coba lagi
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-border shadow-sm overflow-hidden animate-pulse"
            >
              <div className="h-52 bg-surface" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 bg-surface rounded" />
                <div className="h-4 w-3/4 bg-surface rounded" />
                <div className="h-3 w-1/2 bg-surface rounded" />
                <div className="h-8 w-full bg-surface rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center py-24 text-text-secondary">
          <SearchX className="size-10 mb-3" />
          <p className="text-sh-m font-semibold text-text-primary mb-1">
            Tidak ada proyek ditemukan
          </p>
          <p className="text-c-l max-w-sm">
            Coba ubah kata kunci pencarian atau filter yang digunakan.
          </p>
        </div>
      )}

      {/* Project Grid */}
      {!loading && !error && projects.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard-pembeli/${project.id}`}
              className="group bg-white rounded-3xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div className="h-52 overflow-hidden">
                <img
                  src={project.img}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Body */}
              <div className="p-5">
                <p className="text-c-r font-bold uppercase tracking-widest text-primary mb-2">
                  {project.type}
                </p>
                <h2 className="text-sh-m font-bold text-text-primary mb-2 leading-snug">
                  {project.name}
                </h2>
                <div className="flex items-center gap-1.5 text-c-l text-text-secondary mb-4">
                  <MapPin className="size-3.5 shrink-0" />
                  {project.location}
                </div>

                {/* Stats pills */}
                <div className="flex gap-3 mb-5">
                  <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 text-c-l text-text-secondary font-medium">
                    <TreePine className="size-3.5 text-secondary" />
                    {project.trees}
                  </div>
                  <div className="flex items-center gap-2 bg-surface rounded-xl px-3 py-2 text-c-l text-text-secondary font-medium">
                    <Users className="size-3.5 text-primary" />
                    {project.fishers}
                  </div>
                </div>

                {/* Price row */}
                <div className="border-t border-border pt-4 flex items-end justify-between">
                  <div>
                    <p className="text-c-r text-text-secondary mb-1">Harga per ton</p>
                    <p className="text-h3 font-bold text-text-primary">
                      ${project.pricePerTon}
                    </p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-white shadow-md group-hover:bg-primary/90 transition">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M3 9h12M10 4l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {loading && (
        <div className="sr-only" aria-live="polite">
          <Loader2 className="animate-spin" /> Memuat proyek...
        </div>
      )}
    </main>
  );
}