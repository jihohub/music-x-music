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
      {isLoading && <div className="h-[590px] md:h-[170.34px]"></div>}

      {error && (
        <div className="text-center text-white/60 py-8">
          Failed to load artists
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map((artist: AppleMusicArtist) => (
            <div key={artist.id}>
              <Link href={`/artist/${artist.id}`} className="group">
                <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg">
                  <UnoptimizedImage
                    src={getAppleMusicImageUrl(artist.attributes.artwork, "md")}
                    alt={artist.attributes.name}
                    className="aspect-square rounded-2xl w-full"
                  />
                </div>
                <h3 className="mt-2 font-semibold truncate text-sm text-white">
                  {artist.attributes.name}
                </h3>
                <p className="text-sm text-white/60 truncate">
                  {artist.attributes.genreNames?.slice(0, 2).join(", ") ||
                    "Artist"}
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
