"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { AppleMusicAlbum } from "@/types/apple-music";
import Link from "next/link";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-album.jpg";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface AlbumListProps {
  albums: AppleMusicAlbum[];
  textColor1?: string;
  textColor2?: string;
}

export const AlbumList = ({
  albums,
  textColor1 = "#ffffff",
  textColor2 = "#ffffff",
}: AlbumListProps) => {
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {albums.map((album, index) => (
          <div key={album.id}>
            <Link href={`/album/${album.id}`} className="group">
              <div className="relative aspect-square bg-card-bg rounded-2xl overflow-hidden">
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(album.attributes.artwork, "md")}
                  alt={album.attributes.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3
                className="font-medium mt-2 truncate"
                style={{ color: textColor1 }}
              >
                {album.attributes.name}
              </h3>
              <p className="text-sm opacity-70" style={{ color: textColor2 }}>
                {album.attributes.releaseDate?.split("-")[0]} •{" "}
                {album.attributes.trackCount}곡
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
