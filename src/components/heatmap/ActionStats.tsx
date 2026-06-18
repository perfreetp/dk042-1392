import { useMemo } from "react";
import type { ActionStat } from "@/types";
import { generateFaultRecords, generateActionStats } from "@/utils/mock";
import { formatHours, formatPercent, cn } from "@/utils/helpers";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Wrench } from "lucide-react";

export function ActionStats() {
  const records = useMemo(() => generateFaultRecords(200), []);
  const stats = useMemo(() => generateActionStats(records), [records]);
  const chartData = stats.slice(0, 8).map((s) => ({
    name: s.action.slice(0, 8) + (s.action.length > 8 ? "..." : ""),
    fullName: s.action,
    count: s.count,
    successRate: s.successRate,
  }));

  return (
    <div className="card-base p-5 animate-fade-in-up" style={{ animationDelay: "350ms" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Wrench size={16} className="text-primary-400" />
          <h3 className="text-sm font-semibold text-industrial-text">常用处理动作</h3>
        </div>
        <span className="text-xs text-industrial-subtle">共 {stats.length} 种动作</span>
      </div>

      <div className="h-44 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={20}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111c2e",
                border: "1px solid #1e2f4a",
                borderRadius: "6px",
                fontSize: "12px",
                color: "#e2e8f0",
              }}
              labelStyle={{ color: "#e2e8f0", fontWeight: 500 }}
              formatter={(value: number) => [`${value} 次`, "使用次数"]}
              labelFormatter={(_label, payload) =>
                payload?.[0]?.payload?.fullName || ""
              }
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={
                    idx === 0
                      ? "#3b82f6"
                      : idx === 1
                        ? "#60a5fa"
                        : idx === 2
                          ? "#93c5fd"
                          : "#1e3a5f"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 max-h-[240px] overflow-y-auto scrollbar-thin pr-1">
        {stats.slice(0, 6).map((item: ActionStat, idx) => (
          <div
            key={item.action}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-industrial-hover/50 transition-colors"
          >
            <span
              className={cn(
                "w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-medium",
                idx < 3 ? "bg-primary-500/20 text-primary-400" : "bg-industrial-surface text-industrial-subtle",
              )}
            >
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-industrial-text truncate">{item.action}</div>
              <div className="flex items-center gap-3 text-xs text-industrial-subtle mt-0.5">
                <span className="font-mono">{item.count} 次</span>
                <span>平均 {formatHours(item.avgDuration)}</span>
              </div>
            </div>
            <span
              className={cn(
                "text-sm font-mono font-medium",
                item.successRate >= 0.85
                  ? "text-status-success"
                  : item.successRate >= 0.7
                    ? "text-status-warning"
                    : "text-status-danger",
              )}
            >
              {formatPercent(item.successRate, 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
