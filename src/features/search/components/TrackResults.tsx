"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { SpotifyTrack } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import Link from "next/link";

interface TrackResultsProps {
  tracks: SpotifyTrack[];
  limit?: number;
  showMoreLink?: boolean;
  onShowMore?: () => void;
  isLoading?: boolean;
}

export const TrackResults = ({
  tracks,
  limit,
  showMoreLink = false,
  onShowMore,
  isLoading = false,
}: TrackResultsProps) => {
  if (tracks.length === 0 && !isLoading) return null;
  // 전체 탭에서는 4개, 각 탭에서는 8개씩 표시
  const itemLimit = showMoreLink ? 4 : 8;

  // 스켈레톤 UI
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div
            className="h-7 w-20 rounded"
            style={{ backgroundColor: "var(--skeleton-bg)" }}
          ></div>
          {showMoreLink && (
            <div
              className="h-5 w-12 mr-2 rounded"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            ></div>
          )}
        </div>
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">트랙</h2>
        {showMoreLink && (
          <Link
            href="/search?type=track"
            className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded transition-all duration-200"
            onClick={(e) => {
              if (onShowMore) {
                e.preventDefault();
                onShowMore();
              }
            }}
          >
            더 보기
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tracks.map((track) => (
          <Link href={`/track/${track.id}`} key={track.id} className="group">
            <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
              <UnoptimizedImage
                src={getSafeImageUrl(track.album?.images, "md")}
                alt={track.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover"
              />
            </div>
            <div className="mt-2">
              <h3 className="text-sm font-semibold truncate">{track.name}</h3>
            </div>
            <p className="text-sm text-text-secondary truncate">
              {track.artists.map((a) => a.name).join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrackResults;
