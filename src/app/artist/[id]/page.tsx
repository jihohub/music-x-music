"use client";

import Header from "@/components/Header";
import { ArtistPage } from "@/features/artist/ArtistPage";
import {
  useArtistAlbums,
  useArtistById,
  useArtistTopTracks,
} from "@/features/artist/queries";
import React from "react";

export default function ArtistPageContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const artistId = resolvedParams.id;

  // React Query 훅을 사용하여 데이터 가져오기
  const {
    data: artist,
    isLoading: isArtistLoading,
    error: artistError,
  } = useArtistById(artistId);

  const { data: topTracks = [], isLoading: isTracksLoading } =
    useArtistTopTracks(artistId);

  const { data: albums = [], isLoading: isAlbumsLoading } =
    useArtistAlbums(artistId);

  // 로딩 및 에러 상태 통합
  const isLoading = isArtistLoading || isTracksLoading || isAlbumsLoading;
  const error = artistError ? "아티스트 정보를 가져오는데 실패했습니다." : null;

  return (
    <>
      <Header
        title={isLoading ? "아티스트 로딩 중..." : artist?.name || "아티스트"}
      />
      {artist && (
        <ArtistPage
          artist={artist}
          topTracks={topTracks}
          albums={albums}
          isLoading={isLoading}
          error={error}
        />
      )}
    </>
  );
}
