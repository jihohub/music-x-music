"use client";

import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { useEffect, useState } from "react";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/default-album.png";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

export default function MusicPlayer() {
  const {
    currentTrack,
    isPlayerVisible,
    isPlaying,
    currentTime,
    duration,
    isUsingMusicKit,
    audioRef,
    togglePlayback,
    seekTo,
    hidePlayer,
  } = useMusicPlayer();

  const [isExpanded, setIsExpanded] = useState(false);
  const [dominantColor, setDominantColor] = useState("255, 255, 255");

  // 트랙이 변경될 때 audio src 업데이트 (프리뷰 재생용)
  useEffect(() => {
    if (currentTrack && audioRef.current && !isUsingMusicKit) {
      const previewUrl = currentTrack.attributes.previews?.[0]?.url;
      console.log("프리뷰 URL 설정:", previewUrl);
      if (previewUrl) {
        audioRef.current.src = previewUrl;
        audioRef.current.load();
      } else {
        console.log("프리뷰 URL이 없습니다:", currentTrack.attributes.name);
      }
    }
  }, [currentTrack, isUsingMusicKit, audioRef]);

  // 앨범 아트에서 색상 추출
  useEffect(() => {
    if (currentTrack?.attributes.artwork?.bgColor) {
      setDominantColor(currentTrack.attributes.artwork.bgColor);
    }
  }, [currentTrack]);

  // 진행률 계산
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 시간 포맷팅 함수
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // 프리뷰가 없는 경우 처리
  const hasPreview = currentTrack?.attributes.previews?.[0]?.url;
  const canPlay = isUsingMusicKit || hasPreview;

  // 디버깅 정보 출력
  useEffect(() => {
    if (currentTrack) {
      console.log("현재 트랙:", currentTrack.attributes.name);
      console.log("MusicKit 사용 중:", isUsingMusicKit);
      console.log("프리뷰 URL 있음:", !!hasPreview);
      console.log("재생 가능:", canPlay);
    }
  }, [currentTrack, isUsingMusicKit, hasPreview, canPlay]);

  if (!isPlayerVisible || !currentTrack) return null;

  return (
    <>
      {/* 모바일/태블릿 컴팩트 플레이어 */}
      <div className="fixed bottom-16 left-0 right-0 z-40 md:hidden">
        <div
          className="mx-2 mb-2 backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, rgba(${dominantColor}, 0.1) 0%, rgba(255, 105, 180, 0.1) 50%, rgba(138, 43, 226, 0.1) 100%)`,
          }}
        >
          <div className="flex items-center gap-3 p-3">
            {/* 앨범 아트 */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <img
                src={getAppleMusicImageUrl(
                  currentTrack.attributes.artwork,
                  "sm"
                )}
                alt={currentTrack.attributes.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "/images/default-album.png";
                }}
              />
            </div>

            {/* 트랙 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">
                {currentTrack.attributes.name}
              </h3>
              <p className="text-xs text-white/70 truncate">
                {currentTrack.attributes.artistName}
              </p>
              {/* 재생 모드 표시 */}
              <div className="flex items-center gap-1 mt-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isUsingMusicKit
                      ? "bg-green-400"
                      : hasPreview
                      ? "bg-blue-400"
                      : "bg-red-400"
                  }`}
                />
                <span className="text-xs text-white/60">
                  {isUsingMusicKit
                    ? "전체곡"
                    : hasPreview
                    ? "30초 프리뷰"
                    : "재생 불가"}
                </span>
              </div>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlayback}
                disabled={!canPlay}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  canPlay
                    ? "bg-white/20 hover:bg-white/30 text-white active:scale-95"
                    : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
                } ${isPlaying ? "animate-pulse" : ""}`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {isPlaying ? (
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-current rounded"></div>
                      <div className="w-1 h-4 bg-current rounded"></div>
                    </div>
                  ) : (
                    <div className="w-0 h-0 border-l-[6px] border-l-current border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
                  )}
                </div>
              </button>

              <button
                onClick={hidePlayer}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 진행 바 */}
          {canPlay && (
            <div className="px-3 pb-3">
              <div className="relative">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-violet-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {/* 시간 표시 */}
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 프리뷰 없음 메시지 */}
          {!canPlay && (
            <div className="px-3 pb-3">
              <p className="text-xs text-white/60 text-center">
                이 곡은 프리뷰를 제공하지 않습니다
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 데스크톱 플레이어 */}
      <div className="hidden md:block fixed bottom-4 right-4 z-40">
        <div
          className={`backdrop-blur-md bg-white/10 dark:bg-black/20 rounded-2xl border border-white/20 shadow-2xl transition-all duration-300 ${
            isExpanded ? "w-96" : "w-80"
          }`}
          style={{
            background: `linear-gradient(135deg, rgba(${dominantColor}, 0.1) 0%, rgba(255, 105, 180, 0.1) 50%, rgba(138, 43, 226, 0.1) 100%)`,
          }}
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              {/* 앨범 아트 */}
              <div
                className={`relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 transition-all duration-300 ${
                  isExpanded ? "w-20 h-20" : "w-16 h-16"
                }`}
              >
                <img
                  src={getAppleMusicImageUrl(
                    currentTrack.attributes.artwork,
                    isExpanded ? "md" : "sm"
                  )}
                  alt={currentTrack.attributes.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "/images/default-album.png";
                  }}
                />
              </div>

              {/* 트랙 정보 */}
              <div className="flex-1 min-w-0">
                <h3
                  className={`font-semibold text-white truncate transition-all duration-300 ${
                    isExpanded ? "text-lg" : "text-base"
                  }`}
                >
                  {currentTrack.attributes.name}
                </h3>
                <p
                  className={`text-white/70 truncate transition-all duration-300 ${
                    isExpanded ? "text-base" : "text-sm"
                  }`}
                >
                  {currentTrack.attributes.artistName}
                </p>
                <p
                  className={`text-white/50 truncate transition-all duration-300 ${
                    isExpanded ? "text-sm" : "text-xs"
                  }`}
                >
                  {currentTrack.attributes.albumName}
                </p>

                {/* 재생 모드 표시 */}
                <div className="flex items-center gap-2 mt-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isUsingMusicKit
                        ? "bg-green-400"
                        : hasPreview
                        ? "bg-blue-400"
                        : "bg-red-400"
                    }`}
                  />
                  <span className="text-xs text-white/60">
                    {isUsingMusicKit
                      ? "Apple Music 전체곡"
                      : hasPreview
                      ? "30초 프리뷰"
                      : "재생 불가"}
                  </span>
                </div>
              </div>

              {/* 컨트롤 버튼 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    {isExpanded ? (
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    ) : (
                      <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12z"
                        clipRule="evenodd"
                      />
                    )}
                  </svg>
                </button>

                <button
                  onClick={togglePlayback}
                  disabled={!canPlay}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    canPlay
                      ? "bg-white/20 hover:bg-white/30 text-white active:scale-95"
                      : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
                  } ${isPlaying ? "animate-pulse" : ""}`}
                >
                  <div className="w-6 h-6 flex items-center justify-center">
                    {isPlaying ? (
                      <div className="flex gap-1">
                        <div className="w-1.5 h-5 bg-current rounded"></div>
                        <div className="w-1.5 h-5 bg-current rounded"></div>
                      </div>
                    ) : (
                      <div className="w-0 h-0 border-l-[8px] border-l-current border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5" />
                    )}
                  </div>
                </button>

                <button
                  onClick={hidePlayer}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* 진행 바 및 컨트롤 (확장 모드) */}
            {isExpanded && canPlay && (
              <div className="mt-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer range-slider"
                  />
                </div>
                <div className="flex justify-between text-sm text-white/60 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* 프리뷰 없음 메시지 (확장 모드) */}
            {isExpanded && !canPlay && (
              <div className="mt-4">
                <p className="text-sm text-white/60 text-center">
                  이 곡은 프리뷰를 제공하지 않습니다
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS 스타일 */}
      <style jsx>{`
        .range-slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .range-slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ec4899, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </>
  );
}
