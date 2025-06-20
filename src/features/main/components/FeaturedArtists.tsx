"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { useFeaturedArtists } from "@/features/main/queries";
import { AppleMusicArtist } from "@/types/apple-music";
import Link from "next/link";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-artist.jpg"; // 기본 이미지
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

export const FeaturedArtists = () => {
  const { data: artists = [], isLoading, error } = useFeaturedArtists();

  return (
    <section>
      <div className="flex-between mb-4">
        <h2 className="text-xl font-bold">인기 아티스트</h2>
        {/* <Link href="/artists" className="text-primary text-sm font-medium">
          더보기
        </Link> */}
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

      {error && (
        <div className="text-center text-text-secondary py-8">
          아티스트 정보를 가져오는데 실패했습니다.
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map((artist: AppleMusicArtist) => (
            <div key={artist.id}>
              <Link href={`/artist/${artist.id}`} className="group">
                <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                  <UnoptimizedImage
                    src={getAppleMusicImageUrl(artist.attributes.artwork, "md")}
                    alt={artist.attributes.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-2 font-semibold truncate text-sm">
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
      )}
    </section>
  );
};

export default FeaturedArtists;
