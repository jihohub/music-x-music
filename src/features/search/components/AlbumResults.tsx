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

interface AlbumResultsProps {
  albums: AppleMusicAlbum[];
  limit?: number;
  isLoading?: boolean;
  context?: string; // 렌더링 컨텍스트를 구분하기 위한 props
  isFeatured?: boolean;
}

export const AlbumResults = ({
  albums,
  limit,
  isLoading = false,
  context = "search", // 기본값 설정
  isFeatured = false,
}: AlbumResultsProps) => {
  if (albums.length === 0 && !isLoading) return null;
  const itemLimit = 4;

  // Featured 모드 스켈레톤 UI
  if (isLoading && isFeatured) {
    return (
      <>
        <style>
          {`
            .album-featured-skeleton {
              min-height: 438px;
            }
            @media (min-width: 768px) {
              .album-featured-skeleton {
                min-height: 289.5px;
              }
            }
          `}
        </style>
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl animate-pulse album-featured-skeleton"></div>
      </>
    );
  }

  // 일반 스켈레톤 UI
  if (isLoading) {
    // 전체 탭(basic)에서는 4개 앨범에 맞는 높이, 개별 탭에서는 화면 높이
    const skeletonHeight = context === "basic" ? "300px" : "70vh";

    return (
      <div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl animate-pulse"
        style={{ minHeight: skeletonHeight }}
      ></div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {albums.map((album) => (
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
              <h3 className="text-sm font-semibold truncate mt-2 text-white">
                {album.attributes.name}
              </h3>
              <p className="text-sm text-white/70 truncate">
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

export default AlbumResults;
