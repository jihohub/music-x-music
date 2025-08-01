"use client";

import { useHeader } from "@/providers/HeaderProvider";
import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { setArtistTheme, useThemeStore } from "@/stores/themeStore";
import {
  AppleMusicAlbum,
  AppleMusicArtist,
  AppleMusicTrack,
} from "@/types/apple-music";
import { useEffect, useState } from "react";
import { AlbumList } from "./components/AlbumList";
import { ArtistHeader } from "./components/ArtistHeader";
import { ArtistSkeleton } from "./components/ArtistSkeleton";
import { ErrorState } from "./components/ErrorState";
import { TopTracks } from "./components/TopTracks";

// 탭 타입 정의
type ArtistTabType = "tracks" | "albums";

interface ArtistPageProps {
  artist: AppleMusicArtist | undefined;
  topTracks: AppleMusicTrack[];
  albums: AppleMusicAlbum[];
  isLoading?: boolean;
  error?: string | null;
}

export function ArtistPage({
  artist,
  topTracks,
  albums,
  isLoading = false,
  error = null,
}: ArtistPageProps) {
  const { setTitle } = useHeader();
  const { setPageTextColor } = useMusicPlayer();
  const { getDisplayColors } = useThemeStore();
  const [activeTab, setActiveTab] = useState<ArtistTabType>("tracks");

  // 테마 스토어에서 색상 가져오기
  const { backgroundColor, textColor, secondaryTextColor } = getDisplayColors();

  // 아티스트 정보가 로드되면 Header title 설정 및 테마 적용
  useEffect(() => {
    if (artist?.attributes?.name) {
      setTitle(artist.attributes.name);
    }

    // 아티스트 데이터가 있으면 테마 스토어에 색상 저장
    if (artist) {
      setArtistTheme(artist);
    }

    // 페이지 색상 설정 (Footer에서 사용)
    if (artist?.attributes?.artwork?.textColor1) {
      const pageTextColor = `#${artist.attributes.artwork.textColor1}`;
      setPageTextColor(pageTextColor);
    }

    // 컴포넌트 언마운트 시 기본 title로 복원
    return () => {
      setTitle("MUSIC X MUSIC");
      setPageTextColor("#ffffff"); // 기본 색상으로 복원
    };
  }, [artist, setTitle, setPageTextColor]);

  if (isLoading) {
    // 로딩 중일 때도 스토어의 색상 사용
    return <ArtistSkeleton bgColor={backgroundColor} textColor={textColor} />;
  }

  if (error || !artist) {
    return <ErrorState error={error} />;
  }

  return (
    <div
      className="min-h-screen pb-32 md:pb-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="md:pt-16">
          <ArtistHeader artist={artist} />
        </div>

        {/* 컨텐츠 영역 */}
        <div className="px-4">
          {/* 탭 UI */}
          <div className="mt-2 mb-6 flex justify-center">
            <div className="relative">
              {/* 리퀴드글래스 배경 */}
              <div
                className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-black/15 border border-white/10 shadow-2xl rounded-full"
                style={{
                  boxShadow:
                    "0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/15 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/5 rounded-full"></div>
              </div>

              {/* 탭 컨텐츠 */}
              <div className="relative px-2.5 py-1.5">
                <div className="flex gap-1">
                  <a
                    onClick={() => setActiveTab("tracks")}
                    className={`relative py-1 px-2 font-medium text-xs transition-all duration-200 cursor-pointer ${
                      activeTab === "tracks"
                        ? "font-semibold"
                        : "opacity-70 hover:opacity-90"
                    }`}
                    style={{ color: textColor }}
                  >
                    트랙
                  </a>
                  <a
                    onClick={() => setActiveTab("albums")}
                    className={`relative py-1 px-2 font-medium text-xs transition-all duration-200 cursor-pointer ${
                      activeTab === "albums"
                        ? "font-semibold"
                        : "opacity-70 hover:opacity-90"
                    }`}
                    style={{ color: textColor }}
                  >
                    앨범
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="mt-4">
            {activeTab === "tracks" && (
              <TopTracks
                tracks={topTracks}
                textColor1={textColor}
                textColor2={secondaryTextColor}
              />
            )}
            {activeTab === "albums" && (
              <AlbumList
                albums={albums}
                textColor1={textColor}
                textColor2={secondaryTextColor}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
