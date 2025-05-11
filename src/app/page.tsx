import FeaturedArtistsSection from "@/features/main/components/sections/FeaturedArtistsSection";
import HeroSection from "@/features/main/components/sections/HeroSection";
import RecommendedTracksSection from "@/features/main/components/sections/RecommendedTracksSection";

export default function Home() {
  return (
    <div className="py-6 space-y-8">
      <HeroSection />
      <FeaturedArtistsSection />
      <RecommendedTracksSection />
      {/* <GenreSection /> */}
    </div>
  );
}
