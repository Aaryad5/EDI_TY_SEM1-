import type {
  CropOption,
  RegionOption,
  SeasonOption,
  Severity,
  SoilType,
} from "@/lib/types";

export const SOIL_TYPES: SoilType[] = [
  "Alluvial",
  "Black Cotton",
  "Red",
  "Laterite",
  "Sandy",
  "Clay",
  "Loamy",
  "Silty",
];

export const CROPS: CropOption[] = [
  { id: "crop_rice", name: "Rice", family: "Cereal", season: ["Kharif"], typicalDurationDays: 120, waterRequirementMm: 1200, idealPhRange: [5.0, 6.5] },
  { id: "crop_wheat", name: "Wheat", family: "Cereal", season: ["Rabi"], typicalDurationDays: 130, waterRequirementMm: 500, idealPhRange: [6.0, 7.5] },
  { id: "crop_maize", name: "Maize", family: "Cereal", season: ["Kharif", "Zaid"], typicalDurationDays: 100, waterRequirementMm: 600, idealPhRange: [5.8, 7.0] },
  { id: "crop_sugarcane", name: "Sugarcane", family: "Cash", season: ["Year-round"], typicalDurationDays: 330, waterRequirementMm: 2200, idealPhRange: [6.0, 7.5] },
  { id: "crop_tomato", name: "Tomato", family: "Vegetable", season: ["Rabi"], typicalDurationDays: 90, waterRequirementMm: 600, idealPhRange: [6.0, 7.0] },
  { id: "crop_onion", name: "Onion", family: "Vegetable", season: ["Rabi"], typicalDurationDays: 120, waterRequirementMm: 700, idealPhRange: [6.0, 7.0] },
  { id: "crop_potato", name: "Potato", family: "Vegetable", season: ["Rabi"], typicalDurationDays: 90, waterRequirementMm: 550, idealPhRange: [5.5, 6.5] },
  { id: "crop_mustard", name: "Mustard", family: "Oilseed", season: ["Rabi"], typicalDurationDays: 110, waterRequirementMm: 400, idealPhRange: [6.0, 7.0] },
  { id: "crop_cotton", name: "Cotton", family: "Cash", season: ["Kharif"], typicalDurationDays: 165, waterRequirementMm: 800, idealPhRange: [6.0, 8.0] },
  { id: "crop_soybean", name: "Soybean", family: "Pulse", season: ["Kharif"], typicalDurationDays: 110, waterRequirementMm: 450, idealPhRange: [6.0, 7.0] },
  { id: "crop_groundnut", name: "Groundnut", family: "Oilseed", season: ["Kharif", "Zaid"], typicalDurationDays: 120, waterRequirementMm: 650, idealPhRange: [6.0, 7.0] },
  { id: "crop_chilli", name: "Chilli", family: "Vegetable", season: ["Kharif"], typicalDurationDays: 120, waterRequirementMm: 700, idealPhRange: [6.0, 7.0] },
  { id: "crop_banana", name: "Banana", family: "Fruit", season: ["Year-round"], typicalDurationDays: 300, waterRequirementMm: 1700, idealPhRange: [6.0, 7.5] },
  { id: "crop_mango", name: "Mango", family: "Fruit", season: ["Year-round"], typicalDurationDays: 200, waterRequirementMm: 800, idealPhRange: [5.5, 7.5] },
  { id: "crop_grape", name: "Grape", family: "Fruit", season: ["Rabi"], typicalDurationDays: 140, waterRequirementMm: 900, idealPhRange: [6.5, 7.5] },
  { id: "crop_barley", name: "Barley", family: "Cereal", season: ["Rabi"], typicalDurationDays: 120, waterRequirementMm: 450, idealPhRange: [6.0, 7.5] },
  { id: "crop_millets", name: "Millets", family: "Cereal", season: ["Kharif"], typicalDurationDays: 90, waterRequirementMm: 350, idealPhRange: [5.5, 7.0] },
  { id: "crop_lentil", name: "Lentil", family: "Pulse", season: ["Rabi"], typicalDurationDays: 110, waterRequirementMm: 350, idealPhRange: [6.0, 7.5] },
];

