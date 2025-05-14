"use client";

import { SpotifyBadge } from "@/components/SpotifyBadge";
import { SpotifyArtist } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";

interface ArtistHeaderProps {
  artist: SpotifyArtist;
}

export const ArtistHeader = ({ artist }: ArtistHeaderProps) => {
  // 이미지 URL 가져오기
  const artistImage = getSafeImageUrl(artist.images, "lg");

  return (
    <section className="relative bg-background">
      <div className="container px-4 pb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex gap-6"
        >
          <div
            className="relative overflow-hidden shadow-2xl"
            style={{
              width: "160px",
              height: "160px",
              minWidth: "160px",
              minHeight: "160px",
              maxWidth: "160px",
              maxHeight: "160px",
              borderRadius: "4px",
            }}
          >
            <Image
              src={artistImage}
              alt={artist.name}
              fill
              sizes="(max-width: 768px) 160px, 256px"
              className="object-cover object-center"
            />
          </div>
          <div
            className="flex-grow flex flex-col justify-between py-0"
            style={{ height: "160px" }}
          >
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold">
                {artist.name}
              </h1>
              {artist.genres && artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-3">
                  {/* 모바일: 첫 번째 장르만 표시 */}
                  <span className="md:hidden text-sm bg-primary/20 text-primary rounded-full">
                    {artist.genres[0]}
                  </span>

                  {/* 태블릿/데스크톱: 최대 3개 장르 표시 */}
                  {artist.genres.slice(0, 3).map((genre, idx) => (
                    <span
                      key={idx}
                      className="hidden md:inline-block text-sm bg-primary/20 text-primary rounded-full"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div>
              <SpotifyBadge
                href={`https://open.spotify.com/artist/${artist.id}`}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
