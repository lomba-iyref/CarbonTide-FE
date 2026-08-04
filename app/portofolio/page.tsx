"use client";

import { useEffect, useState } from "react";
import { TreePine, Car, Wallet, Download, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { ApiError } from "@/lib/api";
import { getPortfolioSummary, listTransactions } from "@/lib/services/transactions";
import { PortfolioSummaryAPI, TransactionListItemAPI } from "@/lib/types/transactions";

const STATUS_STYLE: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};

const STATUS_LABEL: Record<string, string> = {
  completed: "Retired (Pensiun)",
  failed: "Gagal",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function Portofolio() {
  const [summary, setSummary] = useState<PortfolioSummaryAPI | null>(null);
  const [transactions, setTransactions] = useState<TransactionListItemAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(null);

    Promise.all([getPortfolioSummary(), listTransactions()])
      .then(([summaryData, txData]) => {
        if (ignore) return;
        setSummary(summaryData);
        setTransactions(txData);
      })
      .catch((err) => {
        if (ignore) return;
        const message =
          err instanceof ApiError
            ? err.message
            : "Gagal memuat data portofolio. Coba lagi.";
        setError(message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const totalOffsetTons = Number(summary?.total_offset_tons ?? 0);
  const totalContribution = Number(summary?.total_contribution ?? 0);

  return (
    <div className="min-h-screen">
      <main className="pt-25 sm:pt-28.75 lg:pt-32.5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Portofolio Dampak Iklim</h1>
            <p className="mt-2 sm:mt-3 max-w-2xl text-sm text-slate-600">
              Lacak total emisi yang telah Anda kompensasi dan dampaknya bagi lingkungan.
            </p>
          </div>
          <Link href="/marketplace" className="self-start md:self-auto">
            <div className="inline-flex items-center justify-center rounded-[8px] border border-blue-600 px-5 py-3 text-sm font-medium text-blue-600 shadow-sm transition hover:bg-blue-100 whitespace-nowrap">
              + Beli Kredit Lainnya
            </div>
          </Link>
        </div>

        {/* Error state */}
        {error && !loading && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 mt-8 sm:mt-10">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm flex-1">{error}</p>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-24 text-slate-500">
            <Loader2 className="size-6 animate-spin mr-2" />
            <span className="text-sm">Memuat portofolio...</span>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-10 sm:mt-15 mb-10 sm:mb-15">
              <div className="w-full min-h-45 sm:min-h-52.5 xl:h-56.75 bg-tertiary rounded-[16px] flex flex-col justify-center p-5">
                <p className="text-[#94A3B8] text-sh-m">Total Offset Karbon</p>
                <div className="flex flex-row items-baseline">
                  <p className="text-white text-h2 xl:text-h1 font-bold">{totalOffsetTons}</p>
                  <p className="text-[#94A3B8] text-sh-m ml-1">tCO₂e</p>
                </div>
                <p className="text-secondary text-sh-m">Sepenuhnya dipensiunkan</p>
              </div>

              <div className="w-full min-h-45 sm:min-h-52.5 xl:h-56.75 bg-white border border-slate-200 shadow-sm rounded-[16px] flex flex-col justify-center p-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#ECFDF5] rounded-[16px] flex justify-center items-center">
                  <TreePine color="#7EC8B4" size={28} className="sm:size-7.5" />
                </div>
                <p className="text-[#94A3B8] text-sh-m mt-4">Setara dengan Penanaman</p>
                <p className="text-black text-h3 sm:text-h2 font-bold">
                  {summary?.equivalent_trees ?? 0} Pohon
                </p>
              </div>

              <div className="w-full min-h-45 sm:min-h-52.5 xl:h-56.75 bg-white border border-slate-200 shadow-sm rounded-[16px] flex flex-col justify-center p-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#EFF6FF] rounded-[16px] flex justify-center items-center">
                  <Car size={28} color="#2563EB" className="sm:size-7.5" />
                </div>
                <p className="text-[#94A3B8] text-sh-m mt-4">Setara dengan Menghapus</p>
                <p className="text-black text-h3 sm:text-h2 font-bold">
                  {summary?.equivalent_cars ?? 0} Mobil
                </p>
              </div>

              <div className="w-full min-h-45 sm:min-h-52.5 xl:h-56.75 bg-white border border-slate-200 shadow-sm rounded-[16px] flex flex-col justify-center p-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface rounded-[16px] flex justify-center items-center">
                  <Wallet size={28} className="sm:size-7.5" />
                </div>
                <p className="text-[#94A3B8] text-sh-m mt-4">Total Kontribusi (ESG)</p>
                <p className="text-black text-h3 sm:text-h2 font-bold wrap-break-word">
                  ${totalContribution.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Transactions */}
            <section className="mt-8 rounded-[16px] border border-slate-200 bg-white shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-slate-200">
                <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                  Daftar Sertifikat & Kredit Anda
                </h2>
              </div>

              {transactions.length === 0 ? (
                <div className="px-4 sm:px-6 py-12 text-center text-sm text-slate-500">
                  Belum ada transaksi. Yuk mulai kompensasi emisi Anda.
                </div>
              ) : (
                <div className="overflow-hidden">
                  {/* ── Tabel (md ke atas) ─────────────────────────────── */}
                  <div className="hidden md:block">
                    <div className="bg-slate-50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 m-2">
                      <div className="grid grid-cols-[100px_1fr_110px_110px_140px_100px] lg:grid-cols-[120px_1fr_140px_140px_160px_120px] items-center gap-2">
                        <span>No. Invoice</span>
                        <span>Proyek</span>
                        <span>Tanggal</span>
                        <span>Volume</span>
                        <span>Status</span>
                        <span>Sertifikat</span>
                      </div>
                    </div>

                    {transactions.map((tx) => (
                      <div key={tx.id} className="px-6 py-4 border-t border-slate-200 m-2">
                        <div className="grid grid-cols-[100px_1fr_110px_110px_140px_100px] lg:grid-cols-[120px_1fr_140px_140px_160px_120px] items-center gap-2">
                          <span className="text-slate-700 truncate">{tx.invoice_number}</span>
                          <span className="font-semibold text-slate-900 truncate">{tx.project_name}</span>
                          <span className="text-slate-600">{formatDate(tx.created_at)}</span>
                          <span className="font-semibold text-slate-900">
                            {Number(tx.quantity)} tCO₂e
                          </span>
                          <span
                            className={`inline-flex justify-center w-fit rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                              STATUS_STYLE[tx.status] ?? "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {STATUS_LABEL[tx.status] ?? tx.status}
                          </span>
                          {tx.certificate_url ? (
                            <a
                              href={tx.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-row items-center gap-2"
                            >
                              <Download size={20} color="#2563EB" />
                              <span className="flex items-center gap-2 text-blue-600 font-semibold cursor-pointer">
                                PDF
                              </span>
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">-</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ── Daftar kartu (di bawah md) ─────────────────────── */}
                  <div className="md:hidden divide-y divide-slate-200">
                    {transactions.map((tx) => (
                      <div key={tx.id} className="px-4 py-4 flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate">{tx.project_name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{tx.invoice_number}</p>
                          </div>
                          <span
                            className={`inline-flex justify-center shrink-0 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${
                              STATUS_STYLE[tx.status] ?? "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {STATUS_LABEL[tx.status] ?? tx.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div>
                            <p className="text-xs text-slate-500">Tanggal</p>
                            <p className="text-slate-700">{formatDate(tx.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">Volume</p>
                            <p className="font-semibold text-slate-900">
                              {Number(tx.quantity)} tCO₂e
                            </p>
                          </div>
                        </div>

                        <div className="pt-1">
                          {tx.certificate_url ? (
                            <a
                              href={tx.certificate_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 font-semibold"
                            >
                              <Download size={18} color="#2563EB" />
                              Unduh Sertifikat (PDF)
                            </a>
                          ) : (
                            <span className="text-slate-400 text-xs">Sertifikat belum tersedia</span>
                          )}
                        </div>
                      </div>
                    ))}
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