import { cn } from "@/utils/helpers";
import { getStatusColor, getStatusLabel } from "@/utils/helpers";
import type { TaskStatus } from "@/types";

interface StatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "badge border",
        getStatusColor(status),
        className,
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
}
