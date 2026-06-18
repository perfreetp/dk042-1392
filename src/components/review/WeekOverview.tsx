import { useMemo } from "react";
import { useReviewStore } from "@/store/reviewStore";
import { KpiCard } from "@/components/common/KpiCard";
import { RefreshCw, Download, Calendar } from "lucide-react";

export function WeekOverview() {
  const { tasks, refreshTasks } = useReviewStore();

  const stats = useMemo(() => {
    const pending = tasks.filter((t) => t.status === "PENDING").length;
    const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const done = tasks.filter((t) => t.status === "DONE").length;
    const highFreq = tasks.filter((t) => t.type === "HIGH_FREQ").length;
    const timeout = tasks.filter((t) => t.type === "TIMEOUT").length;
    const needTraining = tasks.filter((t) => t.needTraining).length;
    const highPriority = tasks.filter((t) => t.priority === "HIGH").length;

    return { pending, inProgress, done, highFreq, timeout, needTraining, highPriority, total: tasks.length };
  }, [tasks]);

  const weekRange = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return `${fmt(startOfWeek)} 至 ${fmt(endOfWeek)}`;
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-industrial-text mb-1 flex items-center gap-2">
            复盘清单
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-500/15 text-primary-400 border border-primary-500/30 rounded text-xs font-normal">
              <Calendar size={12} />
              {weekRange}
            </span>
          </h2>
          <p className="text-sm text-industrial-subtle">
            系统自动识别的高频重复故障与超时排故记录，支持任务指派、原因分析与培训提醒
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-secondary flex items-center gap-1.5 text-xs">
            <Download size={14} />
            导出报告
          </button>
          <button
            onClick={refreshTasks}
            className="btn-secondary flex items-center gap-1.5 text-xs"
          >
            <RefreshCw size={14} />
            刷新数据
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard label="待处理" value={stats.pending} iconName="Clock" delay={0} />
        <KpiCard label="进行中" value={stats.inProgress} iconName="Loader" delay={30} />
        <KpiCard label="已完成" value={stats.done} iconName="CheckCircle2" delay={60} />
        <KpiCard label="高频故障" value={stats.highFreq} iconName="Zap" delay={90} />
        <KpiCard label="超时记录" value={stats.timeout} iconName="Timer" delay={120} />
        <KpiCard label="高优先级" value={stats.highPriority} iconName="AlertTriangle" delay={150} />
        <KpiCard label="需培训" value={stats.needTraining} iconName="GraduationCap" delay={180} />
      </div>
    </div>
  );
}
