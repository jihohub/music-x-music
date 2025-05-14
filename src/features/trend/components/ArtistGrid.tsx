"use client";

import { SpotifyBadge } from "@/components/SpotifyBadge";
import { SpotifyLogo } from "@/components/SpotifyLogo";
import { SpotifyArtist } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ArtistGridProps {
  artists: SpotifyArtist[];
  showMoreLink?: boolean;
  onShowMore?: () => void;
}

export const ArtistGrid = ({
  artists,
  showMoreLink = false,
  onShowMore,
}: ArtistGridProps) => {
  if (!artists || artists.length === 0) return null;

  // 표시할 아티스트 수 제한 (최대 20개)
  const displayArtists = artists.slice(0, 20);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">아티스트</h2>
        {showMoreLink && (
          <SpotifyBadge href="https://open.spotify.com/genre/discover-page-feature" />
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayArtists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/artist/${artist.id}`} className="group">
              <SpotifyLogo />
              <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                <Image
                  src={getSafeImageUrl(artist.images, "lg")}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-2 font-semibold truncate text-sm">
                {artist.name}
              </h3>
              <p className="text-sm text-text-secondary truncate">
                {artist.genres?.slice(0, 2).join(", ") || "아티스트"}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
      {showMoreLink && artists.length > 20 && (
        <div className="flex justify-center mt-4">
          <SpotifyBadge href="https://open.spotify.com/genre/discover-page-feature" />
        </div>
      )}
    </motion.div>
  );
};
