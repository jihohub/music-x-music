"use client";

import { SpotifyAlbum } from "@/lib/spotify-api";
import { ErrorState } from "./ErrorState";
import { AlbumHeader } from "./sections/AlbumHeader";
import { AlbumInfo } from "./sections/AlbumInfo";
import { TrackList } from "./sections/TrackList";
import { AlbumSkeleton } from "./skeletons/AlbumSkeleton";

interface AlbumPageProps {
  album: SpotifyAlbum | null;
  isLoading?: boolean;
  error?: string | null;
}

export function AlbumPage({
  album,
  isLoading = false,
  error = null,
}: AlbumPageProps) {
  if (isLoading) {
    return <AlbumSkeleton />;
  }

  if (error || !album) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="py-6">
      <AlbumHeader album={album} />

      {/* 컨텐츠 영역 */}
      <div className="container px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 및 중앙 컬럼 */}
          <div className="lg:col-span-2 space-y-6">
            <TrackList album={album} />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            <AlbumInfo album={album} />
          </div>
        </div>
      </div>
    </div>
  );
}
