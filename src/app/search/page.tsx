import Header from "@/components/Header";
import { SearchPage } from "@/features/search/SearchPage";
import { Suspense } from "react";

export default function SearchPageRoute() {
  return (
    <div className="backdrop-fix">
      <Header title="검색" />
      <Suspense fallback={null}>
        <SearchPage />
      </Suspense>
    </div>
  );
}
