"use client";

import { AlbumPage } from "@/features/album/AlbumPage";
import { useAlbumById } from "@/features/album/queries";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // React Query 훅을 사용할 수 없으므로 별도 컴포넌트로 분리
  return <AlbumPageWrapper id={id} />;
}

function AlbumPageWrapper({ id }: { id: string }) {
  const { data: album, isLoading, error } = useAlbumById(id);

  return (
    <AlbumPage
      album={album || null}
      isLoading={isLoading}
      error={error?.message || null}
    />
  );
}
