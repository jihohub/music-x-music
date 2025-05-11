"use client";

import { SpotifyArtist } from "@/lib/spotify-api";
import { motion } from "framer-motion";
import React from "react";
import {
  IoHeartOutline,
  IoMusicalNotesOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

interface ArtistInfoProps {
  artist: SpotifyArtist;
}

export const ArtistInfo: React.FC<ArtistInfoProps> = ({ artist }) => {
  return (
    <motion.section
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card-bg rounded-lg py-5"
    >
      <h2 className="text-lg font-bold mb-4">아티스트 정보</h2>
      <div className="space-y-3">
        {artist.genres && artist.genres.length > 0 && (
          <div className="flex items-start gap-3">
            <IoMusicalNotesOutline className="text-primary mt-1" size={18} />
            <div>
              <h3 className="font-medium">장르</h3>
              <p className="text-text-secondary">
                {/* 모바일에서는 첫 번째 장르만 표시 */}
                <span className="md:hidden">{artist.genres[0]}</span>
                {/* 데스크톱에서는 최대 3개 장르 표시 */}
                <span className="hidden md:inline">
                  {artist.genres.slice(0, 3).join(", ")}
                </span>
              </p>
            </div>
          </div>
        )}

        {artist.followers && (
          <div className="flex items-start gap-3">
            <IoHeartOutline className="text-primary mt-1" size={18} />
            <div>
              <h3 className="font-medium">팔로워</h3>
              <p className="text-text-secondary">
                {artist.followers.total.toLocaleString()}명
              </p>
            </div>
          </div>
        )}

        {artist.popularity && (
          <div className="flex items-start gap-3">
            <IoTrendingUpOutline className="text-primary mt-1" size={18} />
            <div>
              <h3 className="font-medium">인기도</h3>
              <p className="text-text-secondary">{artist.popularity}</p>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
};
