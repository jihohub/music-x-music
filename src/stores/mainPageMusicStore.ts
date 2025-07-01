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
  setTrackMetadata: (track: AppleMusicTrack, index?: number) => void;
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

    // 🔧 실제 오디오 상태로 판단 (store 상태 무시)
    const actualIsPlaying = audioElement ? !audioElement.paused : false;

    console.log("🎬 play() 함수 호출됨!", {
      storeIsPlaying: isPlaying,
      actualIsPlaying: actualIsPlaying,
      audioPaused: audioElement?.paused,
      audioSrc: audioElement?.src?.substring(0, 50) + "..." || "없음",
    });

    if (audioElement && !actualIsPlaying) {
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
    } else {
      console.log("⚠️ play() 호출 무시됨:", {
        hasAudioElement: !!audioElement,
        actualIsPlaying: actualIsPlaying,
        reason: !audioElement ? "오디오 엘리먼트 없음" : "이미 재생 중",
      });
    }
  },

  pause: () => {
    const { audioElement } = get();
    console.log("⏸️ 일시정지 시도 중...", { audioElement: !!audioElement });

    if (audioElement) {
      // 오디오 상태와 관계없이 무조건 일시정지
      if (!audioElement.paused) {
        console.log("🛑 오디오가 재생 중 - 강제 일시정지");
        audioElement.pause();
      } else {
        console.log("ℹ️ 오디오가 이미 일시정지 상태");
      }

      // 상태 업데이트
      set({ isPlaying: false });

      // Media Session 재생 상태 업데이트
      if ("mediaSession" in navigator) {
        navigator.mediaSession.playbackState = "paused";
        console.log("📱 Media Session 일시정지 상태로 변경");
      }

      console.log("✅ 일시정지 완료");
    } else {
      console.log("⚠️ 오디오 엘리먼트가 없음");
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
    console.log("🎬 playTrack 호출됨!", {
      trackName: track.attributes.name,
      index,
      currentState: {
        isPlaying: get().isPlaying,
        currentTrackIndex: get().currentTrackIndex,
        currentTrackName: get().currentTrack?.attributes.name || "없음",
      },
    });

    const { audioElement, volume, isMuted, updateMediaSession } = get();

    if (audioElement) {
      // 🔧 강제로 이전 트랙 완전히 정지 (store 상태와 관계없이)
      console.log("🛑 이전 트랙 완전 정지 중...", {
        actualIsPlaying: !audioElement.paused,
        currentSrc: audioElement.src ? "있음" : "없음",
      });

      // 1. 일시정지
      if (!audioElement.paused) {
        audioElement.pause();
        console.log("⏸️ 오디오 일시정지 완료");
      }

      // 2. 현재 시간 초기화
      audioElement.currentTime = 0;

      // 3. src 초기화로 완전히 해제
      audioElement.src = "";
      audioElement.load(); // 브라우저에게 오디오 리소스 해제 지시

      // 4. store 상태 초기화
      set({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
      });

      console.log("✅ 이전 트랙 완전 정지 완료");

      // 미리보기 URL이 있는 경우에만 재생
      if (track.attributes.previews && track.attributes.previews.length > 0) {
        const previewUrl = track.attributes.previews[0].url;

        console.log("📀 새 트랙 로딩:", track.attributes.name);

        // 오디오 설정
        audioElement.src = previewUrl;
        audioElement.volume = volume;
        audioElement.muted = isMuted;

        // 상태 업데이트
        set({
          currentTrack: track,
          currentTrackIndex: index,
          currentTime: 0,
          duration: 0,
          isPlaying: false, // 일단 false로 설정
        });

        // Media Session 즉시 업데이트 (메타데이터 설정)
        console.log("📱 Media Session 메타데이터 설정 중...");
        updateMediaSession(track);

        // 🔧 즉시 재생 시도 (setTimeout 제거하여 더 안전하게)
        try {
          console.log(
            "🔄 새 트랙 로딩 완료, 즉시 재생 시도:",
            track.attributes.name
          );

          // canplaythrough 이벤트를 기다리거나 즉시 재생 시도
          const playPromise = audioElement.play();

          if (playPromise !== undefined) {
            await playPromise;
            set({ isPlaying: true });

            // Media Session 재생 상태 업데이트
            if ("mediaSession" in navigator) {
              navigator.mediaSession.playbackState = "playing";
              console.log("📱 Media Session -> playing 상태로 변경");
            }

            console.log("✅ 새 트랙 재생 성공!");
          }
        } catch (error) {
          console.log(
            "❌ 새 트랙 재생 실패:",
            error instanceof Error ? error.message : String(error)
          );
          set({ isPlaying: false });

          // Media Session 일시정지 상태로 설정
          if ("mediaSession" in navigator) {
            navigator.mediaSession.playbackState = "paused";
            console.log("📱 재생 실패로 Media Session -> paused 상태로 변경");
          }
        }
      } else {
        console.log("⚠️ 미리보기 URL이 없는 트랙:", track.attributes.name);
        set({
          currentTrack: track,
          currentTrackIndex: index,
          isPlaying: false,
        });

        // 미리보기가 없어도 메타데이터는 설정
        updateMediaSession(track);
      }
    }
  },

  // 정리
  cleanup: () => {
    console.log("🧹 cleanup 호출됨 - 모든 오디오 정리");
    const { audioElement } = get();
    if (audioElement) {
      // 🔧 강제로 모든 오디오 정지
      console.log("🛑 오디오 완전 정리 중...");

      // 1. 일시정지
      if (!audioElement.paused) {
        audioElement.pause();
        console.log("⏸️ 오디오 일시정지");
      }

      // 2. 시간 초기화
      audioElement.currentTime = 0;

      // 3. src 완전 제거
      audioElement.src = "";
      audioElement.load(); // 리소스 해제

      // 4. 이벤트 리스너 제거 (메모리 누수 방지)
      audioElement.removeAttribute("src");

      console.log("✅ 오디오 완전 정리 완료");
    }

    // 5. store 상태 완전 초기화
    set({
      currentTrack: null,
      currentTrackIndex: 0,
      isPlaying: false,
      isMuted: true, // 기본 음소거 상태로 복원
      currentTime: 0,
      duration: 0,
      isFirstMuteClick: true, // 첫 상호작용도 초기화
    });

    // 6. Media Session 정리
    if ("mediaSession" in navigator) {
      navigator.mediaSession.playbackState = "none";
      navigator.mediaSession.metadata = null;
      console.log("📱 Media Session 정리 완료");
    }

    console.log("🧹 cleanup 완료!");
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

      try {
        // 강제 Media Session 활성화를 위한 더 적극적인 초기화
        console.log("📱 Media Session 강제 활성화 시작...");

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
                // 추가 해상도 제공
                {
                  src: artwork.replace("512x512", "256x256"),
                  sizes: "256x256",
                  type: "image/jpeg",
                },
                {
                  src: artwork.replace("512x512", "128x128"),
                  sizes: "128x128",
                  type: "image/jpeg",
                },
              ]
            : undefined,
        });

        console.log("✅ Media Session 메타데이터 설정 완료:", {
          title: track.attributes.name,
          artist: track.attributes.artistName,
          hasArtwork: !!artwork,
          artworkUrl: artwork ? artwork.substring(0, 100) + "..." : null,
        });

        // 재생 컨트롤 핸들러 설정
        const { play, pause, audioElement } = get();

        // 모든 액션 핸들러를 명시적으로 설정
        navigator.mediaSession.setActionHandler("play", async () => {
          console.log(
            "📱 Media Session: play 액션 호출됨 (잠금화면/알림센터에서 호출될 수 있음)"
          );
          console.log(
            "📱 Media Session play 호출 스택:",
            new Error().stack?.split("\n").slice(0, 3).join("\n") ||
              "스택 추적 불가"
          );
          try {
            await play();
            console.log("✅ Media Session play 성공");
          } catch (error) {
            console.log("❌ Media Session play 실패:", error);
          }
        });

        navigator.mediaSession.setActionHandler("pause", () => {
          console.log(
            "📱 Media Session: pause 액션 호출됨 (잠금화면/알림센터에서 호출될 수 있음)"
          );
          console.log(
            "📱 Media Session pause 호출 스택:",
            new Error().stack?.split("\n").slice(0, 3).join("\n") ||
              "스택 추적 불가"
          );
          try {
            pause();
            console.log("✅ Media Session pause 성공");
          } catch (error) {
            console.log("❌ Media Session pause 실패:", error);
          }
        });

        // 기본 재생 상태 설정
        const currentState =
          audioElement && !audioElement.paused ? "playing" : "paused";
        navigator.mediaSession.playbackState = currentState;
        console.log("📱 Media Session 초기 상태:", currentState);

        // 추가 액션 핸들러들 (명시적으로 null 설정하여 불필요한 버튼 제거)
        navigator.mediaSession.setActionHandler("seekbackward", null);
        navigator.mediaSession.setActionHandler("seekforward", null);
        navigator.mediaSession.setActionHandler("previoustrack", null);
        navigator.mediaSession.setActionHandler("nexttrack", null);
        navigator.mediaSession.setActionHandler("skipad", null);
        navigator.mediaSession.setActionHandler("seekto", null);

        // 강제로 Media Session 활성화를 위한 추가 시도
        setTimeout(() => {
          if (navigator.mediaSession.metadata) {
            console.log("📱 Media Session 강제 재초기화 시도");
            navigator.mediaSession.playbackState =
              navigator.mediaSession.playbackState;
          }
        }, 500);

        console.log("🎯 Media Session 완전 초기화 완료!");
      } catch (error) {
        console.log("❌ Media Session 초기화 실패:", error);
      }
    } else {
      console.log("⚠️ Media Session API가 지원되지 않음");
    }
  },

  // 재생하지 않고 트랙 메타데이터만 설정
  setTrackMetadata: (track: AppleMusicTrack, index = 0) => {
    console.log("📋 트랙 메타데이터만 설정:", track.attributes.name);

    const { audioElement, volume, isMuted, updateMediaSession } = get();

    if (audioElement) {
      // 미리보기 URL이 있으면 오디오 소스 설정 (재생하지 않음)
      if (track.attributes.previews && track.attributes.previews.length > 0) {
        const previewUrl = track.attributes.previews[0].url;

        console.log(
          "🔗 오디오 소스 설정:",
          previewUrl.substring(0, 50) + "..."
        );
        audioElement.src = previewUrl;
        audioElement.volume = volume;
        audioElement.muted = isMuted;
      }

      // 상태 업데이트 (재생 상태는 변경하지 않음)
      set({
        currentTrack: track,
        currentTrackIndex: index,
        currentTime: 0,
        duration: 0,
        // isPlaying은 현재 상태 유지
      });

      // Media Session 메타데이터 설정
      updateMediaSession(track);

      console.log("✅ 메타데이터 설정 완료 (재생하지 않음)");
    } else {
      console.log("⚠️ 오디오 엘리먼트가 없어서 메타데이터만 설정");
      set({
        currentTrack: track,
        currentTrackIndex: index,
        currentTime: 0,
        duration: 0,
      });
    }
  },
}));
