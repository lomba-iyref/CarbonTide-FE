// sections/create-project/data.tsx
"use client";
import { ProjectFormState } from "@/interfaces/interface";

const inputCls =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-c-l text-text-primary outline-none focus:border-primary transition";

export default function Data({ formState }: { formState: ProjectFormState }) {
  const [jumlahPohon, setJumlahPohon] = formState.jumlahPohonProps;
  const [avgDbh, setAvgDbh] = formState.avgDbhProps;
  const [avgTinggi, setAvgTinggi] = formState.avgTinggiProps;
  const [rtsRatio, setRtsRatio] = formState.rtsRatioProps;
  const [soilCarbon, setSoilCarbon] = formState.soilCarbonProps;

  const canContinue = jumlahPohon > 0 && avgDbh > 0 && avgTinggi > 0;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Jumlah Pohon (sampel/total)">
          <input
            type="number"
            min={0}
            className={inputCls}
            value={jumlahPohon}
            onChange={(e) => setJumlahPohon(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Root-to-Shoot Ratio">
          <input
            type="number"
            min={0}
            step={0.01}
            className={inputCls}
            value={rtsRatio}
            onChange={(e) => setRtsRatio(Number(e.target.value) || 0)}
          />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Rata-rata DBH (cm)">
          <input
            type="number"
            min={0}
            step={0.1}
            className={inputCls}
            value={avgDbh}
            onChange={(e) => setAvgDbh(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Rata-rata Tinggi Pohon (m)">
          <input
            type="number"
            min={0}
            step={0.1}
            className={inputCls}
            value={avgTinggi}
            onChange={(e) => setAvgTinggi(Number(e.target.value) || 0)}
          />
        </Field>
      </div>

      <Field label="Soil Organic Carbon (ton C)">
        <input
          type="number"
          min={0}
          step={0.1}
          className={inputCls}
          value={soilCarbon}
          onChange={(e) => setSoilCarbon(Number(e.target.value) || 0)}
        />
      </Field>

      {/* Preview kalkulasi otomatis -- lihat komentar formula di parent page.tsx */}
      <div className="rounded-2xl bg-tertiary p-5 text-white">
        <p className="text-c-r text-white/60 mb-3">
          Estimasi otomatis (AGB = 0.0673 × (ρD²H)^0.976) — validasi dengan
          tim MRV sebelum submit final.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-c-r text-white/40 mb-1">Above Ground Biomass</p>
            <p className="text-c-l font-bold">{formState.agb} ton</p>
          </div>
          <div>
            <p className="text-c-r text-white/40 mb-1">Below Ground Biomass</p>
            <p className="text-c-l font-bold">{formState.bgb} ton</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => formState.setStep(0)}
          className="rounded-full border border-border bg-white px-6 py-3 text-c-l font-semibold text-text-secondary hover:bg-surface transition"
        >
          ← Kembali
        </button>
        <button
          disabled={!canContinue}
          onClick={() => formState.setStep(2)}
          className="rounded-full bg-primary px-6 py-3 text-c-l font-semibold text-white shadow-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lanjut ke Analisis Risiko →
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-c-l font-semibold text-text-secondary">{label}</p>
      {children}
    </div>
  );
}