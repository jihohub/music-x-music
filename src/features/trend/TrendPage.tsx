"use client";

import AllTrendResults from "@/features/trend/components/AllTrendResults";
import SingleTrendResults from "@/features/trend/components/SingleTrendResults";
import TrendHeader from "@/features/trend/components/TrendHeader";
import {
  useTrendAlbums,
  useTrendArtists,
  useTrendTracks,
} from "@/features/trend/queries";
import { useHeader } from "@/providers/HeaderProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

// 트렌드 탭 타입 정의
export type TrendTab = "all" | "track" | "artist" | "album";

// 실제 트렌드 데이터와 UI를 처리하는 컴포넌트
const TrendContent = ({ activeTab }: { activeTab: TrendTab }) => {
  const router = useRouter();

  // API 데이터 가져오기
  const {
    data: trackData = [],
    isLoading: isLoadingTracks,
    error: trackError,
  } = useTrendTracks();

  const {
    data: artistData = [],
    isLoading: isLoadingArtists,
    error: artistError,
  } = useTrendArtists();

  const {
    data: albumData = [],
    isLoading: isLoadingAlbums,
    error: albumError,
  } = useTrendAlbums();

  // 현재 탭에 따른 에러 상태
  const error =
    (activeTab === "track" && trackError) ||
    (activeTab === "artist" && artistError) ||
    (activeTab === "album" && albumError) ||
    (activeTab === "all" && (trackError || artistError || albumError));

  // 더 보기 버튼 클릭 핸들러 - URL 파라미터 설정
  const handleViewMore = (type: TrendTab) => {
    router.push(`/trend?type=${type}`);
  };

  if (error) {
    return (
      <div className="text-center py-20 text-error">
        <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
        <p className="text-sm mt-2">{error.toString()}</p>
      </div>
    );
  }

  return (
    <>
      {/* 전체 탭일 때는 AllTrendResults 컴포넌트 사용 */}
      {activeTab === "all" && (
        <AllTrendResults
          artists={artistData}
          tracks={trackData}
          albums={albumData}
          isLoadingArtists={isLoadingArtists}
          isLoadingTracks={isLoadingTracks}
          isLoadingAlbums={isLoadingAlbums}
          onViewMore={handleViewMore}
        />
      )}

      {/* 개별 탭일 때는 SingleTrendResults 컴포넌트 사용 */}
      {activeTab !== "all" && (
        <SingleTrendResults
          trendType={activeTab}
          artists={artistData}
          tracks={trackData}
          albums={albumData}
          isLoadingArtists={isLoadingArtists}
          isLoadingTracks={isLoadingTracks}
          isLoadingAlbums={isLoadingAlbums}
        />
      )}
    </>
  );
};

// URL 파라미터에서 유효한 탭 타입을 추출하는 함수
const getInitialTabFromUrl = (params: URLSearchParams | null): TrendTab => {
  const typeParam = params?.get("type") as TrendTab | null;
  if (typeParam && ["track", "artist", "album"].includes(typeParam)) {
    return typeParam;
  }
  return "all";
};

// useSearchParams를 사용하는 부분을 별도 컴포넌트로 분리
const TrendPageContent = () => {
  const searchParams = useSearchParams();
  const { setTitle } = useHeader();

  // 초기 상태를 URL에서 바로 가져옴
  const [activeTab, setActiveTab] = useState<TrendTab>(() =>
    getInitialTabFromUrl(searchParams)
  );

  // URL 변경 시 탭 상태 업데이트
  useEffect(() => {
    const newTab = getInitialTabFromUrl(searchParams);
    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  }, [searchParams, activeTab]);

  // 헤더 타이틀 설정
  useEffect(() => {
    setTitle("트렌드");
    return () => setTitle("MUSIC X MUSIC");
  }, [setTitle]);

  return (
    <>
      <div className="pt-20 md:pt-40 pb-24 md:pb-8 space-y-6 px-4 max-w-4xl mx-auto">
        {/* 트렌드 헤더 컴포넌트 */}
        <TrendHeader activeTab={activeTab} />

        {/* 콘텐츠 영역 */}
        <TrendContent activeTab={activeTab} />
      </div>
    </>
  );
};

// 메인 컴포넌트에서는 Suspense로 감싸기
export function TrendPage() {
  return (
    <Suspense
      fallback={
        <div className="py-6 space-y-6 px-4 max-w-4xl mx-auto">
          <div className="text-center py-10">로딩 중...</div>
        </div>
      }
    >
      <TrendPageContent />
    </Suspense>
  );
}

export default TrendPage;
