"use client";

import { ExplicitBadge } from "@/components/ExplicitBadge";
import { SpotifyBadge } from "@/components/SpotifyBadge";
import { SpotifyTrack } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface TrackHeaderProps {
  track: SpotifyTrack;
}

export const TrackHeader = ({ track }: TrackHeaderProps) => {
  // 이미지 URL 가져오기
  const albumImage = getSafeImageUrl(track.album?.images, "lg");

  return (
    <section className="relative bg-background">
      <div className="container px-4 pb-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex gap-6"
        >
          <div className="relative shadow-2xl">
            <div
              className="relative aspect-square rounded-sm overflow-hidden"
              style={{
                width: "160px",
                height: "160px",
                minWidth: "160px",
                minHeight: "160px",
                maxWidth: "160px",
                maxHeight: "160px",
              }}
            >
              <Image
                src={albumImage}
                alt={track.album?.name || "앨범 이미지"}
                fill
                sizes="160px"
                className="object-cover"
              />
            </div>
          </div>
          <div
            className="flex-grow flex flex-col justify-between py-0"
            style={{ height: "160px" }}
          >
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-bold">
                  {track.name}
                </h1>
                {track.explicit && (
                  <ExplicitBadge className="ml-2 flex-shrink-0" />
                )}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {track.artists.map((trackArtist, index) => (
                  <Link
                    key={trackArtist.id}
                    href={`/artist/${trackArtist.id}`}
                    className="text-sm sm:text-base md:text-lg hover:text-primary"
                  >
                    {trackArtist.name}
                    {index < track.artists.length - 1 && ", "}
                  </Link>
                ))}
              </div>
              <Link
                href={`/album/${track.album?.id}`}
                className="text-xs sm:text-sm md:text-md mt-2 hover:text-primary block"
              >
                {track.album?.name}
              </Link>
            </div>
            <div>
              <SpotifyBadge
                href={`https://open.spotify.com/track/${track.id}`}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
