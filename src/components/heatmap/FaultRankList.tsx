import { useMemo } from "react";
import type { FaultRank } from "@/types";
import { generateFaultRecords, generateFaultRanks } from "@/utils/mock";
import { formatHours, formatPercent, cn } from "@/utils/helpers";
import { ArrowUpRight } from "lucide-react";

export function FaultRankList() {
  const records = useMemo(() => generateFaultRecords(200), []);
  const ranks = useMemo(() => generateFaultRanks(records), [records]);

  return (
    <div className="card-base p-5 animate-fade-in-up" style={{ animationDelay: "250ms" }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-industrial-text">高频故障排行</h3>
          <p className="text-xs text-industrial-subtle mt-1">按出现次数降序排列 Top 15</p>
        </div>
        <button className="btn-ghost flex items-center gap-1">
          查看全部
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="overflow-x-auto scrollbar-thin -mx-2">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-industrial-border">
              <th className="text-left text-xs text-industrial-subtle font-medium py-2.5 px-2 w-12">
                #
              </th>
              <th className="text-left text-xs text-industrial-subtle font-medium py-2.5 px-2">
                故障代码
              </th>
              <th className="text-left text-xs text-industrial-subtle font-medium py-2.5 px-2">
                故障描述
              </th>
              <th className="text-left text-xs text-industrial-subtle font-medium py-2.5 px-2">
                ATA
              </th>
              <th className="text-right text-xs text-industrial-subtle font-medium py-2.5 px-2">
                次数
              </th>
              <th className="text-right text-xs text-industrial-subtle font-medium py-2.5 px-2">
                平均停场
              </th>
              <th className="text-right text-xs text-industrial-subtle font-medium py-2.5 px-2">
                平均处理
              </th>
              <th className="text-right text-xs text-industrial-subtle font-medium py-2.5 px-2">
                成功率
              </th>
            </tr>
          </thead>
          <tbody>
            {ranks.map((item: FaultRank, idx) => (
              <tr
                key={item.faultCode}
                className="border-b border-industrial-border/50 hover:bg-industrial-hover/50 transition-colors"
              >
                <td className="py-2.5 px-2">
                  <span
                    className={cn(
                      "inline-flex w-6 h-6 items-center justify-center rounded text-xs font-mono font-medium",
                      idx < 3
                        ? "bg-status-warning/15 text-status-warning"
                        : "bg-industrial-surface text-industrial-subtle",
                    )}
                  >
                    {idx + 1}
                  </span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="font-mono text-sm text-primary-400 font-medium">
                    {item.faultCode}
                  </span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-sm text-industrial-text">{item.faultName}</span>
                </td>
                <td className="py-2.5 px-2">
                  <span className="text-xs font-mono text-industrial-subtle">
                    {item.ataChapter}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-right">
                  <span className="text-sm font-mono font-semibold text-industrial-text">
                    {item.count}
                  </span>
                </td>
                <td className="py-2.5 px-2 text-right">
                  <span className="text-sm text-industrial-text">{formatHours(item.avgDownTime)}</span>
                </td>
                <td className="py-2.5 px-2 text-right">
                  <span className="text-sm text-industrial-text">{formatHours(item.avgDuration)}</span>
                </td>
                <td className="py-2.5 px-2 text-right">
                  <span
                    className={cn(
                      "text-sm font-mono font-medium",
                      item.successRate >= 0.85
                        ? "text-status-success"
                        : item.successRate >= 0.7
                          ? "text-status-warning"
                          : "text-status-danger",
                    )}
                  >
                    {formatPercent(item.successRate, 0)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
