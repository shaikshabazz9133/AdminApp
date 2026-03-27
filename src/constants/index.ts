export const Spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 };
export const BorderRadius = { sm: 8, md: 12, lg: 16, xl: 24, full: 999 };
export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};
export const FontWeight = {
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
  extrabold: "800" as const,
};

export const APP_NAME = "NMC Admin";

export const ISSUE_TYPES = [
  { key: "road_damage", label: "Road Damage" },
  { key: "garbage", label: "Garbage" },
  { key: "drainage", label: "Drainage" },
  { key: "street_light", label: "Street Light" },
] as const;

export const COMPLAINT_STATUS_STEPS = [
  "submitted",
  "assigned",
  "in_progress",
  "completed",
] as const;

export const PRIORITY_LABELS = {
  high: "High",
  medium: "Medium",
  low: "Low",
} as const;

export const DEPARTMENT_LIST = [
  "Roads & Infrastructure",
  "Sanitation",
  "Water & Drainage",
  "Electrical",
  "General",
];
