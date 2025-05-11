"use client";

import { SpotifyArtist, SpotifyTrack } from "@/lib/spotify-api";
import { ErrorState } from "./ErrorState";
import { ArtistInfo } from "./sections/ArtistInfo";
import { TrackHeader } from "./sections/TrackHeader";
import { TrackInfo } from "./sections/TrackInfo";
import { TrackSkeleton } from "./skeletons/TrackSkeleton";

interface TrackPageProps {
  track: SpotifyTrack | null;
  artists: SpotifyArtist[];
  isLoading?: boolean;
  error?: string | null;
}

export function TrackPage({
  track,
  artists,
  isLoading = false,
  error = null,
}: TrackPageProps) {
  if (isLoading) {
    return <TrackSkeleton />;
  }

  if (error || !track) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="py-6">
      <TrackHeader track={track} />

      {/* 컨텐츠 영역 */}
      <div className="container px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 컬럼: 아티스트 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <ArtistInfo artists={artists} />
          </div>

          {/* 오른쪽 컬럼: 트랙 정보 */}
          <div className="space-y-6">
            <TrackInfo track={track} />
          </div>
        </div>
      </div>
    </div>
  );
}
