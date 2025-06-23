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
  const albumImage = getAppleMusicImageUrl(album.attributes.artwork, "lg");

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      {/* 확대된 앨범 이미지 (블러된 배경) */}
      <div className="absolute inset-0 scale-150">
        <UnoptimizedImage
          src={albumImage}
          alt={album.attributes.name}
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
      </div>

      {/* 매우 강한 블러 효과 (더 밝게) */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/5"></div>

      {/* 원본 이미지 (상단 80px 떨어짐, 아이폰 곡률 border-top) */}
      <div
        className="absolute left-0 right-0 top-20 bottom-0 rounded-t-3xl overflow-hidden"
        style={{ borderTopLeftRadius: "24px", borderTopRightRadius: "24px" }}
      >
        <UnoptimizedImage
          src={albumImage}
          alt={album.attributes.name}
          fill
          sizes="100vw"
          className="object-cover"
        />

        {/* 텍스트 오버레이 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
            {album.attributes.name}
          </h1>

          {/* 아티스트명 태그 */}
          <div className="flex flex-wrap gap-2">
            {album.relationships?.artists?.data?.[0] ? (
              <Link
                href={`/artist/${album.relationships.artists.data[0].id}`}
                className="px-3 py-1 text-sm font-medium text-white bg-white/25 backdrop-blur-sm rounded-full border border-white/40 hover:bg-white/35 transition-colors"
              >
                {album.attributes.artistName}
              </Link>
            ) : (
              <span className="px-3 py-1 text-sm font-medium text-white bg-white/25 backdrop-blur-sm rounded-full border border-white/40">
                {album.attributes.artistName}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
