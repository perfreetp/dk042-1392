import { create } from "zustand";
import type { FilterState } from "@/types";

interface FilterStore extends FilterState {
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

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,
  setAircraftTypes: (types) => set({ aircraftTypes: types }),
  setBases: (bases) => set({ bases }),
  setAtaChapters: (chapters) => set({ ataChapters: chapters }),
  setSeasons: (seasons) => set({ seasons }),
  setFaultCodes: (codes) => set({ faultCodes: codes }),
  setDateRange: (range) => set({ dateRange: range }),
  reset: () => set(initialState),
}));
