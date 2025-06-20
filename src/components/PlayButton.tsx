"use client";

import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { AppleMusicTrack } from "@/types/apple-music";
import { useRouter } from "next/navigation";

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
  const { playTrack } = useMusicPlayer();
  const router = useRouter();

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const handlePlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 이벤트 버블링 방지

    if (onClick) {
      onClick(e);
    }

    // 트랙 재생 시작
    playTrack(track);

    // 트랙 페이지로 이동
    router.push(`/track/${track.id}`);
  };

  return (
    <button
      onClick={handlePlay}
      className={`
        ${sizeClasses[size]}
        bg-black dark:bg-white 
        text-white dark:text-black 
        rounded-full 
        flex items-center justify-center 
        hover:scale-105 
        transition-all duration-200 
        shadow-lg hover:shadow-xl
        ${className}
      `}
      title={`${track.attributes.name} 재생`}
    >
      <svg
        className={`${iconSizes[size]} ml-0.5`}
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}
