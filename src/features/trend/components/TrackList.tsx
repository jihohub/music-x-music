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

  // 표시할 트랙 수 제한 (최대 20개)
  const displayTracks = tracks.slice(0, 20);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">트랙</h2>
      </div>
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
                  src={getSafeImageUrl(track.album?.images, "lg")}
                  alt={track.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-semibold truncate text-sm">{track.name}</h3>
              </div>
              <p className="text-sm text-text-secondary truncate">
                {track.artists.map((a) => a.name).join(", ")}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
