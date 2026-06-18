import { create } from "zustand";
import type { ReviewTask, TaskStatus, TaskPriority, ActionType, TaskLog, TaskType } from "@/types";
import { generateReviewTasks, getFilterOptions } from "@/utils/mock";
import { generateId } from "@/utils/helpers";

interface ReviewStore {
  tasks: ReviewTask[];
  selectedTask: ReviewTask | null;
  drawerOpen: boolean;
  initFromLocalStorage: () => void;
  setSelectedTask: (task: ReviewTask | null) => void;
  setDrawerOpen: (open: boolean) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  updateTaskPriority: (taskId: string, priority: TaskPriority) => void;
  assignTask: (taskId: string, assignee: string) => void;
  updateTaskAnalysis: (
    taskId: string,
    data: {
      rootCause?: string;
      action?: string;
      actionType?: ActionType;
      needTraining?: boolean;
    },
  ) => void;
  addTaskLog: (taskId: string, log: Omit<TaskLog, "timestamp">) => void;
  refreshTasks: () => void;
  createTask: (data: {
    faultCode: string;
    faultName: string;
    ataChapter: string;
    riskReason: string;
    suggestedAction: string;
    source: string;
    sourceId?: string;
  }) => ReviewTask | null;
}

const STORAGE_KEY = "tli_review_tasks";

function saveToStorage(tasks: ReviewTask[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}

function loadFromStorage(): ReviewTask[] | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return null;
}

const { engineers } = getFilterOptions();

export const useReviewStore = create<ReviewStore>((set, get) => ({
  tasks: [],
  selectedTask: null,
  drawerOpen: false,
  initFromLocalStorage: () => {
    const stored = loadFromStorage();
    if (stored && stored.length > 0) {
      set({ tasks: stored });
    } else {
      const initial = generateReviewTasks();
      set({ tasks: initial });
      saveToStorage(initial);
    }
  },
  setSelectedTask: (task) => set({ selectedTask: task }),
  setDrawerOpen: (open) => set({ drawerOpen: open }),
  updateTaskStatus: (taskId, status) => {
    const tasks = get().tasks.map((t) => {
      if (t.id === taskId) {
        const newLog: TaskLog = {
          timestamp: new Date().toISOString(),
          action: `状态变更为${status === "PENDING" ? "待处理" : status === "IN_PROGRESS" ? "进行中" : "已完成"}`,
          operator: "质控人员",
        };
        return { ...t, status, historyLog: [...t.historyLog, newLog] };
      }
      return t;
    });
    set({ tasks });
    saveToStorage(tasks);
  },
  updateTaskPriority: (taskId, priority) => {
    const tasks = get().tasks.map((t) => {
      if (t.id === taskId) {
        const newLog: TaskLog = {
          timestamp: new Date().toISOString(),
          action: `优先级变更为${priority === "HIGH" ? "高" : priority === "MEDIUM" ? "中" : "低"}`,
          operator: "质控人员",
        };
        return { ...t, priority, historyLog: [...t.historyLog, newLog] };
      }
      return t;
    });
    set({ tasks });
    saveToStorage(tasks);
  },
  assignTask: (taskId, assignee) => {
    const tasks = get().tasks.map((t) => {
      if (t.id === taskId) {
        const newLog: TaskLog = {
          timestamp: new Date().toISOString(),
          action: `指派给 ${assignee}`,
          operator: "质控人员",
        };
        return { ...t, assignee, historyLog: [...t.historyLog, newLog] };
      }
      return t;
    });
    set({ tasks });
    saveToStorage(tasks);
    const updated = tasks.find((t) => t.id === taskId) || null;
    if (get().selectedTask?.id === taskId && updated) {
      set({ selectedTask: updated });
    }
  },
  updateTaskAnalysis: (taskId, data) => {
    const tasks = get().tasks.map((t) => {
      if (t.id === taskId) {
        const logs: TaskLog[] = [];
        if (data.rootCause) {
          logs.push({
            timestamp: new Date().toISOString(),
            action: "补充原因分析",
            operator: engineers[0],
            remark: data.rootCause.slice(0, 60),
          });
        }
        if (data.action) {
          logs.push({
            timestamp: new Date().toISOString(),
            action: "填写改进措施",
            operator: engineers[0],
            remark: data.action.slice(0, 60),
          });
        }
        return { ...t, ...data, historyLog: [...t.historyLog, ...logs] };
      }
      return t;
    });
    set({ tasks });
    saveToStorage(tasks);
    const updated = tasks.find((t) => t.id === taskId) || null;
    if (get().selectedTask?.id === taskId && updated) {
      set({ selectedTask: updated });
    }
  },
  addTaskLog: (taskId, log) => {
    const tasks = get().tasks.map((t) => {
      if (t.id === taskId) {
        return {
          ...t,
          historyLog: [...t.historyLog, { ...log, timestamp: new Date().toISOString() }],
        };
      }
      return t;
    });
    set({ tasks });
    saveToStorage(tasks);
  },
  refreshTasks: () => {
    const tasks = generateReviewTasks();
    set({ tasks });
    saveToStorage(tasks);
  },
  createTask: (data) => {
    const existing = get().tasks.find(
      (t) => t.source === data.source && t.sourceId === data.sourceId,
    );
    if (existing) return null;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const newTask: ReviewTask = {
      id: generateId(),
      type: "QUALITY_ISSUE" as TaskType,
      faultCode: data.faultCode,
      faultName: data.faultName,
      description: `${data.faultCode} ${data.faultName} - 案例质量问题`,
      ataChapter: data.ataChapter,
      occurrenceCount: 0,
      avgDuration: 0,
      status: "PENDING",
      priority: "HIGH",
      assignee: "",
      needTraining: false,
      riskReason: data.riskReason,
      suggestedAction: data.suggestedAction,
      source: data.source,
      sourceId: data.sourceId,
      createdAt: new Date().toISOString(),
      dueDate: dueDate.toISOString(),
      createdBy: "质控人员",
      historyLog: [
        {
          timestamp: new Date().toISOString(),
          action: "从案例质量页加入复盘清单",
          operator: "质控人员",
          remark: data.riskReason,
        },
      ],
    };

    const tasks = [...get().tasks, newTask];
    set({ tasks });
    saveToStorage(tasks);
    return newTask;
  },
}));

export { engineers };
