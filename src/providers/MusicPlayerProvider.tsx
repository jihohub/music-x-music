"use client";

import { AppleMusicTrack } from "@/types/apple-music";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

// MusicKit 타입 정의
declare global {
  interface Window {
    MusicKit?: {
      getInstance(): {
        isAuthorized: boolean;
        authorize(): Promise<void>;
        unauthorize(): Promise<void>;
        play(): Promise<void>;
        pause(): void;
        setQueue(queue: any): Promise<void>;
        currentPlaybackTime: number;
        currentPlaybackDuration: number;
        playbackState: number;
        addEventListener(event: string, handler: () => void): void;
        removeEventListener(event: string, handler: () => void): void;
      };
    };
  }
}

interface MusicPlayerContextType {
  currentTrack: AppleMusicTrack | null;
  isPlayerVisible: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isUsingMusicKit: boolean;
  isFullScreen: boolean;
  isExpanded: boolean; // 데스크탑 확장 상태
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playTrack: (track: AppleMusicTrack) => void;
  togglePlayback: () => void;
  seekTo: (time: number) => void;
  hidePlayer: () => void;
  closePlayer: () => void;
  expandPlayer: () => void;
  collapsePlayer: () => void;
  toggleExpanded: () => void; // 데스크탑 확장/축소 토글
  maximizePlayer: () => void; // 전체화면으로 전환
  getCurrentTrackTextColor: () => string;
  setPageTextColor: (color: string) => void;
  getPageTextColor: () => string;
  getWidgetTextColor: () => string; // 위젯용 텍스트 색상
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export function MusicPlayerProvider({ children }: MusicPlayerProviderProps) {
  const [currentTrack, setCurrentTrack] = useState<AppleMusicTrack | null>(
    null
  );
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isUsingMusicKit, setIsUsingMusicKit] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // 데스크탑 확장 상태
  const [pageTextColor, setPageTextColor] = useState("#ffffff");
  const [mounted, setMounted] = useState(false); // SSR 대응
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicKitRef = useRef<any>(null);

  // 모바일 재생 상태 보존을 위한 백업
  const audioStateRef = useRef<{
    src: string;
    currentTime: number;
    isPlaying: boolean;
  }>({ src: "", currentTime: 0, isPlaying: false });

  // 클라이언트 사이드 마운트 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  // MusicKit 권한 확인 (로그인이 되어있고 명시적으로 권한이 있을 때만)
  const checkMusicKitAuth = () => {
    if (typeof window !== "undefined" && window.MusicKit) {
      try {
        const musicKit = window.MusicKit.getInstance();
        musicKitRef.current = musicKit;
        return musicKit.isAuthorized;
      } catch (error) {
        console.log("MusicKit 권한 확인 중 오류:", error);
        return false;
      }
    }
    return false;
  };

  const playTrack = async (track: AppleMusicTrack) => {
    console.log("🎵 playTrack 호출됨:", track.attributes.name);

    setCurrentTrack(track);
    setIsPlayerVisible(true);
    setIsFullScreen(false); // 미니 플레이어로 시작
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    // MusicKit 권한이 명시적으로 있는 경우에만 사용
    const musicKitAuthorized = checkMusicKitAuth();
    console.log("🔐 MusicKit 권한:", musicKitAuthorized);

    if (musicKitAuthorized) {
      try {
        // MusicKit으로 전체곡 재생 시도
        await musicKitRef.current.setQueue({
          song: track.id,
        });
        setDuration(track.attributes.durationInMillis / 1000);
        setIsUsingMusicKit(true);
        // MusicKit으로 자동 재생 시작
        await musicKitRef.current.play();
        console.log("✅ MusicKit으로 재생:", track.attributes.name);
        return;
      } catch (error) {
        console.error("❌ MusicKit 재생 실패, 프리뷰로 전환:", error);
      }
    }

    // 기본적으로 프리뷰 재생 사용
    setIsUsingMusicKit(false);
    console.log("🎧 프리뷰로 재생:", track.attributes.name);

    // 프리뷰 자동재생 시도 (사용자 상호작용으로 인한 호출이므로 허용될 가능성 높음)
    if (audioRef.current) {
      const previewUrl = track.attributes.previews?.[0]?.url;
      console.log("🔗 프리뷰 URL:", previewUrl);

      if (previewUrl) {
        audioRef.current.src = previewUrl;
        audioRef.current.load();
        console.log("📁 오디오 로드 완료");

        // 약간의 지연 후 자동재생 시도
        setTimeout(async () => {
          try {
            if (audioRef.current) {
              console.log("▶️ 자동재생 시도...");
              await audioRef.current.play();
              console.log("✅ 프리뷰 자동재생 성공!");
            }
          } catch (error) {
            console.log(
              "⚠️ 프리뷰 자동재생 실패 (사용자가 재생 버튼을 눌러야 함):",
              (error as Error).message
            );
            // 자동재생이 실패해도 오디오는 준비되어 있어서 사용자가 재생 버튼을 누르면 재생됨
          }
        }, 100);
      } else {
        console.log("❌ 프리뷰 URL이 없습니다");
      }
    } else {
      console.log("❌ audioRef가 없습니다");
    }
  };

