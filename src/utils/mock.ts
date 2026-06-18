import type {
  FaultRecord,
  KnowledgeCase,
  ReviewTask,
  HeatmapCell,
  FaultRank,
  RepeatAircraft,
  ActionStat,
  IssueCase,
} from "@/types";

const aircraftTypes = ["B737-800", "B737-MAX", "A320neo", "A330-300", "B787-9"];
const bases = ["北京PEK", "上海PVG", "广州CAN", "成都CTU", "深圳SZX", "西安XIY"];
const seasons = ["春季", "夏季", "秋季", "冬季"];

const ataChapters = [
  { chapter: "ATA21", name: "空调系统" },
  { chapter: "ATA24", name: "电源系统" },
  { chapter: "ATA26", name: "防火系统" },
  { chapter: "ATA27", name: "飞行操纵" },
  { chapter: "ATA29", name: "液压系统" },
  { chapter: "ATA30", name: "防冰排雨" },
  { chapter: "ATA32", name: "起落架" },
  { chapter: "ATA34", name: "导航系统" },
  { chapter: "ATA36", name: "气源系统" },
  { chapter: "ATA49", name: "辅助动力装置" },
  { chapter: "ATA71", name: "动力装置-总述" },
  { chapter: "ATA73", name: "发动机燃油系统" },
];

const faultCodes = [
  { code: "F2101", name: "空调PACK出口温度高" },
  { code: "F2103", name: "客舱温度调节失效" },
  { code: "F2402", name: "发电机TRU故障" },
  { code: "F2405", name: "电瓶充电异常" },
  { code: "F2704", name: "副翼PCU故障" },
  { code: "F2902", name: "液压系统压力低" },
  { code: "F3001", name: "机翼防冰活门故障" },
  { code: "F3205", name: "起落架收放异常" },
  { code: "F3208", name: "刹车温度传感器故障" },
  { code: "F3403", name: "ADIRU校准故障" },
  { code: "F3601", name: "引气压力低" },
  { code: "F4901", name: "APU启动失败" },
  { code: "F7102", name: "发动机N1转速异常" },
  { code: "F7304", name: "发动机燃油滤堵塞" },
  { code: "F7701", name: "发动机指示系统故障" },
];

const handlingActions = [
  "重置相关跳开关",
  "更换LRU组件",
  "清洁传感器探头",
  "软件加载/重置",
  "参考AMM手册排故",
  "地面测试并放行",
  "更换控制计算机",
  "管路检查并清洁",
  "执行MEL保留",
  "更新机载数据库",
];

const engineers = ["张伟", "李明", "王强", "刘洋", "陈静", "赵磊", "周涛", "孙慧"];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randItem<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function randDate(daysBack: number): string {
  const date = new Date();
  date.setDate(date.getDate() - randInt(0, daysBack));
  date.setHours(randInt(0, 23), randInt(0, 59));
  return date.toISOString();
}

function randTail(): string {
  const prefix = "B-";
  const num = randInt(1000, 9999).toString();
  return prefix + num;
}

export function generateFaultRecords(count = 200): FaultRecord[] {
  const records: FaultRecord[] = [];
  for (let i = 0; i < count; i++) {
    const ata = randItem(ataChapters);
    const fault = randItem(faultCodes);
    records.push({
      id: `FR${String(i + 1).padStart(5, "0")}`,
      faultCode: fault.code,
      faultName: fault.name,
      aircraftType: randItem(aircraftTypes),
      base: randItem(bases),
      ataChapter: ata.chapter,
      ataName: ata.name,
      season: randItem(seasons),
      aircraftReg: randTail(),
      occurredAt: randDate(90),
      downTimeHours: +(Math.random() * 8 + 0.5).toFixed(1),
      durationHours: +(Math.random() * 6 + 0.3).toFixed(1),
      handlingAction: randItem(handlingActions),
      caseId: Math.random() > 0.3 ? `KC${randInt(1, 50)}` : undefined,
      success: Math.random() > 0.15,
    });
  }
  return records;
}

