"use client";

import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { memo, useEffect, useState } from "react";
import {
  IoExpand,
  IoPauseSharp,
  IoPlayBackSharp,
  IoPlayForwardSharp,
  IoPlaySharp,
} from "react-icons/io5";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" | "xl" = "md"
): string {
  if (!artwork?.url) {
    return "";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
    xl: "2000x2000",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

// hex 색상에 투명도를 추가하는 함수
const addAlpha = (hex: string, alpha: number): string => {
  // hex에서 # 제거
  const color = hex.replace("#", "");

  // 3자리 hex를 6자리로 확장
  const fullColor =
    color.length === 3
      ? color
          .split("")
          .map((char) => char + char)
          .join("")
      : color;

  // RGB 변환
  const r = parseInt(fullColor.substring(0, 2), 16);
  const g = parseInt(fullColor.substring(2, 4), 16);
  const b = parseInt(fullColor.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// 시간 포맷팅 함수
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default memo(function MusicPlayer() {
  const {
    currentTrack,
    isPlayerVisible,
    isPlaying,
    currentTime,
    duration,
    isUsingMusicKit,
    isFullScreen,
    isExpanded,
    audioRef,
    togglePlayback,
    seekTo,
    hidePlayer,
    closePlayer,
    expandPlayer,
    collapsePlayer,
    toggleExpanded,
    maximizePlayer,
    getWidgetTextColor,
  } = useMusicPlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [dominantColor, setDominantColor] = useState("#1c1c1e");

  // 드래그 상태 관리 (모바일용)
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // 애니메이션 전환 상태 관리
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationState, setAnimationState] = useState<
    "mini" | "expanded" | "full" | "hidden"
  >("hidden");

  // 드래그 임계값
  const closeThreshold =
    typeof window !== "undefined" ? window.innerHeight * 0.33 : 200;
  const maxDrag = typeof window !== "undefined" ? window.innerHeight : 600;

  // 배경 스크롤 차단
  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullScreen]);

  // 터치 이벤트 핸들러 (드래그 핸들 영역에서만 작동)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isClosing || !isFullScreen) return;
    setIsDragging(true);
    setStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isClosing || !isFullScreen) return;

    const currentY = e.targetTouches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) {
      setDragY(Math.min(deltaY, maxDrag));
    }
  };

  const handleTouchEnd = () => {
    if (isClosing || !isFullScreen) return;
    setIsDragging(false);

    if (dragY > closeThreshold) {
      setIsClosing(true);
      setDragY(window.innerHeight);
      setTimeout(() => {
        collapsePlayer();
        setIsClosing(false);
        setDragY(0);
      }, 300);
    } else {
      setDragY(0);
    }
  };

  // 트랙이 변경될 때 색상 설정
  useEffect(() => {
    if (currentTrack) {
      if (currentTrack.attributes.artwork?.bgColor) {
        const hexColor = `#${currentTrack.attributes.artwork.bgColor}`;
        setDominantColor(hexColor);
      } else {
        setDominantColor("#1c1c1e");
      }

      // 오디오 소스 설정
      if (audioRef.current && !isUsingMusicKit) {
        const previewUrl = currentTrack.attributes.previews?.[0]?.url;
        if (previewUrl) {
          audioRef.current.src = previewUrl;
          audioRef.current.load();
        }
      }

      // 이미지 프리로딩
      if (currentTrack.attributes.artwork?.url) {
        const img = new Image();
        img.src = getAppleMusicImageUrl(currentTrack.attributes.artwork, "xl");
      }
    } else {
      setDominantColor("#1c1c1e");
    }
  }, [currentTrack, isUsingMusicKit, audioRef]);

  // 애니메이션 상태 관리
  useEffect(() => {
    if (!isPlayerVisible) {
      setAnimationState("hidden");
      return;
    }

    const currentState: "mini" | "expanded" | "full" | "hidden" = isFullScreen
      ? "full"
      : isExpanded
      ? "expanded"
      : "mini";

    if (currentState !== animationState) {
      setIsTransitioning(true);
      setAnimationState(currentState);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  }, [isPlayerVisible, isFullScreen, isExpanded, animationState]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasPreview = currentTrack?.attributes.previews?.[0]?.url;
  const canPlay = isUsingMusicKit || hasPreview;
  const widgetTextColor = getWidgetTextColor();

  if (!isPlayerVisible || !currentTrack || animationState === "hidden")
    return null;

  return (
    <>
      {/* 전체 화면 플레이어 - 모바일 */}
      <div
        className={`md:hidden fixed inset-0 z-50 flex flex-col transition-all duration-500 ease-out ${
          animationState === "full"
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{
          transform: `translateY(${
            animationState === "full" ? dragY : "100vh"
          })`,
          transition: isDragging
            ? "none"
            : "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* 배경 레이어 */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              ${dominantColor} 0%, 
              ${dominantColor} 40%, 
              #000000 100%)`,
          }}
        />

        {/* 리퀴드글래스 플레이어 레이어 */}
        <div className="relative z-10 w-full h-full flex flex-col backdrop-blur-md bg-white/5">
          {/* 상단 네비게이션 - 드래그 핸들 */}
          <div className="flex items-center justify-center p-4">
            <div
              className="flex flex-col items-center justify-center py-4 px-8 cursor-grab active:cursor-grabbing touch-manipulation"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onClick={collapsePlayer}
            >
              <div
                className={`w-10 h-1 bg-white/40 rounded-full transition-all duration-200 ${
                  isDragging ? "bg-white/60 w-12" : ""
                }`}
              />
            </div>
          </div>

          {/* 메인 컨텐츠 */}
          <div className="flex-1 flex flex-col items-center justify-between px-6 pb-16">
            {/* 앨범 아트 */}
            <div className="relative mb-12">
              <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl">
                {currentTrack.attributes.artwork?.url ? (
                  <img
                    src={getAppleMusicImageUrl(
                      currentTrack.attributes.artwork,
                      "xl"
                    )}
                    alt={currentTrack.attributes.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${addAlpha(
                        dominantColor,
                        0.8
                      )} 0%, ${addAlpha(dominantColor, 0.4)} 100%)`,
                    }}
                  >
                    <div className="text-white/60">
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 트랙 정보 */}
            <div className="text-center mb-12 max-w-md">
              <h1 className="text-2xl font-bold text-white mb-2 leading-tight">
                {currentTrack.attributes.name}
              </h1>
              <p className="text-lg text-white/80">
                {currentTrack.attributes.artistName}
              </p>
            </div>

            {/* 진행 바 */}
            {canPlay && (
              <div className="w-full max-w-md mb-8">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer range-slider"
                    style={{
                      background: `linear-gradient(to right, 
                        ${addAlpha(dominantColor, 1)} 0%, 
                        ${addAlpha(dominantColor, 1)} ${progress}%, 
                        rgba(255, 255, 255, 0.3) ${progress}%, 
                        rgba(255, 255, 255, 0.3) 100%)`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-white/60 mt-2">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* 컨트롤 버튼 */}
            <div className="flex items-center justify-center gap-8">
              <button className="w-16 h-16 flex items-center justify-center text-white hover:text-white/80 transition-all duration-200 active:scale-90">
                <IoPlayBackSharp size={32} />
              </button>

              <button
                onClick={togglePlayback}
                disabled={!canPlay}
                className={`w-16 h-16 flex items-center justify-center transition-all duration-200 active:scale-90 ${
                  canPlay
                    ? "text-white hover:text-white/80"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                {isPlaying ? (
                  <IoPauseSharp size={32} />
                ) : (
                  <IoPlaySharp size={32} />
                )}
              </button>

              <button className="w-16 h-16 flex items-center justify-center text-white hover:text-white/80 transition-all duration-200 active:scale-90">
                <IoPlayForwardSharp size={32} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 전체 화면 플레이어 - 데스크탑 */}
      <div
        className={`hidden md:block fixed inset-0 z-50 transition-all duration-500 ease-out ${
          animationState === "full"
            ? "opacity-100 backdrop-blur-xl"
            : "opacity-0 backdrop-blur-0 pointer-events-none"
        }`}
        style={{
          background:
            animationState === "full"
              ? `linear-gradient(135deg, ${addAlpha(
                  dominantColor,
                  0.8
                )} 0%, ${addAlpha(dominantColor, 0.4)} 100%)`
              : "transparent",
        }}
      >
        <div className="w-full h-full flex items-center justify-center p-8">
          <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* 앨범 아트 */}
            <div className="flex justify-center">
              <div className="w-96 h-96 rounded-3xl overflow-hidden shadow-2xl">
                {currentTrack.attributes.artwork?.url ? (
                  <img
                    src={getAppleMusicImageUrl(
                      currentTrack.attributes.artwork,
                      "xl"
                    )}
                    alt={currentTrack.attributes.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${addAlpha(
                        dominantColor,
                        0.8
                      )} 0%, ${addAlpha(dominantColor, 0.4)} 100%)`,
                    }}
                  >
                    <div className="text-white/60">
                      <svg
                        width="120"
                        height="120"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 컨트롤 패널 */}
            <div className="space-y-8">
              {/* 닫기 버튼 */}
              <div className="flex justify-end">
                <button
                  onClick={collapsePlayer}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                >
                  <svg
                    className="w-6 h-6"
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

              {/* 트랙 정보 */}
              <div>
                <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
                  {currentTrack.attributes.name}
                </h1>
                <p className="text-2xl text-white/80">
                  {currentTrack.attributes.artistName}
                </p>
              </div>

              {/* 진행 바 */}
              {canPlay && (
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={(e) => seekTo(Number(e.target.value))}
                      className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer range-slider"
                      style={{
                        background: `linear-gradient(to right, 
                          ${addAlpha(dominantColor, 1)} 0%, 
                          ${addAlpha(dominantColor, 1)} ${progress}%, 
                          rgba(255, 255, 255, 0.3) ${progress}%, 
                          rgba(255, 255, 255, 0.3) 100%)`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* 컨트롤 버튼 */}
              <div className="flex items-center justify-center gap-8">
                <button className="w-16 h-16 flex items-center justify-center text-white hover:text-white/80 transition-all duration-200 active:scale-90">
                  <IoPlayBackSharp size={36} />
                </button>

                <button
                  onClick={togglePlayback}
                  disabled={!canPlay}
                  className={`w-20 h-20 flex items-center justify-center transition-all duration-200 active:scale-90 ${
                    canPlay
                      ? "hover:opacity-80"
                      : "cursor-not-allowed opacity-50"
                  }`}
                >
                  {isPlaying ? (
                    <IoPauseSharp size={40} />
                  ) : (
                    <IoPlaySharp size={40} />
                  )}
                </button>

                <button className="w-16 h-16 flex items-center justify-center text-white hover:text-white/80 transition-all duration-200 active:scale-90">
                  <IoPlayForwardSharp size={36} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 미니 플레이어 - 모바일 */}
      <div
        className={`md:hidden fixed bottom-24 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          animationState === "mini"
            ? "translate-y-0 opacity-100"
            : animationState === "full"
            ? "-translate-y-full opacity-0"
            : "translate-y-full opacity-0"
        }`}
      >
        <div className="w-[75vw] max-w-md mx-auto">
          <div
            className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-2xl border border-white/20 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105"
            style={{
              background: `linear-gradient(135deg, 
                ${addAlpha(dominantColor, 0.3)} 0%, 
                ${addAlpha(dominantColor, 0.2)} 50%, 
                ${addAlpha(dominantColor, 0.9)} 100%)`,
            }}
            onClick={expandPlayer}
          >
            <div className="flex items-center gap-3 px-3 py-1">
              {/* 앨범 아트 */}
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                {currentTrack.attributes.artwork?.url ? (
                  <img
                    src={getAppleMusicImageUrl(
                      currentTrack.attributes.artwork,
                      "sm"
                    )}
                    alt={currentTrack.attributes.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, ${addAlpha(
                        dominantColor,
                        0.8
                      )} 0%, ${addAlpha(dominantColor, 0.4)} 100%)`,
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="text-white/60"
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 트랙 정보 */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-xs font-semibold truncate leading-tight"
                  style={{ color: widgetTextColor }}
                >
                  {currentTrack.attributes.name}
                </h3>
                <p
                  className="text-[10px] truncate leading-tight"
                  style={{ color: `${widgetTextColor}B3` }}
                >
                  {currentTrack.attributes.artistName}
                </p>
              </div>

              {/* 컨트롤 버튼 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayback();
                  }}
                  disabled={!canPlay}
                  className={`w-7 h-7 flex items-center justify-center transition-all duration-200 active:scale-95 ${
                    canPlay
                      ? "hover:opacity-80"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={{
                    color: canPlay ? widgetTextColor : `${widgetTextColor}66`,
                  }}
                >
                  {isPlaying ? (
                    <IoPauseSharp size={16} />
                  ) : (
                    <IoPlaySharp size={16} className="translate-x-0.5" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closePlayer();
                  }}
                  className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  style={{ color: `${widgetTextColor}B3` }}
                >
                  <svg
                    className="w-3 h-3"
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
              <div className="px-3 pb-1" onClick={(e) => e.stopPropagation()}>
                <div
                  className="relative cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const width = rect.width;
                    const clickPercent = clickX / width;
                    const newTime = clickPercent * duration;
                    seekTo(newTime);
                  }}
                >
                  <div className="h-0.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        background: addAlpha(dominantColor, 1),
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 미니 플레이어 - 데스크탑 */}
      <div
        className={`hidden md:block fixed bottom-8 right-6 z-50 w-80 transition-all duration-500 ease-out cursor-pointer ${
          animationState === "mini"
            ? "translate-y-0 opacity-100 scale-100"
            : animationState === "expanded" || animationState === "full"
            ? "translate-y-8 opacity-0 scale-95"
            : "translate-y-8 opacity-0 scale-95"
        }`}
        onClick={toggleExpanded}
      >
        <div
          className="backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105"
          style={{
            background: `linear-gradient(135deg, 
              ${addAlpha(dominantColor, 0.3)} 0%, 
              ${addAlpha(dominantColor, 0.2)} 50%, 
              ${addAlpha(dominantColor, 0.9)} 100%)`,
          }}
        >
          <div className="flex items-center gap-3 p-2">
            {/* 앨범 아트 */}
            <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              {currentTrack.attributes.artwork?.url ? (
                <img
                  src={getAppleMusicImageUrl(
                    currentTrack.attributes.artwork,
                    "sm"
                  )}
                  alt={currentTrack.attributes.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${addAlpha(
                      dominantColor,
                      0.8
                    )} 0%, ${addAlpha(dominantColor, 0.4)} 100%)`,
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-white/60"
                  >
                    <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                  </svg>
                </div>
              )}
            </div>

            {/* 트랙 정보 */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-semibold truncate"
                style={{ color: widgetTextColor }}
              >
                {currentTrack.attributes.name}
              </h3>
              <p
                className="text-xs truncate"
                style={{ color: `${widgetTextColor}B3` }}
              >
                {currentTrack.attributes.artistName}
              </p>
            </div>

            {/* 컨트롤 버튼 */}
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlayback();
                }}
                disabled={!canPlay}
                className={`w-8 h-8 flex items-center justify-center transition-all duration-200 active:scale-95 ${
                  canPlay ? "hover:opacity-80" : "cursor-not-allowed opacity-50"
                }`}
                style={{
                  color: canPlay ? widgetTextColor : `${widgetTextColor}66`,
                }}
              >
                {isPlaying ? (
                  <IoPauseSharp size={18} />
                ) : (
                  <IoPlaySharp size={18} className="translate-x-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closePlayer();
                }}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                style={{ color: `${widgetTextColor}B3` }}
              >
                <svg
                  className="w-3.5 h-3.5"
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
            <div className="px-2 pb-2" onClick={(e) => e.stopPropagation()}>
              <div
                className="relative cursor-pointer py-1.5"
                onClick={(e) => {
                  e.stopPropagation();
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const width = rect.width;
                  const clickPercent = clickX / width;
                  const newTime = clickPercent * duration;
                  seekTo(newTime);
                }}
              >
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: addAlpha(dominantColor, 1),
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 확장 플레이어 - 데스크탑 */}
      <div
        className={`hidden md:block fixed bottom-8 right-6 z-50 w-96 h-[520px] transition-all duration-500 ease-out ${
          animationState === "expanded"
            ? "translate-y-0 opacity-100 scale-100"
            : animationState === "mini"
            ? "translate-y-8 opacity-0 scale-95"
            : "translate-y-8 opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className="h-full rounded-2xl border border-white/20 shadow-2xl overflow-hidden backdrop-blur-md"
          style={{
            background: `linear-gradient(135deg, 
              ${addAlpha(dominantColor, 0.3)} 0%, 
              ${addAlpha(dominantColor, 0.2)} 50%, 
              ${addAlpha(dominantColor, 0.9)} 100%)`,
          }}
        >
          {/* 상단 버튼 */}
          <div className="flex items-center justify-between p-3">
            <button
              onClick={toggleExpanded}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <div className="w-4 h-0.5 bg-white/50 rounded-full" />
            </button>
            <button
              onClick={maximizePlayer}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <IoExpand size={16} />
            </button>
          </div>

          {/* 앨범 아트 */}
          <div className="flex justify-center mb-6">
            <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-lg">
              {currentTrack.attributes.artwork?.url ? (
                <img
                  src={getAppleMusicImageUrl(
                    currentTrack.attributes.artwork,
                    "lg"
                  )}
                  alt={currentTrack.attributes.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${addAlpha(
                      dominantColor,
                      0.8
                    )} 0%, ${addAlpha(dominantColor, 0.4)} 100%)`,
                  }}
                >
                  <div className="text-white/60">
                    <svg
                      width="64"
                      height="64"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 트랙 정보 */}
          <div className="text-center mb-6 px-4">
            <h3
              className="text-lg font-bold mb-1 leading-tight"
              style={{ color: widgetTextColor }}
            >
              {currentTrack.attributes.name}
            </h3>
            <p className="text-sm" style={{ color: `${widgetTextColor}B3` }}>
              {currentTrack.attributes.artistName}
            </p>
          </div>

          {/* 진행 바 */}
          {canPlay && (
            <div className="px-4 mb-6">
              <div className="relative">
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seekTo(Number(e.target.value))}
                  className="w-full h-2 bg-white/30 rounded-lg appearance-none cursor-pointer range-slider"
                  style={{
                    background: `linear-gradient(to right, 
                      ${addAlpha(dominantColor, 1)} 0%, 
                      ${addAlpha(dominantColor, 1)} ${progress}%, 
                      rgba(255, 255, 255, 0.3) ${progress}%, 
                      rgba(255, 255, 255, 0.3) 100%)`,
                  }}
                />
              </div>
              <div
                className="flex justify-between text-xs mt-2"
                style={{ color: `${widgetTextColor}99` }}
              >
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          )}

          {/* 컨트롤 버튼 */}
          <div className="flex items-center justify-center gap-6 px-4">
            <button
              className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-all duration-200 active:scale-90"
              style={{ color: widgetTextColor }}
            >
              <IoPlayBackSharp size={24} />
            </button>

            <button
              onClick={togglePlayback}
              disabled={!canPlay}
              className={`w-16 h-16 flex items-center justify-center transition-all duration-200 active:scale-90 ${
                canPlay ? "hover:opacity-80" : "cursor-not-allowed opacity-50"
              }`}
              style={{
                color: canPlay ? widgetTextColor : `${widgetTextColor}66`,
              }}
            >
              {isPlaying ? (
                <IoPauseSharp size={32} />
              ) : (
                <IoPlaySharp size={32} className="translate-x-0.5" />
              )}
            </button>

            <button
              className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-all duration-200 active:scale-90"
              style={{ color: widgetTextColor }}
            >
              <IoPlayForwardSharp size={24} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
});

// CSS 스타일 추가
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .range-slider::-webkit-slider-thumb {
      appearance: none;
      width: 0;
      height: 0;
      background: transparent;
      cursor: pointer;
      border: none;
    }
    
    .range-slider::-moz-range-thumb {
      width: 0;
      height: 0;
      background: transparent;
      cursor: pointer;
      border: none;
      border-radius: 0;
    }
    
    .range-slider::-ms-thumb {
      width: 0;
      height: 0;
      background: transparent;
      cursor: pointer;
      border: none;
    }
  `;

  if (!document.head.querySelector("style[data-range-slider]")) {
    style.setAttribute("data-range-slider", "true");
    document.head.appendChild(style);
  }
}
