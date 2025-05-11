"use client";

import { motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import AlbumResults from "./components/AlbumResults";
import ArtistResults from "./components/ArtistResults";
import PopularSearches from "./components/PopularSearches";
import SearchBar from "./components/SearchBar";
import TrackResults from "./components/TrackResults";
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
    handleGenreClick,
    fetchNextPage,

    // 유틸리티
    popularSearches,
  } = useSearchPageLogic();

  return (
    <motion.div
      className="py-6 space-y-6 px-4 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      ref={scrollContainerRef}
      id="scrollableDiv"
    >
      {/* 검색 입력 필드 */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onClearSearch={clearSearch}
        onSubmit={handleSearchSubmit}
      />

      {/* 검색 유형 탭 (검색어가 있는 경우에만 표시) */}
      {searchTerm.trim().length > 0 && (
        <div className="flex justify-center">
          <div className="inline-flex rounded-lg overflow-hidden shadow-md border border-gray-700/10">
            <button
              onClick={() => handleTypeChange("all")}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                searchType === "all"
                  ? "bg-primary text-white shadow-inner font-semibold scale-105 transform translate-y-0.5"
                  : "bg-card-bg hover:bg-gray-700/20 text-text-primary"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => handleTypeChange("artist")}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                searchType === "artist"
                  ? "bg-primary text-white shadow-inner font-semibold scale-105 transform translate-y-0.5"
                  : "bg-card-bg hover:bg-gray-700/20 text-text-primary"
              }`}
            >
              아티스트
            </button>
            <button
              onClick={() => handleTypeChange("track")}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                searchType === "track"
                  ? "bg-primary text-white shadow-inner font-semibold scale-105 transform translate-y-0.5"
                  : "bg-card-bg hover:bg-gray-700/20 text-text-primary"
              }`}
            >
              트랙
            </button>
            <button
              onClick={() => handleTypeChange("album")}
              className={`px-6 py-3 font-medium transition-all duration-200 ${
                searchType === "album"
                  ? "bg-primary text-white shadow-inner font-semibold scale-105 transform translate-y-0.5"
                  : "bg-card-bg hover:bg-gray-700/20 text-text-primary"
              }`}
            >
              앨범
            </button>
          </div>
        </div>
      )}

      {/* 초기 로딩 상태 - 페이지 첫 로딩 시에만 표시 */}
      {isFetching &&
        !isFetchingNextPage &&
        searchTerm.trim().length >= 2 &&
        !hasResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center py-4"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </motion.div>
        )}

      {/* 검색 오류 */}
      {isError && (
        <div className="bg-red-500 bg-opacity-20 text-red-200 p-4 rounded-lg">
          검색 중 오류가 발생했습니다: {error?.message || "알 수 없는 오류"}
        </div>
      )}

      {/* 검색 결과 */}
      <div className="space-y-8">
        {/* 검색 유형이 all인 경우 결과 표시 */}
        {searchType === "all" && hasResults && (
          <>
            {/* 아티스트 결과 */}
            {shouldShowArtists && allArtists.length > 0 && (
              <motion.div
                key={`artist-results-${searchTerm}`}
                initial={{ opacity: 0.8, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArtistResults
                  artists={allArtists.slice(0, 4)}
                  searchTerm={searchTerm}
                  showMoreLink={true}
                  onShowMore={() => handleTypeChange("artist")}
                />
              </motion.div>
            )}

            {/* 트랙 결과 */}
            {shouldShowTracks && allTracks.length > 0 && (
              <motion.div
                key={`track-results-${searchTerm}`}
                initial={{ opacity: 0.8, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <TrackResults
                  tracks={allTracks.slice(0, 5)}
                  searchTerm={searchTerm}
                  showMoreLink={true}
                  onShowMore={() => handleTypeChange("track")}
                />
              </motion.div>
            )}

            {/* 앨범 결과 */}
            {shouldShowAlbums && allAlbums.length > 0 && (
              <motion.div
                key={`album-results-${searchTerm}`}
                initial={{ opacity: 0.8, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }}
              >
                <AlbumResults
                  albums={allAlbums.slice(0, 4)}
                  searchTerm={searchTerm}
                  showMoreLink={true}
                  onShowMore={() => handleTypeChange("album")}
                />
              </motion.div>
            )}
          </>
        )}

        {/* 특정 타입 선택 시 무한 스크롤 적용 */}
        {searchType !== "all" && (
          <motion.div
            key={`${searchType}-results-${searchTerm}`}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="min-h-[300px]"
          >
            <InfiniteScroll
              dataLength={
                searchType === "artist"
                  ? allArtists.length
                  : searchType === "track"
                  ? allTracks.length
                  : searchType === "album"
                  ? allAlbums.length
                  : 0
              }
              next={fetchNextPage}
              hasMore={!!hasNextPage}
              loader={
                <div className="flex justify-center items-center py-4 mt-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              }
              endMessage={
                <p className="text-center text-text-secondary text-sm py-4 mt-2">
                  모든 결과를 불러왔습니다.
                </p>
              }
              className="space-y-6"
              scrollThreshold={0.8}
              style={{ overflow: "unset" }}
              key={`infinite-scroll-${searchType}-${searchTerm}`}
            >
              {/* 아티스트 결과 */}
              {searchType === "artist" && allArtists.length > 0 && (
                <ArtistResults
                  artists={allArtists}
                  searchTerm={searchTerm}
                  showMoreLink={false}
                />
              )}

              {/* 트랙 결과 */}
              {searchType === "track" && allTracks.length > 0 && (
                <TrackResults
                  tracks={allTracks}
                  searchTerm={searchTerm}
                  showMoreLink={false}
                />
              )}

              {/* 앨범 결과 */}
              {searchType === "album" && allAlbums.length > 0 && (
                <AlbumResults
                  albums={allAlbums}
                  searchTerm={searchTerm}
                  showMoreLink={false}
                />
              )}
            </InfiniteScroll>

            {/* 추가 데이터 로딩 중 표시 (하단) */}
            {isFetchingNextPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center items-center py-4 mt-4"
              >
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </motion.div>
            )}

            {/* 백업 로드 더보기 버튼 */}
            {hasNextPage && !isFetchingNextPage && (
              <div className="flex justify-center my-6">
                <button
                  onClick={fetchNextPage}
                  className="px-6 py-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors"
                >
                  더 보기
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* 특정 유형 선택 시 결과가 없는 경우 메시지 표시 */}
      {!isFetching &&
        searchTerm &&
        !isError &&
        !hasResults &&
        searchTerm.trim().length >= 2 && (
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
        )}

      {/* 검색 결과가 없고 로딩 중이 아닐 때 - 인기 검색어 표시 */}
      {(!searchTerm || searchTerm.trim() === "") && !isFetching && (
        <div className="space-y-6 mt-4">
          <PopularSearches
            popularSearches={popularSearches}
            onSearchClick={handlePopularSearchClick}
          />
        </div>
      )}
    </motion.div>
  );
}
