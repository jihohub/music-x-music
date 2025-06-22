"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { AppleMusicArtist } from "@/types/apple-music";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-artist.jpg";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface ArtistHeaderProps {
  artist: AppleMusicArtist;
}

export const ArtistHeader = ({ artist }: ArtistHeaderProps) => {
  // 이미지 URL 가져오기
  const artistImage = getAppleMusicImageUrl(artist.attributes.artwork, "md");

  // 배경색 가져오기
  const bgColor = artist.attributes.artwork?.bgColor
    ? `#${artist.attributes.artwork.bgColor}`
    : "#1c1c1e";

  // 텍스트 색상 가져오기 (API에서 제공하는 색상 사용)
  const textColor1 = artist.attributes.artwork?.textColor1
    ? `#${artist.attributes.artwork.textColor1}`
    : "#ffffff";

  const textColor2 = artist.attributes.artwork?.textColor2
    ? `#${artist.attributes.artwork.textColor2}`
    : "#ffffff";

  return (
    <section className="px-4 pt-8" style={{ backgroundColor: bgColor }}>
      {/* 가로로 긴 투명 컨테이너 */}
      <div className="relative mx-auto">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
          {/* 가로 배치 컨텐츠 */}
          <div className="flex items-center gap-6 md:gap-8">
            {/* 아티스트 이미지 */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl overflow-hidden shadow-xl">
                <UnoptimizedImage
                  src={artistImage}
                  alt={artist.attributes.name}
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
                {artist.attributes.name}
              </h1>

              {/* 장르 태그들 */}
              {artist.attributes.genreNames &&
                artist.attributes.genreNames.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {artist.attributes.genreNames
                      .slice(0, 3)
                      .map((genre, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                          style={{ color: textColor2 }}
                        >
                          {genre}
                        </span>
                      ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