export const REGIONS: RegionOption[] = [
  { id: "region_pune", name: "Pune", state: "Maharashtra", country: "India", climate: "Semi-arid tropical", avgAnnualRainfallMm: 900, avgTemperatureC: 27, majorSoils: ["Black Cotton", "Red", "Laterite"] },
  { id: "region_nashik", name: "Nashik", state: "Maharashtra", country: "India", climate: "Semi-arid", avgAnnualRainfallMm: 800, avgTemperatureC: 29, majorSoils: ["Black Cotton", "Red"] },
  { id: "region_nagpur", name: "Nagpur", state: "Maharashtra", country: "India", climate: "Tropical dry", avgAnnualRainfallMm: 1100, avgTemperatureC: 31, majorSoils: ["Black Cotton", "Laterite"] },
  { id: "region_amritsar", name: "Amritsar", state: "Punjab", country: "India", climate: "Semi-arid subtropical", avgAnnualRainfallMm: 700, avgTemperatureC: 26, majorSoils: ["Alluvial", "Loamy"] },
  { id: "region_ludhiana", name: "Ludhiana", state: "Punjab", country: "India", climate: "Subtropical semi-arid", avgAnnualRainfallMm: 700, avgTemperatureC: 26, majorSoils: ["Alluvial"] },
  { id: "region_kanpur", name: "Kanpur", state: "Uttar Pradesh", country: "India", climate: "Subtropical humid", avgAnnualRainfallMm: 900, avgTemperatureC: 29, majorSoils: ["Alluvial", "Clay"] },
  { id: "region_vijayawada", name: "Vijayawada", state: "Andhra Pradesh", country: "India", climate: "Tropical", avgAnnualRainfallMm: 1000, avgTemperatureC: 31, majorSoils: ["Red", "Alluvial"] },
  { id: "region_coinbatore", name: "Coimbatore", state: "Tamil Nadu", country: "India", climate: "Semi-arid tropical", avgAnnualRainfallMm: 700, avgTemperatureC: 30, majorSoils: ["Red", "Black Cotton"] },
  { id: "region_bangalore", name: "Bengaluru", state: "Karnataka", country: "India", climate: "Tropical savanna", avgAnnualRainfallMm: 900, avgTemperatureC: 27, majorSoils: ["Red", "Laterite"] },
  { id: "region_jabalpur", name: "Jabalpur", state: "Madhya Pradesh", country: "India", climate: "Humid subtropical", avgAnnualRainfallMm: 1400, avgTemperatureC: 29, majorSoils: ["Black Cotton", "Alluvial"] },
];

export const SEASONS: SeasonOption[] = [
  { id: "season_kharif", name: "Kharif", months: "June – October", sowingToHarvestNote: "Sown with onset of monsoon (Jun–Jul), harvested Sep–Oct." },
  { id: "season_rabi", name: "Rabi", months: "October – March", sowingToHarvestNote: "Sown after monsoon (Oct–Nov), harvested Mar–Apr." },
  { id: "season_zaid", name: "Zaid", months: "March – June", sowingToHarvestNote: "Summer season between Rabi and Kharif." },
  { id: "season_year_round", name: "Year-round", months: "All year", sowingToHarvestNote: "Crops possible throughout the year with irrigation." },
];

// ------------------------------------------------------------------
// Severity styling helpers shared across the app
// ------------------------------------------------------------------
export const SEVERITY_STYLES: Record<Severity, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-fresh/15 text-fresh border-fresh/30" },
  medium: { label: "Medium", color: "bg-amber-100 text-amber-700 border-amber-300" },
  high: { label: "High", color: "bg-orange-100 text-orange-700 border-orange-300" },
  critical: { label: "Critical", color: "bg-red-100 text-red-700 border-red-300" },
};

export const CROP_NAMES = CROPS.map((c) => c.name);
export const REGION_NAMES = REGIONS.map((r) => r.name);