"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { ApiError } from "@/lib/api";
import { getMarketplaceProject } from "@/lib/services/marketplace";
import { createPurchase } from "@/lib/services/transactions";
import { MarketplaceDetailAPI } from "@/lib/types/marketplace";
import { PaymentMethod, TransactionAPI } from "@/lib/types/transactions";

const inputCls =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-c-l text-text-primary outline-none focus:border-primary transition placeholder:text-text-secondary";

export default function PembayaranPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");
  const listingId = searchParams.get("listingId");
  const tonsParam = Number(searchParams.get("tons"));
  const tons = Number.isFinite(tonsParam) && tonsParam > 0 ? tonsParam : 1;

  const [project, setProject] = useState<MarketplaceDetailAPI | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<TransactionAPI | null>(null);

  // ── Load project detail (untuk tampilkan ringkasan pesanan yang akurat) ──
  useEffect(() => {
    if (!projectId || !listingId) {
      setLoadError("Data pesanan tidak lengkap. Silakan ulangi dari halaman proyek.");
      setLoadingProject(false);
      return;
    }

    let ignore = false;
    setLoadingProject(true);
    setLoadError(null);

    getMarketplaceProject(projectId)
      .then((data) => {
        if (ignore) return;
        setProject(data);
      })
      .catch((err) => {
        if (ignore) return;
        const message =
          err instanceof ApiError ? err.message : "Gagal memuat data proyek.";
        setLoadError(message);
      })
      .finally(() => {
        if (!ignore) setLoadingProject(false);
      });

    return () => {
      ignore = true;
    };
  }, [projectId, listingId]);

  const formatCardNum = (v: string) =>
    v
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const pricePerTon = Number(project?.price_per_credit ?? 0);
  const platformFeePct = Number(project?.platform_fee_percentage ?? 0);
  const subtotal = tons * pricePerTon;
  const fee = subtotal * platformFeePct;
  const total = subtotal + fee;

  async function handleConfirm() {
    if (!listingId) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const transaction = await createPurchase({
        listing_id: listingId,
        quantity: tons,
        payment_method: method,
      });
      setResult(transaction);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Sesi habis / belum login -> arahkan ke login, bawa balik ke halaman ini
        router.push(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
        return;
      }
      const message =
        err instanceof ApiError
          ? err.message
          : "Gagal memproses pembayaran. Coba lagi.";
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Loading state ──
  if (loadingProject) {
    return (
      <main className="pt-[130px] pb-24 max-w-7xl mx-auto px-4 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <Loader2 className="size-6 animate-spin" />
          <p className="text-c-l">Memuat data pesanan...</p>
        </div>
      </main>
    );
  }

  // ── Error state (data pesanan gagal dimuat) ──
  if (loadError || !project) {
    return (
      <main className="pt-[130px] pb-24 max-w-7xl mx-auto px-4 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="size-8 text-red-500" />
        <p className="text-c-l text-text-secondary text-center max-w-sm">
          {loadError ?? "Proyek tidak ditemukan."}
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

  // ── Success state ──
  if (result) {
    return (
      <main className="pt-[130px] pb-24 max-w-7xl mx-auto px-4 flex flex-col items-center gap-6 text-center">
        <CheckCircle className="size-16 text-secondary mt-10" />
        <h1 className="text-h2 font-bold text-text-primary">
          Pembayaran Berhasil!
        </h1>
        <p className="text-c-l text-text-secondary max-w-sm">
          Sertifikat pensiun kredit karbon Anda ({result.certificate_number}) telah
          diterbitkan.
        </p>
        {result.certificate_url && (
          <a
            href={result.certificate_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-c-l font-semibold text-primary underline underline-offset-2"
          >
            Unduh Sertifikat
          </a>
        )}
        <Link
          href="/dashboard-pembeli"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-c-l font-semibold text-white shadow-sm hover:opacity-90 transition"
        >
          Kembali ke Marketplace
        </Link>
      </main>
    );
  }

  // ── Form pembayaran ──
  return (
    <main className="pt-[130px] pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        href={`/dashboard-pembeli/${projectId}`}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-c-l font-semibold text-text-secondary shadow-sm hover:bg-surface transition mb-8"
      >
        ← Kembali Ke Dashboard
      </Link>

      <h1 className="text-h2 font-bold text-text-primary text-center mb-10">
        Selesaikan Pembayaran
      </h1>

      {submitError && (
        <div className="max-w-2xl mx-auto mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-c-l flex-1">{submitError}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px] lg:items-start">
        {/* ── Payment Form ── */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-sh-m font-bold text-text-primary mb-5 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="1" y="4" width="18" height="13" rx="2.5" stroke="#2563EB" strokeWidth="1.5" />
              <path d="M1 8h18" stroke="#2563EB" strokeWidth="1.5" />
              <rect x="4" y="12" width="4" height="2" rx="1" fill="#2563EB" />
            </svg>
            Metode Pembayaran
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            {(
              [
                { val: "card", label: "Kartu Kredit / Debit" },
                { val: "bank_transfer", label: "Bank Transfer / Invoice ESG" },
              ] as { val: PaymentMethod; label: string }[]
            ).map(({ val, label }) => (
              <label
                key={val}
                onClick={() => setMethod(val)}
                className={`flex items-center gap-3 rounded-2xl border-2 px-5 py-4 cursor-pointer transition ${
                  method === val ? "border-primary bg-blue-50" : "border-border bg-white"
                }`}
              >
                <span
                  className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                    method === val ? "border-primary" : "border-border"
                  }`}
                >
                  {method === val && <span className="block size-2 rounded-full bg-primary" />}
                </span>
                <span
                  className={`text-c-l font-semibold ${
                    method === val ? "text-primary" : "text-text-primary"
                  }`}
                >
                  {label}
                </span>
              </label>
            ))}
          </div>

          {method === "card" && (
            <div className="flex flex-col gap-4">
              <FormField label="Nomor Kartu">
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={cardNum}
                  onChange={(e) => setCardNum(formatCardNum(e.target.value))}
                  className={inputCls}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="MM/YY">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="12/26"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    className={inputCls}
                  />
                </FormField>
                <FormField label="CVC">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="123"
                    maxLength={3}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    className={inputCls}
                  />
                </FormField>
              </div>
              <p className="text-c-r text-text-secondary">
                * Detail kartu ini belum diproses ke payment gateway sungguhan —
                backend saat ini hanya mencatat metode pembayaran.
              </p>
            </div>
          )}

          {method === "bank_transfer" && (
            <div className="rounded-2xl bg-surface border border-border p-5">
              <p className="text-c-l text-text-secondary leading-relaxed">
                Invoice ESG akan dikirimkan ke email terdaftar dalam 1x24 jam
                setelah konfirmasi. Pembayaran dapat dilakukan melalui transfer
                bank ke rekening yang tertera pada invoice.
              </p>
            </div>
          )}
        </div>

        {/* ── Order Summary ── */}
        <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
          <h2 className="text-sh-m font-bold text-text-primary mb-5">
            Ringkasan Pesanan
          </h2>

          <div className="flex items-center gap-3 mb-6">
            <img
              src={project.thumbnail_url || "/placeholder-project.jpg"}
              alt={project.project_name}
              className="size-14 rounded-2xl object-cover shrink-0"
            />
            <div>
              <p className="text-c-l font-bold text-text-primary leading-snug">
                {project.project_name}
              </p>
              <p className="text-c-r text-text-secondary">
                {project.location}
                {project.country ? `, ${project.country}` : ""}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-5">
            <SummaryRow label="Volume Kredit" value={`${tons} tCO₂e`} />
            <SummaryRow label="Harga per ton" value={`$${pricePerTon.toFixed(2)}`} />
            <SummaryRow label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <SummaryRow
              label={`Biaya platform (${(platformFeePct * 100).toFixed(0)}%)`}
              value={`$${fee.toFixed(2)}`}
            />
          </div>

          <div
            className="h-1 rounded-full mb-5"
            style={{ background: "linear-gradient(to right, #2563EB, #00A083)" }}
          />

          <div className="flex items-center justify-between mb-6">
            <span className="text-sh-m font-bold text-text-primary">Total Bayar</span>
            <span className="text-h2 font-bold text-primary">${total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-c-l font-bold text-white shadow-md hover:opacity-90 transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Memproses...
              </>
            ) : (
              <>
                Konfirmasi &amp; Pensiunkan Kredit <CheckCircle className="size-4" />
              </>
            )}
          </button>

          <p className="mt-3 text-center text-c-r text-text-secondary">
            Transaksi aman. Sertifikat pensiun akan diterbitkan langsung.
          </p>
        </div>
      </div>
    </main>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-c-r font-semibold text-text-secondary mb-2">{label}</p>
      {children}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-c-l">
      <span className="text-text-secondary">{label}</span>
      <span className="font-semibold text-text-primary">{value}</span>
    </div>
  );
}