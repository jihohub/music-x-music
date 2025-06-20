"use client";

import { AlbumPage } from "@/features/album/AlbumPage";
import { useAlbumById } from "@/features/album/queries";

export function AlbumPageWrapper({ id }: { id: string }) {
  const { data: album, isLoading, error } = useAlbumById(id);

  return (
    <AlbumPage
      album={album || null}
      isLoading={isLoading}
      error={error?.message || null}
    />
  );
}
