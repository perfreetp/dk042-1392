import { useMemo } from "react";
import { KpiCard } from "@/components/common/KpiCard";
import { ReferenceMatrix } from "@/components/quality/ReferenceMatrix";
import { IssueCaseList } from "@/components/quality/IssueCaseList";
import { QualityScore } from "@/components/quality/QualityScore";
import { EmptyState } from "@/components/common/EmptyState";
import { useFilterStore, filterKnowledgeCases } from "@/store/filterStore";
import { formatPercent } from "@/utils/helpers";
import { getFilterOptions } from "@/utils/mock";

export function CaseQualityPage() {
  const allCases = useFilterStore((s) => s.allKnowledgeCases);
  const allRecords = useFilterStore((s) => s.allFaultRecords);
  const aircraftTypes = useFilterStore((s) => s.aircraftTypes);
  const bases = useFilterStore((s) => s.bases);
  const ataChapters = useFilterStore((s) => s.ataChapters);
  const seasons = useFilterStore((s) => s.seasons);
  const faultCodes = useFilterStore((s) => s.faultCodes);
  const dateRange = useFilterStore((s) => s.dateRange);
  const reset = useFilterStore((s) => s.reset);

  const cases = useMemo(
    () =>
      filterKnowledgeCases(
        allCases,
        {
          aircraftTypes,
          bases,
          ataChapters,
          seasons,
          faultCodes,
          dateRange,
        },
        allRecords,
      ),
    [allCases, allRecords, aircraftTypes, bases, ataChapters, seasons, faultCodes, dateRange],
  );

  const filterOptions = getFilterOptions();
  const activeFilters = useMemo(() => {
    const items: string[] = [];
    if (dateRange?.start && dateRange?.end) {
      items.push(`${dateRange.start} ~ ${dateRange.end}`);
    }
    if (aircraftTypes.length > 0) items.push(`机型 ×${aircraftTypes.length}`);
    if (bases.length > 0) items.push(`基地 ×${bases.length}`);
    if (ataChapters.length > 0) items.push(`ATA ×${ataChapters.length}`);
    if (seasons.length > 0) items.push(`季节 ×${seasons.length}`);
    if (faultCodes.length > 0) items.push(`故障代码 ×${faultCodes.length}`);
    return items;
  }, [aircraftTypes, bases, ataChapters, seasons, faultCodes, dateRange]);

  const stats = useMemo(() => {
    const total = cases.length;
    if (total === 0) {
      return {
        total: 0,
        manualRate: 0,
        releaseRate: 0,
        followUpRate: 0,
        avgSuccess: 0,
        avgScore: 0,
      };
    }
    const hasManual = cases.filter((c) => c.hasManualReference).length;
    const hasRelease = cases.filter((c) => c.hasReleaseConclusion).length;
    const hasFollowUp = cases.filter((c) => c.hasFollowUp).length;
    const avgSuccess = cases.reduce((s, c) => s + c.successRate, 0) / total;
    const avgScore = cases.reduce((s, c) => s + c.qualityScore, 0) / total;

    return {
      total,
      manualRate: hasManual / total,
      releaseRate: hasRelease / total,
      followUpRate: hasFollowUp / total,
      avgSuccess: +avgSuccess.toFixed(2),
      avgScore: Math.round(avgScore),
    };
  }, [cases]);

  const hasData = cases.length > 0;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h2 className="text-xl font-semibold text-industrial-text mb-1">案例质量分析</h2>
        <p className="text-sm text-industrial-subtle">
          识别知识条目可靠性，发现缺失关键要素的问题案例
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          label="知识案例总数"
          value={stats.total}
          unit="条"
          iconName="BookOpen"
          delay={0}
        />
        <KpiCard
          label="平均排故成功率"
          value={formatPercent(stats.avgSuccess, 0)}
          iconName="Target"
          trend={2.4}
          trendLabel="较上月"
          delay={50}
        />
        <KpiCard
          label="平均质量评分"
          value={stats.avgScore}
          unit="分"
          iconName="Star"
          trend={1.8}
          trendLabel="较上月"
          delay={100}
        />
        <KpiCard
          label="手册依据覆盖率"
          value={formatPercent(stats.manualRate, 0)}
          iconName="FileCheck"
          trend={5.1}
          trendLabel="较上月"
          delay={150}
        />
        <KpiCard
          label="放行结论完整率"
          value={formatPercent(stats.releaseRate, 0)}
          iconName="ShieldCheck"
          trend={-1.2}
          trendLabel="较上月"
          delay={200}
        />
      </div>

      {hasData ? (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <ReferenceMatrix cases={cases} />
            </div>
            <QualityScore cases={cases} />
          </div>

          <IssueCaseList cases={cases} />
        </>
      ) : (
        <EmptyState
          title="暂无匹配案例"
          description="当前筛选条件下未找到匹配的知识案例，试试调整筛选条件"
          iconName="BookOpen"
          filterInfo={activeFilters}
          showClearButton={activeFilters.length > 0}
          onClear={reset}
          clearButtonText="清空所有筛选条件"
        />
      )}
    </div>
  );
}
