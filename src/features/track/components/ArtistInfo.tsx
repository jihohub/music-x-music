"use client";

import { SpotifyArtist } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface ArtistInfoProps {
  artists: SpotifyArtist[];
}

export const ArtistInfo = ({ artists }: ArtistInfoProps) => {
  if (artists.length === 0) return null;

  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card-bg rounded-lg py-5"
    >
      <h2 className="text-lg font-bold mb-4">아티스트 정보</h2>
      <div className="space-y-3">
        {artists.map((artist) => (
          <div key={artist.id} className="flex items-center gap-3">
            <Link
              href={`/artist/${artist.id}`}
              className="block relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
            >
              <Image
                src={getSafeImageUrl(artist.images, "sm")}
                alt={artist.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </Link>
            <div className="h-12 flex items-center">
              <Link
                href={`/artist/${artist.id}`}
                className="font-medium hover:text-primary"
              >
                {artist.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};
