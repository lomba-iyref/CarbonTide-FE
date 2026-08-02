"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  ShieldCheck,
  CircleCheck,
  Database,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { ApiError } from "@/lib/api";
import {
  getProjectDetail,
  publishListing,
  unpublishListing,
  updateListing,
} from "@/lib/services/projects";
import {
  ListingVisibility,
  ProjectDetailAPI,
} from "@/lib/types/projects";

const REGISTRY_LABEL: Record<string, string> = {
  verra: "Verra (VCS)",
  gold_standard: "Gold Standard",
  acr: "American Carbon Registry (ACR)",
  car: "Climate Action Reserve (CAR)",
  plan_vivo: "Plan Vivo",
  other: "Other",
};

const LISTING_STATUS_LABEL: Record<string, string> = {
  published: "Published",
  draft: "Draft",
  unpublished: "Unpublished",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DashboardProjectPage() {
  // NOTE: asumsi nama folder route adalah [project]. Kalau ternyata beda
  // (kejadian serupa sempat terjadi di halaman buyer -> foldernya [id]),
  // ganti "project" di bawah sesuai nama folder aslinya.
  const { project: projectId } = useParams<{ project: string }>();

  const [project, setProject] = useState<ProjectDetailAPI | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [price, setPrice] = useState("");
  const [visibility, setVisibility] = useState<ListingVisibility>("public");

  const [savingListing, setSavingListing] = useState(false);
  const [togglingPublish, setTogglingPublish] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setLoadError("ID proyek tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    let ignore = false;
    setLoading(true);
    setLoadError(null);

    getProjectDetail(projectId)
      .then((data) => {
        if (ignore) return;
        setProject(data);
        setPrice(data.listing?.price_per_credit ?? "");
        setVisibility(data.listing?.visibility ?? "public");
      })
      .catch((err) => {
        if (ignore) return;
        const message =
          err instanceof ApiError ? err.message : "Gagal memuat detail proyek.";
        setLoadError(message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [projectId]);

  async function refreshListing() {
    if (!projectId) return;
    const data = await getProjectDetail(projectId);
    setProject(data);
  }

  async function handleSaveListing() {
    if (!projectId) return;
    setSavingListing(true);
    setActionError(null);
    try {
      await updateListing(projectId, {
        price_per_credit: Number(price) || 0,
        visibility,
      });
      await refreshListing();
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Gagal menyimpan perubahan listing.";
      setActionError(message);
    } finally {
      setSavingListing(false);
    }
  }

  async function handleTogglePublish() {
    if (!projectId || !project) return;
    setTogglingPublish(true);
    setActionError(null);
    try {
      if (project.listing?.status === "published") {
        await unpublishListing(projectId);
      } else {
        await publishListing(projectId);
      }
      await refreshListing();
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Gagal mengubah status listing. Pastikan harga sudah disimpan.";
      setActionError(message);
    } finally {
      setTogglingPublish(false);
    }
  }

  if (loading) {
    return (
      <main className="pt-[130px] pb-24 max-w-7xl mx-auto px-4 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-sm">Memuat detail proyek...</p>
        </div>
      </main>
    );
  }

  if (loadError || !project) {
    return (
      <main className="pt-[130px] pb-24 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="size-8 text-red-500" />
        <p className="text-sm text-slate-600 text-center max-w-sm">
          {loadError ?? "Proyek tidak ditemukan."}
        </p>
        <Link
          href="/dashboard-penjual"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 transition"
        >
          ← Kembali Ke Dashboard
        </Link>
      </main>
    );
  }

  const listing = project.listing;
  const inventory = listing?.credit_inventory;
  const totalIssued = Number(inventory?.total_issued ?? 0);

  const segments = inventory
    ? [
        { label: "Retired", value: Number(inventory.retired), color: "#1F2933", textTone: "text-white" },
        { label: "Sold (Active)", value: Number(inventory.sold), color: "#00A083", textTone: "text-white" },
        { label: "Reserved", value: Number(inventory.reserved), color: "#FBBF24", textTone: "text-slate-950" },
        { label: "Buffer (Risk)", value: Number(inventory.buffer), color: "#FB7185", textTone: "text-slate-950" },
        { label: "Available", value: Number(inventory.available), color: "#2563EB", textTone: "text-white" },
      ]
    : [];

  const isPublished = listing?.status === "published";

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="pt-[110px] pb-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <Link
              href="/dashboard-penjual"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
              <ChevronLeft size={16} /> Kembali Ke Dashboard
            </Link>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  {project.project_name}
                </h1>
                <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                  {listing ? LISTING_STATUS_LABEL[listing.status] : "Belum ada listing"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <MapPin className="h-4 w-4 text-slate-400" />
                <p>
                  {project.location}
                  {project.country ? `, ${project.country}` : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-10">
            <button
              onClick={handleTogglePublish}
              disabled={togglingPublish || !listing}
              title={!listing ? "Simpan harga & visibilitas dulu sebelum publish" : undefined}
              className={`rounded-[8px] border px-4 py-2 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed ${
                isPublished
                  ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                  : "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
              }`}
            >
              {togglingPublish
                ? "Memproses..."
                : isPublished
                ? "Unpublish Listing"
                : "Publish Listing"}
            </button>
          </div>
        </div>

        {actionError && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm flex-1">{actionError}</p>
          </div>
        )}

        <div className="flex flex-col gap-10">
          {/* SECTION 1: Identity & Traceability */}
          <div className="space-y-6">
            <div className="w-full rounded-[8px] border-[1.5px] border-[#D9D9D9] flex flex-col px-10 py-4">
              <div className="w-full h-10 flex items-center">
                <ShieldCheck size={28} className="ml-5" color="#2563EB" />
                <p className="font-bold text-[14px] ml-4 flex-1">
                  Carbon Credit Identity & Traceability
                </p>
                {project.verification_status === "verified" && (
                  <div className="bg-[#DBEAFE] w-[138px] h-[31px] rounded-[8px] flex items-center justify-center gap-2">
                    <CircleCheck size={16} color="#1D69E3" strokeWidth={3} />
                    <p className="text-[#1D69E3]">Verified</p>
                  </div>
                )}
              </div>

              <hr className="w-full border-t border-gray-300 my-3" />

              <div className="w-full flex items-center">
                <div className="grid grid-cols-4 w-full text-center">
                  <p className="text-slate-500">Registry</p>
                  <p className="text-slate-500">Vintage</p>
                  <p className="text-slate-500">Methodology</p>
                  <p className="text-slate-500">Verified by</p>

                  <p>{REGISTRY_LABEL[project.registry] ?? project.registry}</p>
                  <p>{project.vintage_year ?? "-"}</p>
                  <p>{project.methodology}</p>
                  <p>{project.verified_by ?? "-"}</p>
                </div>
              </div>

              {project.serial_range && (
                <>
                  <hr className="w-full border-t border-gray-300 my-3" />
                  <div className="w-full flex items-center">
                    <p className="flex-1 ml-10">Serial Range:</p>
                    <div className="w-[317px] h-[38px] flex items-center justify-center rounded-[8px] border-[1.5px] border-[#D9D9D9] bg-white">
                      <p className="text-sm font-bold">{project.serial_range}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* SECTION 2: Inventory + Audit + Listing settings */}
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="flex gap-5 flex-col flex-1">
              {/* Inventory */}
              <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-row items-center gap-2">
                    <Database color="#2563EB" strokeWidth={2} />
                    <h3 className="text-2xl font-semibold text-slate-950">
                      Manajemen Inventaris (Audit-Grade)
                    </h3>
                  </div>
                  <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    Total Supply {totalIssued.toLocaleString("id-ID")} tCO₂e
                  </div>
                </div>

                {!inventory ? (
                  <p className="text-sm text-slate-500 py-6 text-center">
                    Belum ada inventaris kredit untuk proyek ini.
                  </p>
                ) : (
                  <>
                    <div className="mt-6 rounded-[8px] border border-slate-200 bg-slate-50 p-5">
                      <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
                        <span>Inventory distribution</span>
                        <span className="font-semibold text-slate-950">
                          {totalIssued.toLocaleString("id-ID")} tCO₂e
                        </span>
                      </div>
                      <div className="flex h-2 overflow-hidden rounded-full bg-slate-200">
                        {segments.map((seg) => (
                          <div
                            key={seg.label}
                            className="h-full"
                            style={{
                              width: totalIssued > 0 ? `${(seg.value / totalIssued) * 100}%` : "0%",
                              backgroundColor: seg.color,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                      {segments.map((item) => (
                        <div key={item.label} className="rounded-[8px] border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-row items-center gap-2">
                            <div
                              className="rounded-full w-[10px] h-[10px]"
                              style={{ backgroundColor: item.color }}
                            />
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              {item.label}
                            </p>
                          </div>
                          <p className="mt-1 text-lg font-bold">
                            {item.value.toLocaleString("id-ID")}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </section>

              {/* Audit trail */}
              <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-2">
                  <FileText />
                  <h3 className="text-2xl font-semibold text-slate-950">
                    Audit Trail (Sales Log)
                  </h3>
                </div>

                {project.audit_trail.length === 0 ? (
                  <p className="text-sm text-slate-500 py-6 text-center">
                    Belum ada transaksi untuk proyek ini.
                  </p>
                ) : (
                  <div className="overflow-hidden rounded-[8px] border border-slate-200 bg-slate-50">
                    <div className="grid grid-cols-[140px_110px_120px_100px_150px] gap-4 border-b border-slate-200 px-5 py-4 text-xs uppercase tracking-[0.22em] text-slate-500 text-center items-center whitespace-nowrap">
                      <span>Buyer</span>
                      <span>Date</span>
                      <span>Volume</span>
                      <span>Total</span>
                      <span>Status</span>
                    </div>
                    {project.audit_trail.map((tx) => (
                      <div
                        key={tx.id}
                        className="grid grid-cols-[140px_110px_120px_100px_150px] gap-4 px-5 py-4 text-sm text-slate-700 text-center items-center whitespace-nowrap border-t border-slate-200 first:border-t-0"
                      >
                        <span className="font-semibold text-slate-950">{tx.buyer_name}</span>
                        <span>{formatDate(tx.created_at)}</span>
                        <span className="text-emerald-600">+{Number(tx.quantity)} tCO₂e</span>
                        <span>${Number(tx.total_price).toLocaleString("en-US")}</span>
                        <span className="rounded-[8px] bg-emerald-100 px-3 py-1 text-xs font-regular uppercase text-emerald-700 flex items-center justify-center">
                          {tx.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Listing settings sidebar */}
            <div className="lg:w-[380px]">
              <aside>
                <section className="rounded-[8px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-950">Pengaturan Listing</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Harga per ton, visibilitas marketplace, dan status listing.
                    </p>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Harga per Ton CO₂e ($)
                      </label>
                      <div className="mt-3 flex items-center rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3">
                        <span className="text-base font-semibold text-slate-500">$</span>
                        <input
                          type="number"
                          min={0}
                          step={0.01}
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="ml-3 w-full border-none bg-transparent text-2xl font-semibold text-slate-950 outline-none"
                        />
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">
                            Visibilitas Marketplace
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Kalau Public dan status Published, proyek ini bisa dilihat &
                            dibeli investor.
                          </p>
                        </div>
                        <select
                          value={visibility}
                          onChange={(e) => setVisibility(e.target.value as ListingVisibility)}
                          className="rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 outline-none cursor-pointer"
                        >
                          <option value="public">Publik</option>
                          <option value="private">Privat</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleSaveListing}
                      disabled={savingListing}
                      className="inline-flex w-full items-center justify-center rounded-3xl bg-slate-950 px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                      {savingListing ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </div>
                </section>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}