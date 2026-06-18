export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export function formatPercent(value: number, decimals = 1): string {
  return (value * 100).toFixed(decimals) + "%";
}

export function formatHours(hours: number): string {
  if (hours < 1) {
    return Math.round(hours * 60) + "分钟";
  }
  if (hours < 24) {
    return hours.toFixed(1) + "小时";
  }
  const days = Math.floor(hours / 24);
  const remainingHours = Math.round(hours % 24);
  return `${days}天${remainingHours > 0 ? remainingHours + "小时" : ""}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getHeatmapColor(count: number, max: number): string {
  const ratio = count / max;
  if (ratio === 0) return "bg-industrial-surface";
  if (ratio < 0.2) return "bg-primary-900";
  if (ratio < 0.4) return "bg-primary-800";
  if (ratio < 0.6) return "bg-primary-700";
  if (ratio < 0.8) return "bg-amber-600";
  return "bg-status-danger";
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "HIGH":
      return "bg-status-danger/15 text-status-danger border-status-danger/30";
    case "MEDIUM":
      return "bg-status-warning/15 text-status-warning border-status-warning/30";
    case "LOW":
      return "bg-status-success/15 text-status-success border-status-success/30";
    default:
      return "bg-industrial-muted/15 text-industrial-subtle border-industrial-border";
  }
}

export function getPriorityLabel(priority: string): string {
  switch (priority) {
    case "HIGH":
      return "高";
    case "MEDIUM":
      return "中";
    case "LOW":
      return "低";
    default:
      return priority;
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "PENDING":
      return "bg-status-warning/15 text-status-warning border-status-warning/30";
    case "IN_PROGRESS":
      return "bg-status-info/15 text-status-info border-status-info/30";
    case "DONE":
      return "bg-status-success/15 text-status-success border-status-success/30";
    default:
      return "bg-industrial-muted/15 text-industrial-subtle border-industrial-border";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "PENDING":
      return "待处理";
    case "IN_PROGRESS":
      return "进行中";
    case "DONE":
      return "已完成";
    default:
      return status;
  }
}

export function getTaskTypeLabel(type: string): string {
  switch (type) {
    case "QUALITY_ISSUE":
      return "质量问题复盘";
    case "HIGH_FREQ":
      return "高频重复故障";
    case "TIMEOUT":
      return "超时排故";
    default:
      return type;
  }
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
