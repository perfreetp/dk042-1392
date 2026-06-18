export interface FilterState {
  aircraftTypes: string[];
  bases: string[];
  ataChapters: string[];
  seasons: string[];
  faultCodes: string[];
  dateRange: { start: string; end: string };
}

export interface FaultRecord {
  id: string;
  faultCode: string;
  faultName: string;
  faultDescription: string;
  aircraftType: string;
  base: string;
  ataChapter: string;
  ataName: string;
  season: string;
  aircraftReg: string;
  occurredAt: string;
  downTimeHours: number;
  durationHours: number;
  handlingAction: string;
  actionTaken: string;
  caseId?: string;
  success: boolean;
}

export interface KnowledgeCase {
  id: string;
  title: string;
  faultCode: string;
  faultName: string;
  ataChapter: string;
  referenceCount: number;
  successCount: number;
  successRate: number;
  hasManualReference: boolean;
  hasReleaseConclusion: boolean;
  hasFollowUp: boolean;
  qualityScore: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";
export type TaskType = "HIGH_FREQ" | "TIMEOUT" | "QUALITY_ISSUE";
export type ActionType = "ANALYSIS" | "REVISION" | "TRAINING";

export interface TaskLog {
  timestamp: string;
  action: string;
  operator: string;
  remark?: string;
}

export interface ReviewTask {
  id: string;
  type: TaskType;
  faultCode: string;
  faultName: string;
  description: string;
  ataChapter: string;
  occurrenceCount: number;
  avgDuration: number;
  overHours?: number;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  rootCause?: string;
  action?: string;
  actionType?: ActionType;
  needTraining: boolean;
  riskReason?: string;
  suggestedAction?: string;
  source?: string;
  sourceId?: string;
  createdAt: string;
  dueDate: string;
  createdBy: string;
  historyLog: TaskLog[];
}

export interface HeatmapCell {
  ataChapter: string;
  ataName: string;
  month: string;
  count: number;
}

export interface FaultRank {
  faultCode: string;
  faultName: string;
  ataChapter: string;
  count: number;
  avgDownTime: number;
  avgDuration: number;
  successRate: number;
}

export interface RepeatAircraft {
  aircraftReg: string;
  aircraftType: string;
  faultCount: number;
  uniqueFaultCodes: number;
  ataChapters: string[];
  lastOccurrence: string;
}

export interface ActionStat {
  action: string;
  count: number;
  successCount: number;
  successRate: number;
  avgDuration: number;
}

export interface IssueCase {
  id: string;
  title: string;
  faultCode: string;
  ataChapter: string;
  referenceCount: number;
  successRate: number;
  missingItems: string[];
  qualityScore: number;
  lastReferenced: string;
}

export interface KpiData {
  label: string;
  value: number | string;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon: string;
}
