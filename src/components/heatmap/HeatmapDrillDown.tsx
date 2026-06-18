import { useMemo, useState } from "react";
import type { HeatmapCell, FaultRecord, KnowledgeCase } from "@/types";
import { X, Plane, Clock, Timer, Wrench, FileText, AlertTriangle, ArrowRight, ChevronRight } from "lucide-react";
import { formatDateTime, formatHours, cn } from "@/utils/helpers";
import { EmptyState } from "@/components/common/EmptyState";
import { CaseDetailDrawer } from "@/components/common/CaseDetailDrawer";

interface HeatmapDrillDownProps {
  cell: HeatmapCell;
  records: FaultRecord[];
  cases: KnowledgeCase[];
  onClose: () => void;
}

export function HeatmapDrillDown({ cell, records, cases, onClose }: HeatmapDrillDownProps) {
  const [caseDrawerOpen, setCaseDrawerOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<KnowledgeCase | null>(null);

  const caseMap = useMemo(() => {
    const map = new Map<string, KnowledgeCase>();
    for (const c of cases) map.set(c.id, c);
    return map;
  }, [cases]);

  const handleOpenCase = (c: KnowledgeCase) => {
    setSelectedCase(c);
    setCaseDrawerOpen(true);
  };

  const avgDownTime = useMemo(() => {
    if (records.length === 0) return "0";
    return (records.reduce((s, r) => s + r.downTimeHours, 0) / records.length).toFixed(1);
  }, [records]);

  const avgDuration = useMemo(() => {
    if (records.length === 0) return "0";
    return (records.reduce((s, r) => s + r.durationHours, 0) / records.length).toFixed(1);
  }, [records]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-5xl max-h-[85vh] card-base rounded-xl overflow-hidden flex flex-col animate-fade-in-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-industrial-border bg-industrial-surface/50 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle size={18} className="text-status-warning" />
              <h3 className="text-base font-semibold text-industrial-text">
                故障记录明细
              </h3>
            </div>
            <p className="text-sm text-industrial-subtle">
              <span className="font-mono text-primary-400 font-medium">{cell.ataChapter}</span>{" "}
              {cell.ataName} · {cell.month} · 共{" "}
              <span className="font-mono text-industrial-text font-semibold">{records.length}</span> 条记录
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-6 mr-2">
              <div className="text-center">
                <div className="text-lg font-mono font-semibold text-industrial-text">
                  {formatHours(Number(avgDownTime))}
                </div>
                <div className="text-[10px] text-industrial-subtle uppercase tracking-wide">平均停场</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-mono font-semibold text-industrial-text">
                  {formatHours(Number(avgDuration))}
                </div>
                <div className="text-[10px] text-industrial-subtle uppercase tracking-wide">平均处理</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-md bg-industrial-surface hover:bg-industrial-hover flex items-center justify-center text-industrial-subtle hover:text-industrial-text transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          {records.length > 0 ? (
            <div className="space-y-3">
              {records.map((r) => {
                const linkedCase = r.caseId ? caseMap.get(r.caseId) : null;
                return (
                  <div
                    key={r.id}
                    className="p-4 rounded-lg bg-industrial-surface/50 border border-industrial-border hover:border-primary-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="p-2 rounded-md bg-primary-500/15 text-primary-400 shrink-0">
                          <Plane size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-mono text-sm font-semibold text-industrial-text">
                              {r.aircraftReg}
                            </span>
                            <span className="text-xs text-industrial-subtle">{r.aircraftType}</span>
                            <span className="px-2 py-0.5 rounded bg-status-warning/15 text-status-warning text-xs font-mono">
                              {r.faultCode}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-primary-500/10 text-primary-400 text-xs font-mono">
                              {r.base}
                            </span>
                          </div>
                          <div className="text-sm text-industrial-text mb-1">{r.faultDescription}</div>
                          <div className="flex items-center gap-2 text-xs text-industrial-subtle">
                            <Clock size={12} />
                            <span>{formatDateTime(r.occurredAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-6 text-right shrink-0 ml-4">
                        <div>
                          <div
                            className={cn(
                              "text-sm font-mono font-semibold",
                              r.downTimeHours >= 8 ? "text-status-danger" : "text-industrial-text",
                            )}
                          >
                            {formatHours(r.downTimeHours)}
                          </div>
                          <div className="text-[10px] text-industrial-subtle uppercase tracking-wide">停场</div>
                        </div>
                        <div>
                          <div className="text-sm font-mono font-semibold text-industrial-text">
                            {formatHours(r.durationHours)}
                          </div>
                          <div className="text-[10px] text-industrial-subtle uppercase tracking-wide">处理</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-6 pl-11 pt-3 border-t border-industrial-border/50">
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <Wrench size={14} className="text-industrial-subtle mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs text-industrial-subtle mb-1">处理动作</div>
                          <div className="text-sm text-industrial-text">{r.actionTaken}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-xs font-medium",
                            r.success
                              ? "bg-status-success/15 text-status-success"
                              : "bg-status-danger/15 text-status-danger",
                          )}
                        >
                          {r.success ? "排故成功" : "未解决"}
                        </span>
                      </div>
                    </div>

                    {linkedCase && (
                      <div
                        className="flex items-start gap-2 pl-11 pt-3 mt-3 border-t border-industrial-border/50 cursor-pointer group hover:bg-industrial-hover/50 -mx-4 px-4 -mb-4 pb-4 rounded-b-lg transition-colors"
                        onClick={() => handleOpenCase(linkedCase)}
                      >
                        <FileText size={14} className="text-status-success mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-industrial-subtle mb-1">关联知识案例</div>
                          <div className="text-sm text-industrial-text font-medium flex items-center gap-1 group-hover:text-primary-400 transition-colors">
                            {linkedCase.title}
                            <ChevronRight size={14} className="text-industrial-subtle group-hover:text-primary-400 transition-colors" />
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs">
                            <span className="text-industrial-subtle">质量评分</span>
                            <span
                              className={cn(
                                "font-mono font-semibold",
                                linkedCase.qualityScore >= 80
                                  ? "text-status-success"
                                  : linkedCase.qualityScore >= 65
                                    ? "text-status-warning"
                                    : "text-status-danger",
                              )}
                            >
                              {linkedCase.qualityScore}
                            </span>
                            <span className="text-industrial-muted">·</span>
                            <span className="text-industrial-subtle">引用 {linkedCase.referenceCount} 次</span>
                            <span className="text-industrial-muted">·</span>
                            <span
                              className={cn(
                                "font-mono",
                                linkedCase.successRate >= 0.85
                                  ? "text-status-success"
                                  : linkedCase.successRate >= 0.7
                                    ? "text-status-warning"
                                    : "text-status-danger",
                              )}
                            >
                              成功率 {Math.round(linkedCase.successRate * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="暂无明细记录"
              description="该筛选条件下没有找到对应的故障记录"
              iconName="Inbox"
            />
          )}
        </div>
      </div>

      {selectedCase && (
        <CaseDetailDrawer
          caseData={selectedCase}
          relatedRecords={records.filter((r) => r.caseId === selectedCase.id)}
          allCases={cases}
          open={caseDrawerOpen}
          onClose={() => setCaseDrawerOpen(false)}
        />
      )}
    </div>
  );
}
