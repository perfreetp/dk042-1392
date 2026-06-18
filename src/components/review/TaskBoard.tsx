import { useMemo } from "react";
import { useReviewStore, engineers } from "@/store/reviewStore";
import type { ReviewTask, TaskStatus } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { formatDate, getTaskTypeLabel, cn } from "@/utils/helpers";
import {
  User,
  ChevronRight,
  AlertTriangle,
  Clock,
  Flame,
  Timer,
  UserPlus,
  FileWarning,
} from "lucide-react";
import { useState } from "react";

const COLUMNS: { status: TaskStatus; label: string; icon: any; color: string }[] = [
  { status: "PENDING", label: "待处理", icon: Clock, color: "border-status-warning" },
  { status: "IN_PROGRESS", label: "进行中", icon: Flame, color: "border-status-info" },
  { status: "DONE", label: "已完成", icon: ChevronRight, color: "border-status-success" },
];

interface TaskCardProps {
  task: ReviewTask;
  onClick: () => void;
  onAssign: (taskId: string, assignee: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

function TaskCard({ task, onClick, onAssign, onStatusChange }: TaskCardProps) {
  const [showAssign, setShowAssign] = useState(false);
  const TypeIcon =
    task.type === "QUALITY_ISSUE"
      ? FileWarning
      : task.type === "HIGH_FREQ"
        ? AlertTriangle
        : Timer;

  const nextStatus: TaskStatus | null =
    task.status === "PENDING" ? "IN_PROGRESS" : task.status === "IN_PROGRESS" ? "DONE" : null;

  return (
    <div
      className={cn(
        "card-base p-3 cursor-pointer transition-all duration-200 group",
        "hover:border-primary-500/40 hover:shadow-glow-hover",
        task.priority === "HIGH" && "border-l-2 border-l-status-danger",
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border",
              task.type === "QUALITY_ISSUE"
                ? "bg-status-info/15 text-status-info border-status-info/30"
                : task.type === "HIGH_FREQ"
                  ? "bg-status-warning/15 text-status-warning border-status-warning/30"
                  : "bg-status-danger/15 text-status-danger border-status-danger/30",
            )}
          >
            <TypeIcon size={10} />
            {getTaskTypeLabel(task.type)}
          </span>
        </div>
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="mb-2">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="font-mono text-xs text-primary-400 font-medium">{task.faultCode}</span>
        </div>
        <p className="text-xs text-industrial-text line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      </div>

      {task.type === "HIGH_FREQ" && task.occurrenceCount && (
        <div className="flex items-center gap-3 text-[11px] text-industrial-subtle mb-2">
          <span>近30天出现 <span className="text-industrial-text font-mono font-medium">{task.occurrenceCount}</span> 次</span>
        </div>
      )}
      {task.type === "TIMEOUT" && task.overHours && (
        <div className="flex items-center gap-3 text-[11px] text-industrial-subtle mb-2">
          <span>超时 <span className="text-status-danger font-mono font-medium">+{task.overHours}h</span></span>
        </div>
      )}
      {task.type === "QUALITY_ISSUE" && task.riskReason && (
        <div className="text-[11px] text-industrial-subtle mb-2 p-2 bg-status-info/5 border border-status-info/10 rounded">
          <span className="text-status-info font-medium">风险原因：</span>
          <span className="line-clamp-2">{task.riskReason}</span>
        </div>
      )}
      {task.type === "QUALITY_ISSUE" && task.source && (
        <div className="text-[10px] text-industrial-muted mb-2 flex items-center gap-1">
          <span>来源：{task.source}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-industrial-border/50">
        <div className="relative">
          {task.assignee ? (
            <div
              className="flex items-center gap-1.5 text-[11px] text-industrial-subtle cursor-pointer hover:text-industrial-text"
              onClick={(e) => {
                e.stopPropagation();
                setShowAssign(!showAssign);
              }}
            >
              <User size={12} />
              {task.assignee}
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAssign(!showAssign);
              }}
              className="flex items-center gap-1 text-[11px] text-primary-400 hover:text-primary-300"
            >
              <UserPlus size={12} />
              指派责任人
            </button>
          )}
          {showAssign && (
            <div
              className="absolute z-20 bottom-full left-0 mb-1 w-32 bg-industrial-surface border border-industrial-border rounded-md shadow-card py-1 animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              {engineers.map((name) => (
                <div
                  key={name}
                  className="px-3 py-1.5 text-xs text-industrial-text hover:bg-industrial-hover cursor-pointer"
                  onClick={() => {
                    onAssign(task.id, name);
                    setShowAssign(false);
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-industrial-muted">
            {formatDate(task.dueDate)}
          </span>
          {nextStatus && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange(task.id, nextStatus);
              }}
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium border transition-colors",
                nextStatus === "IN_PROGRESS"
                  ? "bg-status-info/10 text-status-info border-status-info/30 hover:bg-status-info/20"
                  : "bg-status-success/10 text-status-success border-status-success/30 hover:bg-status-success/20",
              )}
            >
              {nextStatus === "IN_PROGRESS" ? "开始处理" : "完成"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function TaskBoard() {
  const {
    tasks,
    setSelectedTask,
    setDrawerOpen,
    assignTask,
    updateTaskStatus,
  } = useReviewStore();

  const grouped = useMemo(() => {
    const result: Record<TaskStatus, ReviewTask[]> = {
      PENDING: [],
      IN_PROGRESS: [],
      DONE: [],
    };
    for (const t of tasks) {
      result[t.status].push(t);
    }
    for (const k of Object.keys(result) as TaskStatus[]) {
      result[k].sort((a, b) => {
        const order = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const;
        return order[a.priority] - order[b.priority];
      });
    }
    return result;
  }, [tasks]);

  const handleCardClick = (task: ReviewTask) => {
    setSelectedTask(task);
    setDrawerOpen(true);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
      {COLUMNS.map((col) => {
        const Icon = col.icon;
        const list = grouped[col.status];
        return (
          <div key={col.status} className="flex flex-col min-h-0">
            <div className={cn("flex items-center justify-between pb-3 mb-3 border-b-2", col.color)}>
              <div className="flex items-center gap-2">
                <Icon size={16} className="text-industrial-subtle" />
                <h3 className="text-sm font-semibold text-industrial-text">{col.label}</h3>
                <span className="badge bg-industrial-surface text-industrial-subtle border border-industrial-border">
                  {list.length}
                </span>
              </div>
              <StatusBadge status={col.status} />
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin pr-1 max-h-[600px]">
              {list.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => handleCardClick(task)}
                  onAssign={assignTask}
                  onStatusChange={updateTaskStatus}
                />
              ))}
              {list.length === 0 && (
                <div className="py-12 text-center text-industrial-subtle text-xs">
                  暂无任务
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
