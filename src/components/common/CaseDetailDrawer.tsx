import { useMemo } from "react";
import type { KnowledgeCase, FaultRecord } from "@/types";
import {
  X,
  FileText,
  BookOpen,
  ShieldCheck,
  RefreshCcw,
  Star,
  Target,
  Calendar,
  User,
  CheckCircle,
  AlertCircle,
  Clock,
  Plane,
  ArrowRight,
  ChevronRight,
  History,
} from "lucide-react";
import { cn, formatDate, formatDateTime, formatPercent, formatHours } from "@/utils/helpers";
import { EmptyState } from "@/components/common/EmptyState";

interface CaseDetailDrawerProps {
  caseData: KnowledgeCase;
  relatedRecords: FaultRecord[];
  allCases: KnowledgeCase[];
  open: boolean;
  onClose: () => void;
  onAddToReview?: () => void;
  hasBeenAdded?: boolean;
}

export function CaseDetailDrawer({
  caseData: c,
  relatedRecords,
  allCases,
  open,
  onClose,
  onAddToReview,
  hasBeenAdded = false,
}: CaseDetailDrawerProps) {
  const sameFaultCases = useMemo(
    () => allCases.filter((k) => k.faultCode === c.faultCode && k.id !== c.id).slice(0, 5),
    [allCases, c.faultCode, c.id],
  );

  const qualityItems = [
    {
      key: "manual",
      label: "手册依据",
      value: c.hasManualReference,
      icon: BookOpen,
      desc: c.hasManualReference ? "已关联 AMM/TSM 手册章节" : "缺少手册依据支撑",
    },
    {
      key: "release",
      label: "放行结论",
      value: c.hasReleaseConclusion,
      icon: ShieldCheck,
      desc: c.hasReleaseConclusion ? "有明确的放行标准和限制条件" : "缺少放行结论和 MEL 依据",
    },
    {
      key: "followup",
      label: "后续跟踪",
      value: c.hasFollowUp,
      icon: RefreshCcw,
      desc: c.hasFollowUp ? "有后续效果跟踪和趋势记录" : "缺少排故效果跟踪验证",
    },
  ];

  const avgRecordDuration = useMemo(() => {
    if (relatedRecords.length === 0) return "0";
    return (relatedRecords.reduce((s, r) => s + r.durationHours, 0) / relatedRecords.length).toFixed(1);
  }, [relatedRecords]);

  const avgRecordSuccess = useMemo(() => {
    if (relatedRecords.length === 0) return 0;
    return relatedRecords.filter((r) => r.success).length / relatedRecords.length;
  }, [relatedRecords]);

  const recentReferences = useMemo(() => {
    const refs = [];
    const count = Math.min(8, Math.floor(c.referenceCount / 3));
    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 60) + 1;
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      refs.push({
        id: i,
        date: date.toISOString(),
        base: ["北京PEK", "上海PVG", "广州CAN", "成都CTU"][Math.floor(Math.random() * 4)],
        aircraft: `B-${Math.floor(Math.random() * 9000) + 1000}`,
        result: Math.random() > 0.25 ? "success" : "fail",
        duration: +(Math.random() * 5 + 0.5).toFixed(1),
      });
    }
    return refs.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [c.referenceCount]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-xl h-full bg-industrial-card border-l border-industrial-border shadow-xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between px-5 py-4 border-b border-industrial-border bg-industrial-surface/50 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-md bg-primary-500/15 text-primary-400 shrink-0">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-industrial-text truncate">
                {c.title}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="px-1.5 py-0.5 rounded bg-status-danger/15 text-status-danger text-[11px] font-mono">
                  {c.faultCode}
                </span>
                <span className="text-xs text-industrial-subtle">{c.ataChapter}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md bg-industrial-surface hover:bg-industrial-hover flex items-center justify-center text-industrial-subtle hover:text-industrial-text transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-industrial-surface border border-industrial-border">
                <div className="flex items-center gap-1.5 mb-1">
                  <Target size={12} className="text-primary-400" />
                  <span className="text-xs text-industrial-subtle">引用次数</span>
                </div>
                <div className="text-xl font-mono font-bold text-industrial-text">
                  {c.referenceCount}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-industrial-surface border border-industrial-border">
                <div className="flex items-center gap-1.5 mb-1">
                  <CheckCircle size={12} className="text-status-success" />
                  <span className="text-xs text-industrial-subtle">成功率</span>
                </div>
                <div
                  className={cn(
                    "text-xl font-mono font-bold",
                    c.successRate >= 0.85
                      ? "text-status-success"
                      : c.successRate >= 0.7
                        ? "text-status-warning"
                        : "text-status-danger",
                  )}
                >
                  {formatPercent(c.successRate, 0)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-industrial-surface border border-industrial-border">
                <div className="flex items-center gap-1.5 mb-1">
                  <Star size={12} className="text-status-warning" />
                  <span className="text-xs text-industrial-subtle">质量评分</span>
                </div>
                <div
                  className={cn(
                    "text-xl font-mono font-bold",
                    c.qualityScore >= 85
                      ? "text-status-success"
                      : c.qualityScore >= 70
                        ? "text-status-warning"
                        : "text-status-danger",
                  )}
                >
                  {c.qualityScore}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-industrial-surface border border-industrial-border">
              <div className="text-sm font-medium text-industrial-text mb-3 flex items-center gap-2">
                <AlertCircle size={15} className="text-status-warning" />
                质量要素检查
              </div>
              <div className="space-y-3">
                {qualityItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.key}
                      className={cn(
                        "flex items-start gap-3 p-2.5 rounded-md",
                        item.value
                          ? "bg-status-success/5"
                          : "bg-status-danger/5",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-md flex items-center justify-center shrink-0",
                          item.value
                            ? "bg-status-success/15 text-status-success"
                            : "bg-status-danger/15 text-status-danger",
                        )}
                      >
                        {item.value ? (
                          <CheckCircle size={16} />
                        ) : (
                          <AlertCircle size={16} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-industrial-text">
                            {item.label}
                          </span>
                          <span
                            className={cn(
                              "text-xs font-medium",
                              item.value
                                ? "text-status-success"
                                : "text-status-danger",
                            )}
                          >
                            {item.value ? "已具备" : "缺失"}
                          </span>
                        </div>
                        <p className="text-xs text-industrial-subtle mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {onAddToReview && (
                <button
                  onClick={onAddToReview}
                  className={cn(
                    "w-full mt-4 py-2.5 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2",
                    hasBeenAdded
                      ? "bg-status-success/15 text-status-success border border-status-success/30"
                      : "bg-status-danger/15 text-status-danger border border-status-danger/30 hover:bg-status-danger/25",
                  )}
                >
                  {hasBeenAdded ? (
                    <>
                      <CheckCircle size={16} />
                      已加入复盘清单
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      质量不达标，加入复盘
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="p-4 rounded-lg bg-industrial-surface border border-industrial-border">
              <div className="text-sm font-medium text-industrial-text mb-3 flex items-center gap-2">
                <History size={15} className="text-primary-400" />
                历史引用记录
              </div>
              {recentReferences.length > 0 ? (
                <div className="space-y-2">
                  {recentReferences.map((ref) => (
                    <div
                      key={ref.id}
                      className="flex items-center justify-between py-2 px-2.5 rounded-md hover:bg-industrial-hover transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded bg-industrial-card text-industrial-subtle">
                          <Clock size={12} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-industrial-text">{ref.aircraft}</span>
                            <span className="text-xs text-industrial-subtle">{ref.base}</span>
                          </div>
                          <div className="text-xs text-industrial-subtle">
                            {formatDateTime(ref.date)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={cn(
                            "text-xs font-medium",
                            ref.result === "success"
                              ? "text-status-success"
                              : "text-status-danger",
                          )}
                        >
                          {ref.result === "success" ? "排故成功" : "未解决"}
                        </div>
                        <div className="text-xs text-industrial-subtle font-mono">
                          {formatHours(ref.duration)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="暂无引用记录"
                  description="该案例暂未被引用过"
                  iconName="History"
                  className="py-6"
                />
              )}
            </div>

            <div className="p-4 rounded-lg bg-industrial-surface border border-industrial-border">
              <div className="text-sm font-medium text-industrial-text mb-3 flex items-center gap-2">
                <Plane size={15} className="text-primary-400" />
                关联故障样本
                <span className="ml-auto text-xs text-industrial-subtle font-normal">
                  当前筛选下 {relatedRecords.length} 条
                </span>
              </div>
              {relatedRecords.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-1">
                  {relatedRecords.slice(0, 10).map((r) => (
                    <div
                      key={r.id}
                      className="p-2.5 rounded-md bg-industrial-card/50 border border-industrial-border hover:border-primary-500/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium text-industrial-text">
                            {r.aircraftReg}
                          </span>
                          <span className="text-xs text-industrial-subtle">{r.base}</span>
                        </div>
                        <span
                          className={cn(
                            "text-xs px-1.5 py-0.5 rounded",
                            r.success
                              ? "bg-status-success/10 text-status-success"
                              : "bg-status-danger/10 text-status-danger",
                          )}
                        >
                          {r.success ? "成功" : "未解决"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-industrial-subtle">
                        <span className="font-mono">{r.aircraftType}</span>
                        <span>·</span>
                        <span>{formatDate(r.occurredAt)}</span>
                        <span>·</span>
                        <span>停场 {formatHours(r.downTimeHours)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="暂无关联记录"
                  description="当前筛选范围内没有关联到该案例的故障记录"
                  iconName="Plane"
                  className="py-6"
                />
              )}
              {relatedRecords.length > 0 && (
                <div className="mt-3 pt-3 border-t border-industrial-border grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="text-sm font-mono font-semibold text-industrial-text">
                      {formatHours(Number(avgRecordDuration))}
                    </div>
                    <div className="text-[10px] text-industrial-subtle uppercase tracking-wide">
                      平均处理
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={cn(
                        "text-sm font-mono font-semibold",
                        avgRecordSuccess >= 0.8
                          ? "text-status-success"
                          : avgRecordSuccess >= 0.6
                            ? "text-status-warning"
                            : "text-status-danger",
                      )}
                    >
                      {formatPercent(avgRecordSuccess, 0)}
                    </div>
                    <div className="text-[10px] text-industrial-subtle uppercase tracking-wide">
                      实际成功率
                    </div>
                  </div>
                </div>
              )}
            </div>

            {sameFaultCases.length > 0 && (
              <div className="p-4 rounded-lg bg-industrial-surface border border-industrial-border">
                <div className="text-sm font-medium text-industrial-text mb-3 flex items-center gap-2">
                  <FileText size={15} className="text-primary-400" />
                  同类故障其他案例
                </div>
                <div className="space-y-2">
                  {sameFaultCases.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between p-2.5 rounded-md bg-industrial-card/50 hover:bg-industrial-hover cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText
                          size={14}
                          className="text-industrial-subtle group-hover:text-primary-400 transition-colors shrink-0"
                        />
                        <span className="text-sm text-industrial-text truncate group-hover:text-primary-400 transition-colors">
                          {s.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={cn(
                            "text-xs font-mono",
                            s.qualityScore >= 80
                              ? "text-status-success"
                              : s.qualityScore >= 65
                                ? "text-status-warning"
                                : "text-status-danger",
                          )}
                        >
                          {s.qualityScore}分
                        </span>
                        <ChevronRight
                          size={14}
                          className="text-industrial-subtle group-hover:text-primary-400 transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-lg bg-industrial-surface border border-industrial-border">
              <div className="text-sm font-medium text-industrial-text mb-3 flex items-center gap-2">
                <User size={15} className="text-industrial-subtle" />
                案例信息
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-industrial-muted" />
                  <span className="text-industrial-subtle text-xs">创建</span>
                  <span className="text-industrial-text text-xs font-mono ml-auto">
                    {formatDate(c.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-industrial-muted" />
                  <span className="text-industrial-subtle text-xs">更新</span>
                  <span className="text-industrial-text text-xs font-mono ml-auto">
                    {formatDate(c.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <User size={13} className="text-industrial-muted" />
                  <span className="text-industrial-subtle text-xs">创建人</span>
                  <span className="text-industrial-text text-xs ml-auto">{c.createdBy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
