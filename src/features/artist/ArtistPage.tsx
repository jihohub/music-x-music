"use client";

import { useHeader } from "@/providers/HeaderProvider";
import {
  AppleMusicAlbum,
  AppleMusicArtist,
  AppleMusicTrack,
} from "@/types/apple-music";
import { useEffect } from "react";
import { AlbumList } from "./components/AlbumList";
import { ArtistHeader } from "./components/ArtistHeader";
import { ArtistSkeleton } from "./components/ArtistSkeleton";
import { ErrorState } from "./components/ErrorState";
import { TopTracks } from "./components/TopTracks";

interface ArtistPageProps {
  artist: AppleMusicArtist;
  topTracks: AppleMusicTrack[];
  albums: AppleMusicAlbum[];
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
  const { setTitle } = useHeader();

  // 아티스트 정보가 로드되면 Header title 설정
  useEffect(() => {
    if (artist?.attributes?.name) {
      setTitle(artist.attributes.name);
    }

    // 컴포넌트 언마운트 시 기본 title로 복원
    return () => {
      setTitle("MUSIC X MUSIC");
    };
  }, [artist, setTitle]);

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
        <div className="space-y-8">
          <TopTracks tracks={topTracks} />
          <AlbumList albums={albums} />
        </div>
      </div>
    </div>
  );
}
