import * as icons from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  iconName?: string;
  className?: string;
}

export function EmptyState({
  title = "暂无数据",
  description = "当前条件下没有数据",
  iconName = "Inbox",
  className = "",
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
      <p className="text-sm text-industrial-subtle text-center max-w-sm">{description}</p>
    </div>
  );
}
