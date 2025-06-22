"use client";

import { AlbumPage } from "@/features/album/AlbumPage";
import { useAlbumById } from "@/features/album/queries";

export function AlbumPageWrapper({ id }: { id: string }) {
  const { data: album, isLoading: albumLoading, error } = useAlbumById(id);

  // 앨범은 단일 쿼리이므로 기본 정보 로딩만 체크
  return (
    <AlbumPage
      album={album || null}
      isLoading={albumLoading}
      error={error?.message || null}
    />
  );
}
