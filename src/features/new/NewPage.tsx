"use client";

import { useInfiniteNewReleases, useNewReleases } from "@/hooks/useNewReleases";
import { useHeader } from "@/providers/HeaderProvider";
import { AppleMusicAlbum } from "@/types/apple-music";
import { useEffect, useState } from "react";
import { InfiniteNewReleases } from "./components/InfiniteNewReleases";
import { NewReleaseGrid } from "./components/NewReleaseGrid";

export function NewPage() {
  const [displayedAlbums, setDisplayedAlbums] = useState<AppleMusicAlbum[]>([]);
  const { setTitle } = useHeader();

  // 기본 신규 릴리스 (첫 페이지)
  const { data: newReleases, isLoading, error } = useNewReleases();

  // 무한 스크롤을 위한 쿼리
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNewReleases();

  // 헤더 타이틀 설정
  useEffect(() => {
    setTitle("인기 차트");
    return () => setTitle("MUSIC X MUSIC");
  }, [setTitle]);

  // 모든 페이지의 데이터를 하나의 배열로 결합
  useEffect(() => {
    if (!infiniteData) return;

    const allAlbums = infiniteData.pages.flat();
    setDisplayedAlbums(allAlbums);
  }, [infiniteData]);

  if (isLoading) {
    return (
      <div className="pt-8 md:pt-24 pb-24 md:pb-8 px-4 max-w-6xl mx-auto">
        <NewReleaseGrid albums={[]} isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-8 md:pt-24 pb-24 md:pb-8 px-4 max-w-6xl mx-auto">
        <NewReleaseGrid
          albums={[]}
          error="새 앨범 정보를 가져오는데 실패했습니다."
        />
      </div>
    );
  }

  return (
    <div className="pt-8 md:pt-24 pb-24 md:pb-8 px-4 max-w-6xl mx-auto">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* 콘텐츠 섹션 */}
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
    </div>
  );
}
