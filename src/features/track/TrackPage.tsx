"use client";

import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { AppleMusicTrack } from "@/types/apple-music";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoEllipsisHorizontal,
  IoHeart,
  IoHeartOutline,
  IoRepeat,
  IoShuffle,
} from "react-icons/io5";
import { ErrorState } from "./components/ErrorState";
import { TrackSkeleton } from "./components/TrackSkeleton";

interface TrackPageProps {
  track: AppleMusicTrack | null;
  artists: { name: string }[];
  isLoading?: boolean;
  error?: string | null;
}

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" | "xl" = "lg"
): string {
  if (!artwork?.url) {
    return ""; // 빈 문자열 반환하여 CSS fallback 사용
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
    xl: "2000x2000",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

// 시간 포맷팅 함수
const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Hex 색상을 RGB로 변환하는 함수
const hexToRgb = (hex: string): string => {
  // # 제거하고 6자리로 맞춤
  const cleanHex = hex.replace("#", "").padStart(6, "0");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
};

export function TrackPage({
  track,
  artists,
  isLoading = false,
  error = null,
}: TrackPageProps) {
  const router = useRouter();
  const {
    playTrack,
    togglePlayback,
    seekTo,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isUsingMusicKit,
  } = useMusicPlayer();

  const [isLiked, setIsLiked] = useState(false);
  const [dominantColor, setDominantColor] = useState("59, 130, 246"); // 기본 파란색

  // 드래그 상태 관리
  const [isDragging, setIsDragging] = useState(false);
  const [dragY, setDragY] = useState(0); // 현재 드래그 Y 위치
  const [startY, setStartY] = useState(0); // 드래그 시작 Y 위치
  const [isClosing, setIsClosing] = useState(false); // 닫히는 애니메이션 상태

  // 드래그 임계값 - 화면 높이의 2/3
  const closeThreshold =
    typeof window !== "undefined" ? window.innerHeight * 0.66 : 400;
  const maxDrag = typeof window !== "undefined" ? window.innerHeight : 600; // 화면 전체 높이까지

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isClosing) return; // 닫히는 중이면 무시
    setIsDragging(true);
    setStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isClosing) return;

    const currentY = e.targetTouches[0].clientY;
    const deltaY = currentY - startY;

    // 아래로만 드래그 가능하도록 제한
    if (deltaY > 0) {
      setDragY(Math.min(deltaY, maxDrag));
    }
  };

  const handleTouchEnd = () => {
    if (isClosing) return;
    setIsDragging(false);

    // 임계값 이상 드래그했으면 닫기 애니메이션 시작
    if (dragY > closeThreshold) {
      setIsClosing(true);
      // 화면 아래로 완전히 사라지는 애니메이션
      setDragY(window.innerHeight);
      // 애니메이션 완료 후 페이지 닫기
      setTimeout(() => {
        router.back();
      }, 300);
    } else {
      // 원래 위치로 복귀
      setDragY(0);
    }
  };

  const handleClose = () => {
    router.back();
  };

  // 트랙이 로드되면 자동으로 재생하고 색상 설정
  useEffect(() => {
    if (track) {
      // 현재 재생 중인 트랙이 아니면 재생 시작
      if (!currentTrack || currentTrack.id !== track.id) {
        playTrack(track);
      }

      // 배경색 설정 (hex를 RGB로 변환)
      if (track.attributes.artwork?.bgColor) {
        const rgbColor = hexToRgb(track.attributes.artwork.bgColor);
        setDominantColor(rgbColor);
        console.log(
          "배경색 설정:",
          track.attributes.artwork.bgColor,
          "→",
          rgbColor
        );
      }
    }
  }, [track, playTrack, currentTrack]);

  const isCurrentTrack = currentTrack?.id === track?.id;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const hasPreview = track?.attributes.previews?.[0]?.url;
  const canPlay = isUsingMusicKit || hasPreview;

  if (isLoading) {
    return <TrackSkeleton />;
  }

  if (error || !track) {
    return <ErrorState error={error} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: `linear-gradient(135deg, 
          rgba(${dominantColor}, 0.3) 0%, 
          rgba(${dominantColor}, 0.1) 50%, 
          rgba(0, 0, 0, 0.9) 100%)`,
        transform: `translateY(${dragY}px)`,
        opacity: 1 - dragY / (window.innerHeight || 600),
        transition: isDragging
          ? "none"
          : "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        touchAction: "none", // passive event listener 문제 해결
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 상단 네비게이션 */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handleClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <IoChevronDown size={24} className="text-white" />
        </button>

        {/* 드래그 핸들 */}
        <button
          onClick={handleClose}
          className="flex flex-col items-center justify-center py-2 px-4 hover:bg-white/10 rounded-lg transition-colors"
        >
          <div
            className={`w-10 h-1 bg-white/40 rounded-full transition-all duration-200 ${
              isDragging ? "bg-white/60 w-12" : ""
            }`}
          ></div>
        </button>

        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <IoEllipsisHorizontal size={24} className="text-white" />
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* 앨범 아트 */}
        <div className="relative mb-8">
          <div className="w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
            {track.attributes.artwork?.url ? (
              <img
                src={getAppleMusicImageUrl(track.attributes.artwork, "xl")}
                alt={track.attributes.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // 이미지 로딩 실패 시 부모 요소를 fallback으로 변경
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center" style="background: linear-gradient(135deg, rgba(${dominantColor}, 0.8) 0%, rgba(${dominantColor}, 0.4) 100%)">
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
                  background: `linear-gradient(135deg, rgba(${dominantColor}, 0.8) 0%, rgba(${dominantColor}, 0.4) 100%)`,
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
          {isCurrentTrack && isPlaying && (
            <div
              className="absolute inset-0 rounded-2xl animate-pulse"
              style={{
                background: `linear-gradient(135deg, 
                  rgba(${dominantColor}, 0.3) 0%, 
                  transparent 100%)`,
              }}
            />
          )}
        </div>

        {/* 트랙 정보 */}
        <div className="text-center mb-8 max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
            {track.attributes.name}
          </h1>
          <p className="text-lg md:text-xl text-white/80">
            {track.attributes.artistName}
          </p>
          <p className="text-md text-white/60 mt-1">
            {track.attributes.albumName}
          </p>
        </div>

        {/* 진행 바 */}
        {canPlay && (
          <div className="w-full max-w-md mb-6">
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
                    rgba(${dominantColor}, 1) 0%, 
                    rgba(${dominantColor}, 1) ${progress}%, 
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
        <div className="flex items-center justify-center gap-8 mb-8">
          <button className="text-white/60 hover:text-white transition-colors">
            <IoShuffle size={24} />
          </button>

          <button className="text-white/60 hover:text-white transition-colors">
            <IoChevronBack size={32} />
          </button>

          <button
            onClick={togglePlayback}
            disabled={!canPlay}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
              canPlay
                ? "bg-white hover:bg-white/90 text-black shadow-lg hover:scale-105"
                : "bg-gray-500/50 text-gray-400 cursor-not-allowed"
            }`}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              {isCurrentTrack && isPlaying ? (
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-6 bg-current rounded"></div>
                  <div className="w-1.5 h-6 bg-current rounded"></div>
                </div>
              ) : (
                <div className="w-0 h-0 border-l-[12px] border-l-current border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
              )}
            </div>
          </button>

          <button className="text-white/60 hover:text-white transition-colors">
            <IoChevronForward size={32} />
          </button>

          <button className="text-white/60 hover:text-white transition-colors">
            <IoRepeat size={24} />
          </button>
        </div>

        {/* 추가 액션 */}
        <div className="flex items-center justify-center gap-8">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="text-white/60 hover:text-white transition-colors"
          >
            {isLiked ? (
              <IoHeart size={24} className="text-red-500" />
            ) : (
              <IoHeartOutline size={24} />
            )}
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
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
