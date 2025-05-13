"use client";

import FeaturedArtists from "./components/FeaturedArtists";
import { HeroSection } from "./components/HeroSection";
import RecommendedTracks from "./components/RecommendedTracks";

export function MainPage() {
  return (
    <div className="py-6 space-y-8">
      <HeroSection />
      <div className="container px-4 mt-12 space-y-6">
        <FeaturedArtists />
        <RecommendedTracks />

        {/* <GenreSection /> */}
      </div>
    </div>
  );
}
