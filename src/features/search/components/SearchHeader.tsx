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

export function SearchHeader({
  searchTerm,
  searchType,
  handleSearchChange,
  clearSearch,
  handleSearchSubmit,
  handleTypeChange,
}: SearchHeaderProps) {
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
              <Link
                href={`/search?q=${encodeURIComponent(searchTerm)}`}
                className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
                  searchType === "all"
                    ? "text-primary font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTypeChange("all");
                }}
              >
                전체
                {searchType === "all" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(searchTerm)}&type=artist`}
                className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
                  searchType === "artist"
                    ? "text-primary font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTypeChange("artist");
                }}
              >
                아티스트
                {searchType === "artist" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(searchTerm)}&type=track`}
                className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
                  searchType === "track"
                    ? "text-primary font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTypeChange("track");
                }}
              >
                트랙
                {searchType === "track" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(searchTerm)}&type=album`}
                className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
                  searchType === "album"
                    ? "text-primary font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTypeChange("album");
                }}
              >
                앨범
                {searchType === "album" && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
                )}
              </Link>
            </div>
          </div>
          <div className="w-full h-px bg-gray-200 mt-0.5"></div>
        </div>
      )}
    </>
  );
}

export default SearchHeader;
