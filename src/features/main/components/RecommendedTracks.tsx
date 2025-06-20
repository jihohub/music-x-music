"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { AppleMusicTrack } from "@/types/apple-music";
import Link from "next/link";

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
  return (
    <section>
      <div className="flex-between mb-4">
        <h2 className="text-xl font-bold">추천 트랙</h2>
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div
                className="aspect-square rounded-sm w-full"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-5 mt-2 rounded w-3/4"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-4 mt-1 rounded w-1/2"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          ))}
        </div>
      )}

      {!isLoading && tracks.length === 0 && (
        <div className="text-center text-text-secondary py-8">
          추천할 트랙이 없습니다.
        </div>
      )}

      {!isLoading && tracks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tracks.slice(0, 6).map((track) => (
            <div key={track.id}>
              <Link href={`/track/${track.id}`} className="group">
                <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                  <UnoptimizedImage
                    src={getAppleMusicImageUrl(track.attributes.artwork, "md")}
                    alt={track.attributes.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-2 font-semibold truncate text-sm">
                  {track.attributes.name}
                </h3>
                <p className="text-sm text-text-secondary truncate">
                  {track.attributes.artistName}
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedTracks;
