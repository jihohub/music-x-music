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
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playTrack: (track: AppleMusicTrack) => void;
  togglePlayback: () => void;
  seekTo: (time: number) => void;
  hidePlayer: () => void;
  closePlayer: () => void;
  expandPlayer: () => void;
  collapsePlayer: () => void;
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
  const [pageTextColor, setPageTextColor] = useState("#ffffff");
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicKitRef = useRef<any>(null);

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
    setCurrentTrack(track);
    setIsPlayerVisible(true);
    setIsFullScreen(true);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    // MusicKit 권한이 명시적으로 있는 경우에만 사용
    const musicKitAuthorized = checkMusicKitAuth();

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
        console.log("MusicKit으로 재생:", track.attributes.name);
        return;
      } catch (error) {
        console.error("MusicKit 재생 실패, 프리뷰로 전환:", error);
      }
    }

    // 기본적으로 프리뷰 재생 사용
    setIsUsingMusicKit(false);
    console.log("프리뷰로 재생:", track.attributes.name);

    // 프리뷰 자동 재생 (audioRef 업데이트는 useEffect에서 처리)
    setTimeout(() => {
      if (audioRef.current && !musicKitAuthorized) {
        audioRef.current.play().catch((error) => {
          console.error("프리뷰 자동 재생 실패:", error);
        });
      }
    }, 100);
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
  };

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
        audioRef,
        playTrack,
        togglePlayback,
        seekTo,
        hidePlayer,
        closePlayer,
        expandPlayer,
        collapsePlayer,
        getCurrentTrackTextColor,
        setPageTextColor,
        getPageTextColor: () => pageTextColor,
        getWidgetTextColor,
      }}
    >
      {children}
      {/* HTML5 Audio for preview playback */}
      <audio
        ref={audioRef}
        onPlay={() => !isUsingMusicKit && setIsPlaying(true)}
        onPause={() => !isUsingMusicKit && setIsPlaying(false)}
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
        onLoadedMetadata={(e) =>
          !isUsingMusicKit &&
          setDuration((e.target as HTMLAudioElement).duration)
        }
        onEnded={() => {
          if (!isUsingMusicKit) {
            setIsPlaying(false);
            setCurrentTime(duration); // duration으로 설정해서 진행바가 끝까지 가도록
          }
        }}
        onError={(e) => {
          console.error("오디오 재생 오류:", e);
          if (!isUsingMusicKit) {
            setIsPlaying(false);
          }
        }}
        preload="metadata"
      />
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
