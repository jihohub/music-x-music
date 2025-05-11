"use client";

import { SpotifyAlbum } from "@/types/spotify";
import { motion } from "framer-motion";
import React from "react";
import {
  IoCalendarOutline,
  IoMusicalNotesOutline,
  IoTimeOutline,
} from "react-icons/io5";

interface AlbumInfoProps {
  album: SpotifyAlbum;
}

export const AlbumInfo: React.FC<AlbumInfoProps> = ({ album }) => {
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card-bg rounded-lg py-5"
    >
      <h2 className="text-lg font-bold mb-4">앨범 정보</h2>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <IoCalendarOutline className="text-primary mt-1" size={18} />
          <div>
            <h3 className="font-medium">릴리즈</h3>
            <p className="text-text-secondary">{album.release_date}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <IoMusicalNotesOutline className="text-primary mt-1" size={18} />
          <div>
            <h3 className="font-medium">트랙 수</h3>
            <p className="text-text-secondary">{album.total_tracks}곡</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <IoTimeOutline className="text-primary mt-1" size={18} />
          <div>
            <h3 className="font-medium">총 재생 시간</h3>
            <p className="text-text-secondary">
              {Math.floor(
                (album.tracks?.items?.reduce(
                  (acc, track) => acc + track.duration_ms,
                  0
                ) || 0) / 60000
              )}
              분
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
