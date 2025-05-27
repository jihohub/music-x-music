"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { SpotifyTrack } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import Link from "next/link";

interface TrackGridProps {
  tracks: SpotifyTrack[];
  limit?: number;
  showPreview?: boolean;
  onViewMore?: () => void;
}

export const TrackGrid = ({
  tracks,
  limit,
  showPreview = false,
  onViewMore,
}: TrackGridProps) => {
  const displayTracks = limit ? tracks.slice(0, limit) : tracks;

  return (
    <div className="space-y-4">
      {showPreview && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">트랙</h2>
          {onViewMore && (
            <Link
              href="/trend?type=track"
              className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
              onClick={(e) => {
                if (onViewMore) {
                  e.preventDefault();
                  onViewMore();
                }
              }}
            >
              더 보기
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayTracks.map((track, index) => (
          <div key={track.id}>
            <Link href={`/track/${track.id}`} className="group">
              <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getSafeImageUrl(track.album?.images, "md")}
                  alt={track.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-2 font-semibold truncate text-sm">
                {track.name}
              </h3>
              <p className="text-sm text-text-secondary truncate">
                {track.artists.map((artist) => artist.name).join(", ")}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackGrid;
