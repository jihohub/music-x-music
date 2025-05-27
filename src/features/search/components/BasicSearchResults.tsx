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
}: BasicSearchResultsProps) {
  return (
    <div className="space-y-16">
      {/* 아티스트 결과 */}
      {shouldShowArtists && allArtists.length > 0 && (
        <div key={`artist-results-${searchTerm}`}>
          <ArtistResults
            artists={allArtists.slice(0, 4)}
            showMoreLink={true}
            onShowMore={() => handleTypeChange("artist")}
          />
        </div>
      )}

      {/* 트랙 결과 */}
      {shouldShowTracks && allTracks.length > 0 && (
        <div key={`track-results-${searchTerm}`}>
          <TrackResults
            tracks={allTracks.slice(0, 4)}
            showMoreLink={true}
            onShowMore={() => handleTypeChange("track")}
          />
        </div>
      )}

      {/* 앨범 결과 */}
      {shouldShowAlbums && allAlbums.length > 0 && (
        <div key={`album-results-${searchTerm}`}>
          <AlbumResults
            albums={allAlbums.slice(0, 4)}
            showMoreLink={true}
            onShowMore={() => handleTypeChange("album")}
          />
        </div>
      )}
    </div>
  );
}

export default BasicSearchResults;
