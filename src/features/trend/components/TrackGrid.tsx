"use client";

import { SpotifyTrack } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";
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
            <button
              onClick={onViewMore}
              className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
            >
              더 보기
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayTracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/track/${track.id}`} className="group">
              <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                <Image
                  src={getSafeImageUrl(track.album?.images)}
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
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TrackGrid;