export function generateKnowledgeCases(count = 50): KnowledgeCase[] {
  const cases: KnowledgeCase[] = [];
  for (let i = 0; i < count; i++) {
    const fault = randItem(faultCodes);
    const refCount = randInt(3, 120);
    const successRate = +(Math.random() * 0.5 + 0.4).toFixed(2);
    const successCount = Math.floor(refCount * successRate);
    cases.push({
      id: `KC${String(i + 1).padStart(4, "0")}`,
      title: `${fault.name}典型排故案例 - ${randItem(["经验总结", "维修提示", "故障分析"])}`,
      faultCode: fault.code,
      faultName: fault.name,
      ataChapter: randItem(ataChapters).chapter,
      referenceCount: refCount,
      successCount,
      successRate,
      hasManualReference: Math.random() > 0.25,
      hasReleaseConclusion: Math.random() > 0.2,
      hasFollowUp: Math.random() > 0.35,
      qualityScore: randInt(55, 98),
      createdBy: randItem(engineers),
      createdAt: randDate(365),
    });
  }
  return cases;
}

export function generateReviewTasks(): ReviewTask[] {
  const tasks: ReviewTask[] = [];
  const highFreqFaults = faultCodes.slice(0, 8);
  for (let i = 0; i < highFreqFaults.length; i++) {
    const fault = highFreqFaults[i];
    tasks.push({
      id: `T${String(i + 1).padStart(4, "0")}`,
      type: "HIGH_FREQ",
      faultCode: fault.code,
      faultName: fault.name,
      description: `${fault.code}近30天出现${randInt(5, 18)}次，重复率较高，需分析根本原因`,
      occurrenceCount: randInt(5, 18),
      status: (["PENDING", "IN_PROGRESS", "DONE"] as const)[randInt(0, 2)],
      priority: (["HIGH", "MEDIUM", "LOW"] as const)[randInt(0, 2)],
      assignee: Math.random() > 0.5 ? randItem(engineers) : undefined,
      needTraining: Math.random() > 0.6,
      createdAt: randDate(7),
      dueDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + randInt(1, 7));
        return d.toISOString();
      })(),
      createdBy: "质控系统",
      historyLog: [
        {
          timestamp: randDate(7),
          action: "任务创建",
          operator: "质控系统",
          remark: "系统自动检测到高频故障",
        },
      ],
    });
  }

  const timeoutFaults = faultCodes.slice(5, 12);
  for (let i = 0; i < timeoutFaults.length; i++) {
    const fault = timeoutFaults[i];
    const overHours = +(Math.random() * 5 + 1).toFixed(1);
    tasks.push({
      id: `T${String(i + 100).padStart(4, "0")}`,
      type: "TIMEOUT",
      faultCode: fault.code,
      faultName: fault.name,
      description: `${fault.code}处理超时，超过标准时长${overHours}小时，需复盘排故路径`,
      overHours,
      status: (["PENDING", "IN_PROGRESS", "DONE"] as const)[randInt(0, 2)],
      priority: (["HIGH", "MEDIUM", "LOW"] as const)[randInt(0, 2)],
      assignee: Math.random() > 0.4 ? randItem(engineers) : undefined,
      needTraining: Math.random() > 0.5,
      createdAt: randDate(14),
      dueDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + randInt(1, 10));
        return d.toISOString();
      })(),
      createdBy: "质控系统",
      historyLog: [
        {
          timestamp: randDate(14),
          action: "任务创建",
          operator: "质控系统",
          remark: "系统检测到超时排故记录",
        },
      ],
    });
  }

  return tasks;
}

export function generateHeatmapData(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const months = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const recentMonths = [
    months[(currentMonthIdx - 2 + 12) % 12],
    months[(currentMonthIdx - 1 + 12) % 12],
    months[currentMonthIdx],
  ];

  for (const ata of ataChapters) {
    for (const month of recentMonths) {
      cells.push({
        ataChapter: ata.chapter,
        ataName: ata.name,
        month,
        count: randInt(0, 25),
      });
    }
  }
  return cells;
}

