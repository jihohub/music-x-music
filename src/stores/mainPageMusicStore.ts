import { AppleMusicTrack } from "@/types/apple-music";
import { create } from "zustand";

interface MainPageMusicState {
  // 현재 재생 중인 트랙
  currentTrack: AppleMusicTrack | null;
  currentTrackIndex: number;

  // 오디오 상태
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;

  // 오디오 엘리먼트
  audioElement: HTMLAudioElement | null;

  // 액션들
  setCurrentTrack: (track: AppleMusicTrack | null) => void;
  setCurrentTrackIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setAudioElement: (audio: HTMLAudioElement | null) => void;

  // 메서드들
  play: () => Promise<void>;
  pause: () => void;
  toggleMute: () => void;
  playTrack: (track: AppleMusicTrack, index?: number) => Promise<void>;
  cleanup: () => void;
}

export const useMainPageMusicStore = create<MainPageMusicState>((set, get) => ({
  // 초기 상태
  currentTrack: null,
  currentTrackIndex: 0,
  isPlaying: false,
  isMuted: true, // 기본 음소거 상태
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  audioElement: null,

  // 세터들
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setCurrentTrackIndex: (index) => set({ currentTrackIndex: index }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setAudioElement: (audio) => set({ audioElement: audio }),

  // 재생/일시정지
  play: async () => {
    const { audioElement, isPlaying } = get();
    if (audioElement && !isPlaying) {
      try {
        console.log("🎵 재생 시도 중...");
        await audioElement.play();
        set({ isPlaying: true });
        console.log("✅ 재생 성공!");
      } catch (error) {
        console.log(
          "❌ 재생 실패:",
          error instanceof Error ? error.message : String(error)
        );
        set({ isPlaying: false });
      }
    }
  },

  pause: () => {
    const { audioElement, isPlaying } = get();
    if (audioElement && isPlaying) {
      console.log("⏸️ 일시정지 중...");
      audioElement.pause();
      set({ isPlaying: false });
      console.log("✅ 일시정지 완료");
    }
  },

  // 음소거 토글
  toggleMute: () => {
    const { audioElement, isMuted } = get();
    if (audioElement) {
      const newMuted = !isMuted;
      audioElement.muted = newMuted;
      set({ isMuted: newMuted });
    }
  },

  // 새 트랙 재생
  playTrack: async (track, index = 0) => {
    const { audioElement, volume, isMuted, isPlaying } = get();

    if (audioElement) {
      // 현재 재생 중이면 먼저 정지
      if (isPlaying) {
        console.log("🛑 현재 재생 중인 트랙 정지...");
        audioElement.pause();
      }

      // 미리보기 URL이 있는 경우에만 재생
      if (track.attributes.previews && track.attributes.previews.length > 0) {
        const previewUrl = track.attributes.previews[0].url;

        console.log("📀 새 트랙 로딩:", track.attributes.name);
        audioElement.src = previewUrl;
        audioElement.volume = volume;
        audioElement.muted = isMuted;

        set({
          currentTrack: track,
          currentTrackIndex: index,
          currentTime: 0,
          duration: 0,
          isPlaying: false, // 일단 false로 설정
        });

        // 잠시 기다린 후 재생 시도 (브라우저가 준비될 시간)
        setTimeout(async () => {
          try {
            console.log("▶️ 재생 시도:", track.attributes.name);
            await audioElement.play();
            set({ isPlaying: true });
            console.log("✅ 재생 성공!");
          } catch (error) {
            console.log(
              "❌ 재생 실패:",
              error instanceof Error ? error.message : String(error)
            );
            set({ isPlaying: false });
          }
        }, 100);
      } else {
        console.log("⚠️ 미리보기 URL이 없는 트랙:", track.attributes.name);
        set({
          currentTrack: track,
          currentTrackIndex: index,
          isPlaying: false,
        });
      }
    }
  },

  // 정리
  cleanup: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      audioElement.src = "";
    }
    set({
      currentTrack: null,
      currentTrackIndex: 0,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    });
  },
}));
