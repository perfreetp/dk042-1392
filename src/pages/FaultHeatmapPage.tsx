import { useMemo } from "react";
import { KpiCard } from "@/components/common/KpiCard";
import { FaultHeatmap } from "@/components/heatmap/FaultHeatmap";
import { FaultRankList } from "@/components/heatmap/FaultRankList";
import { RepeatAircraftList } from "@/components/heatmap/RepeatAircraft";
import { ActionStats } from "@/components/heatmap/ActionStats";
import { generateFaultRecords } from "@/utils/mock";
import { formatHours } from "@/utils/helpers";

export function FaultHeatmapPage() {
  const records = useMemo(() => generateFaultRecords(200), []);

  const stats = useMemo(() => {
    const total = records.length;
    const avgDown = records.reduce((s, r) => s + r.downTimeHours, 0) / total;
    const avgDuration = records.reduce((s, r) => s + r.durationHours, 0) / total;
    const aircraftSet = new Set(records.map((r) => r.aircraftReg));
    const repeatAircraft = Array.from(aircraftSet).filter((reg) => {
      const count = records.filter((r) => r.aircraftReg === reg).length;
      return count >= 2;
    }).length;

    return {
      total,
      avgDownTime: avgDown.toFixed(1),
      avgDuration: avgDuration.toFixed(1),
      repeatAircraft,
    };
  }, [records]);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-xl font-semibold text-industrial-text mb-1">故障热力分析</h2>
        <p className="text-sm text-industrial-subtle">
          基于近3个月维修数据，多维度分析故障分布与处理效率
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="故障总次数"
          value={stats.total}
          unit="次"
          trend={8.3}
          trendLabel="较上月"
          iconName="Activity"
          delay={0}
        />
        <KpiCard
          label="平均停场时间"
          value={formatHours(Number(stats.avgDownTime))}
          trend={-5.2}
          trendLabel="较上月"
          iconName="Clock"
          delay={50}
        />
        <KpiCard
          label="平均处理时长"
          value={formatHours(Number(stats.avgDuration))}
          trend={-3.1}
          trendLabel="较上月"
          iconName="Timer"
          delay={100}
        />
        <KpiCard
          label="重复故障飞机"
          value={stats.repeatAircraft}
          unit="架"
          trend={12.5}
          trendLabel="较上月"
          iconName="Plane"
          delay={150}
        />
      </div>

      <FaultHeatmap />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RepeatAircraftList />
        <ActionStats />
      </div>

      <FaultRankList />
    </div>
  );
}
