import { useState } from "react";
import { useReviewStore, engineers } from "@/store/reviewStore";
import type { ActionType, TaskPriority, TaskStatus } from "@/types";
import { StatusBadge } from "@/components/common/StatusBadge";
import { PriorityBadge } from "@/components/common/PriorityBadge";
import { cn, formatDateTime, getTaskTypeLabel, formatDate } from "@/utils/helpers";
import {
  X,
  User,
  UserPlus,
  AlertTriangle,
  Timer,
  FileText,
  Send,
  GraduationCap,
  Clock,
  Calendar,
  ChevronDown,
  MessageSquare,
  FileWarning,
  Target,
  Lightbulb,
} from "lucide-react";

export function TaskDrawer() {
  const {
    selectedTask,
    drawerOpen,
    setDrawerOpen,
    setSelectedTask,
    assignTask,
    updateTaskStatus,
    updateTaskPriority,
    updateTaskAnalysis,
    addTaskLog,
  } = useReviewStore();

  const [rootCause, setRootCause] = useState(selectedTask?.rootCause || "");
  const [action, setAction] = useState(selectedTask?.action || "");
  const [actionType, setActionType] = useState<ActionType | undefined>(selectedTask?.actionType);
  const [needTraining, setNeedTraining] = useState(selectedTask?.needTraining || false);
  const [remark, setRemark] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [showAssignee, setShowAssignee] = useState(false);

  if (!drawerOpen || !selectedTask) return null;

  const TypeIcon =
    selectedTask.type === "QUALITY_ISSUE"
      ? FileWarning
      : selectedTask.type === "HIGH_FREQ"
        ? AlertTriangle
        : Timer;

  const handleClose = () => {
    setDrawerOpen(false);
    setSelectedTask(null);
    setRootCause("");
    setAction("");
    setActionType(undefined);
    setNeedTraining(false);
    setRemark("");
  };

  const handleSave = () => {
    updateTaskAnalysis(selectedTask.id, {
      rootCause: rootCause || undefined,
      action: action || undefined,
      actionType,
      needTraining,
    });
    if (remark.trim()) {
      addTaskLog(selectedTask.id, {
        action: "添加备注",
        operator: engineers[0],
        remark: remark.trim(),
      });
      setRemark("");
    }
  };

  const statusOptions: { value: TaskStatus; label: string }[] = [
    { value: "PENDING", label: "待处理" },
    { value: "IN_PROGRESS", label: "进行中" },
    { value: "DONE", label: "已完成" },
  ];
  const priorityOptions: { value: TaskPriority; label: string }[] = [
    { value: "HIGH", label: "高优先级" },
    { value: "MEDIUM", label: "中优先级" },
    { value: "LOW", label: "低优先级" },
  ];
  const actionTypeOptions: { value: ActionType; label: string; desc: string }[] = [
    { value: "ANALYSIS", label: "补充原因分析", desc: "完善根本原因分析" },
    { value: "REVISION", label: "修订排故提示", desc: "更新知识库条目" },
    { value: "TRAINING", label: "发起培训提醒", desc: "组织专项培训" },
  ];

  const currentStatus = statusOptions.find((s) => s.value === selectedTask.status);
  const currentPriority = priorityOptions.find((p) => p.value === selectedTask.priority);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-[520px] max-w-full bg-industrial-surface border-l border-industrial-border shadow-2xl flex flex-col animate-slide-in">
        <div className="flex items-center justify-between p-5 border-b border-industrial-border">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={cn(
                "p-2 rounded-md shrink-0",
                selectedTask.type === "QUALITY_ISSUE"
                  ? "bg-status-info/15 text-status-info"
                  : selectedTask.type === "HIGH_FREQ"
                    ? "bg-status-warning/15 text-status-warning"
                    : "bg-status-danger/15 text-status-danger",
              )}
            >
              <TypeIcon size={18} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm text-primary-400 font-medium">
                  {selectedTask.faultCode}
                </span>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border",
                    selectedTask.type === "QUALITY_ISSUE"
                      ? "bg-status-info/15 text-status-info border-status-info/30"
                      : selectedTask.type === "HIGH_FREQ"
                        ? "bg-status-warning/15 text-status-warning border-status-warning/30"
                        : "bg-status-danger/15 text-status-danger border-status-danger/30",
                  )}
                >
                  {getTaskTypeLabel(selectedTask.type)}
                </span>
              </div>
              <h3 className="text-base font-semibold text-industrial-text truncate">
                {selectedTask.faultName}
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded text-industrial-subtle hover:text-industrial-text hover:bg-industrial-hover transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-5 space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label className="label-base">状态</label>
                <button
                  onClick={() => {
                    setShowStatus(!showStatus);
                    setShowPriority(false);
                    setShowAssignee(false);
                  }}
                  className="w-full input-base text-left flex items-center justify-between"
                >
                  <StatusBadge status={selectedTask.status} />
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform", showStatus && "rotate-180")}
                  />
                </button>
                {showStatus && (
                  <div className="absolute z-20 mt-1 w-full bg-industrial-card border border-industrial-border rounded-md shadow-card animate-fade-in">
                    {statusOptions.map((opt) => (
                      <div
                        key={opt.value}
                        className={cn(
                          "px-3 py-2 text-sm cursor-pointer transition-colors",
                          selectedTask.status === opt.value
                            ? "bg-primary-500/15 text-primary-400"
                            : "text-industrial-text hover:bg-industrial-hover",
                        )}
                        onClick={() => {
                          updateTaskStatus(selectedTask.id, opt.value);
                          setShowStatus(false);
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="label-base">优先级</label>
                <button
                  onClick={() => {
                    setShowPriority(!showPriority);
                    setShowStatus(false);
                    setShowAssignee(false);
                  }}
                  className="w-full input-base text-left flex items-center justify-between"
                >
                  <PriorityBadge priority={selectedTask.priority} />
                  <ChevronDown
                    size={14}
                    className={cn("transition-transform", showPriority && "rotate-180")}
                  />
                </button>
                {showPriority && (
                  <div className="absolute z-20 mt-1 w-full bg-industrial-card border border-industrial-border rounded-md shadow-card animate-fade-in">
                    {priorityOptions.map((opt) => (
                      <div
                        key={opt.value}
                        className={cn(
                          "px-3 py-2 text-sm cursor-pointer transition-colors",
                          selectedTask.priority === opt.value
                            ? "bg-primary-500/15 text-primary-400"
                            : "text-industrial-text hover:bg-industrial-hover",
                        )}
                        onClick={() => {
                          updateTaskPriority(selectedTask.id, opt.value);
                          setShowPriority(false);
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="relative">
              <label className="label-base">责任人</label>
              <button
                onClick={() => {
                  setShowAssignee(!showAssignee);
                  setShowStatus(false);
                  setShowPriority(false);
                }}
                className="w-full input-base text-left flex items-center justify-between"
              >
                {selectedTask.assignee ? (
                  <span className="flex items-center gap-2 text-sm text-industrial-text">
                    <User size={14} />
                    {selectedTask.assignee}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-sm text-industrial-muted">
                    <UserPlus size={14} />
                    请选择责任人
                  </span>
                )}
                <ChevronDown
                  size={14}
                  className={cn("transition-transform", showAssignee && "rotate-180")}
                />
              </button>
              {showAssignee && (
                <div className="absolute z-20 mt-1 w-full bg-industrial-card border border-industrial-border rounded-md shadow-card animate-fade-in max-h-48 overflow-y-auto scrollbar-thin">
                  {engineers.map((name) => (
                    <div
                      key={name}
                      className={cn(
                        "px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2",
                        selectedTask.assignee === name
                          ? "bg-primary-500/15 text-primary-400"
                          : "text-industrial-text hover:bg-industrial-hover",
                      )}
                      onClick={() => {
                        assignTask(selectedTask.id, name);
                        setShowAssignee(false);
                      }}
                    >
                      <User size={14} />
                      {name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-base flex items-center gap-1">
                  <Calendar size={11} />
                  创建时间
                </label>
                <p className="text-sm text-industrial-text">{formatDateTime(selectedTask.createdAt)}</p>
              </div>
              <div>
                <label className="label-base flex items-center gap-1">
                  <Clock size={11} />
                  截止日期
                </label>
                <p className="text-sm text-industrial-text">{formatDate(selectedTask.dueDate)}</p>
              </div>
            </div>

            {selectedTask.type === "HIGH_FREQ" && selectedTask.occurrenceCount && (
              <div className="p-3 rounded-md bg-status-warning/5 border border-status-warning/20">
                <div className="flex items-center gap-2 text-sm text-status-warning font-medium mb-1">
                  <AlertTriangle size={14} />
                  高频故障预警
                </div>
                <p className="text-xs text-industrial-subtle">
                  该故障近30天出现{" "}
                  <span className="text-industrial-text font-mono font-semibold">
                    {selectedTask.occurrenceCount}
                  </span>{" "}
                  次，超过阈值，需重点关注
                </p>
              </div>
            )}
            {selectedTask.type === "TIMEOUT" && selectedTask.overHours && (
              <div className="p-3 rounded-md bg-status-danger/5 border border-status-danger/20">
                <div className="flex items-center gap-2 text-sm text-status-danger font-medium mb-1">
                  <Timer size={14} />
                  超时排故记录
                </div>
                <p className="text-xs text-industrial-subtle">
                  排故耗时超出标准时长{" "}
                  <span className="text-status-danger font-mono font-semibold">
                    {selectedTask.overHours}小时
                  </span>
                  ，需复盘排故路径
                </p>
              </div>
            )}

            {selectedTask.type === "QUALITY_ISSUE" && (
              <div className="space-y-3">
                {selectedTask.riskReason && (
                  <div className="p-3 rounded-md bg-status-info/5 border border-status-info/20">
                    <div className="flex items-center gap-2 text-sm text-status-info font-medium mb-2">
                      <Target size={14} />
                      风险原因
                    </div>
                    <p className="text-xs text-industrial-text leading-relaxed">
                      {selectedTask.riskReason}
                    </p>
                  </div>
                )}
                {selectedTask.suggestedAction && (
                  <div className="p-3 rounded-md bg-status-success/5 border border-status-success/20">
                    <div className="flex items-center gap-2 text-sm text-status-success font-medium mb-2">
                      <Lightbulb size={14} />
                      建议处理方向
                    </div>
                    <p className="text-xs text-industrial-text leading-relaxed">
                      {selectedTask.suggestedAction}
                    </p>
                  </div>
                )}
                {selectedTask.source && (
                  <div className="p-3 rounded-md bg-industrial-card border border-industrial-border">
                    <div className="flex items-center gap-2 text-sm text-industrial-subtle font-medium mb-1">
                      <FileText size={14} />
                      来源案例
                    </div>
                    <p className="text-xs text-industrial-text">{selectedTask.source}</p>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="label-base flex items-center gap-1">
                <FileText size={11} />
                任务描述
              </label>
              <p className="text-sm text-industrial-text leading-relaxed bg-industrial-card border border-industrial-border rounded-md p-3">
                {selectedTask.description}
              </p>
            </div>

            <div>
              <label className="label-base">根本原因分析</label>
              <textarea
                value={rootCause || selectedTask.rootCause || ""}
                onChange={(e) => setRootCause(e.target.value)}
                placeholder="请填写根本原因分析..."
                rows={3}
                className="input-base resize-none"
              />
            </div>

            <div>
              <label className="label-base">改进措施</label>
              <textarea
                value={action || selectedTask.action || ""}
                onChange={(e) => setAction(e.target.value)}
                placeholder="请填写改进措施..."
                rows={3}
                className="input-base resize-none"
              />
            </div>

            <div>
              <label className="label-base">措施类型</label>
              <div className="grid grid-cols-3 gap-2">
                {actionTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setActionType(actionType === opt.value ? undefined : opt.value)}
                    className={cn(
                      "p-2.5 rounded-md border text-left transition-all",
                      (actionType || selectedTask.actionType) === opt.value
                        ? "bg-primary-500/15 border-primary-500/40 text-primary-400"
                        : "bg-industrial-card border-industrial-border text-industrial-text hover:border-primary-500/30",
                    )}
                  >
                    <div className="text-xs font-medium mb-0.5">{opt.label}</div>
                    <div className="text-[10px] text-industrial-subtle">{opt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-md bg-industrial-card border border-industrial-border">
              <div className="flex items-center gap-2">
                <GraduationCap
                  size={16}
                  className={needTraining || selectedTask.needTraining ? "text-primary-400" : "text-industrial-subtle"}
                />
                <div>
                  <p className="text-sm text-industrial-text">是否发起培训提醒</p>
                  <p className="text-[11px] text-industrial-subtle">
                    开启后将通知培训部门组织专项培训
                  </p>
                </div>
              </div>
              <button
                onClick={() => setNeedTraining(!(needTraining || selectedTask.needTraining))}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  needTraining || selectedTask.needTraining ? "bg-primary-500" : "bg-industrial-border",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    needTraining || selectedTask.needTraining ? "translate-x-5" : "",
                  )}
                />
              </button>
            </div>

            <div>
              <label className="label-base flex items-center gap-1">
                <MessageSquare size={11} />
                添加操作备注
              </label>
              <div className="flex gap-2">
                <input
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  placeholder="记录本次操作备注..."
                  className="input-base flex-1"
                />
              </div>
            </div>

            <div>
              <label className="label-base">操作记录</label>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-1">
                {[...selectedTask.historyLog].reverse().map((log, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-2 rounded bg-industrial-card/50 border border-industrial-border/50"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-500/15 text-primary-400 flex items-center justify-center shrink-0">
                      <User size={12} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-industrial-text font-medium">{log.operator}</span>
                        <span className="text-industrial-muted">·</span>
                        <span className="text-industrial-subtle">{formatDateTime(log.timestamp)}</span>
                      </div>
                      <p className="text-xs text-industrial-subtle mt-0.5">{log.action}</p>
                      {log.remark && (
                        <p className="text-xs text-industrial-text mt-1 bg-industrial-surface/50 rounded p-1.5">
                          {log.remark}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-industrial-border flex items-center justify-end gap-2">
          <button onClick={handleClose} className="btn-secondary text-xs">
            取消
          </button>
          <button onClick={handleSave} className="btn-primary text-xs flex items-center gap-1.5">
            <Send size={12} />
            保存更改
          </button>
        </div>
      </aside>
    </>
  );
}
