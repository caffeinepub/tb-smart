import type { RiskLevel } from "@/context/AppContext";

interface RiskBadgeProps {
  level: RiskLevel;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const config = {
  Low: {
    label: "Low Risk",
    textClass: "text-risk-low",
    bgClass: "bg-risk-low",
    borderClass: "border-risk-low",
    dot: "bg-emerald-500",
  },
  Moderate: {
    label: "Moderate Risk",
    textClass: "text-risk-moderate",
    bgClass: "bg-risk-moderate",
    borderClass: "border-risk-moderate",
    dot: "bg-amber-500",
  },
  High: {
    label: "High Risk",
    textClass: "text-risk-high",
    bgClass: "bg-risk-high",
    borderClass: "border-risk-high",
    dot: "bg-red-500",
  },
};

const sizeClasses = {
  sm: "px-2.5 py-0.5 text-xs font-semibold",
  md: "px-3.5 py-1.5 text-sm font-bold",
  lg: "px-5 py-2.5 text-base font-bold",
};

export function RiskBadge({
  level,
  size = "md",
  className = "",
}: RiskBadgeProps) {
  const c = config[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${c.bgClass} ${c.textClass} ${c.borderClass} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
