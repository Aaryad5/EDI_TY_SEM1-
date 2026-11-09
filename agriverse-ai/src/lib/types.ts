// =====================================================================
// AgriVerse AI — Core domain types
// These interfaces map 1:1 to future PostgreSQL tables
// (users, farms, farm_snapshots, weather_records, soil_records,
//  crop_records, irrigation_records, recommendations, alerts,
//  farm_history, iot_devices)
// =====================================================================

export type ID = string;

export type Severity = "low" | "medium" | "high" | "critical";

export type Timestamps = {
  createdAt: string; // ISO-8601 machine readable
  updatedAt: string; // ISO-8601 machine readable
};

/** Display stamp derived from createdAt — stored for fast filtering */
export type DayStamp = {
  date: string; // YYYY-MM-DD
  day: string; // e.g. "Tuesday"
  time: string; // HH:MM:SS
  timezone: string; // e.g. "Asia/Kolkata"
  timestamp?: string; // ISO-8601 machine readable or formatted
};

// ---------------- User ----------------
export type UserProfile = Timestamps & {
  id: ID;
  userId: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  district: string;
  preferredLanguage: string;
  avatarUrl?: string;
  role: "admin" | "farmer" | "viewer";
};

// ---------------- Farm ----------------
export type AreaUnit = "acres" | "hectares";

export type Farm = Timestamps & {
  id: ID;
  farmId: string;
  userId: string;
  name: string;
  country: string;
  state: string;
  district: string;
  village: string;
  latitude: number;
  longitude: number;
  areaValue: number;
  areaUnit: AreaUnit;
  boundary?: FarmBoundary;
  isActive?: boolean;
  currentCrop?: string;
  cropHealth?: "Healthy" | "Attention" | "Critical";
  imageUrl?: string;
  lastAnalyzed?: string;
  riskLevel?: "Low" | "Medium" | "High";
  address?: string;
};

export type FarmBoundary = {
  type: "Point" | "Polygon";
  coordinates: number[][]; // [lng, lat][]
};

export type FarmLocation = {
  latitude: number;
  longitude: number;
  area: number;
  areaUnit: AreaUnit;
  address: string;
  boundary?: FarmBoundary;
  date: string;
  time: string;
  timezone: string;
};

// ---------------- FarmSnapshot ----------------
export type FarmSnapshot = Timestamps &
  DayStamp & {
    id: ID;
    userId: string;
    username?: string;
    farmId: string;
    label?: string;
    changesMade?: string[];
    farm?: Farm;
    weather?: WeatherRecord;
    soil?: SoilRecord;
    crop?: CropRecord;
    irrigation?: IrrigationRecord;
    management?: FarmManagement;
    preferences?: FarmerPreferences;
  };

// ---------------- Farm Management & Preferences ----------------
export type FarmingMethod = "conventional" | "organic" | "precision" | "mixed";

export type FarmManagement = {
  farmSize: number;
  workers: number;
  farmingExperienceYears: number;
  farmingMethod: FarmingMethod;
  equipment: string[];
  tractorAvailable: boolean;
  iotSensorsAvailable: boolean;
  greenhouseAvailable: boolean;
  storageFacility: boolean;
  coldStorageAvailable: boolean;
};

export type FarmingGoal =
  | "maximum_yield"
  | "maximum_profit"
  | "water_conservation"
  | "sustainable_farming"
  | "organic_production";

export type FarmerPreferences = {
  mainGoal: FarmingGoal;
  preferredCrops: string[];
  budget: number;
  riskTolerance: "low" | "medium" | "high";
  preferredMarket: string;
  targetSellingPeriod: string;
};

// ---------------- Weather ----------------
export type GrowingSeason = "Kharif" | "Rabi" | "Zaid" | "Year-round";

export type WeatherRecord = Timestamps & {
  id: ID;
  snapshotId: ID | null;
  farmId: string;
  userId: string;
  avgTemperatureC: number;
  maxTemperatureC: number;
  minTemperatureC: number;
  relativeHumidityPct: number;
  annualRainfallMm: number;
  recentRainfallMm: number;
  windSpeedKmh: number;
  sunshineHours: number;
  growingSeason: GrowingSeason;
  irrigationAvailable: boolean;
  source?: "manual" | "live";
};

export type ForecastDay = {
  date: string;
  day: string;
  tempHighC: number;
  tempLowC: number;
  humidityPct: number;
  rainfallMm: number;
  windSpeedKmh: number;
  condition: string;
};

