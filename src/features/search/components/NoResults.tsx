"use client";

import { SearchType } from "../hooks/useSearchPageLogic";

interface NoResultsProps {
  searchTerm: string;
  searchType: SearchType;
  isLoading?: boolean;
}

export function NoResults({
  searchTerm,
  searchType,
  isLoading = false,
}: NoResultsProps) {
  if (isLoading) return null;

  const typeLabels = {
    all: "전체",
    artist: "아티스트",
    track: "트랙",
    album: "앨범",
  };

  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
        검색 결과가 없습니다
      </h3>
      <p className="text-gray-500 dark:text-gray-400">
        "{searchTerm}" 에 대한 {typeLabels[searchType]} 검색 결과를 찾을 수
        없습니다.
      </p>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
        다른 검색어를 시도해보세요.
      </p>
    </div>
  );
}

export default NoResults;
