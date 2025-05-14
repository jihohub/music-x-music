"use client";

import { SpotifyBadge } from "@/components/SpotifyBadge";
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import { SearchType } from "../queries/searchSpotify";
import AlbumResults from "./AlbumResults";
import ArtistResults from "./ArtistResults";
import TrackResults from "./TrackResults";

interface ScrollResultsProps {
  searchType: SearchType;
  searchTerm: string;
  allArtists: SpotifyArtist[];
  allTracks: SpotifyTrack[];
  allAlbums: SpotifyAlbum[];
}

export function ScrollResults({
  searchType,
  searchTerm,
  allArtists,
  allTracks,
  allAlbums,
}: ScrollResultsProps) {
  if (searchType === "all") return null;

  // 데이터가 없는 경우 렌더링하지 않음
  const currentItems =
    searchType === "artist"
      ? allArtists
      : searchType === "track"
      ? allTracks
      : allAlbums;

  if (!currentItems.length) return null;

  // 스포티파이 검색 URL 생성
  const spotifySearchUrl = `https://open.spotify.com/search/${encodeURIComponent(
    searchTerm
  )}`;

  return (
    <div className="min-h-[300px] space-y-6">
      {/* 결과 컴포넌트 - 최대 20개만 표시 */}
      {searchType === "artist" && (
        <ArtistResults artists={allArtists.slice(0, 20)} showMoreLink={false} />
      )}

      {searchType === "track" && (
        <TrackResults tracks={allTracks.slice(0, 20)} showMoreLink={false} />
      )}

      {searchType === "album" && (
        <AlbumResults albums={allAlbums.slice(0, 20)} showMoreLink={false} />
      )}

      {/* 스포티파이로 연결되는 링크 */}
      <div className="flex justify-center mt-8">
        <SpotifyBadge href={spotifySearchUrl} />
      </div>
    </div>
  );
}

export default ScrollResults;
