import { SearchPage } from "@/features/search/SearchPage";
import { Suspense } from "react";

function SearchPageFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-lg text-text-secondary">
        검색 페이지를 로드하는 중...
      </p>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPage />
    </Suspense>
  );
}
