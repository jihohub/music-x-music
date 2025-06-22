"use client";

import {
  getFeaturedArtists,
  getRecommendedTracks,
} from "@/features/main/queries";
import { AppleMusicArtist, AppleMusicTrack } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";
import FeaturedArtists from "./components/FeaturedArtists";
import { GenreSection } from "./components/GenreSection";
import { HeroSection } from "./components/HeroSection";
import RecommendedTracks from "./components/RecommendedTracks";

export default function MainPage() {
  const {
    data: artists = [] as AppleMusicArtist[],
    isLoading: artistsLoading,
    error: artistsError,
  } = useQuery({
    queryKey: ["featured-artists"],
    queryFn: getFeaturedArtists,
    staleTime: 1000 * 60 * 30, // 30분
  });

  const {
    data: tracks = [] as AppleMusicTrack[],
    isLoading: tracksLoading,
    error: tracksError,
  } = useQuery({
    queryKey: ["recommended-tracks"],
    queryFn: getRecommendedTracks,
    staleTime: 1000 * 60 * 30, // 30분
  });

  return (
    <main className="min-h-screen pt-20 pb-24 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 히어로 섹션 */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-lg">
          <HeroSection />
        </div>

        {/* 추천 트랙 */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg">
          <RecommendedTracks tracks={tracks} isLoading={tracksLoading} />
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
