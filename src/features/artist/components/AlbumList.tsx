"use client";

import { SpotifyAlbum } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface AlbumListProps {
  albums: SpotifyAlbum[];
}

export const AlbumList = ({ albums }: AlbumListProps) => {
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card-bg rounded-lg py-5"
    >
      <h2 className="text-lg font-bold mb-4">앨범 및 싱글</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {albums.map((album, index) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Link href={`/album/${album.id}`} className="group">
              <div className="relative aspect-square bg-card-bg rounded-sm overflow-hidden">
                <Image
                  src={getSafeImageUrl(album.images, "lg")}
                  alt={album.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-medium mt-2 truncate">{album.name}</h3>
              <p className="text-sm text-text-secondary">
                {album.release_date.split("-")[0]} • {album.total_tracks}곡
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};
