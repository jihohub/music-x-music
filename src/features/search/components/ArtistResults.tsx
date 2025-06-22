"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { AppleMusicArtist } from "@/types/apple-music";
import Link from "next/link";

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

interface ArtistResultsProps {
  artists: AppleMusicArtist[];
  limit?: number;
  isLoading?: boolean;
  isFeatured?: boolean; // 크게 표시하는 모드 (전체 탭)
  isHorizontal?: boolean; // 가로 배치 모드 (아티스트 탭)
}

export const ArtistResults = ({
  artists,
  limit,
  isLoading = false,
  isFeatured = false,
  isHorizontal = false,
}: ArtistResultsProps) => {
  if (artists.length === 0 && !isLoading) return null;
  // 전체 탭에서는 4개, 각 탭에서는 8개씩 표시
  const itemLimit = 4;

  // 아티스트 탭 가로 배치 스켈레톤 UI
  if (isLoading && isHorizontal) {
    return (
      <div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl animate-pulse"
        style={{ minHeight: "70vh" }}
      ></div>
    );
  }

  // Featured 모드 스켈레톤 UI
  if (isLoading && isFeatured) {
    return (
      <>
        <style>
          {`
            .featured-skeleton {
              min-height: 430px;
            }
            @media (min-width: 768px) {
              .featured-skeleton {
                min-height: 321.33px;
              }
            }
          `}
        </style>
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl animate-pulse featured-skeleton"></div>
      </>
    );
  }

  // 스켈레톤 UI
  if (isLoading) {
    return (
      <div
        className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl animate-pulse"
        style={{ minHeight: "70vh" }}
      ></div>
    );
  }

  // Featured 모드 렌더링 (전체 탭에서 첫 번째 아티스트)
  if (isFeatured && artists.length > 0) {
    const artist = artists[0];
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-4">
          {/* 모바일: 세로 레이아웃 */}
          <div className="flex justify-center md:hidden">
            <div className="w-full max-w-sm">
              <Link href={`/artist/${artist.id}`} className="group block">
                <div className="relative">
                  {/* 이미지 */}
                  <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg shadow-lg">
                    <UnoptimizedImage
                      src={getAppleMusicImageUrl(
                        artist.attributes.artwork,
                        "lg"
                      )}
                      alt={artist.attributes.name}
                      fill
                      sizes="80vw"
                      className="object-cover"
                    />
                  </div>

                  {/* 유리 효과 레이어들 */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none">
                    {/* 베이스 유리 */}
                    <div
                      className="absolute inset-0 rounded-2xl border border-white/20"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)",
                        boxShadow:
                          "inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.15)",
                      }}
                    ></div>

                    {/* 상단 하이라이트 (유리 반사) */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1/3 rounded-t-2xl"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 70%, transparent 100%)",
                      }}
                    ></div>

                    {/* 측면 하이라이트 */}
                    <div
                      className="absolute top-1.5 left-1.5 w-4 h-8 rounded-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)",
                        filter: "blur(0.5px)",
                      }}
                    ></div>
                  </div>
                </div>
                <div className="text-center mt-4">
                  <h3 className="text-lg font-bold truncate text-white">
                    {artist.attributes.name}
                  </h3>
                  <p className="text-white/70 truncate mt-1">
                    {artist.attributes.genreNames?.[0] || "아티스트"}
                  </p>
                </div>
              </Link>
            </div>
          </div>
          {/* 데스크탑: 가로 레이아웃 */}
          <div className="hidden md:flex items-center gap-8">
            <div className="w-1/3 aspect-square">
              <Link href={`/artist/${artist.id}`} className="group block">
                <div className="relative">
                  {/* 이미지 */}
                  <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg shadow-lg">
                    <UnoptimizedImage
                      src={getAppleMusicImageUrl(
                        artist.attributes.artwork,
                        "lg"
                      )}
                      alt={artist.attributes.name}
                      fill
                      sizes="33vw"
                      className="object-cover"
                    />
                  </div>

                  {/* 유리 효과 레이어들 */}
                  <div className="absolute inset-0 rounded-2xl pointer-events-none">
                    {/* 베이스 유리 */}
                    <div
                      className="absolute inset-0 rounded-2xl border border-white/20"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 100%)",
                        boxShadow:
                          "inset 0 1px 1px rgba(255,255,255,0.4), inset 0 -1px 1px rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.15)",
                      }}
                    ></div>

                    {/* 상단 하이라이트 (유리 반사) */}
                    <div
                      className="absolute top-0 left-0 right-0 h-1/3 rounded-t-2xl"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 70%, transparent 100%)",
                      }}
                    ></div>

                    {/* 측면 하이라이트 */}
                    <div
                      className="absolute top-1.5 left-1.5 w-4 h-8 rounded-lg"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)",
                        filter: "blur(0.5px)",
                      }}
                    ></div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="flex-1">
              <Link href={`/artist/${artist.id}`} className="group block">
                <h3 className="text-2xl font-bold truncate mb-2 text-white">
                  {artist.attributes.name}
                </h3>
                <p className="text-white/70 truncate">
                  {artist.attributes.genreNames?.[0] || "아티스트"}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 아티스트 탭 가로 배치 모드 렌더링 - 트랙 스타일로 변경
  if (isHorizontal && artists.length > 0) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <div className="space-y-4">
          {artists.map((artist) => (
            <div
              key={artist.id}
              className="group flex items-center gap-3 md:gap-4 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Link
                href={`/artist/${artist.id}`}
                className="relative w-12 h-12 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0"
              >
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(artist.attributes.artwork, "sm")}
                  alt={artist.attributes.name}
                  width={64}
                  height={64}
                  className="rounded-2xl"
                />
              </Link>

              <Link
                href={`/artist/${artist.id}`}
                className="flex-1 min-w-0 text-left"
              >
                <h3 className="font-medium text-sm md:text-base truncate group-hover:text-primary transition-colors text-white">
                  {artist.attributes.name}
                </h3>
                <p className="text-xs md:text-sm text-white/70 truncate">
                  {artist.attributes.genreNames?.[0] || "아티스트"}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 일반 그리드 모드 렌더링
  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <div key={artist.id}>
            <Link href={`/artist/${artist.id}`} className="group">
              <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(artist.attributes.artwork, "md")}
                  alt={artist.attributes.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-semibold truncate mt-2 text-white">
                {artist.attributes.name}
              </h3>
              <p className="text-sm text-white/70 truncate">
                {artist.attributes.genreNames?.[0] || "아티스트"}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistResults;
