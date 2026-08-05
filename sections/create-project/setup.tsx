// sections/create-project/setup.tsx
"use client";
import dynamic from "next/dynamic";
import {
  ProjectFormState,
  ProjectTypeValue,
  RegistryValue,
  MetodologiType,
} from "@/interfaces/interface";

const MapDraw = dynamic(() => import("@/components/map-draw"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-2xl border border-border bg-surface text-c-l text-text-secondary">
      Memuat peta...
    </div>
  ),
});

const PROJECT_TYPE_OPTIONS: { value: ProjectTypeValue; label: string }[] = [
  { value: "blue_carbon", label: "Blue Carbon / ARR" },
  { value: "forestry", label: "Forestry / ARR" },
  { value: "renewable_energy", label: "Renewable Energy" },
  { value: "agriculture", label: "Agriculture" },
  { value: "waste_management", label: "Waste Management" },
  { value: "energy_efficiency", label: "Energy Efficiency" },
  { value: "other", label: "Lainnya" },
];

const REGISTRY_OPTIONS: { value: RegistryValue; label: string }[] = [
  { value: "verra", label: "Verra (VCS)" },
  { value: "gold_standard", label: "Gold Standard" },
  { value: "acr", label: "American Carbon Registry (ACR)" },
  { value: "car", label: "Climate Action Reserve (CAR)" },
  { value: "plan_vivo", label: "Plan Vivo" },
  { value: "other", label: "Lainnya" },
];

const METODOLOGI_OPTIONS: MetodologiType[] = [
  "VM0033 (Verra Blue Carbon)",
  "VM0007 (REDD+ Methodology Framework)",
  "AR-ACM0003 (Afforestation/Reforestation)",
  "Lainnya",
];

const inputCls =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-c-l text-text-primary outline-none focus:border-primary transition";

export default function SetUp({ formState }: { formState: ProjectFormState }) {
  const [namaProyek, setNamaProyek] = formState.namaProyekProps;
  const [projectType, setProjectType] = formState.projectTypeProps;
  const [description, setDescription] = formState.descriptionProps;
  const [country, setCountry] = formState.countryProps;
  const [location, setLocation] = formState.locationProps;
  const [metodologi, setMetodologi] = formState.metodologiProps;
  const [registry, setRegistry] = formState.registryProps;
  const [luasArea, setLuasArea] = formState.luasAreaProps;
  const [deforestasi, setDeforestasi] = formState.deforestasiProps;
  const [thumbnailUrl, setThumbnailUrl] = formState.thumbnailUrlProps;
  const [areaGeojson, setAreaGeojson] = formState.areaGeojsonProps;

  const canContinue =
    namaProyek.trim() !== "" &&
    location.trim() !== "" &&
    luasArea > 0 &&
    areaGeojson !== null;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-border bg-white p-6 shadow-sm">
      <Field label="Nama Proyek">
        <input
          className={inputCls}
          value={namaProyek}
          onChange={(e) => setNamaProyek(e.target.value)}
          placeholder="Restorasi Mangrove Teluk Kelabat"
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipe Proyek">
          <select
            className={inputCls}
            value={projectType}
            onChange={(e) => setProjectType(e.target.value as ProjectTypeValue)}
          >
            {PROJECT_TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Standar Registry">
          <select
            className={inputCls}
            value={registry}
            onChange={(e) => setRegistry(e.target.value as RegistryValue)}
          >
            {REGISTRY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Deskripsi Proyek">
        <textarea
          className={inputCls}
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ceritakan tujuan dan dampak proyek..."
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Negara">
          <input className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)} />
        </Field>
        <Field label="Lokasi">
          <input
            className={inputCls}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Bangka Belitung"
          />
        </Field>
      </div>

      <Field label="Area Proyek (Verifikasi Satelit)">
        <MapDraw value={areaGeojson} onChange={setAreaGeojson} />
        <p className="text-c-r text-text-secondary mt-2">
          Gambar batas area proyek pakai tool polygon di pojok kanan atas peta.
          Data ini dipakai sistem untuk memverifikasi baseline deforestasi secara
          independen lewat citra satelit Global Forest Watch.
        </p>
      </Field>

      <Field label="Metodologi">
        <select
          className={inputCls}
          value={metodologi}
          onChange={(e) => setMetodologi(e.target.value as MetodologiType)}
        >
          {METODOLOGI_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Luas Area (Ha)">
          <input
            type="number"
            min={0}
            className={inputCls}
            value={luasArea}
            onChange={(e) => setLuasArea(Number(e.target.value) || 0)}
          />
        </Field>
        <Field label="Tingkat Deforestasi Historis (%/tahun)">
          <input
            type="number"
            min={0}
            step={0.1}
            className={inputCls}
            value={deforestasi}
            onChange={(e) => setDeforestasi(Number(e.target.value) || 0)}
          />
        </Field>
      </div>

      <Field label="URL Thumbnail">
        <input
          className={inputCls}
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          placeholder="https://..."
        />
      </Field>

      <div className="flex justify-end">
        <button
          disabled={!canContinue}
          onClick={() => formState.setStep(1)}
          className="rounded-full bg-primary px-6 py-3 text-c-l font-semibold text-white shadow-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lanjut ke Input Data MRV →
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