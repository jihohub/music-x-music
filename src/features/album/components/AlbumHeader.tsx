"use client";

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
    <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
        <Image
          src={albumImage}
          alt={album.name}
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
          <div className="relative shadow-2xl group">
            <div
              className="relative aspect-square rounded-lg overflow-hidden"
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
              <Image
                src={albumImage}
                alt={album.name}
                fill
                sizes="160px"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 ring-1 ring-white/10" />
            </div>
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                  {album.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  {album.artists.map((albumArtist, index) => (
                    <Link
                      key={albumArtist.id}
                      href={`/artist/${albumArtist.id}`}
                      className="text-lg text-white hover:text-primary drop-shadow-md"
                    >
                      {albumArtist.name}
                      {index < album.artists.length - 1 && ", "}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
