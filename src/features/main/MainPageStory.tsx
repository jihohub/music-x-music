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
  const [userHasInteracted, setUserHasInteracted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false); // 클라이언트 마운트 상태
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const beatElementRef = useRef<HTMLDivElement>(null);
  const musicPlayerRef = useRef<HTMLAudioElement>(null);
  const [isProcessing, setIsProcessing] = useState(false); // 재생/일시정지 처리 중 상태
  const [animationScale, setAnimationScale] = useState(1); // 실시간 애니메이션 scale
  const [animationRotation, setAnimationRotation] = useState(0); // 실시간 애니메이션 rotation

  // 메인페이지 전용 음악 스토어
  const {
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isMuted,
    playTrack,
    play,
    pause,
    toggleMute,
    setAudioElement,
    setIsPlaying,
    setTrackMetadata,
    cleanup,
  } = useMainPageMusicStore();

  // 통합 쿼리로 데이터 로딩 (트랙만)
  const { data, isLoading, error, isFetching, isInitialLoading } = useQuery({
    queryKey: ["main-page-data"],
    queryFn: getMainPageData,
    staleTime: 1000 * 60 * 5, // 5분으로 줄임 (더 자주 갱신)
    gcTime: 1000 * 60 * 30, // 30분
    retry: 3, // 3번 재시도
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 지수 백오프
  });

  const tracks = data?.tracks || [];

  // 클라이언트 마운트 감지 및 SSG Hydration 안전 처리
  useEffect(() => {
    setIsClientMounted(true);

    // 🔧 SSG Hydration 완료 후 오디오 상태 강제 초기화
    if (typeof window !== "undefined") {
      console.log("🔄 SSG Hydration 완료 - 오디오 상태 강제 초기화");

      // 혹시 남아있을 수 있는 기존 오디오 정리
      const existingAudios = document.querySelectorAll("audio");
      existingAudios.forEach((audio, index) => {
        console.log(`🧹 기존 오디오 ${index + 1} 정리 중...`);
        if (!audio.paused) {
          audio.pause();
        }
        audio.src = "";
        audio.load();
      });

      // Store 상태도 초기화
      cleanup();
      console.log("✅ SSG Hydration 오디오 정리 완료");
    }
  }, [cleanup]);

  // 🔧 컴포넌트 언마운트 시 모든 오디오 정리
  useEffect(() => {
    return () => {
      console.log("🔌 MainPageStory 언마운트 - cleanup 호출");
      cleanup();
    };
  }, [cleanup]);

  // 🔧 브라우저 탭 이동/페이지 이탈 시 오디오 정리
  useEffect(() => {
    const handlePageUnload = () => {
      console.log("🚪 페이지 이탈 감지 - cleanup 호출");
      cleanup();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log("👁️ 탭 숨김 감지 - 오디오 일시정지");
        pause();
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("beforeunload", handlePageUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handlePageUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [cleanup, pause]);

  // 로깅 최적화 - 상태 변경 시에만 출력
  const [lastLoggedState, setLastLoggedState] = useState<string>("");
  useEffect(() => {
    const currentState = `${isLoading}-${isFetching}-${isInitialLoading}-${!!data}-${
      tracks.length
    }`;
    if (currentState !== lastLoggedState) {
      console.log("📊 React Query 상태 변경:", {
        isLoading,
        isFetching,
        isInitialLoading,
        hasData: !!data,
        tracksCount: tracks.length,
        error: !!error,
        firstTrack: data?.tracks?.[0]?.attributes?.name || "N/A",
        currentIndex,
        isMobile,
        isClientMounted,
      });
      setLastLoggedState(currentState);
    }
  }, [
    isLoading,
    isFetching,
    isInitialLoading,
    data,
    tracks.length,
    error,
    currentIndex,
    isMobile,
    isClientMounted,
  ]);

  // 화면 크기 감지
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768); // md 브레이크포인트
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // 재생/일시정지 토글 함수 (사용자 인터랙션으로 간주)
  const togglePlayPause = async () => {
    const audioElement = audioRef.current;
    const actualIsPlaying = audioElement ? !audioElement.paused : false;

    console.log("🎵 togglePlayPause 호출됨", {
      userHasInteracted,
      storeIsPlaying: isPlaying,
      actualIsPlaying: actualIsPlaying,
      currentIndex,
      currentTrackIndex,
      currentTrack: tracks[currentIndex],
      isProcessing,
      hasAudioElement: !!audioElement,
      audioSrc: audioElement?.src || "없음",
      audioPaused: audioElement?.paused,
    });

    if (!userHasInteracted) {
      setUserHasInteracted(true);
      console.log("✅ 사용자 상호작용 기록됨");
    }

    // 🔧 상태 동기화: store 상태를 실제 audio element 상태와 맞춤
    if (audioElement && isPlaying !== actualIsPlaying) {
      console.log("🔄 상태 동기화:", {
        before: { storeIsPlaying: isPlaying, actualIsPlaying },
        after: { storeIsPlaying: actualIsPlaying, actualIsPlaying },
      });
      setIsPlaying(actualIsPlaying);
    }

    // 실제 오디오 상태를 기준으로 판단
    if (actualIsPlaying) {
      // 실제로 재생 중이면 일시정지
      console.log("⏸️ 실제 재생 중 - 일시정지 시도");
      pause();
      console.log("✅ 일시정지 완료");
    } else {
      // 실제로 일시정지 중이면 재생
      if (isProcessing) {
        console.log("⚠️ 재생 처리 중... 무시됨");
        return;
      }

      setIsProcessing(true);

      try {
        console.log("▶️ 실제 일시정지 중 - 재생 시도");

        // 현재 트랙이 설정되어 있는지 확인
        if (!currentTrack && tracks.length > 0) {
          console.log("📀 현재 트랙이 없음 - 첫 번째 트랙 메타데이터 설정");
          setTrackMetadata(tracks[currentIndex], currentIndex);
        }

        // 🔧 강제 재생: store 상태와 관계없이 audio element 직접 제어
        if (audioElement) {
          console.log("🎵 직접 재생 시도...");
          await audioElement.play();
          setIsPlaying(true);

          // Media Session 상태 업데이트
          if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "playing";
          }

          console.log("✅ 직접 재생 성공!");
        } else {
          console.log("⚠️ 오디오 엘리먼트가 없음");
        }
      } catch (error) {
        console.log("❌ 재생 에러:", error);
        setIsPlaying(false);
      } finally {
        setTimeout(() => {
          setIsProcessing(false);
          console.log("🔓 재생 잠금 해제");
        }, 200);
      }
    }
  };

  // 데스크탑용 트랙 변경 함수
  const goToTrack = async (index: number) => {
    console.log("🔄 goToTrack 호출됨", { index, tracksLength: tracks.length });

    if (index < 0 || index >= tracks.length) return;

    if (!userHasInteracted) {
      setUserHasInteracted(true);
    }

    setCurrentIndex(index);
    if (tracks[index]) {
      console.log("📀 새 트랙 재생 시도:", tracks[index].attributes.name);
      await playTrack(tracks[index], index);
    }
  };

  // 데스크탑용 다음/이전 트랙
  const nextTrack = async () => {
    const nextIndex = (currentIndex + 1) % tracks.length;
    await goToTrack(nextIndex);
  };

  const prevTrack = async () => {
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    await goToTrack(prevIndex);
  };

  // 첫 번째 사용자 인터랙션 감지
  useEffect(() => {
    let isHandled = false; // 중복 처리 방지

    const handleFirstInteraction = () => {
      if (isHandled || userHasInteracted) {
        return; // 이미 처리했거나 이미 인터랙션이 있었으면 무시
      }

      isHandled = true;
      console.log("👆 첫 번째 사용자 인터랙션 감지됨!");
      setUserHasInteracted(true);
      console.log("✅ 이제 음악 재생 가능해짐");
    };

    // 다양한 인터랙션 이벤트 감지
    const events = ["click", "touchstart", "keydown"];
    events.forEach((event) => {
      document.addEventListener(event, handleFirstInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, []); // 의존성 배열 비움 - 한 번만 실행

  // 데스크탑용 키보드 이벤트
  useEffect(() => {
    if (isMobile || !tracks.length) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevTrack();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextTrack();
      } else if (e.key === " ") {
        e.preventDefault();
        togglePlayPause();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isMobile,
    currentIndex,
    tracks.length,
    prevTrack,
    nextTrack,
    togglePlayPause,
  ]);

  // 데스크탑용 마우스 휠 이벤트
  useEffect(() => {
    if (isMobile || !tracks.length) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        if (e.deltaX > 0) {
          nextTrack();
        } else {
          prevTrack();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      return () => container.removeEventListener("wheel", handleWheel);
    }
  }, [isMobile, currentIndex, tracks.length]);

  // 오디오 설정 및 이벤트 리스너 (SSG 안전 처리)
  useEffect(() => {
    // 🔧 SSG Hydration 완료 후에만 오디오 초기화
    if (!tracks.length || !isClientMounted) {
      console.log("⏳ 오디오 초기화 대기 중:", {
        tracksLength: tracks.length,
        isClientMounted,
      });
      return;
    }

    const audio = audioRef.current;
    if (audio) {
      setAudioElement(audio);

      // 강화된 이벤트 리스너들
      const handlePlay = () => {
        console.log("🎵 오디오 재생 이벤트 감지됨");
        setIsPlaying(true);

        // Media Session 상태 즉시 동기화
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "playing";
          console.log("📱 Media Session -> playing 상태로 변경");
        }
      };

      const handlePause = () => {
        console.log("⏸️ 오디오 일시정지 이벤트 감지됨");
        setIsPlaying(false);

        // Media Session 상태 즉시 동기화
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "paused";
          console.log("📱 Media Session -> paused 상태로 변경");
        }
      };

      const handleEnded = () => {
        console.log("🔚 곡 종료됨 - 무한 반복 재생 검토");

        // 현재 상태 확인
        const currentState = {
          storeIsPlaying: isPlaying,
          actuallyPaused: audio.paused,
          userWantsPause: !isPlaying, // store 상태가 false면 사용자가 일시정지를 원함
        };

        console.log("🔍 곡 종료 시점 상태:", currentState);

        setIsPlaying(false);

        // Media Session 상태 업데이트
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "paused";
        }

        // 사용자가 일시정지를 원하지 않을 때만 자동 반복 재생
        if (currentState.storeIsPlaying) {
          console.log("🔄 사용자가 재생을 원하므로 무한 반복 재생 시작");
          audio.currentTime = 0;
          audio.play().catch((error) => {
            console.log("❌ 자동 반복 재생 실패:", error);
          });
        } else {
          console.log("⏸️ 사용자가 일시정지를 원하므로 자동 반복 재생 안 함");
        }
      };

      const handleError = (e: Event) => {
        console.log("❌ 오디오 에러 발생:", e);
        setIsPlaying(false);

        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "paused";
        }
      };

      const handleLoadStart = () => {
        console.log("📀 오디오 로딩 시작");
      };

      const handleCanPlayThrough = () => {
        console.log("✅ 오디오 재생 준비 완료");
      };

      // 이벤트 리스너 등록
      audio.addEventListener("play", handlePlay);
      audio.addEventListener("pause", handlePause);
      audio.addEventListener("ended", handleEnded);
      audio.addEventListener("error", handleError);
      audio.addEventListener("loadstart", handleLoadStart);
      audio.addEventListener("canplaythrough", handleCanPlayThrough);

      // volume 설정
      audio.volume = isMuted ? 0 : 1;
      console.log("🔊 오디오 볼륨 설정:", audio.volume, "음소거:", isMuted);

      return () => {
        audio.removeEventListener("play", handlePlay);
        audio.removeEventListener("pause", handlePause);
        audio.removeEventListener("ended", handleEnded);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("loadstart", handleLoadStart);
        audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      };
    }
  }, [setAudioElement, setIsPlaying, isMuted, tracks.length, isClientMounted]);

  // 트랙 인덱스와 currentIndex 동기화
  useEffect(() => {
    if (!tracks.length) return;

    const syncTrack = async () => {
      if (currentTrackIndex !== currentIndex && tracks[currentIndex]) {
        console.log("🔄 인덱스 동기화:", {
          currentTrackIndex,
          currentIndex,
          track: tracks[currentIndex],
          isCurrentlyPlaying: isPlaying,
        });

        // 현재 재생 중일 때만 자동으로 새 트랙 재생
        // 일시정지 상태라면 메타데이터만 설정하고 재생하지 않음
        if (isPlaying) {
          console.log("▶️ 재생 중이므로 새 트랙 재생");
          await playTrack(tracks[currentIndex], currentIndex);
        } else {
          console.log("⏸️ 일시정지 상태이므로 메타데이터만 설정");
          setTrackMetadata(tracks[currentIndex], currentIndex);
        }
      }
    };

    syncTrack();
  }, [
    currentIndex,
    currentTrackIndex,
    tracks,
    playTrack,
    isPlaying,
    setTrackMetadata,
  ]);

  // 첫 번째 트랙 자동 로딩 (처음 접속 시, SSG 안전 처리)
  useEffect(() => {
    // 🔧 SSG Hydration 완료 후에만 첫 트랙 설정
    if (
      tracks.length > 0 &&
      !currentTrack &&
      currentIndex === 0 &&
      isClientMounted
    ) {
      console.log("📀 첫 번째 트랙 자동 설정:", tracks[0].attributes.name);
      console.log("ℹ️ 메타데이터만 설정하고 재생하지 않음 (사용자 의도 존중)");

      // 메타데이터만 설정 (재생하지 않음)
      setTrackMetadata(tracks[0], 0);
    }
  }, [tracks, currentTrack, currentIndex, setTrackMetadata, isClientMounted]);

  // 모바일용 스크롤 이벤트 (개선된 감도 조정)
  useEffect(() => {
    if (!isMobile || !tracks.length) return;

    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container || isScrolling) return;

      // 디바운싱으로 스크롤 감도 조정
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = container.scrollTop;
        const viewportHeight = container.clientHeight;
        const totalTracks = tracks.length * 3; // 무한 루프 고려
        const newIndex = Math.round(scrollTop / viewportHeight);

        // 확장된 트랙 배열에서 실제 인덱스로 변환
        if (newIndex >= 0 && newIndex < totalTracks) {
          const actualIndex = newIndex % tracks.length;

          if (actualIndex !== currentIndex) {
            isScrolling = true;
            console.log("📱 스크롤로 트랙 변경:", {
              from: currentIndex,
              to: actualIndex,
            });
            setCurrentIndex(actualIndex);

            // 스크롤 후 짧은 딜레이
            setTimeout(() => {
              isScrolling = false;
            }, 200);
          }
        }
      }, 100); // 100ms 디바운싱
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        container.removeEventListener("scroll", handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, [isMobile, currentIndex, tracks.length]);

  // 실시간 애니메이션 구현 (강화된 반짝임 효과)
  useEffect(() => {
    let animationInterval: NodeJS.Timeout;

    const checkAndUpdateAnimation = () => {
      const audioElement = audioRef.current;
      const actualIsPlaying = audioElement ? !audioElement.paused : false;

      // 🔧 실제 audio element 상태로 애니메이션 제어
      return actualIsPlaying && tracks.length > 0;
    };

    const startAnimation = () => {
      console.log("🔊 우퍼 진동 애니메이션 시작!");
      let frameCount = 0;

      animationInterval = setInterval(() => {
        // 🔧 매 프레임마다 실제 재생 상태 확인
        if (!checkAndUpdateAnimation()) {
          console.log("🔇 실제 일시정지 감지 - 애니메이션 즉시 중지");
          setAnimationScale(1);
          setAnimationRotation(0);
          clearInterval(animationInterval);
          return;
        }

        // 실제 우퍼처럼 자연스러운 진동 패턴
        const time = frameCount * 0.05; // 시간 흐름

        // 4/4 박자의 킥 드럼 패턴 (1박, 3박에 강한 킥)
        const beatCycle = (time * 2) % 4; // 4박자 사이클

        let vibrationIntensity = 0;

        // 1박과 3박에 강한 킥 (실제 음악처럼)
        if (beatCycle < 0.3 || (beatCycle >= 2 && beatCycle < 2.3)) {
          // 킥 드럼 순간 - 부드러운 진동 (감도 조금 줄임)
          const kickProgress =
            beatCycle < 0.3 ? beatCycle / 0.3 : (beatCycle - 2) / 0.3;
          vibrationIntensity = Math.exp(-kickProgress * 8) * 0.03; // 5% → 3%로 감소
        } else if (
          (beatCycle >= 0.5 && beatCycle < 0.8) ||
          (beatCycle >= 2.5 && beatCycle < 2.8)
        ) {
          // 약한 스네어나 하이햇 (감도 조금 줄임)
          const snareProgress =
            beatCycle < 0.8 ? (beatCycle - 0.5) / 0.3 : (beatCycle - 2.5) / 0.3;
          vibrationIntensity = Math.exp(-snareProgress * 10) * 0.015; // 2% → 1.5%로 감소
        }

        // 약간의 자연스러운 변화 (실제 스피커는 완벽하지 않음)
        const naturalVariation = Math.sin(time * 15) * 0.003;

        const finalScale = 1 + vibrationIntensity + naturalVariation;

        setAnimationScale(finalScale);
        setAnimationRotation(0);

        frameCount++;
      }, 50); // 50ms = 부드러운 20fps
    };

    if (checkAndUpdateAnimation()) {
      startAnimation();
    } else {
      console.log("🔇 우퍼 진동 중지");
      setAnimationScale(1);
      setAnimationRotation(0);
    }

    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [isPlaying, tracks.length]); // store 상태 변경 시에도 확인

  // 로딩 상태나 에러 상태, 또는 트랙이 없을 때 처리
  if (isLoading || isInitialLoading || (isFetching && !data)) {
    console.log("🔄 로딩 화면 표시 중...");
    return (
      <div className="fixed inset-0 bg-black">{/* 완전히 검은 화면 */}</div>
    );
  }

  if (error) {
    console.log("❌ 에러 화면 표시:", error);
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg mb-4">음악을 불러올 수 없습니다</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!tracks.length) {
    console.log("📭 트랙 없음 화면 표시");
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-lg">트랙을 찾을 수 없습니다</p>
        </div>
      </div>
    );
  }

  // 모바일용 스토리 형식
  if (isMobile) {
    // 무한 루프를 위한 확장된 트랙 배열 생성 (6개 트랙을 3번 반복 = 18개)
    const extendedTracks = [...tracks, ...tracks, ...tracks];

    return (
      <main className="relative">
        {/* 숨겨진 오디오 엘리먼트 */}
        <audio ref={audioRef} preload="metadata" />

        {/* 로딩 중이 아닐 때만 UI 요소들 표시 */}
        {isClientMounted && tracks.length > 0 && (
          <>
            {/* 음소거 토글 버튼 - 우측 상단 */}
            <button
              onClick={async () => {
                if (isProcessing) {
                  console.log("⚠️ 처리 중... 음소거 버튼 무시됨");
                  return;
                }

                // 명시적으로 사용자 상호작용 기록
                console.log("🔇 음소거 버튼 클릭됨", { 현재상태: isMuted });
                setUserHasInteracted(true);

                // 첫 번째 트랙이 로드되지 않았다면 로드
                if (!currentTrack && tracks.length > 0) {
                  console.log("📀 첫 번째 트랙 로딩...");
                  await playTrack(tracks[0], 0);
                }

                await toggleMute();
              }}
              className="fixed top-4 right-4 z-[9999] bg-black/50 backdrop-blur-sm rounded-full p-3 text-white hover:bg-black/70 transition-all duration-300 shadow-lg"
              title={isMuted ? "음소거 해제" : "음소거"}
            >
              {isMuted ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.54-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7z" />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.33-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" />
                </svg>
              )}
            </button>

            {/* 곡명 - 아티스트명 표시 - 좌측 하단 (푸터 겹침 방지) */}
            {tracks[currentIndex] && (
              <div className="fixed bottom-4 left-4 z-50 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-3 text-white max-w-xs md:max-w-sm lg:max-w-md mb-20 md:mb-4">
                <h3 className="font-semibold text-sm md:text-base truncate">
                  {tracks[currentIndex].attributes.name}
                </h3>
                <p className="text-xs md:text-sm text-white/80 truncate">
                  {tracks[currentIndex].attributes.artistName}
                </p>
              </div>
            )}
          </>
        )}

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
                isPlaying={isPlaying && currentTrackIndex === actualIndex}
                onImageClick={togglePlayPause}
                animationScale={animationScale}
                animationRotation={animationRotation}
              />
            );
          })}
        </div>
      </main>
    );
  }

  // 데스크탑: 가로 캐러셀 형식 (완전 풀스크린)
  return (
    <div
      className="fixed inset-0 bg-black overflow-hidden z-50"
      ref={containerRef}
    >
      {/* 숨겨진 오디오 엘리먼트 */}
      <audio ref={audioRef} preload="metadata" />

      {/* 로딩 중이 아닐 때만 UI 요소들 표시 */}
      {isClientMounted && tracks.length > 0 && (
        <>
          {/* 음소거 토글 버튼 - 우측 상단 */}
          <button
            onClick={async () => {
              if (isProcessing) {
                console.log("⚠️ 처리 중... 음소거 버튼 무시됨");
                return;
              }

              // 명시적으로 사용자 상호작용 기록
              console.log("🔇 음소거 버튼 클릭됨", { 현재상태: isMuted });
              setUserHasInteracted(true);

              // 첫 번째 트랙이 로드되지 않았다면 로드
              if (!currentTrack && tracks.length > 0) {
                console.log("📀 첫 번째 트랙 로딩...");
                await playTrack(tracks[0], 0);
              }

              await toggleMute();
            }}
            className="fixed top-24 right-8 z-[9999] bg-black/50 backdrop-blur-sm rounded-full p-4 text-white hover:bg-black/70 transition-all duration-300 shadow-lg"
            title={isMuted ? "음소거 해제" : "음소거"}
          >
            {isMuted ? (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.54-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7z" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.33-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" />
              </svg>
            )}
          </button>

          {/* 이전 버튼 - 사이드 네비게이션과 겹치지 않게 위치 조정 */}
          <button
            onClick={prevTrack}
            className="fixed left-32 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 backdrop-blur-sm rounded-full p-4 text-white hover:bg-black/70 transition-all duration-300 shadow-lg"
            title="이전 곡"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>

          {/* 다음 버튼 */}
          <button
            onClick={nextTrack}
            className="fixed right-32 top-1/2 transform -translate-y-1/2 z-50 bg-black/50 backdrop-blur-sm rounded-full p-4 text-white hover:bg-black/70 transition-all duration-300 shadow-lg"
            title="다음 곡"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
            </svg>
          </button>

          {/* 곡명 - 아티스트명 표시 - 좌측 하단 */}
          {tracks[currentIndex] && (
            <div className="fixed bottom-8 left-8 z-50 bg-black/50 backdrop-blur-sm rounded-xl px-6 py-4 text-white max-w-lg">
              <h3 className="font-bold text-xl mb-2 truncate">
                {tracks[currentIndex].attributes.name}
              </h3>
              <p className="text-lg text-white/80 truncate">
                {tracks[currentIndex].attributes.artistName}
              </p>
            </div>
          )}

          {/* 인디케이터 - 하단 중앙 */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex space-x-3">
            {tracks.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTrack(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                title={`곡 ${index + 1}`}
              />
            ))}
          </div>

          {/* 키보드 안내 - 우측 하단 */}
          <div className="fixed bottom-8 right-8 z-50 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-2 text-white/60 text-sm">
            ← → Space ⟳
          </div>
        </>
      )}

      {/* 현재 트랙 표시 */}
      {isClientMounted && tracks[currentIndex] && (
        <CarouselSlide
          track={tracks[currentIndex]}
          isPlaying={isPlaying}
          onImageClick={togglePlayPause}
          animationScale={animationScale}
          animationRotation={animationRotation}
        />
      )}
    </div>
  );
}

