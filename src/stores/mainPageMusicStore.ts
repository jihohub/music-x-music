import { AppleMusicTrack } from "@/types/apple-music";
import { create } from "zustand";

interface MainPageMusicState {
  // 현재 재생 중인 트랙
  currentTrack: AppleMusicTrack | null;

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
  setIsPlaying: (playing: boolean) => void;
  setIsMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setAudioElement: (audio: HTMLAudioElement | null) => void;

  // 메서드들
  play: () => void;
  pause: () => void;
  toggleMute: () => void;
  playTrack: (track: AppleMusicTrack) => void;
  cleanup: () => void;
}

export const useMainPageMusicStore = create<MainPageMusicState>((set, get) => ({
  // 초기 상태
  currentTrack: null,
  isPlaying: false,
  isMuted: true, // 처음엔 음소거
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  audioElement: null,

  // 세터들
  setCurrentTrack: (track) => set({ currentTrack: track }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsMuted: (muted) => set({ isMuted: muted }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  setAudioElement: (audio) => set({ audioElement: audio }),

  // 재생/일시정지
  play: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.play().catch(console.error);
      set({ isPlaying: true });
    }
  },

  pause: () => {
    const { audioElement } = get();
    if (audioElement) {
      audioElement.pause();
      set({ isPlaying: false });
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
  playTrack: (track) => {
    const { audioElement, volume, isMuted } = get();

    if (audioElement) {
      // 미리보기 URL이 있는 경우에만 재생
      if (track.attributes.previews && track.attributes.previews.length > 0) {
        const previewUrl = track.attributes.previews[0].url;
        audioElement.src = previewUrl;
        audioElement.volume = volume;
        audioElement.muted = isMuted;

        set({
          currentTrack: track,
          currentTime: 0,
          duration: 0,
        });

        // 자동 재생
        audioElement.play().catch((error) => {
          console.log("자동 재생 실패 (브라우저 정책):", error);
          set({ isPlaying: false });
        });
      } else {
        console.log("미리보기 URL이 없는 트랙:", track.attributes.name);
        set({ currentTrack: track, isPlaying: false });
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
      isPlaying: false,
      currentTime: 0,
      duration: 0,
    });
  },
}));
