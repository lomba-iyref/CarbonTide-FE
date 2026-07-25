// app/dashboard-pembeli/[project]/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Download, ChevronDown, Loader2 } from "lucide-react";
import { ApiError } from "@/lib/api";
import { getMarketplaceProject } from "@/lib/services/marketplace";
import { MarketplaceDetailAPI } from "@/lib/types/marketplace";

const IMPACT_STYLE: Record<
  string,
  { bg: string; text: string; fallbackIcon: string }
> = {
  other: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    fallbackIcon: "🌱",
  },
};

const DOCUMENT_TYPE_LABEL: Record<string, string> = {
  pdd: "Project Design Document (PDD)",
  validation_report: "Validation Report",
  monitoring_report: "Monitoring Report",
  verification_report: "Verification Report",
  legal_document: "Legal Document",
  other: "Dokumen Lainnya",
};

const PROJECT_TYPE_LABEL: Record<string, string> = {
  forestry: "FORESTRY / ARR",
  renewable_energy: "RENEWABLE ENERGY",
  agriculture: "AGRICULTURE",
  waste_management: "WASTE MANAGEMENT",
  blue_carbon: "BLUE CARBON / ARR",
  energy_efficiency: "ENERGY EFFICIENCY",
  other: "OTHER",
};

const REGISTRY_LABEL: Record<string, string> = {
  verra: "Verra (VCS)",
  gold_standard: "Gold Standard",
  acr: "American Carbon Registry (ACR)",
  car: "Climate Action Reserve (CAR)",
  plan_vivo: "Plan Vivo",
  other: "Other",
};

function filenameFromUrl(url: string) {
  try {
    const parts = url.split("/");
    return decodeURIComponent(parts[parts.length - 1]) || url;
  } catch {
    return url;
  }
}

