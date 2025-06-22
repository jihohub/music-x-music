"use client";

import { AppleMusicAlbum } from "@/types/apple-music";
import { useCallback, useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { NewReleaseGrid } from "./NewReleaseGrid";

interface InfiniteNewReleasesProps {
  albums: AppleMusicAlbum[];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function InfiniteNewReleases({
  albums,
  hasNextPage = false,
  isFetchingNextPage,
  fetchNextPage,
}: InfiniteNewReleasesProps) {
  // 마지막 데이터 요청 시간 추적
  const lastFetchTimeRef = useRef<number>(0);

  // 스크롤 복원 비활성화 및 브라우저의 스크롤 조정 방지
  useEffect(() => {
    // CSS 속성 추가
    document.documentElement.style.setProperty("overflow-anchor", "none");

    return () => {
      // 컴포넌트 언마운트 시 원래대로 복원
      document.documentElement.style.removeProperty("overflow-anchor");
    };
  }, []);

  // 메모이제이션된 handleNext 함수
  const handleNext = useCallback(() => {
    // 연속 요청 방지 (시간 간격 줄임)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 500) return;

    lastFetchTimeRef.current = now;
    fetchNextPage();
  }, [albums.length, fetchNextPage]);

  // 수동 스크롤 감지 추가
  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 위치 확인
      if (!hasNextPage || isFetchingNextPage) return;

      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;

      // 페이지 하단에 근접했을 때 추가 데이터 로드 (300px 전에 로드 시작)
      if (scrollHeight - scrollTop - clientHeight < 300) {
        handleNext();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasNextPage, isFetchingNextPage, handleNext]);

  // 데이터가 없는 경우 렌더링하지 않음
  if (!albums.length) return null;

  return (
    <div className="min-h-[300px]">
      <InfiniteScroll
        dataLength={albums.length}
        next={handleNext}
        hasMore={!!hasNextPage}
        loader={null}
        className="space-y-6"
        scrollThreshold={0.9}
        style={{ overflow: "visible" }}
      >
        <NewReleaseGrid albums={albums} />
      </InfiniteScroll>
    </div>
  );
}
