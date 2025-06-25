"use client";

import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import dynamic from "next/dynamic";
import { memo, useEffect, useState } from "react";
import {
  IoClose,
  IoExpand,
  IoPauseSharp,
  IoPlayBackSharp,
  IoPlayForwardSharp,
  IoPlaySharp,
  IoRemove,
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

// 클라이언트 사이드에서만 렌더링되는 MusicPlayer 컴포넌트
function MusicPlayerClient() {
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
  const [mounted, setMounted] = useState(false);

  // 드래그 상태 관리 (모바일용)
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  // 애니메이션 전환 상태 관리 (플랫폼별)
  const [mobileAnimationState, setMobileAnimationState] = useState<
    "mini" | "full" | "hidden"
  >("hidden");
  const [desktopAnimationState, setDesktopAnimationState] = useState<
    "mini" | "expanded" | "full" | "hidden"
  >("hidden");

  // 클라이언트 사이드 마운트 체크
  useEffect(() => {
    setMounted(true);
  }, []);

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

  // 터치 이벤트 핸들러 (전체 화면에서 작동)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isClosing || !isFullScreen) return;

    setIsDragging(true);
    setStartY(e.targetTouches[0].clientY);
    setDragY(0); // 드래그 시작 시 초기화
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isClosing || !isFullScreen) return;

    const currentY = e.targetTouches[0].clientY;
    const deltaY = currentY - startY;

    // 아래로만 드래그 허용 (기존처럼)
    if (deltaY > 0) {
      setDragY(Math.min(deltaY, maxDrag));
    }
  };

  const handleTouchEnd = () => {
    if (isClosing || !isFullScreen) return;

    setIsDragging(false);

    // 1/3 지점 이상 아래로 드래그하면 미니로 전환
    if (dragY > closeThreshold) {
      setIsClosing(true);
      setDragY(maxDrag);

      setTimeout(() => {
        collapsePlayer();
        setIsClosing(false);
        setDragY(0);
      }, 300);
    } else {
      // 원위치로 복귀
      setDragY(0);
    }
  };

  // 드래그 핸들 클릭 처리 (단순 클릭으로 미니 전환)
  const handleDragHandleClick = () => {
    if (!isDragging) {
      collapsePlayer();
    }
  };

  // 드래그 시 투명도 계산
  const getDragOpacity = () => {
    if (!isDragging || dragY === 0) return 1;
    // 드래그 거리에 따라 1.0에서 0.3까지 점진적으로 투명해짐
    const minOpacity = 0.3;
    const maxOpacity = 1.0;
    const opacityRange = maxOpacity - minOpacity;
    const progress = Math.min(dragY / closeThreshold, 1);
    return maxOpacity - opacityRange * progress;
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

  // 플랫폼별 애니메이션 상태 관리
  useEffect(() => {
    if (!isPlayerVisible) {
      setMobileAnimationState("hidden");
      setDesktopAnimationState("hidden");
      return;
    }

    // 모바일: 2단계 (mini ⟷ full)
    const newMobileState: "mini" | "full" | "hidden" = isFullScreen
      ? "full"
      : "mini";

    // 데스크탑: 3단계 (mini ⟷ expanded ⟷ full)
    const newDesktopState: "mini" | "expanded" | "full" | "hidden" =
      isFullScreen ? "full" : isExpanded ? "expanded" : "mini";

    // 즉시 상태 변경 (애니메이션 겹침 방지)
    setMobileAnimationState(newMobileState);
    setDesktopAnimationState(newDesktopState);
  }, [isPlayerVisible, isFullScreen, isExpanded]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasPreview = currentTrack?.attributes.previews?.[0]?.url;
  const canPlay = isUsingMusicKit || hasPreview;
  const widgetTextColor = getWidgetTextColor();

  // SSR 대응: 클라이언트 사이드 마운트 전에는 렌더링하지 않음
  if (!mounted || !isPlayerVisible || !currentTrack) return null;

  return (
    <>
      {/* 전체 화면 플레이어 - 모바일 (2단계: mini ⟷ full) */}
      <div
        className={`md:hidden fixed inset-0 z-[70] flex flex-col transition-all duration-500 ease-out ${
          mobileAnimationState === "full"
            ? "translate-y-0 opacity-100"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
        style={{
          transform: `translateY(${
            mobileAnimationState === "full" ? dragY + "px" : "100vh"
          })`,
          opacity: mobileAnimationState === "full" ? getDragOpacity() : 0,
          transition: isDragging
            ? "none"
            : "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
        onTouchStart={(e) => {
          // 버튼이 아닌 영역에서만 드래그 허용
          if (!(e.target as Element).closest("button, input")) {
            handleTouchStart(e);
          }
        }}
        onTouchMove={(e) => {
          if (isDragging) {
            handleTouchMove(e);
          }
        }}
        onTouchEnd={(e) => {
          if (isDragging) {
            handleTouchEnd();
          }
        }}
      >
        {/* 배경 레이어 - 드래그에 따라 함께 움직임 */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              ${dominantColor} 0%, 
              ${dominantColor} 40%, 
              #000000 100%)`,
          }}
        />

        {/* 리퀴드글래스 플레이어 레이어 - 드래그에 따라 함께 움직임 */}
        <div className="relative z-10 w-full h-full flex flex-col backdrop-blur-md bg-white/5">
          {/* 상단 네비게이션 - 드래그 핸들 */}
          <div className="flex items-center justify-center p-4 touch-manipulation">
            <div
              className="flex flex-col items-center justify-center py-4 px-8 cursor-grab active:cursor-grabbing"
              onClick={handleDragHandleClick}
            >
              <div
                className={`h-1 rounded-full transition-all duration-200 ${
                  isDragging ? "w-16 h-1.5" : "w-10 h-1"
                }`}
                style={{
                  backgroundColor: isDragging
                    ? `${widgetTextColor}AA`
                    : `${widgetTextColor}66`,
                  boxShadow: isDragging
                    ? `0 0 10px ${widgetTextColor}40`
                    : "none",
                }}
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
                    <div style={{ color: `${widgetTextColor}99` }}>
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
              <h1
                className="text-2xl font-bold mb-2 leading-tight"
                style={{ color: widgetTextColor }}
              >
                {currentTrack.attributes.name}
              </h1>
              <p className="text-lg" style={{ color: `${widgetTextColor}CC` }}>
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
                <div
                  className="flex justify-between text-sm mt-2"
                  style={{ color: `${widgetTextColor}99` }}
                >
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            )}

            {/* 컨트롤 버튼 */}
            <div className="flex items-center justify-center gap-8">
              <button
                className="w-16 h-16 flex items-center justify-center transition-all duration-200 active:scale-90"
                style={{ color: widgetTextColor }}
              >
                <IoPlayBackSharp size={32} />
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
                  <IoPlaySharp size={32} />
                )}
              </button>

              <button
                className="w-16 h-16 flex items-center justify-center transition-all duration-200 active:scale-90"
                style={{ color: widgetTextColor }}
              >
                <IoPlayForwardSharp size={32} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 미니 플레이어 - 모바일 */}
      {mobileAnimationState === "mini" && (
        <div className="md:hidden fixed bottom-24 left-4 right-4 z-[60] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div
            className="backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, 
                ${addAlpha(dominantColor, 0.3)} 0%, 
                ${addAlpha(dominantColor, 0.2)} 50%, 
                ${addAlpha(dominantColor, 0.9)} 100%)`,
            }}
            onClick={(e) => {
              // 버튼이 아닌 영역만 클릭했을 때만 확장
              if (
                e.target === e.currentTarget ||
                (e.target as Element).closest(".track-info-area")
              ) {
                expandPlayer();
              }
            }}
          >
            <div className="flex items-center gap-3 p-3">
              {/* 앨범 아트 */}
              <div
                className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 cursor-pointer track-info-area"
                onClick={() => expandPlayer()}
              >
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
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: `${widgetTextColor}99` }}
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 트랙 정보 */}
              <div
                className="flex-1 min-w-0 cursor-pointer track-info-area"
                onClick={() => expandPlayer()}
              >
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
                {!canPlay && (
                  <p
                    className="text-xs opacity-75"
                    style={{ color: `${widgetTextColor}99` }}
                  >
                    프리뷰 없음
                  </p>
                )}
              </div>

              {/* 컨트롤 버튼 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canPlay) {
                      togglePlayback();
                    } else {
                      // 프리뷰가 없는 경우 피드백
                      console.log("이 트랙은 프리뷰를 제공하지 않습니다");
                    }
                  }}
                  disabled={!canPlay}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95 ${
                    canPlay
                      ? "hover:opacity-80"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={{
                    color: canPlay ? widgetTextColor : `${widgetTextColor}66`,
                    backgroundColor: canPlay
                      ? `${widgetTextColor}20`
                      : "transparent",
                  }}
                  title={
                    !canPlay ? "프리뷰 없음" : isPlaying ? "일시정지" : "재생"
                  }
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
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  style={{ color: `${widgetTextColor}B3` }}
                  title="플레이어 닫기"
                >
                  <IoClose size={16} />
                </button>
              </div>
            </div>

            {/* 진행 바 */}
            {canPlay && (
              <div className="px-3 pb-3" onClick={(e) => e.stopPropagation()}>
                <div
                  className="relative cursor-pointer py-2 hover:py-2.5 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const width = rect.width;
                    const clickPercent = Math.max(
                      0,
                      Math.min(1, clickX / width)
                    );
                    const newTime = clickPercent * duration;
                    seekTo(newTime);
                  }}
                  title={`재생 위치: ${formatTime(currentTime)} / ${formatTime(
                    duration
                  )}`}
                >
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden hover:h-1.5 transition-all duration-200">
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
      )}

      {/* 전체 화면 플레이어 - 데스크탑 (3단계: mini ⟷ expanded ⟷ full) */}
      <div
        className={`hidden md:block fixed inset-0 z-[70] backdrop-blur-xl transition-all duration-500 ease-out ${
          desktopAnimationState === "full"
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{
          background: `linear-gradient(135deg, ${addAlpha(
            dominantColor,
            0.8
          )} 0%, ${addAlpha(dominantColor, 0.4)} 100%)`,
        }}
      >
        <div className="w-full h-full flex items-center justify-center p-8 pt-20">
          {/* 상단 컨트롤 - seek bar와 겹치지 않도록 여백 확보 */}
          <div className="absolute top-6 right-6 flex items-center gap-3 z-10">
            <button
              onClick={toggleExpanded}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              style={{ color: widgetTextColor }}
              title="중간 크기로"
            >
              <IoRemove size={20} />
            </button>
            <button
              onClick={collapsePlayer}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              style={{ color: widgetTextColor }}
              title="미니로"
            >
              <IoClose size={20} />
            </button>
          </div>

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
                    <div style={{ color: `${widgetTextColor}99` }}>
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

            {/* 컨트롤 영역 */}
            <div className="space-y-8">
              {/* 트랙 정보 */}
              <div className="text-center lg:text-left">
                <h1
                  className="text-4xl font-bold mb-4 leading-tight"
                  style={{ color: widgetTextColor }}
                >
                  {currentTrack.attributes.name}
                </h1>
                <p
                  className="text-xl"
                  style={{ color: `${widgetTextColor}CC` }}
                >
                  {currentTrack.attributes.artistName}
                </p>
              </div>

              {/* 진행 바 */}
              {canPlay && (
                <div className="space-y-2">
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
                  <div
                    className="flex justify-between text-sm"
                    style={{ color: `${widgetTextColor}99` }}
                  >
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>
              )}

              {/* 컨트롤 버튼 */}
              <div className="flex items-center justify-center lg:justify-start gap-6">
                <button
                  className="w-16 h-16 flex items-center justify-center transition-all duration-200 active:scale-90"
                  style={{ color: widgetTextColor }}
                >
                  <IoPlayBackSharp size={32} />
                </button>

                <button
                  onClick={togglePlayback}
                  disabled={!canPlay}
                  className={`w-20 h-20 flex items-center justify-center transition-all duration-200 active:scale-90 ${
                    canPlay
                      ? "hover:opacity-80"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={{
                    color: canPlay ? widgetTextColor : `${widgetTextColor}66`,
                  }}
                >
                  {isPlaying ? (
                    <IoPauseSharp size={40} />
                  ) : (
                    <IoPlaySharp size={40} />
                  )}
                </button>

                <button
                  className="w-16 h-16 flex items-center justify-center transition-all duration-200 active:scale-90"
                  style={{ color: widgetTextColor }}
                >
                  <IoPlayForwardSharp size={32} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 미니 플레이어 - 데스크탑 */}
      {desktopAnimationState === "mini" && (
        <div className="hidden md:block fixed bottom-8 right-6 z-[60] w-80 transition-all duration-500 ease-out transform scale-100 opacity-100">
          <div
            className="backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer"
            style={{
              background: `linear-gradient(135deg, 
                ${addAlpha(dominantColor, 0.3)} 0%, 
                ${addAlpha(dominantColor, 0.2)} 50%, 
                ${addAlpha(dominantColor, 0.9)} 100%)`,
            }}
            onClick={(e) => {
              // 버튼이 아닌 영역만 클릭했을 때만 확장
              if (
                e.target === e.currentTarget ||
                (e.target as Element).closest(".track-info-area")
              ) {
                toggleExpanded();
              }
            }}
          >
            <div className="flex items-center gap-3 p-2">
              {/* 앨범 아트 */}
              <div
                className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0 cursor-pointer track-info-area"
                onClick={() => toggleExpanded()}
              >
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
                      style={{ color: `${widgetTextColor}99` }}
                    >
                      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 트랙 정보 */}
              <div
                className="flex-1 min-w-0 cursor-pointer track-info-area"
                onClick={() => toggleExpanded()}
              >
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
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayback();
                  }}
                  disabled={!canPlay}
                  className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10 active:scale-95 ${
                    canPlay
                      ? "hover:opacity-80"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  style={{
                    color: canPlay ? widgetTextColor : `${widgetTextColor}66`,
                    backgroundColor: canPlay
                      ? `${widgetTextColor}20`
                      : "transparent",
                  }}
                  title={isPlaying ? "일시정지" : "재생"}
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
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  style={{ color: `${widgetTextColor}B3` }}
                  title="플레이어 닫기"
                >
                  <IoClose size={14} />
                </button>
              </div>
            </div>

            {/* 진행 바 */}
            {canPlay && (
              <div className="px-2 pb-2" onClick={(e) => e.stopPropagation()}>
                <div
                  className="relative cursor-pointer py-1.5 hover:py-2 transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const width = rect.width;
                    const clickPercent = Math.max(
                      0,
                      Math.min(1, clickX / width)
                    );
                    const newTime = clickPercent * duration;
                    seekTo(newTime);
                  }}
                  title={`재생 위치: ${formatTime(currentTime)} / ${formatTime(
                    duration
                  )}`}
                >
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden hover:h-1.5 transition-all duration-200">
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
      )}

      {/* 확장 플레이어 - 데스크탑 */}
      {desktopAnimationState === "expanded" && (
        <div className="hidden md:block fixed bottom-8 right-6 z-[60] w-96 h-[560px] transition-all duration-500 ease-out transform scale-100 opacity-100">
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
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                style={{ color: widgetTextColor }}
                title="미니로"
              >
                <IoRemove size={16} />
              </button>
              <button
                onClick={maximizePlayer}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                style={{ color: widgetTextColor }}
                title="전체화면으로"
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
                    <div style={{ color: `${widgetTextColor}99` }}>
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
            <div className="flex items-center justify-center gap-4 px-4 pb-4">
              <button
                className="w-12 h-12 flex items-center justify-center transition-all duration-200 active:scale-90"
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
                className="w-12 h-12 flex items-center justify-center transition-all duration-200 active:scale-90"
                style={{ color: widgetTextColor }}
              >
                <IoPlayForwardSharp size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Dynamic import를 사용하여 SSR 시 렌더링 방지
const MusicPlayer = dynamic(() => Promise.resolve(memo(MusicPlayerClient)), {
  ssr: false,
  loading: () => null,
});

export default MusicPlayer;

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
