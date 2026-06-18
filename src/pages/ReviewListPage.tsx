import { useEffect } from "react";
import { WeekOverview } from "@/components/review/WeekOverview";
import { TaskBoard } from "@/components/review/TaskBoard";
import { TaskDrawer } from "@/components/review/TaskDrawer";
import { useReviewStore } from "@/store/reviewStore";

export function ReviewListPage() {
  const { initFromLocalStorage } = useReviewStore();

  useEffect(() => {
    initFromLocalStorage();
  }, [initFromLocalStorage]);

  return (
    <div className="space-y-6">
      <WeekOverview />
      <TaskBoard />
      <TaskDrawer />
    </div>
  );
}
