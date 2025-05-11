"use client";

import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import AlbumResults from "./components/AlbumResults";
import ArtistResults from "./components/ArtistResults";
import PopularSearches from "./components/PopularSearches";
import SearchBar from "./components/SearchBar";
import TrackResults from "./components/TrackResults";
import { SearchType, searchSpotify } from "./queries/searchSpotify";

export function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 검색어 및 유형 가져오기
  const queryParam = searchParams.get("q") || "";
  const typeParam = (searchParams.get("type") || "all") as SearchType;

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [searchType, setSearchType] = useState<SearchType>(typeParam);

  // 검색 결과 상태
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);

  // 무한 스크롤 관련 상태
  const [trackOffset, setTrackOffset] = useState(0);
  const [artistOffset, setArtistOffset] = useState(0);
  const [albumOffset, setAlbumOffset] = useState(0);
  const [hasMoreTracks, setHasMoreTracks] = useState(true);
  const [hasMoreArtists, setHasMoreArtists] = useState(true);
  const [hasMoreAlbums, setHasMoreAlbums] = useState(true);

  // 로딩 및 에러 상태
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 한 번에 가져올 결과 수
  const PAGE_SIZE = 20;

  // URL 업데이트 함수
  const updateSearchParams = useCallback(
    (term: string, type: SearchType = searchType) => {
      if (term.trim().length > 1) {
        // 검색어와 타입이 모두 있는 경우
        const params = new URLSearchParams();
        params.set("q", term);

        // 전체 검색이 아닌 경우에만 type 파라미터 추가
        if (type !== "all") {
          params.set("type", type);
        }

        router.push(`/search?${params.toString()}`, { scroll: false });
      } else if (term.trim() === "") {
        // 검색어가 없는 경우 기본 검색 페이지로
        router.push("/search", { scroll: false });
      }
    },
    [router, searchType]
  );

  // 인기 검색어
  const popularSearches = [
    "Coldplay",
    "르세라핌",
    "Skrillex",
    "Ariana Grande",
    "Kendrick Lamar",
    "Stray Kids",
    "The Weeknd",
    "Justin Bieber",
  ];

  // 검색 함수 - 새로운 검색 시작
  const performSearch = async (term: string, type: SearchType = searchType) => {
    if (term.trim().length < 2) {
      setTracks([]);
      setArtists([]);
      setAlbums([]);
      setSearchError(null);
      resetPagination();
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchSpotify(term, type, 0, PAGE_SIZE);

      // 검색 결과 설정
      if (type === "all" || type === "track") {
        const items = results.tracks?.items || [];
        const total = results.tracks?.total || 0;

        setTracks(items);
        setHasMoreTracks(items.length < total);
        setTrackOffset(items.length);

        console.log(
          `트랙 검색 결과: ${items.length}개, 전체: ${total}개, 더 있음: ${
            items.length < total
          }`
        );
      }

      if (type === "all" || type === "artist") {
        const items = results.artists?.items || [];
        const total = results.artists?.total || 0;

        setArtists(items);
        setHasMoreArtists(items.length < total);
        setArtistOffset(items.length);

        console.log(
          `아티스트 검색 결과: ${items.length}개, 전체: ${total}개, 더 있음: ${
            items.length < total
          }`
        );
      }

      if (type === "all" || type === "album") {
        const items = results.albums?.items || [];
        const total = results.albums?.total || 0;

        setAlbums(items);
        setHasMoreAlbums(items.length < total);
        setAlbumOffset(items.length);

        console.log(
          `앨범 검색 결과: ${items.length}개, 전체: ${total}개, 더 있음: ${
            items.length < total
          }`
        );
      }
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setSearchError("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
      resetResults();
    } finally {
      setIsSearching(false);
    }
  };

  // 더 많은 결과 로드
  const loadMoreResults = async () => {
    if (!searchTerm || isSearching) return;

    try {
      let offset = 0;

      // 현재 표시 중인 유형에 따라 다음 페이지 로드
      if (searchType === "track") {
        offset = trackOffset;
      } else if (searchType === "artist") {
        offset = artistOffset;
      } else if (searchType === "album") {
        offset = albumOffset;
      }

      console.log(
        `무한 스크롤 로드: ${searchType}, offset: ${offset}, limit: ${PAGE_SIZE}`
      );

      const results = await searchSpotify(
        searchTerm,
        searchType,
        offset,
        PAGE_SIZE
      );

      if (searchType === "track") {
        const newTracks = results.tracks?.items || [];
        const total = results.tracks?.total || 0;

        if (newTracks.length > 0) {
          setTracks((prev) => [...prev, ...newTracks]);
          setTrackOffset((prev) => prev + newTracks.length);
        }

        // 다음 페이지가 있는지 확인 (현재 로드된 트랙 수 + 새로 로드된 트랙 수가 전체 결과 수보다 적은지)
        setHasMoreTracks(trackOffset + newTracks.length < total);
        console.log(
          `트랙 로드 완료: ${newTracks.length}개, 전체: ${total}개, 더 있음: ${
            trackOffset + newTracks.length < total
          }`
        );
      } else if (searchType === "artist") {
        const newArtists = results.artists?.items || [];
        const total = results.artists?.total || 0;

        if (newArtists.length > 0) {
          setArtists((prev) => [...prev, ...newArtists]);
          setArtistOffset((prev) => prev + newArtists.length);
        }

        // 다음 페이지가 있는지 확인
        setHasMoreArtists(artistOffset + newArtists.length < total);
        console.log(
          `아티스트 로드 완료: ${
            newArtists.length
          }개, 전체: ${total}개, 더 있음: ${
            artistOffset + newArtists.length < total
          }`
        );
      } else if (searchType === "album") {
        const newAlbums = results.albums?.items || [];
        const total = results.albums?.total || 0;

        if (newAlbums.length > 0) {
          setAlbums((prev) => [...prev, ...newAlbums]);
          setAlbumOffset((prev) => prev + newAlbums.length);
        }

        // 다음 페이지가 있는지 확인
        setHasMoreAlbums(albumOffset + newAlbums.length < total);
        console.log(
          `앨범 로드 완료: ${newAlbums.length}개, 전체: ${total}개, 더 있음: ${
            albumOffset + newAlbums.length < total
          }`
        );
      }
    } catch (error) {
      console.error("추가 결과 로드 중 오류 발생:", error);
    }
  };

  // 페이지네이션 초기화
  const resetPagination = () => {
    setTrackOffset(0);
    setArtistOffset(0);
    setAlbumOffset(0);
    setHasMoreTracks(true);
    setHasMoreArtists(true);
    setHasMoreAlbums(true);
  };

  // 검색 결과 초기화
  const resetResults = () => {
    setTracks([]);
    setArtists([]);
    setAlbums([]);
    resetPagination();
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  // 검색어 초기화
  const clearSearch = () => {
    setSearchTerm("");
    resetResults();
    setSearchError(null);
    router.push("/search", { scroll: false });
  };

  // 인기 검색어 클릭
  const handlePopularSearchClick = (term: string) => {
    setSearchTerm(term);
    resetPagination();
    updateSearchParams(term);
    performSearch(term);
  };

  // 검색 폼 제출 핸들러
  const handleSearchSubmit = () => {
    if (searchTerm.trim().length >= 2) {
      resetPagination();
      updateSearchParams(searchTerm);
      performSearch(searchTerm);
    }
  };

  // 검색 유형 변경 핸들러
  const handleTypeChange = (type: SearchType) => {
    setSearchType(type);
    updateSearchParams(searchTerm, type);

    // 이미 해당 타입의 결과가 있는지 확인 후, 없으면 새로 검색
    if (
      (type === "track" && tracks.length === 0) ||
      (type === "artist" && artists.length === 0) ||
      (type === "album" && albums.length === 0)
    ) {
      performSearch(searchTerm, type);
    }
  };

  // 장르 클릭
  const handleGenreClick = (genre: string) => {
    setSearchTerm(genre);
    resetPagination();
    updateSearchParams(genre);
    performSearch(genre);
  };

  // URL 쿼리 파라미터 변경 감지
  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
      performSearch(queryParam, typeParam);
    }

    // 타입 업데이트
    setSearchType(typeParam);
  }, [queryParam, typeParam]);

  // 검색어 변경 시 URL 업데이트와 검색 실행 (디바운스 적용)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== queryParam) {
        updateSearchParams(searchTerm);
        if (searchTerm.trim().length >= 2) {
          resetPagination();
          performSearch(searchTerm);
        } else if (searchTerm.trim() === "") {
          resetResults();
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, queryParam, updateSearchParams]);

  // 검색 결과가 있는지 확인
  const hasResults =
    tracks.length > 0 || artists.length > 0 || albums.length > 0;

  // 선택된 유형에 따라 표시할 결과 결정
  const shouldShowArtists = searchType === "all" || searchType === "artist";
  const shouldShowTracks = searchType === "all" || searchType === "track";
  const shouldShowAlbums = searchType === "all" || searchType === "album";

  return (
    <div className="py-6 space-y-6 px-4">
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

      {/* 로딩 상태 */}
      {isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-4"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">검색 중...</span>
        </motion.div>
      )}

      {/* 검색 오류 */}
      {searchError && (
        <div className="bg-red-500 bg-opacity-20 text-red-200 p-4 rounded-lg">
          {searchError}
        </div>
      )}

      {/* 검색 결과 */}
      {!isSearching && hasResults && (
        <div className="space-y-8">
          {/* 검색 유형이 all인 경우 결과 표시 */}
          {searchType === "all" && (
            <>
              {/* 아티스트 결과 */}
              {shouldShowArtists && artists.length > 0 && (
                <ArtistResults
                  artists={artists.slice(0, 4)}
                  searchTerm={searchTerm}
                  showMoreLink={true}
                  onShowMore={() => handleTypeChange("artist")}
                />
              )}

              {/* 트랙 결과 */}
              {shouldShowTracks && tracks.length > 0 && (
                <TrackResults
                  tracks={tracks.slice(0, 5)}
                  searchTerm={searchTerm}
                  showMoreLink={true}
                  onShowMore={() => handleTypeChange("track")}
                />
              )}

              {/* 앨범 결과 */}
              {shouldShowAlbums && albums.length > 0 && (
                <AlbumResults
                  albums={albums.slice(0, 4)}
                  searchTerm={searchTerm}
                  showMoreLink={true}
                  onShowMore={() => handleTypeChange("album")}
                />
              )}
            </>
          )}

          {/* 특정 타입 선택 시 무한 스크롤 적용 */}
          {searchType !== "all" && (
            <InfiniteScroll
              dataLength={
                searchType === "track"
                  ? tracks.length
                  : searchType === "artist"
                  ? artists.length
                  : albums.length
              }
              next={loadMoreResults}
              hasMore={
                searchType === "track"
                  ? hasMoreTracks
                  : searchType === "artist"
                  ? hasMoreArtists
                  : hasMoreAlbums
              }
              loader={
                <div className="flex flex-col items-center justify-center py-6 space-y-3 mt-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-primary"></div>
                  <p className="text-sm text-text-secondary animate-pulse">
                    결과 불러오는 중...
                  </p>
                </div>
              }
              endMessage={
                <div className="text-center text-sm py-6 mt-6 rounded-lg bg-card-bg/50 backdrop-blur-sm">
                  <p className="text-text-secondary font-medium">
                    모든 결과를 불러왔습니다
                  </p>
                </div>
              }
              className="space-y-6"
              scrollThreshold={0.9}
              scrollableTarget="root"
              style={{ overflow: "hidden" }}
              pullDownToRefresh={false}
            >
              {/* 아티스트 결과 */}
              {searchType === "artist" && artists.length > 0 && (
                <ArtistResults
                  artists={artists}
                  searchTerm={searchTerm}
                  showMoreLink={false}
                />
              )}

              {/* 트랙 결과 */}
              {searchType === "track" && tracks.length > 0 && (
                <TrackResults
                  tracks={tracks}
                  searchTerm={searchTerm}
                  showMoreLink={false}
                />
              )}

              {/* 앨범 결과 */}
              {searchType === "album" && albums.length > 0 && (
                <AlbumResults
                  albums={albums}
                  searchTerm={searchTerm}
                  showMoreLink={false}
                />
              )}
            </InfiniteScroll>
          )}
        </div>
      )}

      {/* 특정 유형 선택 시 결과가 없는 경우 메시지 표시 */}
      {!isSearching && searchTerm && !searchError && (
        <>
          {searchType === "artist" && artists.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-text-secondary">
                "{searchTerm}"에 대한 아티스트 검색 결과가 없습니다.
              </p>
              <p className="text-sm text-text-secondary mt-2">
                다른 키워드로 검색하거나 다른 카테고리를 선택해보세요.
              </p>
            </div>
          )}

          {searchType === "track" && tracks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-text-secondary">
                "{searchTerm}"에 대한 트랙 검색 결과가 없습니다.
              </p>
              <p className="text-sm text-text-secondary mt-2">
                다른 키워드로 검색하거나 다른 카테고리를 선택해보세요.
              </p>
            </div>
          )}

          {searchType === "album" && albums.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-text-secondary">
                "{searchTerm}"에 대한 앨범 검색 결과가 없습니다.
              </p>
              <p className="text-sm text-text-secondary mt-2">
                다른 키워드로 검색하거나 다른 카테고리를 선택해보세요.
              </p>
            </div>
          )}

          {searchType === "all" && !hasResults && (
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

      {/* 검색 결과가 없고 로딩 중이 아닐 때 */}
      {!isSearching && !hasResults && !searchTerm && (
        <div className="space-y-6">
          <PopularSearches
            popularSearches={popularSearches}
            onSearchClick={handlePopularSearchClick}
          />
          {/* <GenreBrowser onGenreClick={handleGenreClick} /> */}
        </div>
      )}
    </div>
  );
}
