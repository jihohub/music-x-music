"use client";

import { SpotifyAlbum } from "@/types/spotify";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface AlbumListProps {
  albums: SpotifyAlbum[];
}

export const AlbumList: React.FC<AlbumListProps> = ({ albums }) => {
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card-bg rounded-lg py-5"
    >
      <h2 className="text-lg font-bold mb-4">앨범 및 싱글</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {albums.map((album) => (
          <Link href={`/album/${album.id}`} key={album.id} className="group">
            <div className="relative aspect-square bg-card-bg rounded-md overflow-hidden">
              <Image
                src={
                  album.images && album.images.length > 0
                    ? album.images[0].url
                    : "https://via.placeholder.com/300"
                }
                alt={album.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="font-medium mt-2 truncate">{album.name}</h3>
            <p className="text-sm text-text-secondary">
              {album.release_date.split("-")[0]} • {album.total_tracks}곡
            </p>
          </Link>
        ))}
      </div>
    </motion.section>
  );
};
