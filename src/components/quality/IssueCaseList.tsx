import { useMemo } from "react";
import type { IssueCase } from "@/types";
import { generateKnowledgeCases, generateIssueCases } from "@/utils/mock";
import { AlertCircle, FileText, ArrowRight, BookOpen, ShieldCheck, RefreshCcw } from "lucide-react";
import { cn, formatDate } from "@/utils/helpers";

const MISSING_ITEM_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  手册依据: { icon: BookOpen, color: "text-status-danger bg-status-danger/15 border-status-danger/30", label: "缺手册依据" },
  放行结论: { icon: ShieldCheck, color: "text-status-warning bg-status-warning/15 border-status-warning/30", label: "缺放行结论" },
  后续跟踪: { icon: RefreshCcw, color: "text-primary-400 bg-primary-500/15 border-primary-500/30", label: "缺后续跟踪" },
  评分偏低: { icon: AlertCircle, color: "text-status-warning bg-status-warning/15 border-status-warning/30", label: "评分偏低" },
};

export function IssueCaseList() {
  const cases = useMemo(() => generateKnowledgeCases(50), []);
  const issues = useMemo(() => generateIssueCases(cases), [cases]);

  const criticalCount = issues.filter((i) => i.missingItems.includes("手册依据") || i.qualityScore < 65).length;

  return (
    <div className="card-base p-5 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <AlertCircle size={16} className="text-status-warning" />
          <h3 className="text-sm font-semibold text-industrial-text">问题案例清单</h3>
          <span className="badge bg-status-warning/15 text-status-warning border border-status-warning/30">
            {issues.length} 条待处理
          </span>
        </div>
        <button className="btn-ghost flex items-center gap-1 text-xs">
          批量指派
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-2 max-h-[520px] overflow-y-auto scrollbar-thin pr-1">
        {issues.map((item: IssueCase) => {
          const isCritical = item.missingItems.includes("手册依据") || item.qualityScore < 65;
          return (
            <div
              key={item.id}
              className={cn(
                "p-3 rounded-md border transition-all duration-200 cursor-pointer group",
                isCritical
                  ? "bg-status-danger/5 border-status-danger/20 hover:border-status-danger/40"
                  : "bg-industrial-surface/50 border-industrial-border hover:border-primary-500/30",
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 min-w-0">
                  <FileText
                    size={16}
                    className={cn(
                      "mt-0.5 shrink-0",
                      isCritical ? "text-status-danger" : "text-industrial-subtle",
                    )}
                  />
                  <div className="min-w-0">
                    <div className="text-sm text-industrial-text font-medium truncate group-hover:text-primary-400 transition-colors">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="font-mono text-industrial-subtle">{item.faultCode}</span>
                      <span className="text-industrial-muted">·</span>
                      <span className="text-industrial-subtle">
                        最近引用：{formatDate(item.lastReferenced)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <div
                    className={cn(
                      "text-sm font-mono font-semibold",
                      item.qualityScore >= 80
                        ? "text-status-success"
                        : item.qualityScore >= 65
                          ? "text-status-warning"
                          : "text-status-danger",
                    )}
                  >
                    {item.qualityScore}
                  </div>
                  <div className="text-[10px] text-industrial-subtle uppercase tracking-wide">
                    质量分
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 pl-6">
                {item.missingItems.map((mi) => {
                  const cfg = MISSING_ITEM_CONFIG[mi] || {
                    icon: AlertCircle,
                    color: "text-industrial-subtle bg-industrial-card border-industrial-border",
                    label: mi,
                  };
                  const Icon = cfg.icon;
                  return (
                    <span
                      key={mi}
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-xs font-medium",
                        cfg.color,
                      )}
                    >
                      <Icon size={10} />
                      {cfg.label}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
        {issues.length === 0 && (
          <div className="text-center py-12 text-industrial-subtle text-sm">
            所有案例质量达标，干得漂亮！
          </div>
        )}
      </div>
    </div>
  );
}
