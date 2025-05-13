"use client";

import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import { useCallback, useEffect, useRef } from "react";
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
}: InfiniteScrollResultsProps) {
  // 마지막 데이터 요청 시간 추적
  const lastFetchTimeRef = useRef<number>(0);
  // 스크롤 컨테이너 참조
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 현재 검색 유형에 맞는 데이터 선택
  const currentItems =
    searchType === "artist"
      ? allArtists
      : searchType === "track"
      ? allTracks
      : allAlbums;

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

  // 데이터가 없는 경우 렌더링하지 않음
  if (!currentItems.length) return null;

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
        style={{ overflow: "visible" }}
      >
        {/* 결과 컴포넌트 - 즉시 렌더링 */}
        {searchType === "artist" && (
          <ArtistResults artists={allArtists} showMoreLink={false} />
        )}

        {searchType === "track" && (
          <TrackResults tracks={allTracks} showMoreLink={false} />
        )}

        {searchType === "album" && (
          <AlbumResults albums={allAlbums} showMoreLink={false} />
        )}
      </InfiniteScroll>
    </div>
  );
}

export default InfiniteScrollResults;
