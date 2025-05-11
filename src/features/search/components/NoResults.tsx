"use client";

import { SearchType } from "../queries/searchSpotify";

interface NoResultsProps {
  searchTerm: string;
  searchType: SearchType;
}

export function NoResults({ searchTerm, searchType }: NoResultsProps) {
  if (!searchTerm || searchTerm.trim().length < 2) return null;

  return (
    <>
      {searchType === "artist" && (
        <div className="text-center py-8">
          <p className="text-lg text-text-secondary">
            "{searchTerm}"에 대한 아티스트 검색 결과가 없습니다.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            다른 키워드로 검색하거나 다른 카테고리를 선택해보세요.
          </p>
        </div>
      )}

      {searchType === "track" && (
        <div className="text-center py-8">
          <p className="text-lg text-text-secondary">
            "{searchTerm}"에 대한 트랙 검색 결과가 없습니다.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            다른 키워드로 검색하거나 다른 카테고리를 선택해보세요.
          </p>
        </div>
      )}

      {searchType === "album" && (
        <div className="text-center py-8">
          <p className="text-lg text-text-secondary">
            "{searchTerm}"에 대한 앨범 검색 결과가 없습니다.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            다른 키워드로 검색하거나 다른 카테고리를 선택해보세요.
          </p>
        </div>
      )}

      {searchType === "all" && (
        <div className="text-center py-8">
          <p className="text-lg text-text-secondary">
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            다른 키워드로 검색해보세요.
          </p>
        </div>
      )}
    </>
  );
}

export default NoResults;
