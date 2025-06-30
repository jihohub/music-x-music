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

  // 첫 번째 상호작용 상태
  isFirstMuteClick: boolean;

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
  toggleMute: () => Promise<void>;
  playTrack: (track: AppleMusicTrack, index?: number) => Promise<void>;
  updateMediaSession: (track: AppleMusicTrack) => void;
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
  isFirstMuteClick: true,
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

        // Media Session 재생 상태 업데이트
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "playing";
        }

        console.log("✅ 재생 성공!");
      } catch (error) {
        console.log(
          "❌ 재생 실패:",
          error instanceof Error ? error.message : String(error)
        );
        set({ isPlaying: false });

        // Media Session 재생 상태 업데이트
        if ("mediaSession" in navigator) {
          navigator.mediaSession.playbackState = "paused";
        }
      }
    }
  },

  pause: () => {
    const { audioElement, isPlaying } = get();
    if (audioElement && isPlaying) {
      console.log("⏸️ 일시정지 중...");
      audioElement.pause();
      set({ isPlaying: false });

      // Media Session 재생 상태 업데이트
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
      }

      console.log("✅ 일시정지 완료");
    }
  },

  // 음소거 토글
  toggleMute: async () => {
    const { audioElement, isMuted, isFirstMuteClick, play, currentTrack } =
      get();
    if (audioElement) {
      const newMuted = !isMuted;
      audioElement.muted = newMuted;
      set({ isMuted: newMuted });

      // 첫 번째 음소거 버튼 클릭 시 재생 시작
      if (isFirstMuteClick && !newMuted) {
        console.log("🎵 첫 번째 음소거 해제 - 재생 시작!");

        try {
          // 오디오 엘리먼트가 준비되었는지 확인
          if (currentTrack && audioElement.src) {
            console.log("🔊 오디오 준비 완료, 재생 시도...");
            await audioElement.play();
            set({ isPlaying: true, isFirstMuteClick: false });
            console.log("✅ 첫 번째 재생 성공!");

            // Media Session 상태 업데이트
            if ("mediaSession" in navigator) {
              navigator.mediaSession.playbackState = "playing";
            }
          } else {
            console.log("⚠️ 오디오가 아직 준비되지 않음");
            // 트랙이 로드되지 않았다면 기본 트랙 재생 시도
            await play();
            set({ isFirstMuteClick: false });
          }
        } catch (error) {
          console.log("❌ 첫 번째 재생 실패:", error);
          // 실패해도 다음에는 일반 음소거만 하도록
          set({ isFirstMuteClick: false });
        }
      }
    }
  },

  // 새 트랙 재생
  playTrack: async (track, index = 0) => {
    const { audioElement, volume, isMuted, isPlaying, updateMediaSession } =
      get();

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

        // Media Session 업데이트
        updateMediaSession(track);

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

  // Media Session API - iOS 잠금화면 메타데이터 설정
  updateMediaSession: (track: AppleMusicTrack) => {
    if ("mediaSession" in navigator) {
      console.log("🎵 Media Session 업데이트:", track.attributes.name);

      // 앨범 이미지 URL 생성 (Apple Music API 이미지 최적화)
      const artwork = track.attributes.artwork?.url
        ? track.attributes.artwork.url
            .replace("{w}", "512")
            .replace("{h}", "512")
        : null;

      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.attributes.name,
        artist: track.attributes.artistName,
        album: track.attributes.albumName,
        artwork: artwork
          ? [
              {
                src: artwork,
                sizes: "512x512",
                type: "image/jpeg",
              },
            ]
          : undefined,
      });

      // 재생 컨트롤 핸들러 설정
      const { play, pause } = get();

      navigator.mediaSession.setActionHandler("play", () => {
        console.log("📱 Media Session: play 액션");
        play();
      });

      navigator.mediaSession.setActionHandler("pause", () => {
        console.log("📱 Media Session: pause 액션");
        pause();
      });

      // 이전/다음 트랙 핸들러는 향후 구현 가능
      navigator.mediaSession.setActionHandler("previoustrack", null);
      navigator.mediaSession.setActionHandler("nexttrack", null);
    }
  },
}));
