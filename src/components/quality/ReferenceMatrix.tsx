import { useMemo, useState } from "react";
import type { KnowledgeCase } from "@/types";
import { useReviewStore } from "@/store/reviewStore";
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
import {
  Info,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Plus,
  X,
  FileText,
  Target,
  Star,
  BookOpen,
  ShieldCheck,
  RefreshCcw,
} from "lucide-react";
import { cn, formatDate } from "@/utils/helpers";
import { EmptyState } from "@/components/common/EmptyState";

interface ReferenceMatrixProps {
  cases: KnowledgeCase[];
}

interface HoveredCase {
  data: KnowledgeCase | null;
  x: number;
  y: number;
}

export function ReferenceMatrix({ cases }: ReferenceMatrixProps) {
  const createTask = useReviewStore((s) => s.createTask);
  const [hovered, setHovered] = useState<HoveredCase>({ data: null, x: 0, y: 0 });
  const [selected, setSelected] = useState<KnowledgeCase | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const chartData = useMemo(
    () =>
      cases.map((c) => ({
        id: c.id,
        title: c.title,
        faultCode: c.faultCode,
        ataChapter: c.ataChapter,
        x: c.referenceCount,
        y: Math.round(c.successRate * 100),
        z: Math.max(20, c.qualityScore / 3),
        risk: c.referenceCount >= 30 && c.successRate < 0.65,
        reliable: c.referenceCount >= 20 && c.successRate >= 0.85,
      })),
    [cases],
  );

  const handleAddToReview = (c: KnowledgeCase) => {
    const issues: string[] = [];
    if (!c.hasManualReference) issues.push("缺手册依据");
    if (!c.hasReleaseConclusion) issues.push("缺放行结论");
    if (!c.hasFollowUp) issues.push("缺后续跟踪");
    if (c.qualityScore < 70) issues.push("质量评分偏低");
    const riskReason = issues.length > 0
      ? `高引用低成功率：引用 ${c.referenceCount} 次，排故成功率 ${Math.round(c.successRate * 100)}%，${issues.join("、")}`
      : `高引用低成功率：引用 ${c.referenceCount} 次，排故成功率 ${Math.round(c.successRate * 100)}%，需修订排故提示`;
    const suggestedAction = "修订排故提示，补充关键检查步骤，组织相关培训";

    const result = createTask({
      faultCode: c.faultCode,
      faultName: c.title,
      ataChapter: c.ataChapter,
      riskReason,
      suggestedAction,
      source: "REFERENCE_RISK",
      sourceId: c.id,
    });

    if (result) {
      setAddedIds((prev) => new Set(prev).add(c.id));
      setTimeout(() => {
        setAddedIds((prev) => {
          const next = new Set(prev);
          next.delete(c.id);
          return next;
        });
      }, 2000);
    }
  };

  const highRiskCount = cases.filter(
    (c) => c.referenceCount >= 30 && c.successRate < 0.65,
  ).length;
  const reliableCount = cases.filter(
    (c) => c.referenceCount >= 20 && c.successRate >= 0.85,
  ).length;
  const lowRefCount = cases.filter((c) => c.referenceCount < 10).length;

  if (cases.length === 0) {
    return (
      <EmptyState
        title="暂无引用数据"
        description="当前筛选范围内没有知识案例"
        iconName="ScatterChart"
        className="animate-fade-in-up"
      />
    );
  }

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
                  strokeWidth={
                    selected?.id === entry.id
                      ? 3
                      : entry.risk || entry.reliable
                        ? 1.5
                        : 0.5
                  }
                  onMouseEnter={() => {
                    const c = cases.find((cc) => cc.id === entry.id);
                    if (c) {
                      setHovered({ data: c, x: 0, y: 0 });
                    }
                  }}
                  onMouseLeave={() => setHovered({ data: null, x: 0, y: 0 })}
                  onClick={() => {
                    const c = cases.find((cc) => cc.id === entry.id);
                    if (c) setSelected(c);
                  }}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {selected && (
        <div className="mt-5 pt-5 border-t border-industrial-border">
          <div className="p-4 rounded-lg bg-status-danger/5 border border-status-danger/20">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-md bg-status-danger/15 text-status-danger shrink-0">
                  <AlertTriangle size={18} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded bg-status-danger/15 text-status-danger text-xs font-mono">
                      {selected.faultCode}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 text-xs font-mono">
                      ATA {selected.ataChapter}
                    </span>
                    {!selected.hasManualReference && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-status-danger/10 text-status-danger text-xs border border-status-danger/20">
                        <BookOpen size={10} /> 缺手册依据
                      </span>
                    )}
                    {!selected.hasReleaseConclusion && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-status-warning/10 text-status-warning text-xs border border-status-warning/20">
                        <ShieldCheck size={10} /> 缺放行结论
                      </span>
                    )}
                    {!selected.hasFollowUp && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 text-xs border border-primary-500/20">
                        <RefreshCcw size={10} /> 缺后续跟踪
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-medium text-industrial-text mb-1">{selected.title}</div>
                  <div className="flex items-center gap-4 text-xs text-industrial-subtle">
                    <span className="flex items-center gap-1">
                      <Target size={11} />
                      引用 {selected.referenceCount} 次
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={11} />
                      成功率 {Math.round(selected.successRate * 100)}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={11} />
                      评分 {selected.qualityScore}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText size={11} />
                      更新 {formatDate(selected.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={() => handleAddToReview(selected)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300",
                    addedIds.has(selected.id)
                      ? "bg-status-success/15 text-status-success border border-status-success/30"
                      : "bg-status-danger/15 text-status-danger border border-status-danger/30 hover:bg-status-danger/25",
                  )}
                >
                  {addedIds.has(selected.id) ? (
                    <>
                      <CheckCircle size={14} />
                      已加入复盘
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      加入复盘清单
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-md bg-industrial-surface hover:bg-industrial-hover flex items-center justify-center text-industrial-subtle hover:text-industrial-text transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="pl-11 pr-20">
              <div className="text-xs text-industrial-subtle mb-1">风险分析</div>
              <div className="text-sm text-industrial-text">
                该条目被频繁引用（{selected.referenceCount} 次），但排故成功率仅{" "}
                <span className="text-status-danger font-semibold">
                  {Math.round(selected.successRate * 100)}%
                </span>
                ，可能存在排故步骤不准确或遗漏关键检查点的问题，建议尽快修订并排程培训。
              </div>
            </div>
          </div>
        </div>
      )}

      {!selected && (
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
      )}
    </div>
  );
}
