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
    return "/images/placeholder-track.jpg";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface TopTracksProps {
  tracks: AppleMusicTrack[];
}

export const TopTracks = ({ tracks }: TopTracksProps) => {
  if (tracks.length === 0) {
    return (
      <section className="bg-card-bg rounded-lg py-5">
        <h2 className="text-lg font-bold mb-4">인기 트랙</h2>
        <div className="p-4 text-center text-text-secondary">
          인기 트랙을 찾을 수 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card-bg rounded-lg py-5">
      <h2 className="text-lg font-bold mb-4">인기 트랙</h2>
      <div className="space-y-1">
        {tracks.slice(0, 10).map((track, index) => (
          <Link
            key={track.id}
            href={`/track/${track.id}`}
            className="flex items-center gap-3 p-2 hover:bg-gray-700/10 transition-colors group cursor-pointer rounded-md"
          >
            <div className="w-12 h-12 shrink-0">
              <UnoptimizedImage
                src={getAppleMusicImageUrl(track.attributes.artwork, "sm")}
                alt={track.attributes.albumName || track.attributes.name}
                width={48}
                height={48}
                className="rounded-md"
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="font-medium hover:text-primary line-clamp-1 text-sm">
                {track.attributes.name}
              </div>
              <div className="text-text-secondary text-sm line-clamp-1 mt-0.5">
                {track.attributes.albumName || "-"}
                {track.attributes.releaseDate && (
                  <span className="ml-1">
                    • {track.attributes.releaseDate.split("-")[0]}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
