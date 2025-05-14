"use client";

import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import { motion } from "framer-motion";
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
        <motion.div
          key={`artist-results-${searchTerm}`}
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ArtistResults
            artists={allArtists.slice(0, 4)}
            showMoreLink={true}
            onShowMore={() => handleTypeChange("artist")}
          />
        </motion.div>
      )}

      {/* 트랙 결과 */}
      {shouldShowTracks && allTracks.length > 0 && (
        <motion.div
          key={`track-results-${searchTerm}`}
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <TrackResults
            tracks={allTracks.slice(0, 4)}
            showMoreLink={true}
            onShowMore={() => handleTypeChange("track")}
          />
        </motion.div>
      )}

      {/* 앨범 결과 */}
      {shouldShowAlbums && allAlbums.length > 0 && (
        <motion.div
          key={`album-results-${searchTerm}`}
          initial={{ opacity: 0.8, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <AlbumResults
            albums={allAlbums.slice(0, 4)}
            showMoreLink={true}
            onShowMore={() => handleTypeChange("album")}
          />
        </motion.div>
      )}
    </div>
  );
}

export default BasicSearchResults;
