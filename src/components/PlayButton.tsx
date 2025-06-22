"use client";

import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { AppleMusicTrack } from "@/types/apple-music";

interface PlayButtonProps {
  track: AppleMusicTrack;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function PlayButton({
  track,
  size = "md",
  className = "",
  onClick,
}: PlayButtonProps) {
  const { playTrack, currentTrack, isPlaying, togglePlayback } =
    useMusicPlayer();

  const isCurrentTrack = currentTrack?.id === track.id;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (onClick) {
      onClick(e);
    }

    if (isCurrentTrack) {
      // 현재 재생 중인 트랙이면 일시정지/재생 토글
      togglePlayback();
    } else {
      // 새로운 트랙 재생 시작
      playTrack(track);
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-white 
        text-black 
        flex 
        items-center 
        justify-center 
        hover:scale-105 
        transition-all 
        duration-200 
        shadow-lg 
        hover:shadow-xl
        ${isCurrentTrack && isPlaying ? "animate-pulse" : ""}
        ${className}
      `}
      aria-label={
        isCurrentTrack && isPlaying
          ? "일시정지"
          : isCurrentTrack
          ? "재생"
          : `${track.attributes.name} 재생`
      }
    >
      <div className={`${iconSizes[size]} flex items-center justify-center`}>
        {isCurrentTrack && isPlaying ? (
          // 일시정지 아이콘
          <div className="flex gap-0.5">
            <div className="w-0.5 h-full bg-current rounded"></div>
            <div className="w-0.5 h-full bg-current rounded"></div>
          </div>
        ) : (
          // 재생 아이콘
          <div className="w-0 h-0 border-l-[8px] border-l-current border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-0.5" />
        )}
      </div>
    </button>
  );
}
