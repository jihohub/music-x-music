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
      <div>
        <div className="flex items-center gap-2 py-2 text-text-secondary text-sm">
          <div className="w-8 text-center shrink-0">#</div>
          <div className="w-10 shrink-0"></div>
          <div className="flex-grow min-w-0">제목</div>
          <div className="hidden md:block w-1/4 min-w-0">앨범</div>
          <div className="text-right w-10 shrink-0">시간</div>
        </div>
        {tracks.slice(0, 10).map((track, index) => (
          <Link
            key={track.id}
            href={`/track/${track.id}`}
            className="flex items-center gap-2 py-2 hover:bg-gray-700/10 transition-colors group cursor-pointer"
          >
            <div className="w-8 text-center text-text-secondary shrink-0">
              <span>{index + 1}</span>
            </div>
            <div className="w-10 h-10 shrink-0">
              <UnoptimizedImage
                src={getAppleMusicImageUrl(track.attributes.artwork, "sm")}
                alt={track.attributes.albumName || track.attributes.name}
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="hover:text-primary line-clamp-2">
                {track.attributes.name}
              </div>
            </div>
            <div className="hidden md:block w-1/4 text-text-secondary line-clamp-1 min-w-0">
              <span className="text-text-secondary">
                {track.attributes.albumName || "-"}
              </span>
            </div>
            <div className="text-right w-10 text-text-secondary shrink-0">
              {Math.floor(track.attributes.durationInMillis / 60000)}:
              {(Math.floor(track.attributes.durationInMillis / 1000) % 60)
                .toString()
                .padStart(2, "0")}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
