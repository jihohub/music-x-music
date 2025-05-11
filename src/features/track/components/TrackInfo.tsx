"use client";

import { SpotifyTrack } from "@/types/spotify";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import {
  IoCalendarOutline,
  IoMusicalNotesOutline,
  IoTimeOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

interface TrackInfoProps {
  track: SpotifyTrack;
}

export const TrackInfo: React.FC<TrackInfoProps> = ({ track }) => {
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card-bg rounded-lg py-5"
    >
      <h2 className="text-lg font-bold mb-4">트랙 정보</h2>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <IoMusicalNotesOutline className="text-primary mt-1" size={18} />
          <div>
            <h3 className="font-medium">앨범</h3>
            <p className="text-text-secondary">
              <Link
                href={`/album/${track.album?.id}`}
                className="hover:text-primary"
              >
                {track.album?.name}
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <IoCalendarOutline className="text-primary mt-1" size={18} />
          <div>
            <h3 className="font-medium">릴리즈</h3>
            <p className="text-text-secondary">
              {track.album?.release_date || "알 수 없음"}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <IoTimeOutline className="text-primary mt-1" size={18} />
          <div>
            <h3 className="font-medium">재생 시간</h3>
            <p className="text-text-secondary">
              {Math.floor(track.duration_ms / 60000)}:
              {((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <IoTrendingUpOutline className="text-primary mt-1" size={18} />
          <div>
            <h3 className="font-medium">인기도</h3>
            <p className="text-text-secondary">{track.popularity || 0}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
