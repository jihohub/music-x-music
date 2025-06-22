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
  // 이미지 URL 가져오기
  const albumImage = getAppleMusicImageUrl(album.attributes.artwork, "md");

  // 배경색 가져오기
  const bgColor = album.attributes.artwork?.bgColor
    ? `#${album.attributes.artwork.bgColor}`
    : "#1c1c1e";

  // 텍스트 색상 가져오기 (API에서 제공하는 색상 사용)
  const textColor1 = album.attributes.artwork?.textColor1
    ? `#${album.attributes.artwork.textColor1}`
    : "#ffffff";

  const textColor2 = album.attributes.artwork?.textColor2
    ? `#${album.attributes.artwork.textColor2}`
    : "#ffffff";

  return (
    <section className="px-4 pt-8" style={{ backgroundColor: bgColor }}>
      {/* 가로로 긴 투명 컨테이너 */}
      <div className="relative mx-auto">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
          {/* 가로 배치 컨텐츠 */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* 앨범 이미지 */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl">
                <UnoptimizedImage
                  src={albumImage}
                  alt={album.attributes.name}
                  fill
                  sizes="(max-width: 768px) 80px, 128px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* 텍스트 정보 */}
            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight"
                style={{ color: textColor1 }}
              >
                {album.attributes.name}
              </h1>

              {/* 아티스트명 태그 */}
              <div className="flex flex-wrap gap-2">
                {album.relationships?.artists?.data?.[0] ? (
                  <Link
                    href={`/artist/${album.relationships.artists.data[0].id}`}
                    className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full border border-white/30 hover:bg-white/30 transition-colors"
                    style={{ color: textColor2 }}
                  >
                    {album.attributes.artistName}
                  </Link>
                ) : (
                  <span
                    className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                    style={{ color: textColor2 }}
                  >
                    {album.attributes.artistName}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
