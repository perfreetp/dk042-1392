import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { RotateCcw } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  iconName?: string;
  className?: string;
  showClearButton?: boolean;
  onClear?: () => void;
  clearButtonText?: string;
  filterInfo?: string[];
}

export function EmptyState({
  title = "暂无数据",
  description = "当前条件下没有数据",
  iconName = "Inbox",
  className = "",
  showClearButton = false,
  onClear,
  clearButtonText = "清空筛选条件",
  filterInfo,
}: EmptyStateProps) {
  const Icon = ((icons as unknown) as Record<string, LucideIcon>)[iconName] || icons.Inbox;

  return (
    <div
      className={`card-base flex flex-col items-center justify-center py-16 px-6 ${className}`}
    >
      <div className="w-16 h-16 rounded-full bg-industrial-surface flex items-center justify-center text-industrial-muted mb-4">
        <Icon size={28} />
      </div>
      <h3 className="text-base font-medium text-industrial-text mb-1">{title}</h3>
      <p className="text-sm text-industrial-subtle text-center max-w-sm mb-3">{description}</p>
      {filterInfo && filterInfo.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5 mb-1">
          {filterInfo.map((info, i) => (
            <span
              key={i}
              className="px-2 py-0.5 rounded bg-industrial-surface border border-industrial-border text-[11px] text-industrial-subtle font-mono"
            >
              {info}
            </span>
          ))}
        </div>
      )}
      {showClearButton && onClear && (
        <button
          onClick={onClear}
          className="mt-4 px-4 py-2 rounded-md bg-primary-500/15 hover:bg-primary-500/25 text-primary-400 border border-primary-500/30 hover:border-primary-500/50 text-sm font-medium transition-all flex items-center gap-2"
        >
          <RotateCcw size={14} />
          {clearButtonText}
        </button>
      )}
    </div>
  );
}
