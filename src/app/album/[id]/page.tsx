"use client";

import Header from "@/components/Header";
import { AlbumPage } from "@/features/album/AlbumPage";
import { useAlbumById } from "@/features/album/queries";
import { useArtistById } from "@/features/artist/queries";
import React from "react";

export default function AlbumPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const albumId = resolvedParams.id;

  // React Query 훅을 사용하여 앨범 데이터 가져오기
  const { data: album, isLoading, error: albumError } = useAlbumById(albumId);

  // 앨범의 첫 번째 아티스트 정보 가져오기 - 가능한 경우
  const firstArtistId = album?.artists?.[0]?.id;

  // 첫 번째 아티스트 ID가 있으면 해당 정보도 가져오기
  useArtistById(firstArtistId || "");

  // 에러 메시지 처리
  const error = albumError ? "앨범 정보를 가져오는데 실패했습니다." : null;

  return (
    <>
      <Header title={isLoading ? "앨범 로딩 중..." : album?.name || "앨범"} />
      <AlbumPage album={album || null} isLoading={isLoading} error={error} />
    </>
  );
}