// ---------------- Soil ----------------
export type SoilType =
  | "Alluvial"
  | "Black Cotton"
  | "Red"
  | "Laterite"
  | "Sandy"
  | "Clay"
  | "Loamy"
  | "Silty";

export type SoilRecord = Timestamps & {
  id: ID;
  snapshotId: ID | null;
  farmId: string;
  userId: string;
  soilType: SoilType;
  soilPh: number;
  nitrogen: number; // kg/ha
  phosphorus: number; // kg/ha
  potassium: number; // kg/ha
  organicCarbonPct: number;
  moisturePct: number;
  electricalConductivityDsM: number;
  clayPct: number;
  sandPct: number;
  siltPct: number;
  soilDepthCm: number;
  source?: "manual" | "auto";
};

// ---------------- Crop ----------------
export type CropHealth = "excellent" | "good" | "fair" | "poor" | "critical";

export type CropRecord = Timestamps & {
  id: ID;
  snapshotId: ID | null;
  farmId: string;
  userId: string;
  currentCrop: string;
  previousCrop: string;
  cropVariety: string;
  cropAgeWeeks: number;
  sowingDate: string;
  expectedHarvestDate: string;
  farmArea: number;
  seedVariety: string;
  seedQuantity: number;
  fertilizerUsed: string;
  fertilizerQuantity: number; // kg
  pesticidesUsed: string;
  previousYield: number; // tons
  expectedYield: number; // tons
  previousCropDisease: string;
  cropHealth: CropHealth;
  cropImage?: string;
  leafImage?: string;
  farmImage?: string;
};

// ---------------- Irrigation ----------------
export type IrrigationMethod = "drip" | "sprinkler" | "flood" | "rainfed" | "other";
export type WaterSource = "borewell" | "river" | "canal" | "reservoir" | "rainwater" | "other";

export type IrrigationRecord = Timestamps & {
  id: ID;
  snapshotId: ID | null;
  farmId: string;
  userId: string;
  method: IrrigationMethod;
  waterSource: WaterSource;
  waterAvailability: string;
  frequencyDays: number;
  averageWaterUsageLiters: number;
  pumpCapacityHP: number;
};

// ---------------- AI / Recommendations ----------------
export type RecommendationType =
  | "crop"
  | "region"
  | "season"
  | "irrigation"
  | "yield"
  | "fertilizer"
  | "pest_control";

export type ConfidenceLevel = {
  rawModelScore: number | null; // set when ML backend is live
  mockDisplayConfidence: number; // clearly a demo value
  isMock: boolean;
};

export type RecommendationReason = {
  label: string;
  status: "met" | "partial" | "not_met" | "neutral";
};

export type CropRecommendation = {
  crop: string;
  region: string;
  season: string;
  suitabilityScore: number;
  confidence: ConfidenceLevel;
  reasons: RecommendationReason[];
  expectedYieldTonsPerHa: number;
  waterRequirementMm: number;
  growingPeriodDays: number;
  estimatedProfitPerHa: number;
  riskLevel: Severity;
  requiredConditions: string[];
  supportingData: Record<string, string | number>;
};

export type SeasonRecommendation = {
  season: string;
  displayName: string;
  months: string;
  suitability: number;
  reasons: string[];
};

export type RegionRecommendation = {
  region: string;
  country: string;
  suitability: number;
  reasons: string[];
};

export type YieldPrediction = {
  crop: string;
  predictedYieldTonsPerHa: number;
  confidence: ConfidenceLevel;
  andFactors: string[];
};

export type IrrigationRecommendation = {
  crop: string;
  recommendedFrequencyDays: number;
  waterPerEventLiters: number;
  confidence: ConfidenceLevel;
  rationale: string;
};

export type DiseasePrediction = {
  crop: string;
  disease: string;
  probability: number;
  confidence: ConfidenceLevel;
  symptoms: string[];
  recommendedAction: string;
};

export type PestRisk = {
  pest: string;
  crop: string;
  riskLevel: Severity;
  riskScore: number;
  confidence: ConfidenceLevel;
  recommendedAction: string;
};

export type WeatherRisk = {
  event: string;
  riskLevel: Severity;
  likelihoodPct: number;
  impact: string;
  suggestedAction: string;
};

export type MarketPrediction = {
  crop: string;
  currentPricePerKg: number;
  predictedPricePerKg: number;
  trend: "up" | "down" | "stable";
  confidence: ConfidenceLevel;
  demandIndex: number;
};