export default function ProjectDetailPage() {
  const { project: projectId } = useParams<{ project: string }>();
  const router = useRouter();

  const [project, setProject] = useState<MarketplaceDetailAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tons, setTons] = useState(10);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!projectId) return;

    let ignore = false;
    setLoading(true);
    setError(null);

    getMarketplaceProject(projectId)
      .then((data) => {
        if (ignore) return;
        setProject(data);
        setTons((prev) => {
          const available = Number(data.available_tons ?? 0);
          return Math.min(prev, available || prev) || 1;
        });
      })
      .catch((err) => {
        if (ignore) return;
        const message =
          err instanceof ApiError
            ? err.status === 404
              ? "Proyek tidak ditemukan."
              : err.message
            : "Gagal memuat data proyek. Coba lagi.";
        setError(message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [projectId]);

  if (loading) {
    return (
      <main className="pt-[130px] pb-24 max-w-7xl mx-auto px-4 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-c-l">Memuat detail proyek...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="pt-[130px] pb-24 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-c-l text-text-secondary">
          {error ?? "Proyek tidak ditemukan."}
        </p>
        <Link
          href="/dashboard-pembeli"
          className="rounded-full border border-border bg-white px-4 py-2 text-c-l font-semibold text-text-secondary shadow-sm hover:bg-surface transition"
        >
          ← Kembali Ke Marketplace
        </Link>
      </main>
    );
  }

  const pricePerTon = Number(project.price_per_credit ?? 0);
  const platformFeePct = Number(project.platform_fee_percentage ?? 0);
  const availableTons = Number(project.available_tons ?? 0);

  const platformFee = tons * pricePerTon * platformFeePct;
  const total = tons * pricePerTon + platformFee;

  const handleTonsChange = (value: number) => {
    const clamped = Math.min(Math.max(1, value), availableTons || value);
    setTons(clamped);
  };

  return (
    <main className="pt-[130px] pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        href="/dashboard-pembeli"
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-c-l font-semibold text-text-secondary shadow-sm hover:bg-surface transition mb-8"
      >
        ← Kembali Ke Marketplace
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        {/* ── Left Column ── */}
        <div className="flex flex-col gap-8">
          {/* Hero image */}
          <div className="relative h-72 rounded-3xl overflow-hidden">
            <img
              src={project.thumbnail_url || "/placeholder-project.jpg"}
              alt={project.project_name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-5 left-5">
              <span className="inline-block bg-primary text-white text-c-r font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                {PROJECT_TYPE_LABEL[project.project_type] ?? project.project_type}
              </span>
              <h1 className="text-h2 font-bold text-white leading-tight">
                {project.project_name}
              </h1>
              <p className="flex items-center gap-1.5 text-white/80 text-c-l mt-1">
                <MapPin className="size-3.5" />
                {project.location}
                {project.country ? `, ${project.country}` : ""}
              </p>
            </div>
          </div>

          {/* Developer */}
          <div className="flex items-center gap-3 text-c-l text-text-secondary">
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-50">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5" r="2.5" stroke="#2563EB" strokeWidth="1.3" />
                <path d="M3 13c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            Dikembangkan oleh:{" "}
            <span className="font-semibold text-text-primary">
              {project.developer_name}
            </span>
          </div>

          {/* Identity card */}
          <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <p className="text-c-r font-bold uppercase tracking-widest text-text-secondary flex items-center gap-2">
                🛡️ Carbon Credit Identity &amp; Traceability
              </p>
              {project.verification_status === "verified" && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-c-r font-bold text-emerald-600">
                  ✓ Verified
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-4 mb-4">
              {[
                { label: "Registry", value: REGISTRY_LABEL[project.registry] ?? project.registry },
                { label: "Vintage", value: project.vintage_year ?? "-" },
                { label: "Methodology", value: project.methodology },
                { label: "Verified by", value: project.verified_by ?? "-" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-c-r text-text-secondary mb-1">{label}</p>
                  <p className="text-c-l font-bold text-text-primary">{value}</p>
                </div>
              ))}
            </div>
            {project.serial_range && (
              <div className="border-t border-border pt-4 flex items-center justify-between">
                <p className="text-c-r text-text-secondary">Serial Range</p>
                <p className="font-mono text-c-r bg-surface rounded-lg px-3 py-1.5 text-text-primary">
                  {project.serial_range}
                </p>
              </div>
            )}
          </div>

          {/* About */}
          <Section title="Tentang Proyek">
            <p className="text-c-l text-text-secondary leading-relaxed">
              {project.description}
            </p>
          </Section>

          {/* Co-Benefits */}
          {project.impacts.length > 0 && (
            <Section title="Dampak Nyata (Co-Benefits)">
              <div className="grid grid-cols-3 gap-4">
                {project.impacts.map((impact) => {
                  const style = IMPACT_STYLE[impact.impact_type] ?? IMPACT_STYLE.other;
                  return (
                    <div
                      key={impact.id}
                      className={`${style.bg} rounded-2xl p-5 flex flex-col items-center text-center gap-2`}
                    >
                      <span className="text-3xl">{impact.icon || style.fallbackIcon}</span>
                      <p className={`text-c-l font-bold ${style.text} whitespace-pre-line leading-snug`}>
                        {impact.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Section>
          )}

          {/* MRV Transparency */}
          <div className="rounded-3xl bg-tertiary p-6 text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2" y="10" width="3" height="6" rx="1" fill="#3B8FEF" />
                  <rect x="7" y="6" width="3" height="10" rx="1" fill="#3B8FEF" />
                  <rect x="12" y="2" width="3" height="14" rx="1" fill="#3B8FEF" />
                </svg>
                <span className="text-sh-m font-bold">Transparansi Kalkulasi Karbon</span>
              </div>
              <span className="bg-primary text-white text-c-r font-bold px-3 py-1 rounded-full">
                CarbonTide MRV
              </span>
            </div>
            <p className="text-c-r text-white/60 leading-relaxed mb-6">
              Akurasi proyek ini dihitung menggunakan pendekatan hibrida: pengukuran
              manual lapangan (DBH, Tinggi) dikombinasikan dengan persamaan alometrik
              standar untuk stok karbon mangrove.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-5">
              {[
                { label: "Luas Area", value: project.area_hectares ? `${project.area_hectares} Ha` : "-" },
                { label: "Metodologi", value: project.methodology },
                { label: "Baseline", value: project.mrv_baseline_label ?? "-" },
                {
                  label: "Confidence",
                  value: project.mrv_confidence ? `✓ ${project.mrv_confidence}` : "-",
                  green: true,
                },
              ].map(({ label, value, green }) => (
                <div key={label}>
                  <p className="text-c-r text-white/40 mb-1">{label}</p>
                  <p className={`text-c-l font-bold ${green ? "text-secondary" : "text-white"}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 flex items-center justify-between">
              <span className="text-c-r text-white/40">ℹ️ Lihat Rumus Estimasi Biomassa</span>
              <span className="font-mono text-c-r text-white/40">
                AGB = 0.0673 × (ρD²H)⁰·⁹⁷⁶
              </span>
            </div>
          </div>

          {/* FAQ */}
          {project.faqs.length > 0 && (
            <Section title="⚠️ FAQ & Risk Disclosure">
              <div className="flex flex-col gap-3">
                {project.faqs.map((faq, i) => (
                  <div key={faq.id} className="rounded-2xl border border-border overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                      <span className="text-c-l font-bold text-text-primary">{faq.question}</span>
                      <ChevronDown
                        className={`size-4 text-text-secondary shrink-0 transition-transform ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <p className="px-5 pb-5 text-c-l text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Documents */}
          {project.documents.length > 0 && (
            <Section title="📄 Dokumen & Sertifikasi">
              <div className="flex flex-col gap-3">
                {project.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between rounded-2xl border border-border px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="1" width="10" height="13" rx="1.5" stroke="#2563EB" strokeWidth="1.3" />
                        <path d="M5 5h6M5 8h4" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" />
                      </svg>
                      <span className="text-c-l font-semibold text-text-primary">
                        {DOCUMENT_TYPE_LABEL[doc.document_type] ?? filenameFromUrl(doc.file_url)}
                      </span>
                    </div>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-secondary hover:text-primary transition"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* ── Right Column: Purchase Panel ── */}
        <div className="lg:sticky lg:top-[120px]">
          <div className="rounded-3xl border border-border bg-white p-6 shadow-lg">
            <h2 className="text-sh-m font-bold text-text-primary mb-1">
              Kompensasi Emisi Anda
            </h2>
            <p className="text-c-l font-semibold text-secondary mb-6">
              {availableTons.toLocaleString()} ton CO2e tersedia
            </p>

            <label className="block text-c-l font-semibold text-text-primary mb-2">
              Jumlah yang ingin dibeli (1 Ton CO2e)
            </label>
            <input
              type="number"
              min={1}
              max={availableTons || undefined}
              value={tons}
              onChange={(e) => handleTonsChange(parseInt(e.target.value) || 1)}
              className="w-full rounded-2xl border border-border bg-surface px-4 py-3 text-h3 font-bold text-text-primary outline-none focus:border-primary transition mb-6"
            />

            <div className="flex flex-col gap-3 mb-5">
              <PriceRow label="Harga per ton" value={`$${pricePerTon.toFixed(2)}`} />
              <PriceRow
                label={`Biaya platform (${(platformFeePct * 100).toFixed(0)}%)`}
                value={`$${platformFee.toFixed(2)}`}
              />
            </div>

            <div className="border-t border-border pt-4 flex items-center justify-between mb-5">
              <span className="text-sh-m font-bold text-text-primary">Total Estimasi</span>
              <span className="text-h3 font-bold text-primary">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/dashboard-pembeli/pembayaran?projectId=${project.id}&tons=${tons}`
                )
              }
              disabled={availableTons === 0}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-c-l font-bold text-white shadow-md hover:opacity-90 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjut ke Pembayaran →
            </button>

            <p className="mt-3 text-center text-c-r text-text-secondary">
              ✅ Sertifikat pensiun akan diterbitkan otomatis
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-sh-m font-bold text-text-primary mb-4">{title}</h2>
      {children}
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-c-l">
      <span className="text-text-secondary">{label}</span>
      <span className="font-semibold text-text-primary">{value}</span>
    </div>
  );
}