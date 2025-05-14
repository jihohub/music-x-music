"use client";

import { SpotifyLogo } from "@/components/SpotifyLogo";
import { useRecommendedTracks } from "@/hooks/useSpotifyData";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
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

      {!isLoading && (tracks?.length === 0 || isError) && (
        <div className="text-center py-6">
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
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link href={`/track/${track.id}`} className="group">
                <SpotifyLogo />
                <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                  <Image
                    src={getSafeImageUrl(track.album?.images, "lg")}
                    alt={track.album?.name || "앨범 이미지"}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover"
                    priority={track === tracks[0]}
                  />
                </div>
                <h3 className="mt-2 font-semibold truncate text-sm">
                  {track.name}
                </h3>
                <p className="text-sm text-text-secondary truncate">
                  {track.artists.map((artist) => artist.name).join(", ")}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedTracks;
