import { useMemo } from "react";
import type { KnowledgeCase } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { Trophy, TrendingUp, FileCheck } from "lucide-react";
import { cn } from "@/utils/helpers";
import { EmptyState } from "@/components/common/EmptyState";

interface QualityScoreProps {
  cases: KnowledgeCase[];
}

export function QualityScore({ cases }: QualityScoreProps) {
  const distribution = useMemo(() => {
    const buckets = [
      { range: "50-59", min: 50, max: 60, count: 0, label: "不合格" },
      { range: "60-69", min: 60, max: 70, count: 0, label: "待改进" },
      { range: "70-79", min: 70, max: 80, count: 0, label: "合格" },
      { range: "80-89", min: 80, max: 90, count: 0, label: "良好" },
      { range: "90-100", min: 90, max: 101, count: 0, label: "优秀" },
    ];
    for (const c of cases) {
      for (const b of buckets) {
        if (c.qualityScore >= b.min && c.qualityScore < b.max) {
          b.count += 1;
          break;
        }
      }
    }
    return buckets;
  }, [cases]);

  const avgScore = useMemo(() => {
    if (cases.length === 0) return 0;
    const sum = cases.reduce((s, c) => s + c.qualityScore, 0);
    return Math.round(sum / cases.length);
  }, [cases]);

  const sorted = useMemo(
    () => [...cases].sort((a, b) => b.qualityScore - a.qualityScore),
    [cases],
  );
  const topCases = sorted.slice(0, 5);
  const bottomCases = sorted.slice(-5).reverse();

  const getBucketColor = (label: string) => {
    switch (label) {
      case "不合格":
        return "#ef4444";
      case "待改进":
        return "#f59e0b";
      case "合格":
        return "#3b82f6";
      case "良好":
        return "#60a5fa";
      case "优秀":
        return "#10b981";
      default:
        return "#3b82f6";
    }
  };

  if (cases.length === 0) {
    return (
      <EmptyState
        title="暂无评分数据"
        description="当前筛选范围内没有知识案例"
        iconName="Star"
        className="animate-fade-in-up"
      />
    );
  }

  return (
    <div className="card-base p-5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <FileCheck size={16} className="text-primary-400" />
          <h3 className="text-sm font-semibold text-industrial-text">案例质量评分</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-industrial-subtle">平均分</div>
            <div
              className={cn(
                "text-xl font-mono font-bold",
                avgScore >= 80
                  ? "text-status-success"
                  : avgScore >= 70
                    ? "text-status-warning"
                    : "text-status-danger",
              )}
            >
              {avgScore}
              <TrendingUp size={14} className="inline ml-1 text-status-success" />
            </div>
          </div>
        </div>
      </div>

      <div className="h-48 mb-5">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distribution} barSize={48}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2f4a" vertical={false} />
            <XAxis
              dataKey="range"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
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
              formatter={(value: number) => [`${value} 条`, "案例数量"]}
              labelFormatter={(_label, payload) => {
                const d = payload?.[0]?.payload;
                return d ? `${d.range}分 · ${d.label}` : "";
              }}
            />
            <ReferenceLine
              y={cases.length / distribution.length}
              stroke="#475569"
              strokeDasharray="5 5"
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {distribution.map((entry, idx) => (
                <Cell key={idx} fill={getBucketColor(entry.label)} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-industrial-border">
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Trophy size={14} className="text-status-warning" />
            <span className="text-xs font-medium text-industrial-text">TOP 5 优质案例</span>
          </div>
          <div className="space-y-1.5">
            {topCases.map((c, idx) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded bg-industrial-surface/50 hover:bg-industrial-hover transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold",
                      idx === 0
                        ? "bg-status-warning/20 text-status-warning"
                        : idx < 3
                          ? "bg-primary-500/15 text-primary-400"
                          : "bg-industrial-card text-industrial-subtle",
                    )}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-xs text-industrial-text truncate">
                    {c.title.slice(0, 18)}...
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-status-success shrink-0 ml-2">
                  {c.qualityScore}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="inline-flex w-4 h-4 rounded items-center justify-center bg-status-danger/20 text-status-danger text-[10px] font-bold">
              !
            </span>
            <span className="text-xs font-medium text-industrial-text">BOTTOM 5 待改进</span>
          </div>
          <div className="space-y-1.5">
            {bottomCases.map((c, idx) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2 rounded bg-status-danger/5 hover:bg-status-danger/10 transition-colors cursor-pointer border border-status-danger/10"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold bg-status-danger/15 text-status-danger">
                    {5 - idx}
                  </span>
                  <span className="text-xs text-industrial-text truncate">
                    {c.title.slice(0, 18)}...
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-status-danger shrink-0 ml-2">
                  {c.qualityScore}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
