import { AppleMusicTrack } from "@/types/apple-music";
import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { setTrackTheme } from "./themeStore";

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

interface MusicPlayerState {
  // 상태
  currentTrack: AppleMusicTrack | null;
  isPlayerVisible: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isUsingMusicKit: boolean;
  isFullScreen: boolean;
  isExpanded: boolean;

  // Audio 및 MusicKit 참조
  audioElement: HTMLAudioElement | null;
  musicKitInstance: any;

  // 액션
  playTrack: (track: AppleMusicTrack) => Promise<void>;
  togglePlayback: () => Promise<void>;
  seekTo: (time: number) => void;
  hidePlayer: () => void;
  closePlayer: () => void;
  expandPlayer: () => void;
  collapsePlayer: () => void;
  toggleExpanded: () => void;
  maximizePlayer: () => void;
  updateCurrentTime: (time: number) => void;
  updateDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
  initializeAudio: () => void;
  checkMusicKitAuth: () => boolean;
}

export const useMusicPlayerStore = create<MusicPlayerState>()(
  subscribeWithSelector((set, get) => ({
    // 초기 상태
    currentTrack: null,
    isPlayerVisible: false,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isUsingMusicKit: false,
    isFullScreen: false,
    isExpanded: false,
    audioElement: null,
    musicKitInstance: null,

    // Audio 초기화
    initializeAudio: () => {
      if (typeof window === "undefined") return;

      const audio = new Audio();
      audio.preload = "metadata";
      audio.crossOrigin = "anonymous";
      (audio as any).playsInline = true; // iOS에서 인라인 재생

      // 이벤트 리스너 등록
      audio.addEventListener("play", () => {
        const { isUsingMusicKit } = get();
        if (!isUsingMusicKit) {
          set({ isPlaying: true });
          console.log("HTML5 Audio: 재생 시작");
        }
      });

      audio.addEventListener("pause", () => {
        const { isUsingMusicKit } = get();
        if (!isUsingMusicKit) {
          set({ isPlaying: false });
          console.log("HTML5 Audio: 재생 일시정지");
        }
      });

      audio.addEventListener("timeupdate", () => {
        const { isUsingMusicKit } = get();
        if (!isUsingMusicKit) {
          const currentTime = audio.currentTime;
          const duration = audio.duration;
          set({ currentTime });

          // 재생 완료 감지
          if (Math.abs(currentTime - duration) < 0.1 && duration > 0) {
            set({ isPlaying: false, currentTime: duration });
          }
        }
      });

      audio.addEventListener("loadedmetadata", () => {
        const { isUsingMusicKit } = get();
        if (!isUsingMusicKit) {
          set({ duration: audio.duration });
          console.log("HTML5 Audio: 메타데이터 로드됨, 길이:", audio.duration);
        }
      });

      audio.addEventListener("ended", () => {
        const { isUsingMusicKit } = get();
        if (!isUsingMusicKit) {
          set({ isPlaying: false, currentTime: get().duration });
          console.log("HTML5 Audio: 재생 완료");
        }
      });

      audio.addEventListener("error", (e) => {
        console.error("HTML5 Audio 재생 오류:", e);
        const { isUsingMusicKit } = get();
        if (!isUsingMusicKit) {
          set({ isPlaying: false });
        }
      });

      // body에 추가하여 페이지 변경에 영향받지 않게 함
      audio.style.display = "none";
      document.body.appendChild(audio);

      set({ audioElement: audio });
    },

    // MusicKit 권한 확인
    checkMusicKitAuth: () => {
      if (typeof window !== "undefined" && window.MusicKit) {
        try {
          const musicKit = window.MusicKit.getInstance();
          set({ musicKitInstance: musicKit });
          return musicKit.isAuthorized;
        } catch (error) {
          console.log("MusicKit 권한 확인 중 오류:", error);
          return false;
        }
      }
      return false;
    },

    // 트랙 재생
    playTrack: async (track: AppleMusicTrack) => {
      const { audioElement, checkMusicKitAuth } = get();

      set({
        currentTrack: track,
        isPlayerVisible: true,
        isFullScreen: false,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      });

      // 트랙 테마 적용
      setTrackTheme(track);

      // MusicKit 권한 확인
      const musicKitAuthorized = checkMusicKitAuth();

      if (musicKitAuthorized) {
        try {
          const { musicKitInstance } = get();
          await musicKitInstance.setQueue({ song: track.id });
          set({
            duration: track.attributes.durationInMillis / 1000,
            isUsingMusicKit: true,
          });
          await musicKitInstance.play();
          console.log("MusicKit으로 재생:", track.attributes.name);
          return;
        } catch (error) {
          console.error("MusicKit 재생 실패, 프리뷰로 전환:", error);
        }
      }

      // 프리뷰 재생
      set({ isUsingMusicKit: false });
      console.log("프리뷰로 재생:", track.attributes.name);

      if (audioElement) {
        const previewUrl = track.attributes.previews?.[0]?.url;
        if (previewUrl) {
          audioElement.src = previewUrl;
          audioElement.load();
          try {
            await audioElement.play();
          } catch (error) {
            console.error("프리뷰 자동 재생 실패:", error);
          }
        }
      }
    },

    // 재생/일시정지 토글
    togglePlayback: async () => {
      const {
        isUsingMusicKit,
        isPlaying,
        audioElement,
        musicKitInstance,
        currentTime,
        duration,
      } = get();

      if (isUsingMusicKit && musicKitInstance?.isAuthorized) {
        try {
          if (isPlaying) {
            musicKitInstance.pause();
          } else {
            if (Math.abs(currentTime - duration) < 1) {
              musicKitInstance.currentPlaybackTime = 0;
            }
            await musicKitInstance.play();
          }
        } catch (error) {
          console.error("MusicKit 재생/일시정지 실패:", error);
        }
      } else if (audioElement) {
        if (isPlaying) {
          audioElement.pause();
        } else {
          try {
            if (Math.abs(currentTime - duration) < 1) {
              audioElement.currentTime = 0;
              set({ currentTime: 0 });
            }
            await audioElement.play();
          } catch (error) {
            console.error("프리뷰 재생 실패:", error);
          }
        }
      }
    },

    // 탐색
    seekTo: (time: number) => {
      const { isUsingMusicKit, audioElement, musicKitInstance } = get();

      if (isUsingMusicKit && musicKitInstance?.isAuthorized) {
        try {
          musicKitInstance.currentPlaybackTime = time;
        } catch (error) {
          console.error("MusicKit 탐색 실패:", error);
        }
      } else if (audioElement) {
        audioElement.currentTime = time;
        set({ currentTime: time });
      }
    },

    // 플레이어 숨기기
    hidePlayer: () => {
      set({ isFullScreen: false });
    },

    // 플레이어 닫기
    closePlayer: () => {
      const { isUsingMusicKit, audioElement, musicKitInstance } = get();

      set({
        isPlayerVisible: false,
        isFullScreen: false,
        isPlaying: false,
        currentTime: 0,
        currentTrack: null,
      });

      if (isUsingMusicKit && musicKitInstance?.isAuthorized) {
        try {
          musicKitInstance.pause();
        } catch (error) {
          console.error("MusicKit 정지 실패:", error);
        }
      } else if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
    },

    // 플레이어 확장
    expandPlayer: () => {
      set({ isFullScreen: true });
    },

    // 플레이어 축소
    collapsePlayer: () => {
      set({ isFullScreen: false, isExpanded: false });
    },

    // 데스크탑 확장 토글
    toggleExpanded: () => {
      const { isExpanded } = get();
      set({ isExpanded: !isExpanded, isFullScreen: false });
    },

    // 전체화면 전환
    maximizePlayer: () => {
      set({ isFullScreen: true, isExpanded: false });
    },

    // 현재 시간 업데이트
    updateCurrentTime: (time: number) => {
      set({ currentTime: time });
    },

    // 지속 시간 업데이트
    updateDuration: (duration: number) => {
      set({ duration });
    },

    // 재생 상태 설정
    setIsPlaying: (playing: boolean) => {
      set({ isPlaying: playing });
    },
  }))
);

// 초기화 함수 (앱 시작 시 호출)
export const initializeMusicPlayer = () => {
  if (typeof window !== "undefined") {
    const { initializeAudio, checkMusicKitAuth } =
      useMusicPlayerStore.getState();
    initializeAudio();
    checkMusicKitAuth();
  }
};
