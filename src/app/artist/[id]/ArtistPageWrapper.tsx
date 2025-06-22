"use client";

import { ArtistPage } from "@/features/artist/ArtistPage";
import {
  useArtistAlbums,
  useArtistById,
  useArtistTopTracks,
} from "@/features/artist/queries";

export function ArtistPageWrapper({ id }: { id: string }) {
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

  // 아티스트 기본 정보만 로딩 중인지 확인 (색상 적용을 위해)
  const isArtistInfoLoading = artistLoading;
  // 전체 데이터 로딩 상태 (다른 데이터들이 로딩 중이어도 기본 정보는 표시)
  const isFullLoading = tracksLoading || albumsLoading;
  const error = artistError || tracksError || albumsError;

  // artist가 없고 아티스트 정보 로딩 중이 아닌 경우 에러로 처리
  if (!artist && !isArtistInfoLoading) {
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

  // 모든 경우에 artist 데이터를 전달 (다른 데이터 로딩 중이어도 기본 정보는 표시)
  return (
    <ArtistPage
      artist={artist}
      topTracks={topTracks || []}
      albums={albums || []}
      isLoading={isFullLoading} // 다른 데이터들의 로딩 상태만 전달
      error={error?.message || null}
    />
  );
}
