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

interface AlbumHeaderProps {
  album: AppleMusicAlbum;
}

export const AlbumHeader = ({ album }: AlbumHeaderProps) => {
  // 앨범 이미지 URL 가져오기
  const albumImage = getAppleMusicImageUrl(album.attributes.artwork, "md");
  const bannerImage = getAppleMusicImageUrl(album.attributes.artwork, "lg");

  return (
    <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
        <UnoptimizedImage
          src={bannerImage}
          alt={album.attributes.name}
          fill
          sizes="100vw"
          className="object-cover -z-10 opacity-50"
          priority
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 container px-4 pb-6">
        <div className="flex items-end gap-6">
          <div
            className="relative overflow-hidden aspect-square rounded-sm"
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
              <UnoptimizedImage
                src={albumImage}
                alt={album.attributes.name}
                fill
                sizes="(max-width: 768px) 160px, 256px"
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 ring-1 ring-white/10" />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
                  {album.attributes.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  {album.relationships?.artists?.data?.[0] ? (
                    <Link
                      href={`/artist/${album.relationships.artists.data[0].id}`}
                      className="text-sm sm:text-base md:text-lg hover:text-primary"
                    >
                      {album.attributes.artistName}
                    </Link>
                  ) : (
                    <span className="text-sm sm:text-base md:text-lg">
                      {album.attributes.artistName}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
