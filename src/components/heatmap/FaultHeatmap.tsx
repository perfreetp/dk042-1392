import { useMemo, useState } from "react";
import type { HeatmapCell, FaultRecord } from "@/types";
import { computeHeatmapFromRecords } from "@/utils/mock";
import { getHeatmapColor, cn } from "@/utils/helpers";
import { Info } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

interface FaultHeatmapProps {
  records: FaultRecord[];
  onCellClick?: (cell: HeatmapCell) => void;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  cell: HeatmapCell | null;
}

export function FaultHeatmap({ records, onCellClick }: FaultHeatmapProps) {
  const data = useMemo(() => computeHeatmapFromRecords(records), [records]);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    cell: null,
  });

  const { months, chapters, maxCount } = useMemo(() => {
    const monthList: string[] = [];
    const monthOrder = [
      "1月", "2月", "3月", "4月", "5月", "6月",
      "7月", "8月", "9月", "10月", "11月", "12月",
    ];
    const monthSet = new Set<string>();
    const chapterList: { chapter: string; name: string }[] = [];
    const seen = new Set<string>();
    let max = 0;
    for (const cell of data) {
      monthSet.add(cell.month);
      if (!seen.has(cell.ataChapter)) {
        seen.add(cell.ataChapter);
        chapterList.push({ chapter: cell.ataChapter, name: cell.ataName });
      }
      if (cell.count > max) max = cell.count;
    }
    for (const m of monthOrder) {
      if (monthSet.has(m)) monthList.push(m);
    }
    chapterList.sort((a, b) => a.chapter.localeCompare(b.chapter));
    return { months: monthList, chapters: chapterList, maxCount: max };
  }, [data]);

  const getCell = (chapter: string, month: string) =>
    data.find((c) => c.ataChapter === chapter && c.month === month);

  const totalCount = data.reduce((sum, c) => sum + c.count, 0);
  const avgCount = chapters.length > 0 && months.length > 0
    ? Math.round(totalCount / (chapters.length * months.length))
    : 0;

  if (data.length === 0) {
    return (
      <EmptyState
        title="暂无热力数据"
        description="当前筛选范围内没有故障记录"
        iconName="LayoutGrid"
        className="animate-fade-in-up"
      />
    );
  }

  return (
    <div className="card-base p-5 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-industrial-text flex items-center gap-2">
            ATA 章节 × 月份 故障热力矩阵
            <span className="inline-flex items-center gap-1 text-industrial-subtle font-normal text-xs">
              <Info size={12} />
              颜色越深故障越多
            </span>
          </h3>
          <p className="text-xs text-industrial-subtle mt-1">
            筛选范围内共 <span className="text-industrial-text font-mono">{totalCount}</span> 次故障，月均{" "}
            <span className="text-industrial-text font-mono">{avgCount}</span> 次/章节
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-industrial-subtle">少</span>
            <div className="flex gap-0.5">
              <span className="w-4 h-3 rounded-sm bg-industrial-surface border border-industrial-border" />
              <span className="w-4 h-3 rounded-sm bg-primary-900" />
              <span className="w-4 h-3 rounded-sm bg-primary-800" />
              <span className="w-4 h-3 rounded-sm bg-primary-700" />
              <span className="w-4 h-3 rounded-sm bg-amber-600" />
              <span className="w-4 h-3 rounded-sm bg-status-danger" />
            </div>
            <span className="text-industrial-subtle">多</span>
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto scrollbar-thin">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs text-industrial-subtle font-medium pb-2 pr-4 w-36 shrink-0">
                ATA 章节
              </th>
              {months.map((m) => (
                <th
                  key={m}
                  className="text-center text-xs text-industrial-subtle font-medium pb-2 px-2 min-w-[64px]"
                >
                  {m}
                </th>
              ))}
              <th className="text-center text-xs text-industrial-subtle font-medium pb-2 pl-4 w-16">
                合计
              </th>
            </tr>
          </thead>
          <tbody>
            {chapters.map((ch, idx) => {
              const rowTotal = months.reduce(
                (sum, m) => sum + (getCell(ch.chapter, m)?.count || 0),
                0,
              );
              return (
                <tr key={ch.chapter} className={idx % 2 === 1 ? "bg-industrial-surface/30" : ""}>
                  <td className="py-1.5 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-primary-400 font-medium">
                        {ch.chapter}
                      </span>
                      <span className="text-xs text-industrial-text truncate">{ch.name}</span>
                    </div>
                  </td>
                  {months.map((m) => {
                    const cell = getCell(ch.chapter, m);
                    const count = cell?.count || 0;
                    return (
                      <td key={m} className="px-1 py-1 text-center">
                        <div
                          className={cn(
                            "w-full h-9 rounded-md flex items-center justify-center text-xs font-mono transition-all duration-200",
                            getHeatmapColor(count, maxCount),
                            count > 0
                              ? "text-white/90 hover:scale-105 cursor-pointer hover:ring-2 hover:ring-primary-400/50"
                              : "text-industrial-muted cursor-default",
                          )}
                          onMouseEnter={(e) =>
                            setTooltip({
                              visible: true,
                              x: e.clientX,
                              y: e.clientY,
                              cell: cell || { ataChapter: ch.chapter, ataName: ch.name, month: m, count: 0 },
                            })
                          }
                          onMouseLeave={() => setTooltip((t) => ({ ...t, visible: false }))}
                          onClick={() => {
                            if (count > 0 && onCellClick && cell) {
                              onCellClick(cell);
                            }
                          }}
                        >
                          {count > 0 ? count : "-"}
                        </div>
                      </td>
                    );
                  })}
                  <td className="py-1.5 pl-4 text-center">
                    <span className="text-xs font-mono font-semibold text-industrial-text">
                      {rowTotal}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {tooltip.visible && tooltip.cell && (
          <div
            className="fixed z-50 pointer-events-none bg-industrial-surface border border-industrial-border rounded-md shadow-card p-3 text-xs animate-fade-in"
            style={{ left: tooltip.x + 12, top: tooltip.y + 12 }}
          >
            <div className="text-industrial-text font-medium mb-1">
              {tooltip.cell.ataChapter} {tooltip.cell.ataName}
            </div>
            <div className="text-industrial-subtle space-y-0.5">
              <div>月份：{tooltip.cell.month}</div>
              <div>
                故障次数：
                <span className="text-industrial-text font-mono font-medium">
                  {tooltip.cell.count}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
