import { X, RotateCcw, ChevronDown } from "lucide-react";
import { useFilterStore } from "@/store/filterStore";
import { getFilterOptions } from "@/utils/mock";
import { cn } from "@/utils/helpers";
import { useState } from "react";

interface MultiSelectProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="mb-4">
      <label className="label-base">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full input-base text-left flex items-center justify-between"
        >
          <span className={cn(selected.length > 0 ? "text-industrial-text" : "text-industrial-muted")}>
            {selected.length > 0 ? `已选 ${selected.length} 项` : "全部"}
          </span>
          <ChevronDown
            size={16}
            className={cn("text-industrial-subtle transition-transform", open && "rotate-180")}
          />
        </button>
        {open && (
          <div className="absolute z-20 mt-1 w-full bg-industrial-surface border border-industrial-border rounded-md shadow-card max-h-56 overflow-y-auto scrollbar-thin">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => toggle(opt.value)}
                className={cn(
                  "px-3 py-2 text-sm cursor-pointer transition-colors",
                  selected.includes(opt.value)
                    ? "bg-primary-500/15 text-primary-400"
                    : "text-industrial-text hover:bg-industrial-hover",
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center",
                      selected.includes(opt.value)
                        ? "bg-primary-500 border-primary-500"
                        : "border-industrial-muted",
                    )}
                  >
                    {selected.includes(opt.value) && (
                      <X size={12} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span className="truncate">{opt.label}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {selected.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {selected.slice(0, 3).map((v) => {
              const opt = options.find((o) => o.value === v);
              return (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary-500/15 text-primary-400 border border-primary-500/30 rounded text-xs"
                >
                  {opt?.label.split(" ")[0] || v}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(v);
                    }}
                    className="hover:text-white"
                  >
                    <X size={10} />
                  </button>
                </span>
              );
            })}
            {selected.length > 3 && (
              <span className="inline-flex items-center px-2 py-0.5 bg-industrial-muted/15 text-industrial-subtle rounded text-xs">
                +{selected.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function FilterPanel() {
  const options = getFilterOptions();
  const {
    aircraftTypes,
    bases,
    ataChapters,
    seasons,
    faultCodes,
    dateRange,
    setAircraftTypes,
    setBases,
    setAtaChapters,
    setSeasons,
    setFaultCodes,
    setDateRange,
    reset,
  } = useFilterStore();

  const aircraftTypeOpts = aircraftTypes.map((v) => ({ value: v, label: v }));
  const baseOpts = bases.map((v) => ({ value: v, label: v }));
  const seasonOpts = seasons.map((v) => ({ value: v, label: v }));

  const hasActiveFilters =
    aircraftTypes.length > 0 ||
    bases.length > 0 ||
    ataChapters.length > 0 ||
    seasons.length > 0 ||
    faultCodes.length > 0;

  return (
    <aside className="w-72 shrink-0 bg-industrial-surface/50 border-r border-industrial-border p-5 overflow-y-auto scrollbar-thin">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-industrial-text uppercase tracking-wide">
          数据筛选
        </h2>
        {hasActiveFilters && (
          <button
            onClick={reset}
            className="flex items-center gap-1 text-xs text-industrial-subtle hover:text-primary-400 transition-colors"
          >
            <RotateCcw size={12} />
            重置
          </button>
        )}
      </div>

      <MultiSelect
        label="机型"
        options={options.aircraftTypes.map((v) => ({ value: v, label: v }))}
        selected={aircraftTypes}
        onChange={setAircraftTypes}
      />

      <MultiSelect
        label="基地"
        options={options.bases.map((v) => ({ value: v, label: v }))}
        selected={bases}
        onChange={setBases}
      />

      <MultiSelect
        label="ATA 章节"
        options={options.ataChapters}
        selected={ataChapters}
        onChange={setAtaChapters}
      />

      <MultiSelect
        label="季节"
        options={options.seasons.map((v) => ({ value: v, label: v }))}
        selected={seasons}
        onChange={setSeasons}
      />

      <MultiSelect
        label="故障代码"
        options={options.faultCodes}
        selected={faultCodes}
        onChange={setFaultCodes}
      />

      <div className="mb-4">
        <label className="label-base">时间范围</label>
        <div className="space-y-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="input-base"
          />
          <div className="text-center text-industrial-muted text-xs">至</div>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="input-base"
          />
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-industrial-border">
        <div className="text-xs text-industrial-subtle mb-3">快捷选择</div>
        <div className="flex flex-wrap gap-2">
          {["近7天", "近30天", "近3个月", "近半年"].map((label) => (
            <button
              key={label}
              className="px-2.5 py-1 text-xs bg-industrial-card border border-industrial-border rounded text-industrial-subtle hover:text-industrial-text hover:border-primary-500/30 transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-industrial-border">
        <div className="text-xs text-industrial-subtle mb-2">数据概览</div>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-industrial-subtle">故障记录</span>
            <span className="text-industrial-text font-mono font-medium">200 条</span>
          </div>
          <div className="flex justify-between">
            <span className="text-industrial-subtle">知识案例</span>
            <span className="text-industrial-text font-mono font-medium">50 条</span>
          </div>
          <div className="flex justify-between">
            <span className="text-industrial-subtle">覆盖机型</span>
            <span className="text-industrial-text font-mono font-medium">5 种</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
