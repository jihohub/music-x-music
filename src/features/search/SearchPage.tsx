"use client";

import BasicSearchResults from "./components/BasicSearchResults";
import InfiniteScrollResults from "./components/InfiniteScrollResults";
import NoResults from "./components/NoResults";
import PopularSearches from "./components/PopularSearches";
import SearchHeader from "./components/SearchHeader";
import { useSearchPageLogic } from "./hooks/useSearchPageLogic";

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
    isFetchingNextPage,
    isError,
    error,
    hasResults,
    hasNextPage,

    // 선택 상태
    shouldShowArtists,
    shouldShowTracks,
    shouldShowAlbums,

    // 핸들러
    handleSearchChange,
    clearSearch,
    handlePopularSearchClick,
    handleSearchSubmit,
    handleTypeChange,
    fetchNextPage,

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

  // 검색 로딩 중 상태 표시 최적화
  const showLoading =
    isFetching &&
    !isFetchingNextPage &&
    searchTerm.trim().length >= 2 &&
    !hasResults;

  return (
    <div
      className="py-6 space-y-6 px-4"
      ref={scrollContainerRef}
      id="search-page-container"
    >
      {/* 헤더 영역: 검색 입력과 탭 */}
      <SearchHeader
        searchTerm={searchTerm}
        searchType={searchType}
        handleSearchChange={handleSearchChange}
        clearSearch={clearSearch}
        handleSearchSubmit={handleSearchSubmit}
        handleTypeChange={handleTypeChange}
      />

      {/* 초기 로딩 상태 */}
      {/* <AnimatePresence mode="wait">
        {showLoading && <LoadingIndicator key="loading" size="large" />}

        {isError && (
          <div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ErrorDisplay message={error?.message} />
          </div>
        )}
      </AnimatePresence> */}

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

        {/* 검색 타입이 'all'이 아닐 때 스크롤 결과 표시 */}
        {showInfiniteResults && (
          <div key={`scroll-results-${searchType}-${searchTerm}`}>
            <InfiniteScrollResults
              searchType={searchType}
              searchTerm={searchTerm}
              allArtists={allArtists}
              allTracks={allTracks}
              allAlbums={allAlbums}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
              isLoading={isFetching}
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
  );
}
