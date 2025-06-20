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

interface SingleTrendResultsProps {
  trendType: TrendTab;
  artists: AppleMusicArtist[];
  tracks: AppleMusicTrack[];
  albums: AppleMusicAlbum[];
  isLoadingArtists: boolean;
  isLoadingTracks: boolean;
  isLoadingAlbums: boolean;
}

export function SingleTrendResults({
  trendType,
  artists,
  tracks,
  albums,
  isLoadingArtists,
  isLoadingTracks,
  isLoadingAlbums,
}: SingleTrendResultsProps) {
  // all 타입은 이 컴포넌트에서 처리하지 않음
  if (trendType === "all") {
    return null;
  }

  return (
    <div>
      {trendType === "artist" && (
        <ArtistGrid artists={artists} isLoading={isLoadingArtists} />
      )}

      {trendType === "track" && (
        <TrackGrid tracks={tracks} isLoading={isLoadingTracks} />
      )}

      {trendType === "album" && (
        <AlbumGrid albums={albums} isLoading={isLoadingAlbums} />
      )}
    </div>
  );
}

export default SingleTrendResults;
