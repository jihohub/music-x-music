"use client";

import { SpotifyAlbum } from "@/types/spotify";
import { AlbumHeader } from "./components/AlbumHeader";
import { AlbumInfo } from "./components/AlbumInfo";
import { AlbumSkeleton } from "./components/AlbumSkeleton";
import { ErrorState } from "./components/ErrorState";
import { TrackList } from "./components/TrackList";

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
