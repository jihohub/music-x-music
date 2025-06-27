"use client";

import { useThemeStore } from "@/stores/themeStore";
import { AppleMusicArtist, AppleMusicTrack } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";
import FeaturedArtists from "./components/FeaturedArtists";
import { GenreSection } from "./components/GenreSection";
import { HeroSection } from "./components/HeroSection";
import RecommendedTracks from "./components/RecommendedTracks";
import { getMainPageData } from "./queries/getMainPageData";

export default function MainPage() {
  const { getDisplayColors } = useThemeStore();
  const { textColor } = getDisplayColors();

  // 통합 쿼리로 한 번에 데이터 로딩
  const { data, isLoading, error } = useQuery({
    queryKey: ["main-page-data"],
    queryFn: getMainPageData,
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간
  });

  const artists = data?.artists || ([] as AppleMusicArtist[]);
  const tracks = data?.tracks || ([] as AppleMusicTrack[]);

  // 에러가 있을 경우 에러 메시지 표시
  if (error) {
    return (
      <main className="min-h-screen pt-20 pb-24 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg">
            <div className="text-center py-20">
              <p style={{ color: textColor }}>
                데이터를 불러오는 중 오류가 발생했습니다.
              </p>
              <p
                className="text-sm mt-2 opacity-70"
                style={{ color: textColor }}
              >
                {error.toString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 히어로 섹션 */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg">
          <HeroSection />
        </div>

        {/* 추천 트랙 */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <RecommendedTracks tracks={tracks} isLoading={isLoading} />
        </div>

        {/* 인기 아티스트 */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <FeaturedArtists />
        </div>

        {/* 장르 섹션 */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <GenreSection />
        </div>
      </div>
    </main>
  );
}
