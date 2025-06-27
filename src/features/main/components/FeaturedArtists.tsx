"use client";

import { useFeaturedArtists } from "@/features/main/queries";
import { AppleMusicArtist } from "@/types/apple-music";
import {
  getAppleMusicImageSrcSet,
  getOptimizedAppleMusicImageUrl,
} from "@/utils/image";
import Link from "next/link";

export const FeaturedArtists = () => {
  const { data: artists = [], isLoading, error } = useFeaturedArtists();

  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-white">인기 아티스트</h2>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-4 bg-white/5 rounded animate-pulse" />
              <div className="h-3 bg-white/5 rounded animate-pulse w-3/4" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-white/60 py-8">
          아티스트를 불러오지 못했습니다
        </div>
      )}

      {!isLoading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map((artist: AppleMusicArtist, index) => (
            <div key={artist.id}>
              <Link href={`/artist/${artist.id}`} className="group">
                <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg">
                  <img
                    src={getOptimizedAppleMusicImageUrl(
                      artist.attributes.artwork,
                      {
                        containerWidth: 200, // 실제 렌더링 크기에 맞춤
                        useDevicePixelRatio: true,
                        maxSize: 640,
                      }
                    )}
                    srcSet={getAppleMusicImageSrcSet(artist.attributes.artwork)}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16.66vw"
                    alt={artist.attributes.name}
                    className="aspect-square rounded-2xl w-full h-full object-cover transition-opacity duration-300"
                    loading={index < 6 ? "eager" : "lazy"} // 첫 6개는 즉시 로드
                    style={{
                      contentVisibility: "auto",
                      containIntrinsicSize: "200px 200px",
                    }}
                  />
                </div>
                <h3 className="mt-2 font-semibold truncate text-sm text-white group-hover:text-white/80 transition-colors">
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
