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
    <main className="min-h-screen pt-16">
      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-12">
        <HeroSection />
        <FeaturedArtists />
        <RecommendedTracks tracks={tracks} isLoading={tracksLoading} />
        <GenreSection />
      </div>
    </main>
  );
}
