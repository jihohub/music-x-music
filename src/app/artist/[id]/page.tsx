"use client";

import { ArtistPage } from "@/features/artist/ArtistPage";
import {
  useArtistAlbums,
  useArtistById,
  useArtistTopTracks,
} from "@/features/artist/queries";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // React Query 훅을 사용할 수 없으므로 별도 컴포넌트로 분리
  return <ArtistPageWrapper id={id} />;
}

function ArtistPageWrapper({ id }: { id: string }) {
  const {
    data: artist,
    isLoading: artistLoading,
    error: artistError,
  } = useArtistById(id);
  const {
    data: topTracks,
    isLoading: tracksLoading,
    error: tracksError,
  } = useArtistTopTracks(id);
  const {
    data: albums,
    isLoading: albumsLoading,
    error: albumsError,
  } = useArtistAlbums(id);

  const isLoading = artistLoading || tracksLoading || albumsLoading;
  const error = artistError || tracksError || albumsError;

  // artist가 없고 로딩 중이 아닌 경우 에러로 처리
  if (!artist && !isLoading) {
    return (
      <ArtistPage
        artist={undefined as any} // ErrorState에서 처리됨
        topTracks={[]}
        albums={[]}
        isLoading={false}
        error={error?.message || "아티스트를 찾을 수 없습니다"}
      />
    );
  }

  // artist가 있는 경우 정상 렌더링
  if (artist) {
    return (
      <ArtistPage
        artist={artist}
        topTracks={topTracks || []}
        albums={albums || []}
        isLoading={isLoading}
        error={error?.message || null}
      />
    );
  }

  // 로딩 중인 경우
  return (
    <ArtistPage
      artist={undefined as any} // ArtistSkeleton에서 처리됨
      topTracks={[]}
      albums={[]}
      isLoading={true}
      error={null}
    />
  );
}