// 개별 스토리 슬라이드 컴포넌트 (모바일용)
function StorySlide({
  track,
  isActive,
  isPlaying,
  onImageClick,
  animationScale,
  animationRotation,
}: {
  track: AppleMusicTrack;
  isActive: boolean;
  isPlaying: boolean;
  onImageClick: () => void;
  animationScale: number;
  animationRotation: number;
}) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // 클라이언트에서만 이미지 URL 설정 (hydration mismatch 방지)
  useEffect(() => {
    const url = getOptimizedAppleMusicImageUrl(track.attributes.artwork, {
      containerWidth: window.innerWidth,
      useDevicePixelRatio: true,
      maxSize: 1600,
    });
    setImageUrl(url);
    setImageLoaded(false); // URL 변경 시 로딩 상태 리셋
  }, [track.attributes.artwork, track.attributes.name]);

  // 이미지 로딩 완료 감지
  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.log("❌ 스토리 이미지 로딩 실패:", track.attributes.name);
      setImageLoaded(true); // 실패해도 표시
    };
    img.src = imageUrl;
  }, [imageUrl, track.attributes.name]);

  if (!imageUrl || !imageLoaded) {
    return (
      <section className="relative h-screen snap-start flex items-center justify-center overflow-hidden bg-black">
        {/* 완전히 검은 화면 */}
      </section>
    );
  }

  return (
    <section className="relative h-screen snap-start flex items-center justify-center overflow-hidden">
      {/* 단일 이미지 레이어 - 비트 애니메이션 적용 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat cursor-pointer"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transformOrigin: "center center",
          // 비트감 있는 애니메이션 (축소 없음)
          transform: `scale(${animationScale})`,
          transition: isPlaying ? "none" : "transform 0.3s ease-out",
          // 강화된 반짝임 효과
          filter: isPlaying
            ? `brightness(${1 + (animationScale - 1) * 0.8}) contrast(${
                1 + (animationScale - 1) * 0.5
              }) saturate(${1 + (animationScale - 1) * 0.3})`
            : "brightness(1) contrast(1) saturate(1)",
        }}
        onClick={onImageClick}
      />

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/40 pointer-events-none" />
    </section>
  );
}

// 데스크탑용 캐러셀 슬라이드 컴포넌트
function CarouselSlide({
  track,
  isPlaying,
  onImageClick,
  animationScale,
  animationRotation,
}: {
  track: AppleMusicTrack;
  isPlaying: boolean;
  onImageClick: () => void;
  animationScale: number;
  animationRotation: number;
}) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  // 클라이언트에서만 이미지 URL 설정 (hydration mismatch 방지)
  useEffect(() => {
    if (track) {
      const url = getOptimizedAppleMusicImageUrl(track.attributes.artwork, {
        containerWidth: window.innerWidth,
        useDevicePixelRatio: true,
        maxSize: 2000,
      });
      setImageUrl(url);
      setImageLoaded(false); // URL 변경 시 로딩 상태 리셋
    }
  }, [track?.attributes?.artwork, track?.attributes?.name]);

  // 이미지 로딩 완료 감지
  useEffect(() => {
    if (!imageUrl || !track) return;

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.log("❌ 캐러셀 이미지 로딩 실패:", track.attributes.name);
      setImageLoaded(true); // 실패해도 표시
    };
    img.src = imageUrl;
  }, [imageUrl, track?.attributes?.name]);

  if (!track) {
    console.log("❌ 트랙 데이터 없음");
    return null;
  }

  if (!imageUrl || !imageLoaded) {
    return (
      <div className="absolute inset-0 bg-black">{/* 완전히 검은 화면 */}</div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* 단일 이미지 레이어 - 비트 애니메이션 적용 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat cursor-pointer"
        style={{
          backgroundImage: `url(${imageUrl})`,
          transformOrigin: "center center",
          // 비트감 있는 애니메이션 (축소 없음)
          transform: `scale(${animationScale})`,
          transition: isPlaying ? "none" : "transform 0.3s ease-out",
          // 강화된 반짝임 효과
          filter: isPlaying
            ? `brightness(${1 + (animationScale - 1) * 0.8}) contrast(${
                1 + (animationScale - 1) * 0.5
              }) saturate(${1 + (animationScale - 1) * 0.3})`
            : "brightness(1) contrast(1) saturate(1)",
        }}
        onClick={onImageClick}
      />

      {/* 오버레이 */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}
