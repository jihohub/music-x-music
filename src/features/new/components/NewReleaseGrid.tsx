"use client";

import { SpotifyLogo } from "@/components/SpotifyLogo";
import { SpotifyAlbum } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface NewReleaseGridProps {
  albums: SpotifyAlbum[];
  isLoading?: boolean;
  error?: string | null;
}

export const NewReleaseGrid = ({
  albums,
  isLoading = false,
  error = null,
}: NewReleaseGridProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div
              className="aspect-square bg-card-bg rounded-sm w-full"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
            <div
              className="h-4 mt-2 rounded w-3/4"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
            <div
              className="h-3 mt-1 rounded w-1/2"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
        <p className="mb-4">{error}</p>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
        <p className="mb-4">신규 앨범이 없습니다</p>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {albums.map((album, index) => (
        <motion.div
          key={album.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link href={`/album/${album.id}`} className="group">
            <SpotifyLogo />
            <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
              <Image
                src={getSafeImageUrl(album.images, "lg")}
                alt={album.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover"
              />
            </div>
            <h3 className="mt-2 font-semibold truncate">{album.name}</h3>
            <p className="text-sm text-text-secondary truncate">
              {album.artists?.map((a) => a.name).join(", ")}
            </p>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
