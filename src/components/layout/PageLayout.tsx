import { ReactNode } from "react";
import { Header } from "./Header";
import { FilterPanel } from "@/components/common/FilterPanel";
import { useLocation } from "react-router-dom";

interface PageLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function PageLayout({ children, showSidebar = true }: PageLayoutProps) {
  const location = useLocation();
  const isReviewPage = location.pathname === "/review-list";

  return (
    <div className="h-screen flex flex-col bg-industrial-bg overflow-hidden">
      <Header />
      <div className="flex-1 flex min-h-0">
        {showSidebar && !isReviewPage && <FilterPanel />}
        <main className="flex-1 min-w-0 overflow-y-auto scrollbar-thin grid-bg">
          <div className="p-6 min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
