import { cn } from "@/utils/helpers";
import { getPriorityColor, getPriorityLabel } from "@/utils/helpers";
import type { TaskPriority } from "@/types";

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        "badge border",
        getPriorityColor(priority),
        className,
      )}
    >
      {getPriorityLabel(priority)}优先级
    </span>
  );
}
