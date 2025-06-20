"use client";

import Link from "next/link";
import BasicSearchResults from "./components/BasicSearchResults";
import InfiniteScrollResults from "./components/InfiniteScrollResults";
import NoResults from "./components/NoResults";
import PopularSearches from "./components/PopularSearches";
import SearchBar from "./components/SearchBar";
import { useSearchPageLogic } from "./hooks/useSearchPageLogic";

// 검색 탭 아이템 정의
const searchTabItems = [
  { id: "all", label: "전체" },
  { id: "artist", label: "아티스트" },
  { id: "track", label: "트랙" },
  { id: "album", label: "앨범" },
] as const;

export function SearchPage() {
  const {
    // 상태
    searchTerm,
    searchType,
    scrollContainerRef,
    allTracks,
    allArtists,
    allAlbums,
    isFetching,
    isError,
    error,
    hasResults,

    // 선택 상태
    shouldShowArtists,
    shouldShowTracks,
    shouldShowAlbums,

    // 무한스크롤 관련
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSpecificTypeSearch,

    // 핸들러
    handleSearchChange,
    clearSearch,
    handlePopularSearchClick,
    handleSearchSubmit,
    handleTypeChange,

    // 유틸리티
    popularSearches,
  } = useSearchPageLogic();

  // 탭 변경 시 즉시 결과를 표시하기 위한 최적화된 조건
  const showBasicResults = searchType === "all" && (hasResults || isFetching);
  const showInfiniteResults =
    searchType !== "all" &&
    (isFetching ||
      (searchType === "artist" && allArtists.length > 0) ||
      (searchType === "track" && allTracks.length > 0) ||
      (searchType === "album" && allAlbums.length > 0));
  const showNoResults =
    !isFetching && // 로딩 중이 아닐 때만 "결과 없음" 표시
    searchTerm &&
    !isError &&
    !hasResults &&
    searchTerm.trim().length >= 2;
  const showPopularSearches =
    (!searchTerm || searchTerm.trim() === "") && !isFetching;

  // 검색어에 따른 URL 생성 함수
  const getSearchUrl = (type: any) => {
    const baseUrl = `/search?q=${encodeURIComponent(searchTerm)}`;
    return type === "all" ? baseUrl : `${baseUrl}&type=${type}`;
  };

  return (
    <>
      {/* 검색바 - 반응형 위치 조정 */}
      <div className="fixed z-40 px-4 py-4 top-4 left-0 right-0 md:hidden">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          onSubmit={handleSearchSubmit}
        />
      </div>

      {/* 데스크탑용 검색바 (상단바 아래) */}
      <div className="hidden md:block fixed top-20 left-4 right-4 z-40 px-4 py-4">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onClearSearch={clearSearch}
          onSubmit={handleSearchSubmit}
        />
      </div>

      {/* 검색 탭 - 반응형 위치 조정 */}
      {searchTerm.trim().length > 0 && (
        <div
          className="fixed left-6 right-6 z-40 flex justify-center
          bottom-28 md:bottom-8"
        >
          <div className="relative">
            {/* 리퀴드글래스 배경 */}
            <div
              className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-black/15 border border-white/10 shadow-2xl rounded-full"
              style={{
                boxShadow:
                  "0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/15 rounded-full"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/5 rounded-full"></div>
            </div>

            {/* 탭 컨텐츠 */}
            <div className="relative px-2.5 py-1.5">
              <div className="flex gap-1">
                {searchTabItems.map((tab) => (
                  <Link
                    key={tab.id}
                    href={getSearchUrl(tab.id)}
                    className={`relative py-1 px-2 font-medium text-xs transition-all duration-200 ${
                      searchType === tab.id
                        ? "text-white font-semibold"
                        : "text-white/70 hover:text-white/90"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTypeChange(tab.id as any);
                    }}
                  >
                    {tab.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 메인 컨텐츠 영역 */}
      <div
        className="space-y-6 px-4
          pt-28 pb-32 md:pt-52 md:pb-8"
        ref={scrollContainerRef}
        id="search-page-container"
      >
        {/* 검색 결과 영역 */}
        <div className="space-y-8">
          {/* 검색 타입이 'all'일 때 결과 표시 */}
          {showBasicResults && (
            <div key={`basic-results-${searchTerm}`}>
              <BasicSearchResults
                searchTerm={searchTerm}
                allArtists={allArtists}
                allTracks={allTracks}
                allAlbums={allAlbums}
                shouldShowArtists={shouldShowArtists}
                shouldShowTracks={shouldShowTracks}
                shouldShowAlbums={shouldShowAlbums}
                handleTypeChange={handleTypeChange}
                isLoading={isFetching}
              />
            </div>
          )}

          {/* 검색 타입이 'all'이 아닐 때 결과 표시 */}
          {showInfiniteResults && (
            <div key={`scroll-results-${searchType}-${searchTerm}`}>
              <InfiniteScrollResults
                searchType={searchType}
                searchTerm={searchTerm}
                allArtists={allArtists}
                allTracks={allTracks}
                allAlbums={allAlbums}
                isLoading={isFetching}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
              />
            </div>
          )}
        </div>

        {/* 결과 없음 메시지 */}
        {showNoResults && (
          <div key="no-results">
            <NoResults
              searchTerm={searchTerm}
              searchType={searchType}
              isLoading={isFetching}
            />
          </div>
        )}

        {/* 인기 검색어 (검색어가 없을 때) */}
        {showPopularSearches && (
          <div key="popular-searches" className="space-y-6 mt-4">
            <PopularSearches
              popularSearches={popularSearches}
              onSearchClick={handlePopularSearchClick}
            />
          </div>
        )}
      </div>
    </>
  );
}
