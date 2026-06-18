import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatNumber } from "@/utils/helpers";
import type { LucideIcon } from "lucide-react";
import * as icons from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  iconName: string;
  delay?: number;
}

export function KpiCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  iconName,
  delay = 0,
}: KpiCardProps) {
  const Icon = ((icons as unknown) as Record<string, LucideIcon>)[iconName] || icons.Activity;
  const displayValue = typeof value === "number" ? formatNumber(value) : value;

  return (
    <div
      className="card-base card-hover p-5 relative overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500/40 via-status-success/30 to-transparent" />
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-industrial-subtle uppercase tracking-wide font-medium">
          {label}
        </span>
        <div className="p-2 rounded-md bg-primary-500/10 text-primary-400">
          <Icon size={18} strokeWidth={1.8} />
        </div>
      </div>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-mono font-semibold text-industrial-text">
          {displayValue}
        </span>
        {unit && <span className="text-sm text-industrial-subtle">{unit}</span>}
      </div>
      {(trend !== undefined || trendLabel) && (
        <div className="flex items-center gap-1.5 text-xs">
          {trend !== undefined && (
            <>
              {trend > 0 ? (
                <TrendingUp size={14} className="text-status-danger" />
              ) : trend < 0 ? (
                <TrendingDown size={14} className="text-status-success" />
              ) : (
                <Minus size={14} className="text-industrial-subtle" />
              )}
              <span
                className={cn(
                  "font-medium",
                  trend > 0
                    ? "text-status-danger"
                    : trend < 0
                      ? "text-status-success"
                      : "text-industrial-subtle",
                )}
              >
                {trend > 0 ? "+" : ""}
                {trend.toFixed(1)}%
              </span>
            </>
          )}
          {trendLabel && (
            <span className="text-industrial-subtle">{trendLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
