// sections/create-project/risk.tsx
"use client";
import { ProjectFormState, RISK_OPTIONS } from "@/interfaces/interface";

export default function Risk({ formState }: { formState: ProjectFormState }) {
  const [riskLevel, setRiskLevel] = formState.riskLevelProps;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3">
        <p className="text-c-l font-semibold text-text-secondary">
          Tingkat Risiko Non-Permanensi
        </p>
        {RISK_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            onClick={() => setRiskLevel(opt.value)}
            className={`flex items-center gap-3 rounded-2xl border-2 px-5 py-4 cursor-pointer transition ${
              riskLevel === opt.value
                ? "border-primary bg-blue-50"
                : "border-border bg-white"
            }`}
          >
            <span
              className={`flex size-4 shrink-0 items-center justify-center rounded-full border-2 ${
                riskLevel === opt.value ? "border-primary" : "border-border"
              }`}
            >
              {riskLevel === opt.value && (
                <span className="block size-2 rounded-full bg-primary" />
              )}
            </span>
            <span
              className={`text-c-l font-semibold ${
                riskLevel === opt.value ? "text-primary" : "text-text-primary"
              }`}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>

      <div className="rounded-2xl bg-tertiary p-5 text-white">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-c-r text-white/40 mb-1">Total Gross Carbon Stock</p>
            <p className="text-c-l font-bold">{formState.grossCarbon} tCO₂e</p>
          </div>
          <div>
            <p className="text-c-r text-white/40 mb-1">Kredit yang Bisa Diterbitkan</p>
            <p className="text-c-l font-bold text-secondary">{formState.credit} tCO₂e</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => formState.setStep(1)}
          className="rounded-full border border-border bg-white px-6 py-3 text-c-l font-semibold text-text-secondary hover:bg-surface transition"
        >
          ← Kembali
        </button>
        <button
          onClick={() => formState.setStep(3)}
          className="rounded-full bg-primary px-6 py-3 text-c-l font-semibold text-white shadow-sm hover:opacity-90 transition"
        >
          Lihat Laporan →
        </button>
      </div>
    </div>
  );
}