"use client";

import { SpotifyArtist } from "@/types/spotify";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

interface ArtistHeaderProps {
  artist: SpotifyArtist;
}

export const ArtistHeader: React.FC<ArtistHeaderProps> = ({ artist }) => {
  // 이미지가 없는 경우 기본 이미지 URL
  const artistImage =
    artist.images && artist.images.length > 0
      ? artist.images[0].url
      : "https://via.placeholder.com/300";

  // 배너 이미지 - 아티스트 메인 이미지에 그라데이션 효과를 적용
  const bannerImage =
    artist.images && artist.images.length > 0
      ? artist.images[0].url
      : "https://via.placeholder.com/1200x400";

  return (
    <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
        <Image
          src={bannerImage}
          alt={artist.name}
          fill
          sizes="100vw"
          className="object-cover -z-10 opacity-50"
          quality={90}
          priority
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 container px-4 pb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-end gap-6"
        >
          <div
            className="relative rounded-full overflow-hidden shadow-2xl group"
            style={{
              width: "160px",
              height: "160px",
              minWidth: "160px",
              minHeight: "160px",
              maxWidth: "160px",
              maxHeight: "160px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
            <div className="absolute inset-0">
              <Image
                src={artistImage}
                alt={artist.name}
                fill
                sizes="(max-width: 768px) 160px, 256px"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 ring-1 ring-white/10" />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {artist.name}
                </h1>
                {artist.genres && artist.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {/* 모바일: 첫 번째 장르만 표시 */}
                    <span className="md:hidden text-sm bg-primary/20 text-primary px-3 py-1 rounded-full">
                      {artist.genres[0]}
                    </span>

                    {/* 태블릿/데스크톱: 최대 3개 장르 표시 */}
                    {artist.genres.slice(0, 3).map((genre, idx) => (
                      <span
                        key={idx}
                        className="hidden md:inline-block text-sm bg-primary/20 text-primary px-3 py-1 rounded-full"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
