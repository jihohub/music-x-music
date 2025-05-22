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
import { motion } from "framer-motion";
import { Suspense, useState } from "react";

export default function TrendPage() {
  const [activeTab, setActiveTab] = useState<TrendTab>("all");

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
    (activeTab === "tracks" && isLoadingTracks) ||
    (activeTab === "artists" && isLoadingArtists) ||
    (activeTab === "albums" && isLoadingAlbums) ||
    (activeTab === "all" &&
      (isLoadingTracks || isLoadingArtists || isLoadingAlbums));

  // 현재 탭에 따른 에러 상태
  const error =
    (activeTab === "tracks" && trackError) ||
    (activeTab === "artists" && artistError) ||
    (activeTab === "albums" && albumError) ||
    (activeTab === "all" && (trackError || artistError || albumError));

  return (
    <>
      <Header title="트렌드" />
      <div className="py-6 space-y-6 px-4">
        {/* 탭 선택 - Suspense로 감싸서 useSearchParams 사용 */}
        <Suspense fallback={<div className="mb-4 h-10" />}>
          <TrendTabSelector activeTab={activeTab} onChange={setActiveTab} />
        </Suspense>

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-20 text-error">
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <p className="text-sm mt-2">{error.toString()}</p>
          </div>
        )}

        {/* 전체 탭 - 각 카테고리별 미리보기 */}
        {activeTab === "all" && !error && (
          <motion.div
            className="space-y-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 아티스트 섹션 */}
            {artistData && (
              <ArtistGrid
                artists={artistData}
                limit={4}
                showPreview={true}
                onViewMore={() => setActiveTab("artists")}
              />
            )}

            {/* 트랙 섹션 */}
            {trackData && (
              <TrackGrid
                tracks={trackData}
                limit={4}
                showPreview={true}
                onViewMore={() => setActiveTab("tracks")}
              />
            )}

            {/* 앨범 섹션 */}
            {albumData && (
              <AlbumGrid
                albums={albumData}
                limit={4}
                showPreview={true}
                onViewMore={() => setActiveTab("albums")}
              />
            )}
          </motion.div>
        )}

        {/* 트랙 트렌드 */}
        {activeTab === "tracks" && !isLoading && !error && trackData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TrackGrid tracks={trackData} />
          </motion.div>
        )}

        {/* 아티스트 트렌드 */}
        {activeTab === "artists" && !isLoading && !error && artistData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArtistGrid artists={artistData} />
          </motion.div>
        )}

        {/* 앨범 트렌드 */}
        {activeTab === "albums" && !isLoading && !error && albumData && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlbumGrid albums={albumData} />
          </motion.div>
        )}
      </div>
    </>
  );
}
