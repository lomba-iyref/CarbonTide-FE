// interfaces/interface.ts
import { Dispatch, SetStateAction } from "react";

export type StepType = 0 | 1 | 2 | 3;
export type StateProp<T> = [T, Dispatch<SetStateAction<T>>];

// Harus persis sama dengan Project.project_type choices di backend
export type ProjectTypeValue =
  | "forestry"
  | "renewable_energy"
  | "agriculture"
  | "waste_management"
  | "blue_carbon"
  | "energy_efficiency"
  | "other";

// Harus persis sama dengan Project.registry choices di backend
export type RegistryValue =
  | "verra"
  | "gold_standard"
  | "acr"
  | "car"
  | "plan_vivo"
  | "other";

// Model tidak punya `choices` untuk methodology (CharField bebas),
// jadi ini cuma daftar pilihan umum -- boleh ditambah/diubah bebas.
export type MetodologiType =
  | "VM0033 (Verra Blue Carbon)"
  | "VM0007 (REDD+ Methodology Framework)"
  | "AR-ACM0003 (Afforestation/Reforestation)"
  | "Lainnya";

// Harus persis sama dengan MRV.RiskLevel choices di backend
export type RiskLevelValue = "low" | "medium" | "high";

export interface RiskOption {
  value: RiskLevelValue;
  label: string;
  bufferPct: number;
}

export const RISK_OPTIONS: RiskOption[] = [
  { value: "low", label: "Rendah (Low Risk) - 10% Buffer Deduction", bufferPct: 0.1 },
  { value: "medium", label: "Sedang (Medium Risk) - 15% Buffer Deduction", bufferPct: 0.15 },
  { value: "high", label: "Tinggi (High Risk) - 20% Buffer Deduction", bufferPct: 0.2 },
];

/**
 * Satu objek state gabungan untuk seluruh wizard (Setup + Data + Risk + Report).
 * Field `agb`, `bgb`, `grossCarbon`, `credit` adalah nilai TURUNAN (read-only,
 * dihitung ulang otomatis di parent lewat useMemo tiap kali input MRV/risk berubah)
 * -- jangan di-set manual dari section manapun.
 */
export interface ProjectFormState {
  // ── Setup ──
  namaProyekProps: StateProp<string>;
  projectTypeProps: StateProp<ProjectTypeValue>;
  descriptionProps: StateProp<string>;
  countryProps: StateProp<string>;
  locationProps: StateProp<string>;
  metodologiProps: StateProp<MetodologiType>;
  registryProps: StateProp<RegistryValue>;
  luasAreaProps: StateProp<number>;
  deforestasiProps: StateProp<number>;
  thumbnailUrlProps: StateProp<string>;

  // ── Data MRV ──
  jumlahPohonProps: StateProp<number>;
  avgDbhProps: StateProp<number>;
  avgTinggiProps: StateProp<number>;
  rtsRatioProps: StateProp<number>;
  soilCarbonProps: StateProp<number>;

  // ── Risk ──
  riskLevelProps: StateProp<RiskLevelValue>;

  // ── Turunan (read-only) ──
  agb: number; // above_ground_biomass, ton
  bgb: number; // below_ground_biomass, ton
  grossCarbon: number; // total_gross_carbon_stock, tCO2e
  credit: number; // issuable_credits, tCO2e (setelah buffer deduction)

  setStep: Dispatch<SetStateAction<StepType>>;
}