"use client";
import { useMemo, useState } from "react";
import SetUp from "@/sections/create-project/setup";
import Data from "@/sections/create-project/data";
import Risk from "@/sections/create-project/risk";
import Report from "@/sections/create-project/report";
import {
  StepType,
  ProjectTypeValue,
  RegistryValue,
  MetodologiType,
  RiskLevelValue,
  ProjectFormState,
  RISK_OPTIONS,
} from "@/interfaces/interface";
import { GeoJSONPolygon } from "@/components/map-draw";

// ── ASUMSI kalkulasi biomassa & kredit karbon ──────────────────────────────
// AGB memakai rumus alometrik yang sama dengan yang ditampilkan di halaman
// detail proyek buyer: AGB = 0.0673 x (rho * D^2 * H)^0.976 (per pohon, kg).
// WOOD_DENSITY, CARBON_FRACTION, CO2_CONVERSION adalah nilai default generik
// -- BUKAN dari metodologi resmi (VM0033/VM0007). Validasi dengan tim MRV
// sebelum dipakai di produksi. Semua nilai turunan ini tetap read-only di
// UI (preview), backend menyimpan apa pun yang dikirim saat submit.
const WOOD_DENSITY = 0.5; // g/cm3, rata-rata kerapatan kayu mangrove
const CARBON_FRACTION = 0.47; // IPCC default: proporsi karbon dlm biomassa kering
const CO2_CONVERSION = 44 / 12; // konversi ton C -> ton CO2e

function InputStep({
  step,
  formState,
}: {
  step: number;
  formState: ProjectFormState;
}) {
  const Forms = [
    <SetUp key="setup" formState={formState} />,
    <Data key="data" formState={formState} />,
    <Risk key="risk" formState={formState} />,
  ];

  return (
    <div className="flex flex-col gap-10 mt-30 w-305">
      <div className="flex flex-col gap-5">
        <p className="text-h1 font-bold">Setup Proyek & Input MRV</p>
        <p>
          Alur MRV end-to-end yang bisa diaudit sesuai spesifikasi Blue
          Carbon (AGB, BGB, SOC).
        </p>
      </div>
      {Forms[step]}
    </div>
  );
}

export default function CreateProject() {
  const [step, setStep] = useState<StepType>(0);

  // ── Setup ──
  const namaProyekProps = useState("");
  const projectTypeProps = useState<ProjectTypeValue>("blue_carbon");
  const descriptionProps = useState("");
  const countryProps = useState("Indonesia");
  const locationProps = useState("");
  const metodologiProps = useState<MetodologiType>("VM0033 (Verra Blue Carbon)");
  const registryProps = useState<RegistryValue>("verra");
  const luasAreaProps = useState(0);
  const deforestasiProps = useState(0);
  const thumbnailUrlProps = useState("");
  const areaGeojsonProps = useState<GeoJSONPolygon | null>(null);

  // ── Data MRV ──
  const jumlahPohonProps = useState(0);
  const avgDbhProps = useState(0);
  const avgTinggiProps = useState(0);
  const rtsRatioProps = useState(0.3);
  const soilCarbonProps = useState(0);

  // ── Risk ──
  const riskLevelProps = useState<RiskLevelValue>("medium");

  // ── Kalkulasi turunan (read-only preview, dihitung ulang otomatis) ──
  const { agb, bgb, grossCarbon, credit } = useMemo(() => {
    const dbh = avgDbhProps[0];
    const height = avgTinggiProps[0];
    const treeCount = jumlahPohonProps[0];
    const rts = rtsRatioProps[0];
    const soilCarbon = soilCarbonProps[0];

    const agbPerTreeKg =
      dbh > 0 && height > 0
        ? 0.0673 * Math.pow(WOOD_DENSITY * dbh * dbh * height, 0.976)
        : 0;
    const agbTon = (agbPerTreeKg * treeCount) / 1000;
    const bgbTon = agbTon * rts;

    const carbonStockTonC = (agbTon + bgbTon) * CARBON_FRACTION + soilCarbon;
    const grossCarbonTonCO2e = carbonStockTonC * CO2_CONVERSION;

    const bufferPct =
      RISK_OPTIONS.find((r) => r.value === riskLevelProps[0])?.bufferPct ?? 0;
    const issuableCredit = grossCarbonTonCO2e * (1 - bufferPct);

    return {
      agb: Number(agbTon.toFixed(2)),
      bgb: Number(bgbTon.toFixed(2)),
      grossCarbon: Number(grossCarbonTonCO2e.toFixed(2)),
      credit: Number(issuableCredit.toFixed(2)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    avgDbhProps[0],
    avgTinggiProps[0],
    jumlahPohonProps[0],
    rtsRatioProps[0],
    soilCarbonProps[0],
    riskLevelProps[0],
  ]);

  const formState: ProjectFormState = {
    namaProyekProps,
    projectTypeProps,
    descriptionProps,
    countryProps,
    locationProps,
    metodologiProps,
    registryProps,
    luasAreaProps,
    deforestasiProps,
    thumbnailUrlProps,
    areaGeojsonProps,
    jumlahPohonProps,
    avgDbhProps,
    avgTinggiProps,
    rtsRatioProps,
    soilCarbonProps,
    riskLevelProps,
    agb,
    bgb,
    grossCarbon,
    credit,
    setStep,
  };

  return (
    <div className="flex justify-center">
      {step < 3 ? (
        <InputStep step={step} formState={formState} />
      ) : (
        <Report formState={formState} />
      )}
    </div>
  );
}