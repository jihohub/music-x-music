"use client";

import { useHeader } from "@/providers/HeaderProvider";
import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { setAlbumTheme, useThemeStore } from "@/stores/themeStore";
import { AppleMusicAlbum } from "@/types/apple-music";
import { useEffect, useState } from "react";
import { AlbumHeader } from "./components/AlbumHeader";
import { AlbumInfo } from "./components/AlbumInfo";
import { AlbumSkeleton } from "./components/AlbumSkeleton";
import { ErrorState } from "./components/ErrorState";
import { TrackList } from "./components/TrackList";

// 탭 타입 정의
type AlbumTabType = "tracks" | "info";

interface AlbumPageProps {
  album: AppleMusicAlbum | null;
  isLoading?: boolean;
  error?: string | null;
}

export function AlbumPage({
  album,
  isLoading = false,
  error = null,
}: AlbumPageProps) {
  const { setTitle } = useHeader();
  const { setPageTextColor } = useMusicPlayer();
  const { getDisplayColors } = useThemeStore();
  const [activeTab, setActiveTab] = useState<AlbumTabType>("tracks");

  // 테마 스토어에서 색상 가져오기
  const { backgroundColor, textColor, secondaryTextColor } = getDisplayColors();

  // 앨범 정보가 로드되면 Header title 설정 및 테마 적용
  useEffect(() => {
    if (album?.attributes?.name) {
      setTitle(album.attributes.name);
    }

    // 앨범 데이터가 있으면 테마 스토어에 색상 저장
    if (album) {
      setAlbumTheme(album);
    }

    // 페이지 색상 설정 (Footer에서 사용)
    if (album?.attributes?.artwork?.textColor1) {
      const pageTextColor = `#${album.attributes.artwork.textColor1}`;
      setPageTextColor(pageTextColor);
    }

    // 컴포넌트 언마운트 시 기본 title과 색상으로 복원
    return () => {
      setTitle("MUSIC X MUSIC");
      setPageTextColor("#ffffff");
    };
  }, [album, setTitle, setPageTextColor]);

  if (isLoading) {
    // 로딩 중일 때도 스토어의 색상 사용
    return <AlbumSkeleton bgColor={backgroundColor} textColor={textColor} />;
  }

  if (error || !album) {
    return <ErrorState error={error} />;
  }

  return (
    <div
      className="min-h-screen pb-32 md:pb-8 transition-colors duration-500"
      style={{ backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="md:pt-16">
          <AlbumHeader album={album} />
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
                    onClick={() => setActiveTab("info")}
                    className={`relative py-1 px-2 font-medium text-xs transition-all duration-200 cursor-pointer ${
                      activeTab === "info"
                        ? "font-semibold"
                        : "opacity-70 hover:opacity-90"
                    }`}
                    style={{ color: textColor }}
                  >
                    정보
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="mt-4">
            {activeTab === "tracks" && (
              <div className="space-y-6">
                <TrackList
                  album={album}
                  textColor1={textColor}
                  textColor2={secondaryTextColor}
                />
              </div>
            )}
            {activeTab === "info" && (
              <div className="space-y-6">
                <AlbumInfo
                  album={album}
                  textColor1={textColor}
                  textColor2={secondaryTextColor}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
