import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { FaultHeatmapPage } from "@/pages/FaultHeatmapPage";
import { CaseQualityPage } from "@/pages/CaseQualityPage";
import { ReviewListPage } from "@/pages/ReviewListPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PageLayout>
              <FaultHeatmapPage />
            </PageLayout>
          }
        />
        <Route
          path="/case-quality"
          element={
            <PageLayout>
              <CaseQualityPage />
            </PageLayout>
          }
        />
        <Route
          path="/review-list"
          element={
            <PageLayout showSidebar={false}>
              <ReviewListPage />
            </PageLayout>
          }
        />
        <Route path="*" element={<div className="text-center text-xl text-industrial-subtle p-12">页面不存在</div>} />
      </Routes>
    </Router>
  );
}
