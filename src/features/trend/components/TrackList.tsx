"use client";

import { SpotifyTrack } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface TrackListProps {
  tracks: SpotifyTrack[];
  showMoreLink?: boolean;
  onShowMore?: () => void;
}

export const TrackList = ({
  tracks,
  showMoreLink = false,
  onShowMore,
}: TrackListProps) => {
  if (!tracks || tracks.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">트랙</h2>
        {showMoreLink && (
          <button
            onClick={onShowMore}
            className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
          >
            더 보기
          </button>
        )}
      </div>
      <div className="space-y-2">
        {tracks.map((track) => (
          <Link
            href={`/track/${track.id}`}
            key={track.id}
            className="flex items-center gap-4 p-3 rounded-md hover:bg-card-bg transition-colors"
          >
            <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={getSafeImageUrl(track.album?.images, "lg")}
                alt={track.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="flex-grow min-w-0">
              <h3 className="font-semibold truncate">{track.name}</h3>
              <p className="text-text-secondary text-sm truncate">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};
