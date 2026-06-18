import { useMemo, useState } from "react";
import { KpiCard } from "@/components/common/KpiCard";
import { FaultHeatmap } from "@/components/heatmap/FaultHeatmap";
import { FaultRankList } from "@/components/heatmap/FaultRankList";
import { RepeatAircraftList } from "@/components/heatmap/RepeatAircraft";
import { ActionStats } from "@/components/heatmap/ActionStats";
import { EmptyState } from "@/components/common/EmptyState";
import { HeatmapDrillDown } from "@/components/heatmap/HeatmapDrillDown";
import { useFilterStore, filterFaultRecords } from "@/store/filterStore";
import { formatHours } from "@/utils/helpers";
import type { FaultRecord, HeatmapCell } from "@/types";

export function FaultHeatmapPage() {
  const allRecords = useFilterStore((s) => s.allFaultRecords);
  const allCases = useFilterStore((s) => s.allKnowledgeCases);
  const aircraftTypes = useFilterStore((s) => s.aircraftTypes);
  const bases = useFilterStore((s) => s.bases);
  const ataChapters = useFilterStore((s) => s.ataChapters);
  const seasons = useFilterStore((s) => s.seasons);
  const faultCodes = useFilterStore((s) => s.faultCodes);
  const dateRange = useFilterStore((s) => s.dateRange);
  const reset = useFilterStore((s) => s.reset);

  const records = useMemo(
    () =>
      filterFaultRecords(allRecords, {
        aircraftTypes,
        bases,
        ataChapters,
        seasons,
        faultCodes,
        dateRange,
      }),
    [allRecords, aircraftTypes, bases, ataChapters, seasons, faultCodes, dateRange],
  );

  const stats = useMemo(() => {
    const total = records.length;
    if (total === 0) {
      return { total: 0, avgDownTime: "0", avgDuration: "0", repeatAircraft: 0 };
    }
    const avgDown = records.reduce((s, r) => s + r.downTimeHours, 0) / total;
    const avgDuration = records.reduce((s, r) => s + r.durationHours, 0) / total;
    const countMap = new Map<string, number>();
    for (const r of records) {
      countMap.set(r.aircraftReg, (countMap.get(r.aircraftReg) || 0) + 1);
    }
    const repeatAircraft = Array.from(countMap.values()).filter((c) => c >= 2).length;

    return {
      total,
      avgDownTime: avgDown.toFixed(1),
      avgDuration: avgDuration.toFixed(1),
      repeatAircraft,
    };
  }, [records]);

  const activeFilters = useMemo(() => {
    const items: string[] = [];
    if (aircraftTypes.length > 0) items.push(`机型 ×${aircraftTypes.length}`);
    if (bases.length > 0) items.push(`基地 ×${bases.length}`);
    if (ataChapters.length > 0) items.push(`ATA ×${ataChapters.length}`);
    if (seasons.length > 0) items.push(`季节 ×${seasons.length}`);
    if (faultCodes.length > 0) items.push(`故障代码 ×${faultCodes.length}`);
    return items;
  }, [aircraftTypes, bases, ataChapters, seasons, faultCodes]);

  const [drillDown, setDrillDown] = useState<{ cell: HeatmapCell; records: FaultRecord[] } | null>(null);

  const handleCellClick = (cell: HeatmapCell) => {
    const monthIndex = [
      "1月", "2月", "3月", "4月", "5月", "6月",
      "7月", "8月", "9月", "10月", "11月", "12月",
    ].indexOf(cell.month);
    const matched = records.filter((r) => {
      const date = new Date(r.occurredAt);
      return r.ataChapter === cell.ataChapter && date.getMonth() === monthIndex;
    });
    setDrillDown({ cell, records: matched });
  };

  const hasData = records.length > 0;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-xl font-semibold text-industrial-text mb-1">故障热力分析</h2>
        <p className="text-sm text-industrial-subtle">
          基于筛选条件下的维修数据，多维度分析故障分布与处理效率
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

      {hasData ? (
        <>
          <FaultHeatmap records={records} onCellClick={handleCellClick} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <RepeatAircraftList records={records} />
            <ActionStats records={records} />
          </div>

          <FaultRankList records={records} />
        </>
      ) : (
        <EmptyState
          title="暂无匹配数据"
          description={
            activeFilters.length > 0
              ? `当前筛选条件：${activeFilters.join("，")}，未找到匹配的故障记录`
              : "当前筛选条件下没有找到故障记录，请尝试调整筛选条件"
          }
          iconName="SearchX"
          showClearButton={activeFilters.length > 0}
          onClear={reset}
        />
      )}

      {drillDown && (
        <HeatmapDrillDown
          cell={drillDown.cell}
          records={drillDown.records}
          cases={allCases}
          onClose={() => setDrillDown(null)}
        />
      )}
    </div>
  );
}
