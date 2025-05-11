import Header from "@/components/Header";
import { SearchPage } from "@/features/search/SearchPage";

export default function SearchPageRoute() {
  return (
    <>
      <Header title="검색" />
      <SearchPage />
    </>
  );
}
