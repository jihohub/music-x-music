"use client";

import { useRecommendedTracks } from "@/hooks/useSpotifyData";
import Image from "next/image";
import Link from "next/link";

export default function RecommendedTracks() {
  const { data: tracks, isLoading, isError } = useRecommendedTracks();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="group bg-card-bg rounded-lg overflow-hidden">
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
    );
  }

  // 결과가 없는 경우 빈 배열 처리
  const displayTracks = tracks || [];

  // 데이터가 없는 경우 메시지 표시
  if (displayTracks.length === 0) {
    return (
      <div className="p-6 text-center rounded-md bg-card-bg">
        <p>추천 트랙을 불러올 수 없습니다.</p>
        <p className="text-sm text-text-secondary mt-2">
          {isError
            ? "데이터를 가져오는 중 오류가 발생했습니다."
            : "추천 트랙이 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {displayTracks.map((track) => (
        <Link
          href={`/track/${track.id}`}
          key={track.id}
          className="group bg-card-bg rounded-lg overflow-hidden hover:bg-gray-700/10 transition-colors"
        >
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={
                track.album?.images?.[0]?.url ||
                "https://via.placeholder.com/300"
              }
              alt={track.album?.name || "앨범 이미지"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover transition-transform group-hover:scale-105"
              priority={track === displayTracks[0]}
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm line-clamp-1">{track.name}</h3>
            <p className="text-text-secondary text-xs line-clamp-1 mt-1">
              {track.artists.map((artist) => artist.name).join(", ")}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
