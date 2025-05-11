"use client";

import { SpotifyAlbum } from "@/lib/spotify-api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { IoPlayCircleOutline } from "react-icons/io5";

interface TrackListProps {
  album: SpotifyAlbum;
}

export const TrackList: React.FC<TrackListProps> = ({ album }) => {
  const albumImage =
    album.images && album.images.length > 0
      ? album.images[0].url
      : "https://via.placeholder.com/40";

  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-card-bg rounded-lg py-5"
    >
      <h2 className="text-lg font-bold mb-4">트랙 목록</h2>
      <div>
        <div className="flex items-center gap-2 py-2 text-text-secondary text-sm">
          <div className="w-8 text-center shrink-0">#</div>
          <div className="flex-grow min-w-0">제목</div>
          <div className="hidden md:block w-1/3 min-w-0">아티스트</div>
          <div className="text-right w-10 shrink-0">시간</div>
        </div>
        {album.tracks?.items.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-2 py-2 hover:bg-gray-700/10 transition-colors group"
          >
            <div className="w-8 text-center text-text-secondary shrink-0">
              <span className="group-hover:hidden">{index + 1}</span>
              <button className="hidden group-hover:block mx-auto">
                <IoPlayCircleOutline size={18} />
              </button>
            </div>
            <div className="w-10 h-10 shrink-0">
              <Image
                src={albumImage}
                alt={album.name}
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
            <div className="flex-grow min-w-0">
              <Link
                href={`/track/${track.id}`}
                className="hover:text-primary block line-clamp-2"
              >
                {track.name}
              </Link>
            </div>
            <div className="hidden md:block w-1/3 min-w-0">
              <div className="text-text-secondary truncate">
                {track.artists.map((artist, index) => (
                  <React.Fragment key={artist.id}>
                    <Link
                      href={`/artist/${artist.id}`}
                      className="hover:text-primary"
                    >
                      {artist.name}
                    </Link>
                    {index < track.artists.length - 1 && (
                      <span className="mx-1">, </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="text-text-secondary text-right w-10 shrink-0">
              {Math.floor(track.duration_ms / 60000)}:
              {((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};