export function generateFaultRanks(records: FaultRecord[]): FaultRank[] {
  const map = new Map<string, FaultRank>();
  for (const r of records) {
    const existing = map.get(r.faultCode);
    if (existing) {
      existing.count += 1;
      existing.avgDownTime += r.downTimeHours;
      existing.avgDuration += r.durationHours;
      if (r.success) existing.successRate += 1;
    } else {
      map.set(r.faultCode, {
        faultCode: r.faultCode,
        faultName: r.faultName,
        ataChapter: r.ataChapter,
        count: 1,
        avgDownTime: r.downTimeHours,
        avgDuration: r.durationHours,
        successRate: r.success ? 1 : 0,
      });
    }
  }
  const arr = Array.from(map.values());
  for (const item of arr) {
    item.avgDownTime = +(item.avgDownTime / item.count).toFixed(1);
    item.avgDuration = +(item.avgDuration / item.count).toFixed(1);
    item.successRate = +(item.successRate / item.count).toFixed(2);
  }
  return arr.sort((a, b) => b.count - a.count).slice(0, 15);
}

export function generateRepeatAircraft(records: FaultRecord[]): RepeatAircraft[] {
  const map = new Map<string, RepeatAircraft & { _ataSet: Set<string>; _last: Date }>();
  for (const r of records) {
    const existing = map.get(r.aircraftReg);
    const occurred = new Date(r.occurredAt);
    if (existing) {
      existing.faultCount += 1;
      existing._ataSet.add(r.ataChapter);
      if (occurred > existing._last) existing._last = occurred;
    } else {
      map.set(r.aircraftReg, {
        aircraftReg: r.aircraftReg,
        aircraftType: r.aircraftType,
        faultCount: 1,
        uniqueFaultCodes: 1,
        ataChapters: [r.ataChapter],
        lastOccurrence: r.occurredAt,
        _ataSet: new Set([r.ataChapter]),
        _last: occurred,
      } as any);
    }
  }
  const arr = Array.from(map.values())
    .filter((a) => a.faultCount >= 2)
    .map((a) => ({
      aircraftReg: a.aircraftReg,
      aircraftType: a.aircraftType,
      faultCount: a.faultCount,
      uniqueFaultCodes: a._ataSet.size,
      ataChapters: Array.from(a._ataSet),
      lastOccurrence: a._last.toISOString(),
    }))
    .sort((a, b) => b.faultCount - a.faultCount)
    .slice(0, 12);
  return arr;
}

export function generateActionStats(records: FaultRecord[]): ActionStat[] {
  const map = new Map<string, ActionStat>();
  for (const r of records) {
    const existing = map.get(r.handlingAction);
    if (existing) {
      existing.count += 1;
      existing.avgDuration += r.durationHours;
      if (r.success) existing.successCount += 1;
    } else {
      map.set(r.handlingAction, {
        action: r.handlingAction,
        count: 1,
        successCount: r.success ? 1 : 0,
        successRate: 0,
        avgDuration: r.durationHours,
      });
    }
  }
  const arr = Array.from(map.values());
  for (const item of arr) {
    item.successRate = +(item.successCount / item.count).toFixed(2);
    item.avgDuration = +(item.avgDuration / item.count).toFixed(1);
  }
  return arr.sort((a, b) => b.count - a.count);
}

export function generateIssueCases(cases: KnowledgeCase[]): IssueCase[] {
  return cases
    .filter(
      (c) =>
        !c.hasManualReference || !c.hasReleaseConclusion || !c.hasFollowUp || c.qualityScore < 75,
    )
    .map((c) => {
      const missing: string[] = [];
      if (!c.hasManualReference) missing.push("手册依据");
      if (!c.hasReleaseConclusion) missing.push("放行结论");
      if (!c.hasFollowUp) missing.push("后续跟踪");
      if (c.qualityScore < 75) missing.push("评分偏低");
      return {
        id: c.id,
        title: c.title,
        faultCode: c.faultCode,
        missingItems: missing,
        qualityScore: c.qualityScore,
        lastReferenced: randDate(60),
      };
    })
    .sort((a, b) => a.qualityScore - b.qualityScore);
}

export function getFilterOptions() {
  return {
    aircraftTypes,
    bases,
    ataChapters: ataChapters.map((a) => ({ value: a.chapter, label: `${a.chapter} ${a.name}` })),
    seasons,
    faultCodes: faultCodes.map((f) => ({ value: f.code, label: `${f.code} ${f.name}` })),
    engineers,
    handlingActions,
  };
}
