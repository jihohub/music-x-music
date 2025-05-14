"use client";

import { ExplicitBadge } from "@/components/ExplicitBadge";
import { SpotifyBadge } from "@/components/SpotifyBadge";
import { SpotifyAlbum } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface AlbumHeaderProps {
  album: SpotifyAlbum;
}

export const AlbumHeader = ({ album }: AlbumHeaderProps) => {
  // 앨범 이미지 URL 가져오기
  const albumImage = getSafeImageUrl(album.images, "lg");

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
                alt={album.name}
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
                  {album.name}
                </h1>
                {album.explicit && <ExplicitBadge />}
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {album.artists.map((albumArtist, index) => (
                  <Link
                    key={albumArtist.id}
                    href={`/artist/${albumArtist.id}`}
                    className="text-sm sm:text-base md:text-lg hover:text-primary"
                  >
                    {albumArtist.name}
                    {index < album.artists.length - 1 && ", "}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <SpotifyBadge
                href={`https://open.spotify.com/album/${album.id}`}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
