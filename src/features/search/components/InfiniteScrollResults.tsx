"use client";

import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import { useCallback, useEffect, useRef, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { SearchType } from "../queries/searchSpotify";
import AlbumResults from "./AlbumResults";
import ArtistResults from "./ArtistResults";
import TrackResults from "./TrackResults";

interface InfiniteScrollResultsProps {
  searchType: SearchType;
  searchTerm: string;
  allArtists: SpotifyArtist[];
  allTracks: SpotifyTrack[];
  allAlbums: SpotifyAlbum[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
  isLoading?: boolean;
}

export function InfiniteScrollResults({
  searchType,
  searchTerm,
  allArtists,
  allTracks,
  allAlbums,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  isLoading = false,
}: InfiniteScrollResultsProps) {
  // 마지막 데이터 요청 시간 추적
  const lastFetchTimeRef = useRef<number>(0);
  // 스크롤 컨테이너 참조
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // 최초 로딩 여부 추적
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // 현재 검색 유형에 맞는 데이터 선택
  const currentItems =
    searchType === "artist"
      ? allArtists
      : searchType === "track"
      ? allTracks
      : allAlbums;

  // 데이터가 로드되면 isFirstLoad를 false로 설정
  useEffect(() => {
    if (currentItems.length > 0 && isFirstLoad) {
      setIsFirstLoad(false);
    }
  }, [currentItems.length, isFirstLoad]);

  // 검색어나 검색 타입이 변경되면 isFirstLoad를 true로 재설정
  useEffect(() => {
    setIsFirstLoad(true);
  }, [searchTerm, searchType]);

  // 스크롤 복원 비활성화 및 브라우저의 스크롤 조정 방지
  useEffect(() => {
    // CSS 속성 추가
    document.documentElement.style.setProperty("overflow-anchor", "none");

    return () => {
      // 컴포넌트 언마운트 시 원래대로 복원
      document.documentElement.style.removeProperty("overflow-anchor");
    };
  }, []);

  // 메모이제이션된 handleNext 함수
  const handleNext = useCallback(() => {
    // 연속 요청 방지 (시간 간격 줄임)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 500) return;

    lastFetchTimeRef.current = now;
    fetchNextPage();
  }, [currentItems.length, fetchNextPage]);

  // 수동 스크롤 감지 추가
  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 위치 확인
      if (!hasNextPage || isFetchingNextPage) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      // 페이지 하단에 근접했을 때 추가 데이터 로드
      if (scrollHeight - scrollTop - clientHeight < 300) {
        handleNext();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, handleNext]);

  if (searchType === "all") return null;

  // 데이터가 없는 경우에도 로딩 중일 때는 스켈레톤 표시 (최초 로딩 시에만)
  if (!currentItems.length && !isLoading) return null;

  // 스켈레톤을 표시할지 결정하는 조건: 최초 로딩 시에만 표시
  const shouldShowSkeleton = isLoading && isFirstLoad;

  return (
    <div className="min-h-[300px]">
      <InfiniteScroll
        dataLength={currentItems.length}
        next={handleNext}
        hasMore={!!hasNextPage}
        loader={null}
        endMessage={null}
        className="space-y-6"
        scrollThreshold={0.5}
        scrollableTarget="search-page-container"
        style={{ overflow: "visible" }}
      >
        {/* 결과 컴포넌트 - 즉시 렌더링 */}
        {searchType === "artist" && (
          <ArtistResults
            artists={allArtists}
            limit={4}
            isLoading={shouldShowSkeleton}
          />
        )}

        {searchType === "track" && (
          <TrackResults
            tracks={allTracks}
            limit={4}
            isLoading={shouldShowSkeleton}
          />
        )}

        {searchType === "album" && (
          <AlbumResults
            albums={allAlbums}
            limit={4}
            isLoading={shouldShowSkeleton}
          />
        )}
      </InfiniteScroll>
    </div>
  );
}

export default InfiniteScrollResults;
