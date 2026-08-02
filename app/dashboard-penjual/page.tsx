"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet, TrendingUp, LayoutGrid, Loader2, AlertCircle } from "lucide-react";
import { ApiError } from "@/lib/api";
import { getDashboardSummary, listProjects } from "@/lib/services/projects";
import { DashboardSummaryAPI, ProjectListItemAPI } from "@/lib/types/projects";

const LISTING_STATUS_STYLE: Record<string, string> = {
  published: "bg-blue-100 text-blue-700",
  draft: "bg-slate-100 text-slate-600",
  unpublished: "bg-amber-100 text-amber-700",
};

const LISTING_STATUS_LABEL: Record<string, string> = {
  published: "Published",
  draft: "Draft",
  unpublished: "Unpublished",
};

const PROJECT_TYPE_LABEL: Record<string, string> = {
  forestry: "Forestry / ARR",
  renewable_energy: "Renewable Energy",
  agriculture: "Agriculture",
  waste_management: "Waste Management",
  blue_carbon: "Blue Carbon / ARR",
  energy_efficiency: "Energy Efficiency",
  other: "Other",
};

function getStatusBadge(project: ProjectListItemAPI) {
  if (project.listing_status) {
    return {
      style: LISTING_STATUS_STYLE[project.listing_status] ?? "bg-slate-100 text-slate-600",
      label: LISTING_STATUS_LABEL[project.listing_status] ?? project.listing_status,
    };
  }
  // Belum ada listing sama sekali -> tampilkan status proyek mentah
  return {
    style: "bg-slate-100 text-slate-600",
    label: project.status.charAt(0).toUpperCase() + project.status.slice(1),
  };
}

export default function Dashboard_penjual() {
  const [summary, setSummary] = useState<DashboardSummaryAPI | null>(null);
  const [projects, setProjects] = useState<ProjectListItemAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    Promise.all([getDashboardSummary(), listProjects()])
      .then(([summaryData, projectsData]) => {
        if (ignore) return;
        setSummary(summaryData);
        setProjects(projectsData);
      })
      .catch((err) => {
        if (ignore) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "Gagal memuat data dashboard. Coba lagi.";
        setError(message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const totalRevenue = Number(summary?.total_revenue ?? 0);
  const totalCreditsSold = Number(summary?.total_credits_sold ?? 0);
  const totalProjects = summary?.total_projects ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="pt-[130px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard Penjual</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-600">
              Kelola portofolio proyek karbon, inventaris kredit, dan performa penjualan Anda.
            </p>
          </div>
          <Link
            href="/create-project"
            className="inline-flex items-center justify-center rounded-[8px] bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
          >
            + Buat Proyek Baru
          </Link>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 mt-10">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm flex-1">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-24 text-slate-500">
            <Loader2 className="size-6 animate-spin mr-2" />
            <span className="text-sm">Memuat dashboard...</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Summary cards */}
            <section className="mt-10 grid gap-4 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-row items-center">
                <div className="flex items-center justify-center bg-[#DBEAFE] w-[70px] h-[70px] rounded-full">
                  <Wallet color="#2563EB" strokeWidth={3} />
                </div>
                <div className="ml-5">
                  <span className="text-xs uppercase tracking-[0.2em]">Total Pendapatan</span>
                  <p className="text-3xl font-bold text-slate-900">
                    ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-row items-center">
                <div className="flex items-center justify-center bg-[#D1FAE5] w-[70px] h-[70px] rounded-full">
                  <TrendingUp color="#059669" strokeWidth={3} />
                </div>
                <div className="ml-5">
                  <span className="text-xs uppercase tracking-[0.2em]">Kredit Terjual</span>
                  <div className="flex flex-row">
                    <p className="text-3xl font-bold text-slate-900">
                      {totalCreditsSold.toLocaleString("id-ID")}
                    </p>
                    <span className="mt-4 ml-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                      tCO₂e
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex flex-row items-center">
                <div className="flex items-center justify-center bg-[#E0E7FF] w-[70px] h-[70px] rounded-full">
                  <LayoutGrid color="#736EEC" strokeWidth={3} />
                </div>
                <div className="ml-5">
                  <span className="text-xs uppercase tracking-[0.2em]">Total Proyek</span>
                  <div className="flex flex-row">
                    <p className="text-3xl font-bold text-slate-900">{totalProjects}</p>
                    <span className="mt-4 ml-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                      proyek
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Project list */}
            <section className="mt-8 rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    Daftar Proyek & Inventaris
                  </h2>
                </div>
              </div>

              {projects.length === 0 ? (
                <div className="py-16 text-center text-sm text-slate-500">
                  Belum ada proyek. Yuk buat proyek pertamamu.
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-slate-200">
                  <div className="bg-slate-50 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <div className="grid grid-cols-[minmax(180px,_1fr)_120px_120px_220px_96px] items-center gap-4">
                      <span className="text-center items-center whitespace-nowrap">Nama Proyek</span>
                      <span>Status</span>
                      <span>Harga/Ton</span>
                      <span>Inventaris (Tersedia)</span>
                      <span>Aksi</span>
                    </div>
                  </div>

                  <div className="px-5 py-4">
                    {projects.map((project) => {
                      const badge = getStatusBadge(project);
                      const available = Number(project.available_credits ?? 0);
                      const totalIssued = Number(project.total_issued_credits ?? 0);
                      const pct = totalIssued > 0 ? (available / totalIssued) * 100 : 0;

                      return (
                        <div
                          key={project.id}
                          className="grid grid-cols-[minmax(180px,_1fr)_120px_120px_220px_96px] items-center gap-4 border-t border-slate-200 py-4 first:border-t-0"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              className="h-14 w-14 rounded-[8px] bg-slate-100 object-cover"
                              src={project.thumbnail_url || "/placeholder-project.jpg"}
                              alt={project.project_name}
                            />
                            <div>
                              <p className="font-semibold text-slate-900">{project.project_name}</p>
                              <p className="text-sm text-slate-500">
                                {PROJECT_TYPE_LABEL[project.project_type] ?? project.project_type}
                              </p>
                            </div>
                          </div>

                          <div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${badge.style}`}
                            >
                              {badge.label}
                            </span>
                          </div>

                          <div className="font-semibold text-slate-900">
                            {project.price_per_credit ? `$${Number(project.price_per_credit)}` : "-"}
                          </div>

                          <div className="max-w-[180px]">
                            {project.total_issued_credits ? (
                              <>
                                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                                  <span>{available.toLocaleString("id-ID")}</span>
                                  <span>{totalIssued.toLocaleString("id-ID")}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className="h-full rounded-full bg-blue-600"
                                    style={{ width: `${Math.min(pct, 100)}%` }}
                                  />
                                </div>
                              </>
                            ) : (
                              <span className="text-xs text-slate-400">Belum ada inventaris</span>
                            )}
                          </div>

                          <div>
                            <Link
                              href={`/dashboard-penjual/${project.id}`}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-800"
                            >
                              Kelola <span aria-hidden="true">→</span>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}