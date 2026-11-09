import type {
  CropRecord,
  Farm,
  FarmerPreferences,
  FarmManagement,
  IrrigationRecord,
  SoilRecord,
  WeatherRecord,
} from "@/lib/types";

export type FieldErrors<T> = Partial<Record<keyof T, string>>;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+()\-.\s\d]{7,18}$/;

function required(v: unknown): boolean {
  return v !== undefined && v !== null && String(v).trim() !== "";
}

function inRange(v: number, min: number, max: number): boolean {
  return v >= min && v <= max;
}

export function validateSignup(values: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  country: string;
  state: string;
  district: string;
  preferredLanguage: string;
  agreed: boolean;
}) {
  const e: Record<string, string> = {};
  if (!required(values.fullName)) e.fullName = "Full name is required.";
  else if (values.fullName.trim().length < 3) e.fullName = "Name must be at least 3 characters.";

  if (!required(values.email)) e.email = "Email is required.";
  else if (!emailRe.test(values.email)) e.email = "Enter a valid email address.";

  if (!required(values.phone)) e.phone = "Phone number is required.";
  else if (!phoneRe.test(values.phone)) e.phone = "Enter a valid phone number.";

  if (!required(values.password)) e.password = "Password is required.";
  else if (values.password.length < 8) e.password = "Password must be at least 8 characters.";
  else if (!/[A-Za-z]/.test(values.password) || !/\d/.test(values.password))
    e.password = "Password must contain letters and numbers.";

  if (values.confirmPassword !== values.password)
    e.confirmPassword = "Passwords do not match.";

  if (!required(values.country)) e.country = "Country is required.";
  if (!required(values.state)) e.state = "State is required.";
  if (!required(values.district)) e.district = "District is required.";
  if (!required(values.preferredLanguage)) e.preferredLanguage = "Language is required.";
  if (!values.agreed) e.agreed = "You must accept the Terms and Privacy Policy.";

  return e;
}

export function validateLogin(values: { email: string; password: string }) {
  const e: Record<string, string> = {};
  if (!required(values.email)) e.email = "Email is required.";
  else if (!emailRe.test(values.email)) e.email = "Enter a valid email address.";
  if (!required(values.password)) e.password = "Password is required.";
  return e;
}

export function validateFarm(values: Partial<Farm>): FieldErrors<Farm> {
  const e: FieldErrors<Farm> = {};
  if (!required(values.name)) e.name = "Farm name is required.";
  if (!required(values.country)) e.country = "Country is required.";
  if (!required(values.state)) e.state = "State is required.";
  if (!required(values.district)) e.district = "District is required.";
  if (values.latitude === undefined || !inRange(Number(values.latitude), -90, 90))
    e.latitude = "Latitude must be between -90 and 90.";
  if (values.longitude === undefined || !inRange(Number(values.longitude), -180, 180))
    e.longitude = "Longitude must be between -180 and 180.";
  if (!values.areaValue || Number(values.areaValue) <= 0) e.areaValue = "Enter a valid farm area.";
  return e;
}

export function validateWeather(values: Partial<WeatherRecord>): FieldErrors<WeatherRecord> {
  const e: FieldErrors<WeatherRecord> = {};
  if (!required(values.avgTemperatureC)) e.avgTemperatureC = "Required.";
  if (!required(values.maxTemperatureC)) e.maxTemperatureC = "Required.";
  if (!required(values.minTemperatureC)) e.minTemperatureC = "Required.";
  if (!required(values.relativeHumidityPct)) e.relativeHumidityPct = "Required.";
  else if (!inRange(Number(values.relativeHumidityPct), 0, 100))
    e.relativeHumidityPct = "Humidity must be 0–100%.";
  if (!required(values.annualRainfallMm)) e.annualRainfallMm = "Required.";
  if (!required(values.windSpeedKmh)) e.windSpeedKmh = "Required.";
  return e;
}

export function validateSoil(values: Partial<SoilRecord>): FieldErrors<SoilRecord> {
  const e: FieldErrors<SoilRecord> = {};
  if (!required(values.soilType)) e.soilType = "Soil type is required.";
  if (!required(values.soilPh)) e.soilPh = "Required.";
  else if (!inRange(Number(values.soilPh), 0, 14)) e.soilPh = "pH must be between 0 and 14.";
  if (!required(values.nitrogen)) e.nitrogen = "Required.";
  if (!required(values.phosphorus)) e.phosphorus = "Required.";
  if (!required(values.potassium)) e.potassium = "Required.";
  return e;
}

export function validateCrop(values: Partial<CropRecord>): FieldErrors<CropRecord> {
  const e: FieldErrors<CropRecord> = {};
  if (!required(values.currentCrop)) e.currentCrop = "Current crop is required.";
  if (!required(values.cropVariety)) e.cropVariety = "Crop variety is required.";
  if (!required(values.sowingDate)) e.sowingDate = "Sowing date is required.";
  if (!required(values.expectedHarvestDate)) e.expectedHarvestDate = "Expected harvest date is required.";
  if (!required(values.previousYield)) e.previousYield = "Required.";
  if (!required(values.expectedYield)) e.expectedYield = "Required.";
  return e;
}

export function validateIrrigation(values: Partial<IrrigationRecord>): FieldErrors<IrrigationRecord> {
  const e: FieldErrors<IrrigationRecord> = {};
  if (!required(values.method)) e.method = "Irrigation method is required.";
  if (!required(values.waterSource)) e.waterSource = "Water source is required.";
  if (!required(values.waterAvailability)) e.waterAvailability = "Required.";
  return e;
}

export function validateManagement(values: Partial<FarmManagement>): FieldErrors<FarmManagement> {
  const e: FieldErrors<FarmManagement> = {};
  if (!required(values.farmSize)) e.farmSize = "Farm size is required.";
  if (!required(values.farmingExperienceYears)) e.farmingExperienceYears = "Required.";
  if (!required(values.farmingMethod)) e.farmingMethod = "Farming method is required.";
  return e;
}

export function validatePreferences(values: Partial<FarmerPreferences>): FieldErrors<FarmerPreferences> {
  const e: FieldErrors<FarmerPreferences> = {};
  if (!required(values.mainGoal)) e.mainGoal = "Main goal is required.";
  if (!required(values.budget)) e.budget = "Budget is required.";
  if (!required(values.riskTolerance)) e.riskTolerance = "Risk tolerance is required.";
  if (!required(values.preferredMarket)) e.preferredMarket = "Preferred market is required.";
  return e;
}

export function validateForgotPassword(values: { email: string }) {
  const e: Record<string, string> = {};
  if (!required(values.email)) e.email = "Email is required.";
  else if (!emailRe.test(values.email)) e.email = "Enter a valid email address.";
  return e;
}

export function validateResetPassword(values: { password: string; confirm: string }) {
  const e: Record<string, string> = {};
  if (!required(values.password)) e.password = "Password is required.";
  else if (values.password.length < 8) e.password = "Password must be at least 8 characters.";
  if (values.confirm !== values.password) e.confirm = "Passwords do not match.";
  return e;
}