"use client";

import { ExplicitBadge } from "@/components/ExplicitBadge";
import { SpotifyLogo } from "@/components/SpotifyLogo";
import { SpotifyAlbum } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface AlbumResultsProps {
  albums: SpotifyAlbum[];
  showMoreLink?: boolean;
  onShowMore?: () => void;
}

export const AlbumResults = ({
  albums,
  showMoreLink = false,
  onShowMore,
}: AlbumResultsProps) => {
  if (albums.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">앨범</h2>
        {showMoreLink && (
          <button
            onClick={onShowMore}
            className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
          >
            더 보기
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {albums.slice(0, 20).map((album, index) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/album/${album.id}`} className="group">
              <SpotifyLogo />
              <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                <Image
                  src={getSafeImageUrl(album.images)}
                  alt={album.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-2 flex items-center gap-1">
                <h3 className="font-semibold truncate">{album.name}</h3>
                {album.explicit && (
                  <ExplicitBadge className="ml-1 flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-text-secondary truncate">
                {album.artists.map((a) => a.name).join(", ")}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AlbumResults;
