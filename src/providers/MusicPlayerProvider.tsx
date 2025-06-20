"use client";

import { AppleMusicTrack } from "@/types/apple-music";
import { useSession } from "next-auth/react";
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
  audioRef: React.RefObject<HTMLAudioElement | null>;
  playTrack: (track: AppleMusicTrack) => void;
  togglePlayback: () => void;
  seekTo: (time: number) => void;
  hidePlayer: () => void;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(
  undefined
);

interface MusicPlayerProviderProps {
  children: ReactNode;
}

export function MusicPlayerProvider({ children }: MusicPlayerProviderProps) {
  const { data: session } = useSession();
  const [currentTrack, setCurrentTrack] = useState<AppleMusicTrack | null>(
    null
  );
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isUsingMusicKit, setIsUsingMusicKit] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const musicKitRef = useRef<any>(null);

  // MusicKit 권한 확인 (로그인이 되어있고 명시적으로 권한이 있을 때만)
  const checkMusicKitAuth = () => {
    if (session && typeof window !== "undefined" && window.MusicKit) {
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
        console.log("MusicKit으로 재생:", track.attributes.name);
        return;
      } catch (error) {
        console.error("MusicKit 재생 실패, 프리뷰로 전환:", error);
      }
    }

    // 기본적으로 프리뷰 재생 사용
    setIsUsingMusicKit(false);
    console.log("프리뷰로 재생:", track.attributes.name);
  };

  const togglePlayback = async () => {
    if (isUsingMusicKit && musicKitRef.current?.isAuthorized) {
      try {
        if (isPlaying) {
          musicKitRef.current.pause();
        } else {
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
    if (isUsingMusicKit && musicKitRef.current?.isAuthorized) {
      try {
        musicKitRef.current.pause();
      } catch (error) {
        console.error("MusicKit 일시정지 실패:", error);
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }

    setIsPlayerVisible(false);
    setCurrentTrack(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsUsingMusicKit(false);
  };

  // MusicKit 이벤트 리스너 (권한이 있을 때만)
  useEffect(() => {
    if (!isUsingMusicKit || !musicKitRef.current) return;

    const musicKit = musicKitRef.current;

    const handlePlaybackStateChange = () => {
      setIsPlaying(musicKit.playbackState === 2); // 2 = playing
      setCurrentTime(musicKit.currentPlaybackTime);
      setDuration(musicKit.currentPlaybackDuration);
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

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlayerVisible,
        isPlaying,
        currentTime,
        duration,
        isUsingMusicKit,
        audioRef,
        playTrack,
        togglePlayback,
        seekTo,
        hidePlayer,
      }}
    >
      {children}
      {/* HTML5 Audio for preview playback */}
      <audio
        ref={audioRef}
        onPlay={() => !isUsingMusicKit && setIsPlaying(true)}
        onPause={() => !isUsingMusicKit && setIsPlaying(false)}
        onTimeUpdate={(e) =>
          !isUsingMusicKit &&
          setCurrentTime((e.target as HTMLAudioElement).currentTime)
        }
        onLoadedMetadata={(e) =>
          !isUsingMusicKit &&
          setDuration((e.target as HTMLAudioElement).duration)
        }
        onEnded={() => {
          if (!isUsingMusicKit) {
            setIsPlaying(false);
            setCurrentTime(0);
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
