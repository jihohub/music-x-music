"use client";

import { FeaturedArtistsSection } from "./components/FeaturedArtistsSection";
import { HeroSection } from "./components/HeroSection";
import { RecommendedTracksSection } from "./components/RecommendedTracksSection";

export function MainPage() {
  return (
    <div className="py-6 space-y-8">
      <HeroSection />
      <FeaturedArtistsSection />
      <RecommendedTracksSection />
      {/* <GenreSection /> */}
    </div>
  );
}