  const togglePlayback = async () => {
    if (isUsingMusicKit && musicKitRef.current?.isAuthorized) {
      try {
        if (isPlaying) {
          musicKitRef.current.pause();
        } else {
          // 노래가 끝났을 때 처음부터 재생
          if (Math.abs(currentTime - duration) < 1) {
            musicKitRef.current.currentPlaybackTime = 0;
          }
          await musicKitRef.current.play();
        }
      } catch (error) {
        console.error("MusicKit 재생/일시정지 실패:", error);
      }
    } else {
      // HTML5 Audio (프리뷰)
      if (!audioRef.current) return;

      // 상태 백업
      audioStateRef.current = {
        src: audioRef.current.src,
        currentTime: audioRef.current.currentTime,
        isPlaying: !isPlaying,
      };

      if (isPlaying) {
        audioRef.current.pause();
      } else {
        try {
          // 노래가 끝났을 때 처음부터 재생
          if (Math.abs(currentTime - duration) < 1) {
            audioRef.current.currentTime = 0;
            setCurrentTime(0);
          }
          await audioRef.current.play();
        } catch (error) {
          console.error("프리뷰 재생 실패:", error);
        }
      }
    }
  };

  const seekTo = (time: number) => {
    if (isUsingMusicKit && musicKitRef.current?.isAuthorized) {
      try {
        musicKitRef.current.currentPlaybackTime = time;
      } catch (error) {
        console.error("MusicKit 탐색 실패:", error);
      }
    } else {
      if (!audioRef.current) return;
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const hidePlayer = () => {
    // 페이지 이동 시에는 음악을 중단하지 않고 미니 플레이어로만 전환
    setIsFullScreen(false); // 풀스크린만 해제, 미니 플레이어는 유지
    // setIsPlayerVisible(false); // 이 줄을 주석처리하여 음악이 계속 재생되도록 함
  };

  const closePlayer = () => {
    // 완전히 플레이어를 닫고 음악 중단
    setIsPlayerVisible(false);
    setIsFullScreen(false);
    setIsPlaying(false);

    if (isUsingMusicKit && musicKitRef.current?.isAuthorized) {
      try {
        musicKitRef.current.pause();
      } catch (error) {
        console.error("MusicKit 정지 실패:", error);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }

    setCurrentTime(0);
    setCurrentTrack(null);
  };

  const expandPlayer = () => {
    setIsFullScreen(true);
  };

  const collapsePlayer = () => {
    setIsFullScreen(false);
    setIsExpanded(false); // 전체화면 해제 시 확장도 해제
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    setIsFullScreen(false); // 확장 토글 시 전체화면 해제
  };

  const maximizePlayer = () => {
    setIsFullScreen(true);
    setIsExpanded(false); // 전체화면 전환 시 확장 해제
  };

  // Audio 요소 상태 복원 (모바일 대응)
  useEffect(() => {
    if (!audioRef.current || isUsingMusicKit) return;

    const audio = audioRef.current;
    const backup = audioStateRef.current;

    // 백업된 상태가 있고 현재 트랙과 일치하면 복원
    if (backup.src && audio.src !== backup.src && currentTrack) {
      const previewUrl = currentTrack.attributes.previews?.[0]?.url;
      if (
        previewUrl &&
        backup.src.includes(previewUrl.split("/").pop() || "")
      ) {
        console.log("모바일: Audio 상태 복원 중...");
        audio.src = backup.src;
        audio.currentTime = backup.currentTime;

        if (backup.isPlaying) {
          audio.play().catch((error) => {
            console.error("상태 복원 중 재생 실패:", error);
          });
        }
      }
    }
  }, [audioRef.current, currentTrack, isUsingMusicKit]);

  // MusicKit 이벤트 리스너 (권한이 있을 때만)
  useEffect(() => {
    if (!isUsingMusicKit || !musicKitRef.current) return;

    const musicKit = musicKitRef.current;

    const handlePlaybackStateChange = () => {
      const playbackState = musicKit.playbackState;
      const currentPlaybackTime = musicKit.currentPlaybackTime;
      const playbackDuration = musicKit.currentPlaybackDuration;

      setIsPlaying(playbackState === 2); // 2 = playing
      setCurrentTime(currentPlaybackTime);
      setDuration(playbackDuration);

      // 재생 완료 감지 (재생이 멈추고 시간이 끝에 도달했을 때)
      if (
        playbackState !== 2 &&
        Math.abs(currentPlaybackTime - playbackDuration) < 1 &&
        playbackDuration > 0
      ) {
        setIsPlaying(false);
        setCurrentTime(playbackDuration);
      }
    };

    musicKit.addEventListener(
      "playbackStateDidChange",
      handlePlaybackStateChange
    );
    musicKit.addEventListener(
      "playbackTimeDidChange",
      handlePlaybackStateChange
    );

    return () => {
      musicKit.removeEventListener(
        "playbackStateDidChange",
        handlePlaybackStateChange
      );
      musicKit.removeEventListener(
        "playbackTimeDidChange",
        handlePlaybackStateChange
      );
    };
  }, [isUsingMusicKit]);

  // 현재 트랙의 텍스트 색상 가져오기
  const getCurrentTrackTextColor = () => {
    if (currentTrack?.attributes.artwork?.textColor1) {
      return `#${currentTrack.attributes.artwork.textColor1}`;
    }
    return "#ffffff"; // 기본 흰색
  };

  // 위젯용 텍스트 색상 가져오기 (트랙 색상 우선)
  const getWidgetTextColor = () => {
    // 트랙이 재생 중이면 트랙 색상 사용
    if (currentTrack?.attributes.artwork?.textColor1) {
      return `#${currentTrack.attributes.artwork.textColor1}`;
    }
    // 트랙이 없으면 페이지 색상 사용
    if (pageTextColor !== "#ffffff") {
      return pageTextColor;
    }
    return "#ffffff"; // 기본 흰색
  };

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlayerVisible,
        isPlaying,
        currentTime,
        duration,
        isUsingMusicKit,
        isFullScreen,
        isExpanded,
        audioRef,
        playTrack,
        togglePlayback,
        seekTo,
        hidePlayer,
        closePlayer,
        expandPlayer,
        collapsePlayer,
        toggleExpanded,
        maximizePlayer,
        getCurrentTrackTextColor,
        setPageTextColor,
        getPageTextColor: () => pageTextColor,
        getWidgetTextColor,
      }}
    >
      {children}
      {/* HTML5 Audio를 클라이언트 사이드에서만 렌더링 */}
      {mounted &&
        createPortal(
          <audio
            ref={audioRef}
            onPlay={() => {
              if (!isUsingMusicKit) {
                setIsPlaying(true);
                console.log("HTML5 Audio: 재생 시작");
              }
            }}
            onPause={() => {
              if (!isUsingMusicKit) {
                setIsPlaying(false);
                console.log("HTML5 Audio: 재생 일시정지");
              }
            }}
            onTimeUpdate={(e) => {
              if (!isUsingMusicKit) {
                const audio = e.target as HTMLAudioElement;
                const currentTime = audio.currentTime;
                const duration = audio.duration;
                setCurrentTime(currentTime);

                // 재생 완료 감지 (시간이 끝에 도달했을 때)
                if (Math.abs(currentTime - duration) < 0.1 && duration > 0) {
                  setIsPlaying(false);
                  setCurrentTime(duration);
                }
              }
            }}
            onLoadedMetadata={(e) => {
              if (!isUsingMusicKit) {
                const audio = e.target as HTMLAudioElement;
                setDuration(audio.duration);
                console.log(
                  "HTML5 Audio: 메타데이터 로드됨, 길이:",
                  audio.duration
                );
              }
            }}
            onCanPlay={() => {
              if (!isUsingMusicKit && audioRef.current) {
                console.log("HTML5 Audio: 재생 준비됨");
              }
            }}
            onEnded={() => {
              if (!isUsingMusicKit) {
                setIsPlaying(false);
                setCurrentTime(duration);
                console.log("HTML5 Audio: 재생 완료");
              }
            }}
            onError={(e) => {
              console.error("HTML5 Audio 재생 오류:", e);
              if (!isUsingMusicKit) {
                setIsPlaying(false);
              }
            }}
            onSuspend={() => {
              // 모바일에서 Suspense 경계로 인한 중단 방지
              console.log("HTML5 Audio: 일시 중단됨 (모바일 대응)");
            }}
            onStalled={() => {
              // 네트워크 지연으로 인한 중단 방지
              console.log("HTML5 Audio: 네트워크 지연");
            }}
            preload="metadata"
            crossOrigin="anonymous"
            playsInline // iOS에서 인라인 재생 허용
            muted={false} // 음소거 해제
            style={{ display: "none" }} // 화면에 보이지 않게
          />,
          document.body
        )}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (context === undefined) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
