// sections/create-project/report.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { ApiError } from "@/lib/api";
import { createFullProject } from "@/lib/services/projects";
import { ProjectFormState } from "@/interfaces/interface";

export default function Report({ formState }: { formState: ProjectFormState }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const result = await createFullProject({
        project: {
          project_name: formState.namaProyekProps[0],
          project_type: formState.projectTypeProps[0],
          description: formState.descriptionProps[0],
          country: formState.countryProps[0],
          location: formState.locationProps[0],
          methodology: formState.metodologiProps[0],
          registry: formState.registryProps[0],
          area_hectares: formState.luasAreaProps[0],
          deforestation_rate: formState.deforestasiProps[0],
          expected_credits: formState.credit,
          thumbnail_url: formState.thumbnailUrlProps[0] || null,
        },
        mrv: {
          tree_count: formState.jumlahPohonProps[0],
          average_dbh: formState.avgDbhProps[0],
          average_height: formState.avgTinggiProps[0],
          root_to_shoot_ratio: formState.rtsRatioProps[0],
          soil_organic_carbon: formState.soilCarbonProps[0],
          above_ground_biomass: formState.agb,
          below_ground_biomass: formState.bgb,
          total_gross_carbon_stock: formState.grossCarbon,
          risk_level: formState.riskLevelProps[0],
          issuable_credits: formState.credit,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/dashboard-penjual/${result.project.id}`);
      }, 1500);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        router.push(
          `/login?next=${encodeURIComponent(window.location.pathname)}`
        );
        return;
      }
      const message =
        err instanceof ApiError ? err.message : "Gagal membuat proyek. Coba lagi.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-white p-10 shadow-sm text-center mt-30">
        <CheckCircle className="size-14 text-secondary" />
        <p className="text-h3 font-bold text-text-primary">Proyek berhasil dibuat!</p>
        <p className="text-c-l text-text-secondary">
          Mengarahkan ke dashboard proyek...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 mt-30 w-305">
      <div className="flex flex-col gap-5">
        <p className="text-h1 font-bold">Ringkasan & Submit</p>
        <p>Periksa kembali data sebelum mengajukan proyek untuk verifikasi.</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3">
          <AlertCircle className="size-5 shrink-0" />
          <p className="text-c-l flex-1">{error}</p>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-white p-6 shadow-sm grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-4">
        <SummaryItem label="Nama Proyek" value={formState.namaProyekProps[0] || "-"} />
        <SummaryItem label="Luas Area" value={`${formState.luasAreaProps[0]} Ha`} />
        <SummaryItem label="Jumlah Pohon" value={String(formState.jumlahPohonProps[0])} />
        <SummaryItem label="Rata-rata DBH" value={`${formState.avgDbhProps[0]} cm`} />
        <SummaryItem label="Rata-rata Tinggi" value={`${formState.avgTinggiProps[0]} m`} />
        <SummaryItem label="Root-to-Shoot Ratio" value={String(formState.rtsRatioProps[0])} />
        <SummaryItem label="Total Gross Carbon" value={`${formState.grossCarbon} tCO₂e`} />
        <SummaryItem label="Kredit Diterbitkan" value={`${formState.credit} tCO₂e`} />
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => formState.setStep(2)}
          className="rounded-full border border-border bg-white px-6 py-3 text-c-l font-semibold text-text-secondary hover:bg-surface transition"
        >
          ← Kembali
        </button>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-c-l font-semibold text-white shadow-sm hover:opacity-90 transition disabled:opacity-50"
        >
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Mengirim...
            </>
          ) : (
            "Submit Proyek"
          )}
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-c-r text-text-secondary mb-1">{label}</p>
      <p className="text-c-l font-bold text-text-primary">{value}</p>
    </div>
  );
}