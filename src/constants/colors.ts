export const Colors = {
  // TDP Party Colors — AP Government
  primary: "#F5C518", // TDP Golden Yellow
  primaryDark: "#C58A00", // Dark Gold
  primaryLight: "#FFF8DC", // Corn Silk
  secondary: "#1A3654", // TDP Navy Blue
  secondaryLight: "#E8F0FE",
  accent: "#D97706",
  accentLight: "#FEF3C7",
  error: "#EF4444",
  errorLight: "#FEF2F2",
  warning: "#F59E0B",
  warningLight: "#FFFBEB",

  background: "#FFFDF5",
  surface: "#FFFFFF",
  surfaceElevated: "#FFF8DC",
  dark: "#1A2535",

  text: "#1A2535",
  textSecondary: "#64748B",
  textTertiary: "#94A3B8",
  textInverse: "#FFFFFF",

  border: "#F0E6B0",
  divider: "#FFF3B0",
  cardBg: "#FFFFFF",

  status: {
    submitted: "#64748B",
    assigned: "#D97706",
    in_progress: "#1A56DB",
    completed: "#10B981",
    cancelled: "#EF4444",
  },
  statusBg: {
    submitted: "#F1F5F9",
    assigned: "#FEF3C7",
    in_progress: "#EFF6FF",
    completed: "#ECFDF5",
    cancelled: "#FEF2F2",
  },

  priority: {
    high: "#EF4444",
    medium: "#D97706",
    low: "#10B981",
  },
  priorityBg: {
    high: "#FEF2F2",
    medium: "#FEF3C7",
    low: "#ECFDF5",
  },

  gradient: {
    primary: ["#FFE566", "#F5C518"] as [string, string],
    hero: ["#F5C518", "#C58A00"] as [string, string],
    admin: ["#F5C518", "#C58A00"] as [string, string],
    success: ["#10B981", "#059669"] as [string, string],
    warning: ["#D97706", "#B45309"] as [string, string],
    error: ["#EF4444", "#DC2626"] as [string, string],
  },

  chart: [
    "#F5C518",
    "#10B981",
    "#1A56DB",
    "#EF4444",
    "#D97706",
    "#0EA5E9",
    "#8B5CF6",
  ],
};

export default Colors;
