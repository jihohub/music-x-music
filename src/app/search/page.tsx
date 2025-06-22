import { SearchPage } from "@/features/search/SearchPage";
import { Suspense } from "react";

function SearchPageFallback() {
  return <div className="flex items-center justify-center min-h-screen"></div>;
}

export default function Page() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPage />
    </Suspense>
  );
}
