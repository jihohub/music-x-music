"use client";

import { TrendTab } from "@/features/trend/TrendPage";
import {
  AppleMusicAlbum,
  AppleMusicArtist,
  AppleMusicTrack,
} from "@/types/apple-music";
import AlbumGrid from "./AlbumGrid";
import ArtistGrid from "./ArtistGrid";
import TrackGrid from "./TrackGrid";

interface AllTrendResultsProps {
  artists: AppleMusicArtist[];
  tracks: AppleMusicTrack[];
  albums: AppleMusicAlbum[];
  isLoadingArtists: boolean;
  isLoadingTracks: boolean;
  isLoadingAlbums: boolean;
  onViewMore: (type: TrendTab) => void;
}

export function AllTrendResults({
  artists,
  tracks,
  albums,
  isLoadingArtists,
  isLoadingTracks,
  isLoadingAlbums,
  onViewMore,
}: AllTrendResultsProps) {
  return (
    <div className="space-y-8">
      {/* 아티스트 섹션 */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <ArtistGrid
          artists={artists}
          limit={4}
          showPreview
          onViewMore={() => onViewMore("artist")}
          isLoading={isLoadingArtists}
        />
      </div>

      {/* 트랙 섹션 */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <TrackGrid
          tracks={tracks}
          limit={4}
          showPreview
          onViewMore={() => onViewMore("track")}
          isLoading={isLoadingTracks}
        />
      </div>

      {/* 앨범 섹션 */}
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <AlbumGrid
          albums={albums}
          limit={4}
          showPreview
          onViewMore={() => onViewMore("album")}
          isLoading={isLoadingAlbums}
        />
      </div>
    </div>
  );
}

export default AllTrendResults;
