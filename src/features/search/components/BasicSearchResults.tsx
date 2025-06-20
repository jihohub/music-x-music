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
    <div className="space-y-16">
      {/* 아티스트 결과 - 전체 탭에서는 첫 번째 1명만 크게 표시 */}
      {(shouldShowArtists || isLoading) && (
        <div key={`artist-results-${searchTerm}`}>
          <ArtistResults
            artists={allArtists.slice(0, 1)} // 첫 번째 1명만
            isLoading={isLoading}
            isFeatured={true} // 크게 표시하는 모드
          />
        </div>
      )}

      {/* 트랙 결과 */}
      {(shouldShowTracks || isLoading) && (
        <div key={`track-results-${searchTerm}`}>
          <TrackResults tracks={allTracks.slice(0, 4)} isLoading={isLoading} />
        </div>
      )}

      {/* 앨범 결과 */}
      {(shouldShowAlbums || isLoading) && (
        <div key={`album-results-${searchTerm}`}>
          <AlbumResults albums={allAlbums.slice(0, 4)} isLoading={isLoading} />
        </div>
      )}
    </div>
  );
}

export default BasicSearchResults;
