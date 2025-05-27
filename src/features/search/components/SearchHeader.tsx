"use client";

import Link from "next/link";
import { SearchType } from "../queries/searchSpotify";
import SearchBar from "./SearchBar";

interface SearchHeaderProps {
  searchTerm: string;
  searchType: SearchType;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  clearSearch: () => void;
  handleSearchSubmit: () => void;
  handleTypeChange: (type: SearchType) => void;
}

// 검색 탭 아이템 정의
const searchTabItems = [
  { id: "all", label: "전체" },
  { id: "artist", label: "아티스트" },
  { id: "track", label: "트랙" },
  { id: "album", label: "앨범" },
] as const;

export function SearchHeader({
  searchTerm,
  searchType,
  handleSearchChange,
  clearSearch,
  handleSearchSubmit,
  handleTypeChange,
}: SearchHeaderProps) {
  // 검색어에 따른 URL 생성 함수
  const getSearchUrl = (type: SearchType) => {
    const baseUrl = `/search?q=${encodeURIComponent(searchTerm)}`;
    return type === "all" ? baseUrl : `${baseUrl}&type=${type}`;
  };

  return (
    <>
      {/* 검색 입력 필드 */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
        onSubmit={handleSearchSubmit}
      />

      {/* 검색 유형 탭 (검색어가 있는 경우에만 표시) - 애플 스타일 */}
      {searchTerm.trim().length > 0 && (
        <div className="mt-6 mb-4">
          <div className="flex justify-center">
            <div className="inline-flex gap-4 px-1">
              {searchTabItems.map((tab) => (
                <Link
                  key={tab.id}
                  href={getSearchUrl(tab.id as SearchType)}
                  className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
                    searchType === tab.id
                      ? "text-primary font-semibold"
                      : "text-gray-500 hover:text-gray-800"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleTypeChange(tab.id as SearchType);
                  }}
                >
                  {tab.label}
                  {searchType === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="w-full h-px bg-gray-200 mt-0.5"></div>
        </div>
      )}
    </>
  );
}

export default SearchHeader;
