"use client";

import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/lib/spotify-api";
import { AlbumList } from "./components/AlbumList";
import { ArtistHeader } from "./components/ArtistHeader";
import { ArtistInfo } from "./components/ArtistInfo";
import { ArtistSkeleton } from "./components/ArtistSkeleton";
import { ErrorState } from "./components/ErrorState";
import { TopTracks } from "./components/TopTracks";

interface ArtistPageProps {
  artist: SpotifyArtist;
  topTracks: SpotifyTrack[];
  albums: SpotifyAlbum[];
  isLoading?: boolean;
  error?: string | null;
}

export function ArtistPage({
  artist,
  topTracks,
  albums,
  isLoading = false,
  error = null,
}: ArtistPageProps) {
  if (isLoading) {
    return <ArtistSkeleton />;
  }

  if (error || !artist) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="py-6">
      <ArtistHeader artist={artist} />

      {/* 컨텐츠 영역 */}
      <div className="container px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 및 중앙 컬럼 */}
          <div className="lg:col-span-2 space-y-6">
            <TopTracks tracks={topTracks} />
            <AlbumList albums={albums} />
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            <ArtistInfo artist={artist} />
          </div>
        </div>
      </div>
    </div>
  );
}
