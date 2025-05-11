"use client";

import FeaturedArtists from "./components/FeaturedArtists";
import { HeroSection } from "./components/HeroSection";
import RecommendedTracks from "./components/RecommendedTracks";

export function MainPage() {
  return (
    <div className="py-6 space-y-8">
      <HeroSection />
      <FeaturedArtists />
      <RecommendedTracks />
      {/* <GenreSection /> */}
    </div>
  );
}
