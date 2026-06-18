import { create } from "zustand";
import type { FilterState, FaultRecord, KnowledgeCase } from "@/types";
import { generateFaultRecords, generateKnowledgeCases } from "@/utils/mock";

interface FilterStore extends FilterState {
  allFaultRecords: FaultRecord[];
  allKnowledgeCases: KnowledgeCase[];
  setAircraftTypes: (types: string[]) => void;
  setBases: (bases: string[]) => void;
  setAtaChapters: (chapters: string[]) => void;
  setSeasons: (seasons: string[]) => void;
  setFaultCodes: (codes: string[]) => void;
  setDateRange: (range: { start: string; end: string }) => void;
  reset: () => void;
}

const now = new Date();
const threeMonthsAgo = new Date();
threeMonthsAgo.setMonth(now.getMonth() - 3);

const initialState: FilterState = {
  aircraftTypes: [],
  bases: [],
  ataChapters: [],
  seasons: [],
  faultCodes: [],
  dateRange: {
    start: threeMonthsAgo.toISOString().split("T")[0],
    end: now.toISOString().split("T")[0],
  },
};

const allFaultRecords = generateFaultRecords(200);
const allKnowledgeCases = generateKnowledgeCases(50);

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  allFaultRecords,
  allKnowledgeCases,
  setAircraftTypes: (types) => set({ aircraftTypes: types }),
  setBases: (bases) => set({ bases }),
  setAtaChapters: (chapters) => set({ ataChapters: chapters }),
  setSeasons: (seasons) => set({ seasons }),
  setFaultCodes: (codes) => set({ faultCodes: codes }),
  setDateRange: (range) => set({ dateRange: range }),
  reset: () => set(initialState),
}));

export function filterFaultRecords(
  records: FaultRecord[],
  filters: FilterState,
): FaultRecord[] {
  return records.filter((r) => {
    if (filters.aircraftTypes.length > 0 && !filters.aircraftTypes.includes(r.aircraftType)) {
      return false;
    }
    if (filters.bases.length > 0 && !filters.bases.includes(r.base)) {
      return false;
    }
    if (filters.ataChapters.length > 0 && !filters.ataChapters.includes(r.ataChapter)) {
      return false;
    }
    if (filters.seasons.length > 0 && !filters.seasons.includes(r.season)) {
      return false;
    }
    if (filters.faultCodes.length > 0 && !filters.faultCodes.includes(r.faultCode)) {
      return false;
    }
    if (filters.dateRange.start) {
      const start = new Date(filters.dateRange.start).getTime();
      const occurred = new Date(r.occurredAt).getTime();
      if (occurred < start) return false;
    }
    if (filters.dateRange.end) {
      const end = new Date(filters.dateRange.end).getTime();
      const occurred = new Date(r.occurredAt).getTime();
      if (occurred > end + 86400000 - 1) return false;
    }
    return true;
  });
}

export function filterKnowledgeCases(
  cases: KnowledgeCase[],
  filters: FilterState,
): KnowledgeCase[] {
  return cases.filter((c) => {
    if (filters.ataChapters.length > 0 && !filters.ataChapters.includes(c.ataChapter)) {
      return false;
    }
    if (filters.faultCodes.length > 0 && !filters.faultCodes.includes(c.faultCode)) {
      return false;
    }
    return true;
  });
}
