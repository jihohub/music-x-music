"use client";

import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import AlbumResults from "./AlbumResults";
import ArtistResults from "./ArtistResults";
import TrackResults from "./TrackResults";

interface BasicSearchResultsProps {
  searchTerm: string;
  allArtists: SpotifyArtist[];
  allTracks: SpotifyTrack[];
  allAlbums: SpotifyAlbum[];
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
      {/* 아티스트 결과 */}
      {(shouldShowArtists || isLoading) && (
        <div key={`artist-results-${searchTerm}`}>
          <ArtistResults
            artists={allArtists.slice(0, 4)}
            showMoreLink
            onShowMore={() => handleTypeChange("artist")}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* 트랙 결과 */}
      {(shouldShowTracks || isLoading) && (
        <div key={`track-results-${searchTerm}`}>
          <TrackResults
            tracks={allTracks.slice(0, 4)}
            showMoreLink
            onShowMore={() => handleTypeChange("track")}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* 앨범 결과 */}
      {(shouldShowAlbums || isLoading) && (
        <div key={`album-results-${searchTerm}`}>
          <AlbumResults
            albums={allAlbums.slice(0, 4)}
            showMoreLink
            onShowMore={() => handleTypeChange("album")}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}

export default BasicSearchResults;
