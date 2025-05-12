"use client";

import { useInfiniteNewReleases, useNewReleases } from "@/hooks/useNewReleases";
import { SpotifyAlbum } from "@/types/spotify";
import { useEffect, useState } from "react";
import { NewReleaseGrid } from "./components/NewReleaseGrid";

export function NewPage() {
  const [displayedAlbums, setDisplayedAlbums] = useState<SpotifyAlbum[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 기본 신규 릴리스 (첫 페이지)
  const { data: newReleases, isLoading, error } = useNewReleases(24);

  // 무한 스크롤을 위한 쿼리
  const {
    data: infiniteData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteNewReleases(24);

  // 모든 페이지의 데이터를 하나의 배열로 결합
  useEffect(() => {
    if (!infiniteData) return;

    const allAlbums = infiniteData.pages.flat();
    setDisplayedAlbums(allAlbums);
  }, [infiniteData]);

  // 스크롤 이벤트 리스너 추가
  useEffect(() => {
    const handleScroll = () => {
      if (isFetchingNextPage || !hasNextPage) return;

      // 스크롤이 페이지 하단에 가까워지면 다음 페이지 로드
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (documentHeight - scrollY - windowHeight < 200) {
        setIsLoadingMore(true);
        fetchNextPage().finally(() => setIsLoadingMore(false));
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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
        <NewReleaseGrid
          albums={
            displayedAlbums.length > 0 ? displayedAlbums : newReleases || []
          }
        />

        {/* 로딩 더 보기 */}
        {isLoadingMore && (
          <div className="text-center py-4">
            <div className="inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-text-secondary mt-2">
              더 불러오는 중...
            </p>
          </div>
        )}

        {/* 모든 항목 로드 완료 메시지 */}
        {!hasNextPage && displayedAlbums.length > 24 && (
          <div className="text-center py-4">
            <p className="text-sm text-text-secondary">
              모든 신규 앨범을 불러왔습니다
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
