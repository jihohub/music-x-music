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
  isLoading?: boolean;
  textColor1?: string;
  textColor2?: string;
}

export const TopTracks = ({
  tracks,
  isLoading = false,
  textColor1 = "#ffffff",
  textColor2 = "#ffffff",
}: TopTracksProps) => {
  const { playTrack } = useMusicPlayer();

  if (tracks.length === 0) {
    return (
      <section className="bg-card-bg rounded-lg py-5">
        <h2 className="text-lg font-bold mb-4" style={{ color: textColor1 }}>
          인기 트랙
        </h2>
        <div className="p-4 text-center" style={{ color: textColor2 }}>
          인기 트랙을 찾을 수 없습니다.
        </div>
      </section>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="space-y-4">
        {tracks.slice(0, 10).map((track, index) => (
          <div
            key={`artist-track-${track.id}`}
            className="group flex items-center gap-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <button
              onClick={() => {
                playTrack(track);
              }}
              className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0"
            >
              <UnoptimizedImage
                src={getAppleMusicImageUrl(track.attributes.artwork, "sm")}
                alt={track.attributes.albumName || track.attributes.name}
                width={48}
                height={48}
                className="rounded-2xl"
              />
            </button>

            <button
              onClick={() => {
                playTrack(track);
              }}
              className="flex-1 min-w-0 text-left"
            >
              <h3
                className="font-medium text-sm truncate group-hover:opacity-80 transition-colors"
                style={{ color: textColor1 }}
              >
                {track.attributes.name}
              </h3>
              <p
                className="text-xs truncate opacity-70"
                style={{ color: textColor2 }}
              >
                {track.attributes.albumName}
                {track.attributes.releaseDate && (
                  <span> • {track.attributes.releaseDate.split("-")[0]}</span>
                )}
              </p>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
