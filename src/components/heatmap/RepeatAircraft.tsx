import { useMemo } from "react";
import type { RepeatAircraft, FaultRecord } from "@/types";
import { generateRepeatAircraft } from "@/utils/mock";
import { formatDate, cn } from "@/utils/helpers";
import { Plane, AlertTriangle } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

interface RepeatAircraftListProps {
  records: FaultRecord[];
}

export function RepeatAircraftList({ records }: RepeatAircraftListProps) {
  const data = useMemo(() => generateRepeatAircraft(records), [records]);

  if (records.length === 0) {
    return (
      <EmptyState
        title="暂无重复故障数据"
        description="当前筛选范围内没有故障记录"
        iconName="Plane"
        className="animate-fade-in-up"
      />
    );
  }

  return (
    <div className="card-base p-5 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-industrial-text">重复故障飞机</h3>
          {data.length > 0 && (
            <span className="badge bg-status-warning/15 text-status-warning border border-status-warning/30">
              <AlertTriangle size={10} className="mr-1" />
              {data.length} 架
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 max-h-[420px] overflow-y-auto scrollbar-thin pr-1">
        {data.map((item: RepeatAircraft) => (
          <div
            key={item.aircraftReg}
            className="p-3 rounded-md bg-industrial-surface/50 border border-industrial-border hover:border-primary-500/30 hover:bg-industrial-hover transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded bg-primary-500/15 text-primary-400">
                  <Plane size={14} />
                </div>
                <div>
                  <div className="font-mono text-sm font-semibold text-industrial-text">
                    {item.aircraftReg}
                  </div>
                  <div className="text-xs text-industrial-subtle">{item.aircraftType}</div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "text-lg font-mono font-bold",
                    item.faultCount >= 5
                      ? "text-status-danger"
                      : item.faultCount >= 3
                        ? "text-status-warning"
                        : "text-industrial-text",
                  )}
                >
                  {item.faultCount}
                </div>
                <div className="text-[10px] text-industrial-subtle uppercase tracking-wide">
                  故障次数
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex flex-wrap gap-1">
                {item.ataChapters.slice(0, 3).map((ata) => (
                  <span
                    key={ata}
                    className="px-1.5 py-0.5 bg-industrial-card border border-industrial-border rounded text-industrial-subtle font-mono"
                  >
                    {ata}
                  </span>
                ))}
                {item.ataChapters.length > 3 && (
                  <span className="px-1.5 py-0.5 text-industrial-muted">
                    +{item.ataChapters.length - 3}
                  </span>
                )}
              </div>
              <div className="text-industrial-subtle">
                最近：{formatDate(item.lastOccurrence)}
              </div>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="text-center py-8 text-industrial-subtle text-sm">
            暂无重复故障飞机记录
          </div>
        )}
      </div>
    </div>
  );
}
