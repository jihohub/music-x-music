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

interface ArtistResultsProps {
  artists: AppleMusicArtist[];
  limit?: number;
  isLoading?: boolean;
  isFeatured?: boolean; // 크게 표시하는 모드
}

export const ArtistResults = ({
  artists,
  limit,
  isLoading = false,
  isFeatured = false,
}: ArtistResultsProps) => {
  if (artists.length === 0 && !isLoading) return null;
  // 전체 탭에서는 4개, 각 탭에서는 8개씩 표시
  const itemLimit = 4;

  // Featured 모드 스켈레톤 UI
  if (isLoading && isFeatured) {
    return (
      <div className="space-y-4">
        <div
          className="h-7 w-20 rounded"
          style={{ backgroundColor: "var(--skeleton-bg)" }}
        ></div>
        {/* 모바일: 세로 레이아웃 */}
        <div className="flex justify-center md:hidden">
          <div className="animate-pulse w-full max-w-sm">
            <div
              className="aspect-square overflow-hidden rounded-lg bg-card-bg relative w-full"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
            <div
              className="mt-4 h-6 rounded w-[70%] mx-auto"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
            <div
              className="h-4 mt-2 rounded w-[50%] mx-auto"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
          </div>
        </div>
        {/* 데스크탑: 가로 레이아웃 */}
        <div className="hidden md:flex items-center gap-8">
          <div className="animate-pulse w-1/3 aspect-square">
            <div
              className="w-full h-full rounded-lg"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
          </div>
          <div className="flex-1 space-y-4">
            <div
              className="h-8 rounded w-[60%]"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
            <div
              className="h-5 rounded w-[40%]"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 스켈레톤 UI
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div
          className="h-7 w-20 rounded"
          style={{ backgroundColor: "var(--skeleton-bg)" }}
        ></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: itemLimit }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div
                className="aspect-square overflow-hidden rounded-sm bg-card-bg relative w-full"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="mt-2 h-5 rounded w-[85%]"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-4 mt-1 rounded w-[65%]"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Featured 모드 렌더링 (전체 탭에서 첫 번째 아티스트)
  if (isFeatured && artists.length > 0) {
    const artist = artists[0];
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">아티스트</h2>

        {/* 모바일: 세로 레이아웃 */}
        <div className="flex justify-center md:hidden">
          <div className="w-full max-w-sm">
            <Link href={`/artist/${artist.id}`} className="group block">
              <div className="overflow-hidden rounded-lg aspect-square relative bg-card-bg shadow-lg">
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(artist.attributes.artwork, "lg")}
                  alt={artist.attributes.name}
                  fill
                  sizes="80vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="text-center mt-4">
                <h3 className="text-lg font-bold truncate">
                  {artist.attributes.name}
                </h3>
                <p className="text-text-secondary truncate mt-1">
                  {artist.attributes.genreNames?.slice(0, 2).join(", ") ||
                    "아티스트"}
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* 데스크탑: 가로 레이아웃 */}
        <div className="hidden md:block">
          <Link href={`/artist/${artist.id}`} className="group">
            <div className="flex items-center gap-8">
              <div className="w-1/3 aspect-square">
                <div className="overflow-hidden rounded-lg w-full h-full relative bg-card-bg shadow-lg">
                  <UnoptimizedImage
                    src={getAppleMusicImageUrl(artist.attributes.artwork, "lg")}
                    alt={artist.attributes.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 80vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-3xl font-bold truncate mb-3">
                  {artist.attributes.name}
                </h3>
                <p className="text-text-secondary text-xl">
                  {artist.attributes.genreNames?.slice(0, 2).join(", ") ||
                    "아티스트"}
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  // 일반 그리드 모드 렌더링
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">아티스트</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <div key={artist.id}>
            <Link href={`/artist/${artist.id}`} className="group">
              <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(artist.attributes.artwork, "md")}
                  alt={artist.attributes.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-semibold truncate mt-2">
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

export default ArtistResults;
