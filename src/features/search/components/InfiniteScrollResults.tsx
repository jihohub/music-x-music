"use client";

import {
  AppleMusicAlbum,
  AppleMusicArtist,
  AppleMusicTrack,
} from "@/types/apple-music";
import { FetchNextPageOptions } from "@tanstack/react-query";
import { useEffect } from "react";
import { SearchType } from "../hooks/useSearchPageLogic";
import AlbumResults from "./AlbumResults";
import ArtistResults from "./ArtistResults";
import TrackResults from "./TrackResults";

interface InfiniteScrollResultsProps {
  searchType: SearchType;
  searchTerm: string;
  allArtists: AppleMusicArtist[];
  allTracks: AppleMusicTrack[];
  allAlbums: AppleMusicAlbum[];
  isLoading?: boolean;
  fetchNextPage?: (options?: FetchNextPageOptions) => Promise<any>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
}

export function InfiniteScrollResults({
  searchType,
  searchTerm,
  allArtists,
  allTracks,
  allAlbums,
  isLoading = false,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: InfiniteScrollResultsProps) {
  // 무한스크롤 구현
  useEffect(() => {
    if (!fetchNextPage || !hasNextPage || isFetchingNextPage) return;

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 화면 최하단에서 100px 전에 도달하면 다음 페이지 로드
      if (scrollTop + windowHeight >= documentHeight - 100) {
        console.log("무한스크롤 트리거: fetchNextPage 호출");
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // 디버깅용 로그
  console.log("InfiniteScrollResults Debug:", {
    searchType,
    searchTerm,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: !!fetchNextPage,
    artistsCount: allArtists.length,
    tracksCount: allTracks.length,
    albumsCount: allAlbums.length,
  });

  return (
    <div className="space-y-8">
      {/* 아티스트 타입 검색 결과 */}
      {searchType === "artist" && (
        <div key={`artist-infinite-${searchTerm}`}>
          <ArtistResults artists={allArtists} isLoading={false} />
        </div>
      )}

      {/* 트랙 타입 검색 결과 */}
      {searchType === "track" && (
        <div key={`track-infinite-${searchTerm}`}>
          <TrackResults tracks={allTracks} isLoading={false} />
        </div>
      )}

      {/* 앨범 타입 검색 결과 */}
      {searchType === "album" && (
        <div key={`album-infinite-${searchTerm}`}>
          <AlbumResults albums={allAlbums} isLoading={false} />
        </div>
      )}
    </div>
  );
}

export default InfiniteScrollResults;
