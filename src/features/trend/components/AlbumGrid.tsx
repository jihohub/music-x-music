"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { AppleMusicAlbum } from "@/types/apple-music";
import Link from "next/link";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-album.jpg";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface AlbumGridProps {
  albums: AppleMusicAlbum[];
  limit?: number;
  showPreview?: boolean;
  onViewMore?: () => void;
  isLoading?: boolean;
}

export const AlbumGrid = ({
  albums,
  limit,
  showPreview = false,
  onViewMore,
  isLoading = false,
}: AlbumGridProps) => {
  // 전체 탭에서는 4개, 각 탭에서는 8개씩 표시
  const itemLimit = showPreview ? limit || 4 : 8;
  const displayAlbums = limit ? albums.slice(0, itemLimit) : albums;

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
        {displayAlbums.map((album, index) => (
          <div key={album.id}>
            <Link href={`/album/${album.id}`} className="group">
              <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(album.attributes.artwork, "md")}
                  alt={album.attributes.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-2 font-semibold truncate text-sm group-hover:text-primary transition-colors">
                {album.attributes.name}
              </h3>
              <p className="text-sm text-text-secondary truncate">
                {album.attributes.artistName}
                {album.attributes.releaseDate && (
                  <span className="ml-1">
                    • {album.attributes.releaseDate.split("-")[0]}
                  </span>
                )}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumGrid;
