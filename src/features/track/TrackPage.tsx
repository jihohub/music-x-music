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
    return "/images/default-album.png";
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
      }}
    >
      {/* 상단 네비게이션 */}
      <div className="flex items-center justify-between p-4 backdrop-blur-md bg-black/20">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <IoChevronDown size={24} className="text-white" />
        </button>

        <div className="text-center">
          <p className="text-xs text-white/60 uppercase tracking-wider">
            {isUsingMusicKit ? "Apple Music에서 재생 중" : "프리뷰 재생 중"}
          </p>
        </div>

        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <IoEllipsisHorizontal size={24} className="text-white" />
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
        {/* 앨범 아트 */}
        <div className="relative mb-8">
          <div className="w-80 h-80 md:w-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={getAppleMusicImageUrl(track.attributes.artwork, "xl")}
              alt={track.attributes.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/images/default-album.png";
              }}
            />
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
