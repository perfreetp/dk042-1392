import { useMemo, useState } from "react";
import type { KnowledgeCase } from "@/types";
import { generateKnowledgeCases } from "@/utils/mock";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { Info, AlertTriangle, CheckCircle, TrendingDown } from "lucide-react";
import { cn } from "@/utils/helpers";

interface HoveredCase {
  data: KnowledgeCase | null;
  x: number;
  y: number;
}

export function ReferenceMatrix() {
  const cases = useMemo(() => generateKnowledgeCases(50), []);
  const [hovered, setHovered] = useState<HoveredCase>({ data: null, x: 0, y: 0 });

  const chartData = cases.map((c) => ({
    id: c.id,
    title: c.title,
    faultCode: c.faultCode,
    x: c.referenceCount,
    y: Math.round(c.successRate * 100),
    z: Math.max(20, c.qualityScore / 3),
    risk: c.referenceCount >= 30 && c.successRate < 0.65,
    reliable: c.referenceCount >= 20 && c.successRate >= 0.85,
  }));

  const highRiskCount = cases.filter((c) => c.referenceCount >= 30 && c.successRate < 0.65).length;
  const reliableCount = cases.filter((c) => c.referenceCount >= 20 && c.successRate >= 0.85).length;
  const lowRefCount = cases.filter((c) => c.referenceCount < 10).length;

  return (
    <div className="card-base p-5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-industrial-text flex items-center gap-2">
            知识条目引用分析
            <Info size={14} className="text-industrial-subtle" />
          </h3>
          <p className="text-xs text-industrial-subtle mt-1">
            四象限图：X轴引用次数，Y轴排故成功率，气泡大小为质量评分
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-status-danger" />
            <span className="text-industrial-subtle">
              高风险低成功率
              <span className="text-status-danger font-semibold ml-1">{highRiskCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-status-success" />
            <span className="text-industrial-subtle">
              高可靠
              <span className="text-status-success font-semibold ml-1">{reliableCount}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative h-[380px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 10 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e2f4a"
              vertical={true}
              horizontal={true}
            />
            <XAxis
              type="number"
              dataKey="x"
              name="引用次数"
              stroke="#475569"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#1e2f4a" }}
              tickLine={{ stroke: "#1e2f4a" }}
              label={{
                value: "引用次数",
                position: "bottom",
                fill: "#94a3b8",
                fontSize: 12,
                offset: 20,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="成功率"
              stroke="#475569"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={{ stroke: "#1e2f4a" }}
              tickLine={{ stroke: "#1e2f4a" }}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              label={{
                value: "排故成功率",
                angle: -90,
                position: "insideLeft",
                fill: "#94a3b8",
                fontSize: 12,
                offset: 10,
              }}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              content={({ payload }) => {
                if (!payload?.[0]?.payload) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-industrial-surface border border-industrial-border rounded-md shadow-card p-3 text-xs">
                    <div className="font-medium text-industrial-text mb-1.5">{d.title}</div>
                    <div className="text-industrial-subtle space-y-0.5">
                      <div className="flex justify-between gap-4">
                        <span>故障代码</span>
                        <span className="font-mono text-industrial-text">{d.faultCode}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>引用次数</span>
                        <span className="font-mono text-industrial-text">{d.x} 次</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>成功率</span>
                        <span
                          className={cn(
                            "font-mono",
                            d.y >= 85
                              ? "text-status-success"
                              : d.y >= 65
                                ? "text-status-warning"
                                : "text-status-danger",
                          )}
                        >
                          {d.y}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <ReferenceLine
              x={30}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              strokeWidth={1}
              label={{ value: "高频引用阈值", fill: "#f59e0b", fontSize: 10, position: "top" }}
            />
            <ReferenceLine
              y={65}
              stroke="#f59e0b"
              strokeDasharray="5 5"
              strokeWidth={1}
            />
            <Scatter name="知识条目" data={chartData}>
              {chartData.map((entry, idx) => (
                <Cell
                  key={idx}
                  fill={
                    entry.risk
                      ? "#ef4444"
                      : entry.reliable
                        ? "#10b981"
                        : entry.y < 65
                          ? "#f59e0b"
                          : "#3b82f6"
                  }
                  fillOpacity={entry.risk || entry.reliable ? 0.85 : 0.55}
                  stroke={
                    entry.risk
                      ? "#ef4444"
                      : entry.reliable
                        ? "#10b981"
                        : "#3b82f6"
                  }
                  strokeWidth={entry.risk || entry.reliable ? 1.5 : 0.5}
                  onMouseEnter={() => {
                    const c = cases.find((cc) => cc.id === entry.id);
                    if (c) {
                      setHovered({ data: c, x: 0, y: 0 });
                    }
                  }}
                  onMouseLeave={() => setHovered({ data: null, x: 0, y: 0 })}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-industrial-border">
        <div className="p-3 rounded-md bg-status-danger/5 border border-status-danger/15">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-status-danger" />
            <span className="text-xs text-industrial-subtle">需紧急修订</span>
          </div>
          <div className="text-lg font-mono font-semibold text-status-danger">
            {highRiskCount}
            <span className="text-xs text-industrial-subtle font-normal ml-1">条</span>
          </div>
        </div>
        <div className="p-3 rounded-md bg-status-success/5 border border-status-success/15">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={14} className="text-status-success" />
            <span className="text-xs text-industrial-subtle">经验证可靠</span>
          </div>
          <div className="text-lg font-mono font-semibold text-status-success">
            {reliableCount}
            <span className="text-xs text-industrial-subtle font-normal ml-1">条</span>
          </div>
        </div>
        <div className="p-3 rounded-md bg-industrial-surface border border-industrial-border">
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} className="text-industrial-subtle" />
            <span className="text-xs text-industrial-subtle">引用不足</span>
          </div>
          <div className="text-lg font-mono font-semibold text-industrial-text">
            {lowRefCount}
            <span className="text-xs text-industrial-subtle font-normal ml-1">条</span>
          </div>
        </div>
      </div>
    </div>
  );
}
