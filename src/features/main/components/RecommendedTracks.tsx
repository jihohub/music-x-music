"use client";

import { useRecommendedTracks } from "@/hooks/useSpotifyData";
import { getSafeImageUrl } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";

export const RecommendedTracks = () => {
  const { data: tracks, isLoading, isError } = useRecommendedTracks();

  return (
    <section>
      <div className="flex-between mb-4">
        <h2 className="text-xl font-bold">추천 트랙</h2>
        {/* <Link href="/tracks" className="text-primary text-sm font-medium">
          더보기
        </Link> */}
      </div>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="group bg-card-bg rounded-lg overflow-hidden"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <div
                  className="absolute inset-0 animate-pulse"
                  style={{ backgroundColor: "var(--skeleton-bg)" }}
                />
              </div>
              <div className="h-[64px] p-3">
                <div
                  className="h-4 rounded w-3/4 mb-2 animate-pulse"
                  style={{ backgroundColor: "var(--skeleton-bg)" }}
                />
                <div
                  className="h-3 rounded w-1/2 animate-pulse"
                  style={{ backgroundColor: "var(--skeleton-bg)" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (tracks?.length === 0 || isError) && (
        <div className="p-6 text-center rounded-md bg-card-bg">
          <p>추천 트랙을 불러올 수 없습니다.</p>
          <p className="text-sm text-text-secondary mt-2">
            {isError
              ? "데이터를 가져오는 중 오류가 발생했습니다."
              : "추천 트랙이 없습니다."}
          </p>
        </div>
      )}

      {!isLoading && tracks && tracks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tracks.map((track) => (
            <Link
              href={`/track/${track.id}`}
              key={track.id}
              className="group bg-card-bg rounded-lg overflow-hidden hover:bg-gray-700/10 transition-colors"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={getSafeImageUrl(track.album?.images, "lg")}
                  alt={track.album?.name || "앨범 이미지"}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover transition-transform group-hover:scale-105"
                  priority={track === tracks[0]}
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">
                  {track.name}
                </h3>
                <p className="text-text-secondary text-xs line-clamp-1 mt-1">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedTracks;
