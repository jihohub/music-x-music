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

interface TrackGridProps {
  tracks: AppleMusicTrack[];
  limit?: number;
  showPreview?: boolean;
  onViewMore?: () => void;
  isLoading?: boolean;
}

export const TrackGrid = ({
  tracks,
  limit,
  showPreview = false,
  onViewMore,
  isLoading = false,
}: TrackGridProps) => {
  const { playTrack } = useMusicPlayer();

  // 전체 탭에서는 4개, 각 탭에서는 8개씩 표시
  const itemLimit = showPreview ? limit || 4 : 8;
  const displayTracks = limit ? tracks.slice(0, itemLimit) : tracks;

  // 스켈레톤 UI
  if (isLoading) {
    // 전체 탭에서는 4개 아이템(2x2), 개별 탭에서는 8개 아이템(2x4 또는 4x2)
    const skeletonHeight = showPreview
      ? "h-[399px] md:h-[220px]"
      : "h-[1000px] md:h-[440px]";
    return <div className={`${skeletonHeight} animate-pulse`}></div>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayTracks.map((track, index) => (
          <div key={`trend-track-${track.id}`} className="group relative">
            <button
              onClick={() => {
                playTrack(track);
              }}
              className="w-full text-left"
            >
              <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(track.attributes.artwork, "md")}
                  alt={track.attributes.albumName || track.attributes.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-2 font-semibold truncate text-sm">
                {track.attributes.name}
              </h3>
              <p className="text-sm text-text-secondary truncate">
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

export default TrackGrid;
