"use client";

import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import { useEffect, useRef } from "react";
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

  // 스크롤 이벤트 핸들러
  const handleNext = () => {
    // 연속 요청 방지
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 800) return;

    lastFetchTimeRef.current = now;
    fetchNextPage();
  };

  if (searchType === "all") return null;

  // 데이터가 없는 경우 렌더링하지 않음
  if (!currentItems.length) return null;

  return (
    <div className="min-h-[300px]">
      <InfiniteScroll
        dataLength={currentItems.length}
        next={handleNext}
        hasMore={!!hasNextPage && !isFetchingNextPage}
        loader={null}
        endMessage={null}
        className="space-y-6"
        scrollThreshold={0.85}
        style={{ overflow: "visible" }}
      >
        {/* 결과 컴포넌트 - 즉시 렌더링 */}
        {searchType === "artist" && (
          <ArtistResults
            artists={allArtists}
            searchTerm={searchTerm}
            showMoreLink={false}
          />
        )}

        {searchType === "track" && (
          <TrackResults
            tracks={allTracks}
            searchTerm={searchTerm}
            showMoreLink={false}
          />
        )}

        {searchType === "album" && (
          <AlbumResults
            albums={allAlbums}
            searchTerm={searchTerm}
            showMoreLink={false}
          />
        )}
      </InfiniteScroll>
    </div>
  );
}

export default InfiniteScrollResults;
