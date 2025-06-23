"use client";

import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { memo, useEffect, useState } from "react";
import {
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
    audioRef,
    togglePlayback,
    seekTo,
    hidePlayer,
    closePlayer,
    expandPlayer,
    collapsePlayer,
    getWidgetTextColor,
  } = useMusicPlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [dominantColor, setDominantColor] = useState("#1c1c1e"); // hex 코드 그대로 사용

  // 드래그 상태 관리
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // 드래그 임계값
  const closeThreshold =
    typeof window !== "undefined" ? window.innerHeight * 0.33 : 200;
  const maxDrag = typeof window !== "undefined" ? window.innerHeight : 600;

  // 터치 이벤트 핸들러
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

  // 트랙이 변경될 때 audio src 업데이트 및 색상 설정
  useEffect(() => {
    // currentTrack이 있을 때마다 배경색 강제 설정
    if (currentTrack) {
      // 배경색 설정 - hex 코드 그대로 사용
      if (currentTrack.attributes.artwork?.bgColor) {
        const hexColor = `#${currentTrack.attributes.artwork.bgColor}`;
        setDominantColor(hexColor);
        console.log("배경색 적용:", hexColor);
      } else {
        // 배경색 정보가 없으면 기본 어두운 색상 사용
        setDominantColor("#1c1c1e");
        console.log("기본 배경색 사용: #1c1c1e");
      }

      // 오디오 소스 설정 (프리뷰 모드용)
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
      // currentTrack이 없을 때도 기본 배경색으로 리셋
      setDominantColor("#1c1c1e");
      console.log("트랙 없음 - 기본 배경색으로 리셋: #1c1c1e");
    }
  }, [currentTrack, isUsingMusicKit, audioRef]);

  // 전체화면 상태 변경 시 배경색 강제 재적용
  useEffect(() => {
    if (isFullScreen && currentTrack) {
      // 즉시 실행하도록 수정
      if (currentTrack.attributes.artwork?.bgColor) {
        const hexColor = `#${currentTrack.attributes.artwork.bgColor}`;
        setDominantColor(hexColor);
        console.log("전체화면 전환 - 배경색 즉시 적용:", hexColor);
      } else {
        setDominantColor("#1c1c1e");
        console.log("전체화면 전환 - 기본 배경색 즉시 적용: #1c1c1e");
      }
    }
  }, [isFullScreen, currentTrack]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasPreview = currentTrack?.attributes.previews?.[0]?.url;
  const canPlay = isUsingMusicKit || hasPreview;

  // 위젯용 텍스트 색상 (트랙 색상 우선)
  const widgetTextColor = getWidgetTextColor();

  if (!isPlayerVisible || !currentTrack) return null;

  // 전체 화면 플레이어
  if (isFullScreen) {
    return (
      <>
        {/* 모바일: 전체 화면 */}
        <div
          key={`fullscreen-player-${currentTrack?.id || "no-track"}`}
          className="md:hidden fixed inset-0 z-50 flex flex-col"
          style={{
            transform: `translateY(${dragY}px)`,
            transition: isDragging
              ? "none"
              : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            touchAction: "none",
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* 배경 레이어 - API 응답 색상 */}
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
            {/* 상단 네비게이션 */}
            <div className="flex items-center justify-center p-4">
              {/* 드래그 핸들만 중앙에 표시 */}
              <button
                onClick={collapsePlayer}
                className="flex flex-col items-center justify-center py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
              >
                <div
                  className={`w-10 h-1 bg-white/40 rounded-full transition-all duration-200 ${
                    isDragging ? "bg-white/60 w-12" : ""
                  }`}
                ></div>
              </button>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 flex flex-col items-center justify-between px-6 pb-16">
              {/* 앨범 아트 */}
              <div className="relative mb-12">
                <div className="w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  {currentTrack.attributes.artwork?.url ? (
                    <img
                      src={getAppleMusicImageUrl(
                        currentTrack.attributes.artwork,
                        "xl"
                      )}
                      alt={currentTrack.attributes.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, ${addAlpha(
                              dominantColor,
                              0.8
                            )} 0%, ${addAlpha(dominantColor, 0.4)} 100%)">
                              <div class="text-white/60">
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                                </svg>
                              </div>
                            </div>
                          `;
                        }
                      }}
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

                {/* 재생 중 펄스 효과 */}
                {isPlaying && (
                  <div
                    className="absolute inset-0 rounded-2xl animate-pulse"
                    style={{
                      background: `linear-gradient(135deg, 
                        ${addAlpha(dominantColor, 0.3)} 0%, 
                        transparent 100%)`,
                    }}
                  />
                )}
              </div>

              {/* 트랙 정보 */}
              <div className="text-center mb-12 max-w-md">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                  {currentTrack.attributes.name}
                </h1>
                <p className="text-lg md:text-xl text-white/80">
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
                      className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
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
              <div className="flex items-center justify-center gap-8 mb-6">
                {/* 이전 버튼 */}
                <button
                  className="w-16 h-16 flex items-center justify-center text-white hover:text-white/80 transition-all duration-200 active:scale-90 hover:scale-110"
                  onClick={() => {
                    // 햅틱 피드백
                    if (navigator.vibrate) {
                      navigator.vibrate(50);
                    }
                  }}
                >
                  <IoPlayBackSharp size={32} />
                </button>

                {/* 재생/일시정지 버튼 */}
                <button
                  onClick={() => {
                    // 햅틱 피드백
                    if (navigator.vibrate) {
                      navigator.vibrate(75);
                    }
                    togglePlayback();
                  }}
                  disabled={!canPlay}
                  className={`w-16 h-16 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 ${
                    canPlay
                      ? "text-white hover:text-white/80"
                      : "text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8">
                    {isPlaying ? (
                      <IoPauseSharp
                        size={32}
                        className="transition-all duration-200"
                      />
                    ) : (
                      <IoPlaySharp
                        size={32}
                        className="transition-all duration-200 translate-x-0.5"
                      />
                    )}
                  </div>
                </button>

                {/* 다음 버튼 */}
                <button
                  className="w-16 h-16 flex items-center justify-center text-white hover:text-white/80 transition-all duration-200 active:scale-90 hover:scale-110"
                  onClick={() => {
                    // 햅틱 피드백
                    if (navigator.vibrate) {
                      navigator.vibrate(50);
                    }
                  }}
                >
                  <IoPlayForwardSharp size={32} />
                </button>
              </div>

              {/* 재생 불가능 메시지 */}
              {!canPlay && (
                <div className="mt-4 p-4 bg-white/10 backdrop-blur-md rounded-lg">
                  <p className="text-white/80 text-center text-sm">
                    이 곡은 프리뷰를 제공하지 않습니다
                  </p>
                </div>
              )}
            </div>

            {/* CSS 스타일 */}
            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                height: 0;
                width: 0;
                background: transparent;
                cursor: pointer;
                border: none;
              }

              .slider::-moz-range-thumb {
                height: 0;
                width: 0;
                background: transparent;
                cursor: pointer;
                border: none;
              }
            `}</style>
          </div>
        </div>

        {/* 데스크탑: 확장된 플레이어 */}
        <div
          key={`desktop-expanded-player-${currentTrack?.id || "no-track"}`}
          className="hidden md:block fixed bottom-8 right-6 z-50 w-80 h-96 transition-all duration-500 ease-out"
        >
          <div
            className="h-full rounded-2xl border border-white/20 shadow-2xl overflow-hidden backdrop-blur-md flex flex-col"
            style={{
              background: `linear-gradient(135deg, 
                ${addAlpha(dominantColor, 0.3)} 0%, 
                ${addAlpha(dominantColor, 0.2)} 50%, 
                ${addAlpha(dominantColor, 0.9)} 100%)`,
            }}
          >
            {/* 상단 축소 버튼 */}
            <div className="flex items-center justify-center pt-2 pb-1">
              <button
                onClick={collapsePlayer}
                className="w-12 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg transition-all duration-200 active:scale-95"
              >
                <div className="w-8 h-1 bg-white/50 rounded-full hover:bg-white/70 transition-colors duration-200"></div>
              </button>
            </div>

            {/* 앨범 아트 */}
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-lg">
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
                        width="40"
                        height="40"
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
            <div className="text-center mb-4 px-3">
              <h3
                className="text-sm font-bold mb-1 leading-tight truncate"
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

            {/* 진행 바 */}
            {canPlay && (
              <div className="px-3 mb-4">
                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
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
                  className="flex justify-between text-xs mt-1"
                  style={{ color: `${widgetTextColor}99` }}
                >
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* 컨트롤 버튼 */}
            <div className="flex items-center justify-center gap-4 px-3 flex-1">
              {/* 이전 버튼 */}
              <button
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-all duration-200 active:scale-90 hover:scale-110"
                style={{ color: widgetTextColor }}
                onClick={() => {
                  if (navigator.vibrate) {
                    navigator.vibrate(50);
                  }
                }}
              >
                <IoPlayBackSharp size={20} />
              </button>

              {/* 재생/일시정지 버튼 */}
              <button
                onClick={() => {
                  if (navigator.vibrate) {
                    navigator.vibrate(75);
                  }
                  togglePlayback();
                }}
                disabled={!canPlay}
                className={`w-12 h-12 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-110 ${
                  canPlay ? "hover:opacity-80" : "cursor-not-allowed opacity-50"
                }`}
                style={{
                  color: canPlay ? widgetTextColor : `${widgetTextColor}66`,
                }}
              >
                <div className="flex items-center justify-center">
                  {isPlaying ? (
                    <IoPauseSharp
                      size={24}
                      className="transition-all duration-200"
                    />
                  ) : (
                    <IoPlaySharp
                      size={24}
                      className="transition-all duration-200 translate-x-0.5"
                    />
                  )}
                </div>
              </button>

              {/* 다음 버튼 */}
              <button
                className="w-10 h-10 flex items-center justify-center hover:opacity-80 transition-all duration-200 active:scale-90 hover:scale-110"
                style={{ color: widgetTextColor }}
                onClick={() => {
                  if (navigator.vibrate) {
                    navigator.vibrate(50);
                  }
                }}
              >
                <IoPlayForwardSharp size={20} />
              </button>
            </div>

            {/* 재생 불가능 메시지 */}
            {!canPlay && (
              <div className="p-3">
                <p className="text-white/80 text-center text-xs">
                  이 곡은 프리뷰를 제공하지 않습니다
                </p>
              </div>
            )}

            {/* 데스크탑 위젯용 CSS 스타일 */}
            <style jsx>{`
              .slider::-webkit-slider-thumb {
                appearance: none;
                height: 0;
                width: 0;
                background: transparent;
                cursor: pointer;
                border: none;
              }

              .slider::-moz-range-thumb {
                height: 0;
                width: 0;
                background: transparent;
                cursor: pointer;
                border: none;
              }
            `}</style>
          </div>
        </div>
      </>
    );
  }

  // 미니 플레이어 위젯
  return (
    <>
      {/* 모바일용 미니 플레이어 */}
      <div className="md:hidden fixed bottom-[calc(4vh+5rem)] left-0 right-0 z-50 transition-all duration-500 ease-out">
        <div className="w-[75vw] max-w-md mx-auto">
          <div
            key={`mini-player-mobile-${currentTrack?.id || "no-track"}`}
            className="backdrop-blur-md bg-white/10 dark:bg-black/40 rounded-2xl border border-white/20 shadow-2xl cursor-pointer"
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
                    <div className="text-white/60">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </div>
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
                  <div className="w-4 h-4 flex items-center justify-center">
                    {isPlaying ? (
                      <IoPauseSharp size={16} />
                    ) : (
                      <IoPlaySharp size={16} className="translate-x-0.5" />
                    )}
                  </div>
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

            {/* 진행 바 (아래쪽 별도 줄) */}
            {canPlay && (
              <div
                className="px-3 pb-1"
                onClick={(e) => {
                  e.stopPropagation(); // 진행바 영역 전체에서 확장 방지
                }}
              >
                <div
                  className="relative cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // 위젯 확장 방지
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

            {/* 재생 불가능 메시지 */}
            {!canPlay && (
              <div className="px-3 pb-1">
                <p className="text-[10px] text-white/60 text-center">
                  프리뷰 없음
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 데스크탑용 미니 플레이어 */}
      <div className="hidden md:block fixed bottom-8 right-6 z-50 w-80 transition-all duration-500 ease-out">
        <div
          key={`desktop-mini-player-${currentTrack?.id || "no-track"}`}
          className="backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden cursor-pointer"
          style={{
            background: `linear-gradient(135deg, 
              ${addAlpha(dominantColor, 0.3)} 0%, 
              ${addAlpha(dominantColor, 0.2)} 50%, 
              ${addAlpha(dominantColor, 0.9)} 100%)`,
          }}
          onClick={expandPlayer}
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
                  <div className="text-white/60">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
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
                <div className="w-5 h-5 flex items-center justify-center">
                  {isPlaying ? (
                    <IoPauseSharp size={18} />
                  ) : (
                    <IoPlaySharp size={18} className="translate-x-0.5" />
                  )}
                </div>
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
            <div
              className="px-2 pb-2"
              onClick={(e) => {
                e.stopPropagation(); // 진행바 영역 전체에서 확장 방지
              }}
            >
              <div
                className="relative cursor-pointer py-1.5"
                onClick={(e) => {
                  e.stopPropagation(); // 위젯 확장 방지
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

          {/* 재생 불가능 메시지 */}
          {!canPlay && (
            <div className="px-2 pb-2">
              <p className="text-xs text-white/60 text-center">
                이 곡은 프리뷰를 제공하지 않습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
});
