"use client";

import {
  AppleMusicAlbum,
  AppleMusicArtist,
  AppleMusicTrack,
} from "@/types/apple-music";
import AlbumResults from "./AlbumResults";
import ArtistResults from "./ArtistResults";
import TrackResults from "./TrackResults";

interface BasicSearchResultsProps {
  searchTerm: string;
  allArtists: AppleMusicArtist[];
  allTracks: AppleMusicTrack[];
  allAlbums: AppleMusicAlbum[];
  shouldShowArtists: boolean;
  shouldShowTracks: boolean;
  shouldShowAlbums: boolean;
  handleTypeChange: (type: any) => void;
  isLoading?: boolean;
}

export function BasicSearchResults({
  searchTerm,
  allArtists,
  allTracks,
  allAlbums,
  shouldShowArtists,
  shouldShowTracks,
  shouldShowAlbums,
  handleTypeChange,
  isLoading = false,
}: BasicSearchResultsProps) {
  return (
    <div className="space-y-8">
      {/* 아티스트 결과 - 전체 탭에서는 첫 번째 1명만 크게 표시 */}
      {(shouldShowArtists || isLoading) && (
        <ArtistResults
          key={`artist-results-${searchTerm}`}
          artists={allArtists.slice(0, 1)} // 첫 번째 1명만
          isLoading={isLoading}
          isFeatured={true} // 크게 표시하는 모드
        />
      )}

      {/* 트랙 결과 */}
      {(shouldShowTracks || isLoading) && (
        <TrackResults
          key={`track-results-${searchTerm}`}
          tracks={allTracks.slice(0, 4)}
          isLoading={isLoading}
          context="basic"
          isFeatured={true}
        />
      )}

      {/* 앨범 결과 */}
      {(shouldShowAlbums || isLoading) && (
        <AlbumResults
          key={`album-results-${searchTerm}`}
          albums={allAlbums.slice(0, 4)}
          isLoading={isLoading}
          context="basic"
          isFeatured={true}
        />
      )}
    </div>
  );
}

export default BasicSearchResults;
