"use client";

import { useInfiniteNewReleases, useNewReleases } from "@/hooks/useNewReleases";
import { SpotifyAlbum } from "@/types/spotify";
import { useEffect, useState } from "react";
import { InfiniteNewReleases } from "./components/InfiniteNewReleases";
import { NewReleaseGrid } from "./components/NewReleaseGrid";

export function NewPage() {
  const [displayedAlbums, setDisplayedAlbums] = useState<SpotifyAlbum[]>([]);

  // 기본 신규 릴리스 (첫 페이지)
  const { data: newReleases, isLoading, error } = useNewReleases();

  // 무한 스크롤을 위한 쿼리
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNewReleases();

  // 모든 페이지의 데이터를 하나의 배열로 결합
  useEffect(() => {
    if (!infiniteData) return;

    const allAlbums = infiniteData.pages.flat();
    setDisplayedAlbums(allAlbums);
  }, [infiniteData]);

  if (isLoading) {
    return (
      <div className="py-6 px-4">
        <NewReleaseGrid albums={[]} isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-4">
        <NewReleaseGrid
          albums={[]}
          error="새 앨범 정보를 가져오는데 실패했습니다."
        />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 space-y-6">
      <div className="space-y-6">
        {displayedAlbums.length > 0 ? (
          <InfiniteNewReleases
            albums={displayedAlbums}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        ) : (
          newReleases && <NewReleaseGrid albums={newReleases} />
        )}
      </div>
    </div>
  );
}
