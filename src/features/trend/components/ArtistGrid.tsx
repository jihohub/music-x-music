"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { AppleMusicArtist } from "@/types/apple-music";
import Link from "next/link";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-artist.jpg";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface ArtistGridProps {
  artists: AppleMusicArtist[];
  limit?: number;
  showPreview?: boolean;
  onViewMore?: () => void;
  isLoading?: boolean;
}

export const ArtistGrid = ({
  artists,
  limit,
  showPreview = false,
  onViewMore,
  isLoading = false,
}: ArtistGridProps) => {
  // 전체 탭에서는 4개, 각 탭에서는 8개씩 표시
  const itemLimit = showPreview ? limit || 4 : 8;
  const displayArtists = limit ? artists.slice(0, itemLimit) : artists;

  // 스켈레톤 UI
  if (isLoading) {
    // 전체 탭에서는 4개 아이템(2x2), 개별 탭에서는 8개 아이템(2x4 또는 4x2)
    const skeletonHeight = showPreview
      ? "h-[388px] md:h-[240px]"
      : "h-[1080px] md:h-[480px]";
    return <div className={`${skeletonHeight} animate-pulse`}></div>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayArtists.map((artist, index) => (
          <div key={artist.id}>
            <Link href={`/artist/${artist.id}`} className="group">
              <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(artist.attributes.artwork, "md")}
                  alt={artist.attributes.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-2 font-semibold truncate text-sm group-hover:text-primary transition-colors">
                {artist.attributes.name}
              </h3>
              <p className="text-sm text-text-secondary truncate">
                {artist.attributes.genreNames?.slice(0, 2).join(", ") ||
                  "아티스트"}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistGrid;
