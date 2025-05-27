"use client";

import Header from "@/components/Header";
import AlbumGrid from "@/features/trend/components/AlbumGrid";
import ArtistGrid from "@/features/trend/components/ArtistGrid";
import TrackGrid from "@/features/trend/components/TrackGrid";
import TrendTabSelector, {
  TrendTab,
} from "@/features/trend/components/TrendTabSelector";
import {
  useTrendAlbums,
  useTrendArtists,
  useTrendTracks,
} from "@/features/trend/queries";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";

// 탭 컨텐츠를 담당하는 별도 컴포넌트
const TrendContent = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: TrendTab;
  setActiveTab: (tab: TrendTab) => void;
}) => {
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

  // 현재 탭에 따른 로딩 상태
  const isLoading =
    (activeTab === "track" && isLoadingTracks) ||
    (activeTab === "artist" && isLoadingArtists) ||
    (activeTab === "album" && isLoadingAlbums) ||
    (activeTab === "all" &&
      (isLoadingTracks || isLoadingArtists || isLoadingAlbums));

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

  if (activeTab === "all") {
    return (
      <div className="space-y-16">
        {/* 아티스트 섹션 */}
        {artistData && (
          <ArtistGrid
            artists={artistData}
            limit={4}
            showPreview={true}
            onViewMore={() => handleViewMore("artist")}
          />
        )}

        {/* 트랙 섹션 */}
        {trackData && (
          <TrackGrid
            tracks={trackData}
            limit={4}
            showPreview={true}
            onViewMore={() => handleViewMore("track")}
          />
        )}

        {/* 앨범 섹션 */}
        {albumData && (
          <AlbumGrid
            albums={albumData}
            limit={4}
            showPreview={true}
            onViewMore={() => handleViewMore("album")}
          />
        )}
      </div>
    );
  }

  if (activeTab === "track" && !isLoading && trackData) {
    return (
      <div>
        <TrackGrid tracks={trackData} />
      </div>
    );
  }

  if (activeTab === "artist" && !isLoading && artistData) {
    return (
      <div>
        <ArtistGrid artists={artistData} />
      </div>
    );
  }

  if (activeTab === "album" && !isLoading && albumData) {
    return (
      <div>
        <AlbumGrid albums={albumData} />
      </div>
    );
  }

  return null;
};

export default function TrendPage() {
  const [activeTab, setActiveTab] = useState<TrendTab>("all");

  return (
    <>
      <Header title="트렌드" />
      <div className="py-6 space-y-6 px-4">
        {/* 탭 선택 - Suspense로 감싸서 useSearchParams 사용 */}
        <Suspense fallback={<div className="mb-4 h-10" />}>
          <TrendTabSelector activeTab={activeTab} onChange={setActiveTab} />
        </Suspense>

        {/* 콘텐츠 영역 */}
        <TrendContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </>
  );
}
