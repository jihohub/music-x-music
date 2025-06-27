"use client";

import { useMainPageMusicStore } from "@/stores/mainPageMusicStore";
import { useThemeStore } from "@/stores/themeStore";
import { AppleMusicTrack } from "@/types/apple-music";
import { getOptimizedAppleMusicImageUrl } from "@/utils/image";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { getMainPageData } from "./queries/getMainPageData";

export default function MainPageStory() {
  const { getDisplayColors } = useThemeStore();
  const { textColor } = getDisplayColors();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true); // 기본적으로 자동재생 켜짐
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 메인페이지 전용 음악 스토어
  const {
    currentTrack,
    isPlaying,
    isMuted,
    playTrack,
    toggleMute,
    setAudioElement,
    cleanup,
    setIsPlaying,
  } = useMainPageMusicStore();

  // 통합 쿼리로 데이터 로딩 (트랙만)
  const { data, isLoading, error } = useQuery({
    queryKey: ["main-page-data"],
    queryFn: getMainPageData,
    staleTime: 1000 * 60 * 30, // 30분
    gcTime: 1000 * 60 * 60, // 1시간
  });

  const tracks = data?.tracks || [];

  // 오디오 엘리먼트 초기화
  useEffect(() => {
    if (audioRef.current) {
      setAudioElement(audioRef.current);

      const audio = audioRef.current;

      // 이벤트 리스너
      const handleLoadedMetadata = () => {
        console.log("오디오 메타데이터 로드됨");
      };

      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => {
        // 곡이 끝나면 다음 곡으로
        if (tracks.length > 0) {
          const nextIndex = (currentIndex + 1) % tracks.length;
          setCurrentIndex(nextIndex);
          goToStory(nextIndex);
        }
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
      };
    }
  }, [currentIndex, tracks.length, setAudioElement, setIsPlaying]);

  // 첫 트랙 자동 재생
  useEffect(() => {
    if (tracks.length > 0 && currentIndex === 0 && !currentTrack) {
      playTrack(tracks[0]);
    }
  }, [tracks, currentIndex, currentTrack, playTrack]);

  // 자동 전환 (5초마다 다음 스토리) - 무한 루프
  useEffect(() => {
    if (!isAutoPlay || tracks.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tracks.length); // 무한 루프
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, tracks.length]);

  // 스크롤 감지 - 무한 루프 대응
  useEffect(() => {
    const container = containerRef.current;
    if (!container || tracks.length === 0) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const windowHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / windowHeight) % tracks.length;

      if (newIndex !== currentIndex) {
        setCurrentIndex(newIndex);
        // 새 트랙 재생
        if (tracks[newIndex]) {
          playTrack(tracks[newIndex]);
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [currentIndex, tracks, playTrack]);

  // 현재 인덱스가 변경될 때 해당 트랙 재생
  useEffect(() => {
    if (tracks.length > 0 && tracks[currentIndex]) {
      playTrack(tracks[currentIndex]);
    }
  }, [currentIndex, tracks, playTrack]);

  // 다음/이전 스토리로 이동 - 무한 루프
  const goToStory = (index: number) => {
    const normalizedIndex =
      ((index % tracks.length) + tracks.length) % tracks.length;
    setCurrentIndex(normalizedIndex);

    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: normalizedIndex * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p style={{ color: textColor }}>
            데이터를 불러오는 중 오류가 발생했습니다.
          </p>
        </div>
      </main>
    );
  }

  if (isLoading || tracks.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: textColor }}>음악을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  // 무한 반복을 위한 확장된 트랙 배열 생성
  const extendedTracks = [...tracks, ...tracks, ...tracks]; // 3번 반복

  return (
    <main className="relative">
      {/* 숨겨진 오디오 엘리먼트 */}
      <audio ref={audioRef} preload="metadata" />

      {/* 진행 인디케이터 - 6개만 표시 */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 flex space-x-1">
        {tracks.map((_, index) => (
          <div
            key={index}
            className={`h-1 w-8 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white" : "bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* 음소거/음소거 해제 버튼 */}
      <button
        onClick={toggleMute}
        className="fixed top-4 right-16 z-50 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
        title={isMuted ? "음소거 해제" : "음소거"}
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* 자동재생 토글 */}
      <button
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        className="fixed top-4 right-4 z-50 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
        title={isAutoPlay ? "자동재생 끄기" : "자동재생 켜기"}
      >
        {isAutoPlay ? "⏸️" : "▶️"}
      </button>

      {/* 네비게이션 버튼 */}
      <button
        onClick={() => goToStory(currentIndex - 1)}
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
      >
        ↑
      </button>

      <button
        onClick={() => goToStory(currentIndex + 1)}
        className="fixed right-4 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-colors"
      >
        ↓
      </button>

      {/* 스토리 컨테이너 */}
      <div
        ref={containerRef}
        className="h-screen overflow-y-auto scroll-smooth snap-y snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {extendedTracks.map((track, index) => {
          const actualIndex = index % tracks.length;
          return (
            <StorySlide
              key={`${track.id}-${index}`}
              track={track}
              isActive={actualIndex === currentIndex}
              isPlaying={isPlaying && currentTrack?.id === track.id}
              isMuted={isMuted}
            />
          );
        })}
      </div>
    </main>
  );
}

// 개별 스토리 슬라이드 컴포넌트
function StorySlide({
  track,
  isActive,
  isPlaying,
  isMuted,
}: {
  track: AppleMusicTrack;
  isActive: boolean;
  isPlaying: boolean;
  isMuted: boolean;
}) {
  // 이미지 URL 가져오기
  const imageUrl = getOptimizedAppleMusicImageUrl(track.attributes.artwork, {
    containerWidth: typeof window !== "undefined" ? window.innerWidth : 1200,
    useDevicePixelRatio: true,
    maxSize: 1600,
  });

  const title = track.attributes.name;
  const artist = track.attributes.artistName;

  return (
    <section className="relative h-screen snap-start flex items-center justify-center overflow-hidden">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transform: isActive ? "scale(1)" : "scale(1.1)",
          transition: "transform 0.5s ease-out",
        }}
      />

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />

      {/* 재생 상태 표시 */}
      {isActive && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40">
          <div
            className={`flex items-center space-x-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm transition-all duration-300 ${
              isPlaying ? "opacity-100" : "opacity-70"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isPlaying ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
            <span>
              {isPlaying
                ? isMuted
                  ? "재생 중 (음소거)"
                  : "재생 중"
                : "일시정지"}
            </span>
          </div>
        </div>
      )}

      {/* 콘텐츠 */}
      <div
        className={`relative z-10 text-center text-white transition-all duration-700 ${
          isActive ? "opacity-100 translate-y-0" : "opacity-70 translate-y-4"
        }`}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl opacity-80 mb-8">{artist}</p>

        <div className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-full font-medium">
          {isPlaying ? (isMuted ? "🔇 음소거됨" : "🎵 재생 중") : "⏸️ 일시정지"}
        </div>
      </div>

      {/* 하단 스크롤 힌트 */}
      {isActive && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm">스크롤하여 다음 곡</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      )}
    </section>
  );
}