export type Recommendation = Timestamps & {
  id: ID;
  snapshotId: ID | null;
  farmId: string;
  userId: string;
  type: RecommendationType;
  isMock: boolean;
  crop?: CropRecommendation;
  season?: SeasonRecommendation;
  region?: RegionRecommendation;
  yieldPrediction?: YieldPrediction;
  irrigation?: IrrigationRecommendation;
  summary: string;
};

// ---------------- Alerts ----------------
export type AlertCategory =
  | "weather"
  | "crop"
  | "pest"
  | "irrigation"
  | "temperature"
  | "soil"
  | "market";

export type FarmAlert = Timestamps &
  DayStamp & {
    id: ID;
    farmId: string;
    userId: string;
    category: AlertCategory;
    severity: Severity;
    message: string;
    recommendedAction: string;
    read: boolean;
  };

// ---------------- History ----------------
export type HistoryRecord = FarmSnapshot & {
  type: "snapshot_created" | "snapshot_updated" | "recommendation_generated" | "alert_raised";
  title: string;
  changes?: string[];
};

// ---------------- IoT / Devices ----------------
export type DeviceType = "soil_sensor" | "weather_station" | "camera" | "valve" | "drone";

export type IoTDevice = Timestamps & {
  id: ID;
  farmId: string;
  userId: string;
  name: string;
  type: DeviceType;
  status: "online" | "offline" | "maintenance";
  batteryPct: number;
  lastReading: string;
};

// ---------------- Digital Twin ----------------
export type SimulationScenario = {
  id: string;
  label: string;
  description: string;
  parameters: Record<string, number>;
};

export type DigitalTwinSimulation = {
  baselineYieldTonsPerHa: number;
  simulatedYieldTonsPerHa: number;
  baselineWaterUsageLiters: number;
  simulatedWaterUsageLiters: number;
  waterStressIndex: number;
  cropHealthImpact: number; // -1..1
  qaPerArea: Record<string, number>;
  notes: string[];
};

// ---------------- Region / Crop catalog ----------------
export type CropOption = {
  id: string;
  name: string;
  family: string;
  season: string[];
  typicalDurationDays: number;
  waterRequirementMm: number;
  idealPhRange: [number, number];
};

export type RegionOption = {
  id: string;
  name: string;
  state: string;
  country: string;
  climate: string;
  avgAnnualRainfallMm: number;
  avgTemperatureC: number;
  majorSoils: SoilType[];
};

export type SeasonOption = {
  id: string;
  name: "Kharif" | "Rabi" | "Zaid" | "Year-round";
  months: string;
  sowingToHarvestNote: string;
};

// ---------------- Search ----------------
export type HistoryFilter = {
  query?: string;
  dateFrom?: string;
  dateTo?: string;
  crop?: string;
  farmId?: string;
  type?: HistoryRecord["type"];
};

// ---------------- AI Agents & Orchestration ----------------
export type AgentCategory = "weather" | "crop" | "soil" | "irrigation" | "pest" | "market";

export type AgentResult = {
  id: string;
  name: string;
  category: AgentCategory;
  status: "optimal" | "good" | "attention" | "warning";
  risk: "Low" | "Medium" | "High";
  finding: string;
  recommendation: string;
  confidence: number;
  stage?: string;
  growth?: string;
  currentPrice?: string;
  trend?: string;
  details?: Record<string, string | number>;
};

export type SimulationResult = {
  id: string;
  farmId: string;
  scenarioName: string;
  expectedYieldTons: number;
  waterUsageLiters: number;
  riskLevel: "Low" | "Medium" | "High";
  estimatedProfitInr: number;
  sustainabilityScore: number;
  recommendation: string;
  rainfallDeltaPct?: number;
  tempDeltaC?: number;
  irrigationDeltaPct?: number;
  timestamp: string;
};

export type AIAnalysis = {
  id: string;
  farmId: string;
  date: string;
  time: string;
  agents: AgentResult[];
  primaryRecommendation: {
    action: string;
    description: string;
    risk: "Low" | "Medium" | "High";
    confidence: number;
  };
};

// Convenience domain aliases
export type User = UserProfile;
export type WeatherData = WeatherRecord;
export type SoilData = SoilRecord;
export type CropData = CropRecord;
export type IrrigationData = IrrigationRecord;
export type AIRecommendation = Recommendation;
export type Alert = FarmAlert;