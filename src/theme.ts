export const colors = {
  background: "#050509",
  card: "#111118",
  softCard: "#181824",
  gold: "#FACC15",
  text: "#F9FAFB",
  muted: "#9CA3AF",
  border: "#27272F",
  green: "#22C55E",
  yellow: "#FACC15",
  orange: "#FB923C",
  red: "#F87171"
};

export function riskColor(score: number): string {
  if (score >= 82) return colors.red;
  if (score >= 64) return colors.orange;
  if (score >= 42) return colors.yellow;
  return colors.green;
}

export const gradients = {
  gold: ["#FACC15", "#FB923C"] as const,
  risk: ["#F87171", "#FB923C", "#FACC15", "#22C55E"] as const,
  card: ["#1E1E2E", "#111118"] as const,
  accent: ["rgba(250,204,21,0.12)", "rgba(250,204,21,0)"] as const
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  xxl: 40
};

export const radius = {
  md: 14,
  lg: 20,
  xl: 28
};

export const shadow = {
  shadowColor: "#000000",
  shadowOpacity: 0.28,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 10 },
  elevation: 6
};
