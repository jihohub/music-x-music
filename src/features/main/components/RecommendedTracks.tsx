"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { AppleMusicTrack } from "@/types/apple-music";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-track.jpg"; // 기본 이미지
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface RecommendedTracksProps {
  tracks: AppleMusicTrack[];
  isLoading: boolean;
}

export const RecommendedTracks = ({
  tracks,
  isLoading,
}: RecommendedTracksProps) => {
  const { playTrack } = useMusicPlayer();

  return (
    <section>
      {isLoading && <div className="h-[555.5px] md:h-[159.84px]"></div>}

      {!isLoading && tracks.length === 0 && (
        <div className="text-center text-white/60 py-8">
          No tracks available
        </div>
      )}

      {!isLoading && tracks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tracks.map((track) => (
            <div
              key={`recommended-track-${track.id}`}
              className="group relative"
            >
              <button
                onClick={() => {
                  playTrack(track);
                }}
                className="w-full text-left"
              >
                <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg">
                  <UnoptimizedImage
                    src={getAppleMusicImageUrl(track.attributes.artwork, "md")}
                    alt={track.attributes.name}
                    className="aspect-square rounded-2xl w-full"
                  />
                </div>
              </button>

              <button
                onClick={() => {
                  playTrack(track);
                }}
                className="w-full text-left mt-2"
              >
                <h3 className="font-semibold text-sm truncate leading-tight text-white group-hover:text-white/80 transition-colors">
                  {track.attributes.name}
                </h3>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedTracks;
