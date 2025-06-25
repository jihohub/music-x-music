import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface ThemeState {
  // 색상 상태
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  secondaryTextColor: string;

  // 현재 아티스트/앨범/트랙 정보
  currentArtwork: {
    bgColor?: string;
    textColor1?: string;
    textColor2?: string;
    textColor3?: string;
    textColor4?: string;
  } | null;

  // 페이지별 테마 모드
  themeMode: "default" | "artist" | "album" | "track";

  // 액션
  setArtworkColors: (artwork: any) => void;
  setThemeMode: (mode: "default" | "artist" | "album" | "track") => void;
  resetTheme: () => void;

  // 계산된 색상 가져오기
  getDisplayColors: () => {
    backgroundColor: string;
    textColor: string;
    secondaryTextColor: string;
    accentColor: string;
  };
}

const DEFAULT_COLORS = {
  backgroundColor: "#000000",
  textColor: "#ffffff",
  secondaryTextColor: "#ffffff99",
  accentColor: "#ffffff",
};

export const useThemeStore = create<ThemeState>()(
  subscribeWithSelector((set, get) => ({
    // 초기 상태
    primaryColor: "#ffffff",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    secondaryTextColor: "#ffffff99",
    currentArtwork: null,
    themeMode: "default",

    // 아트워크 색상 설정
    setArtworkColors: (artwork: any) => {
      if (!artwork) {
        set({ currentArtwork: null });
        return;
      }

      const newArtwork = {
        bgColor: artwork.bgColor,
        textColor1: artwork.textColor1,
        textColor2: artwork.textColor2,
        textColor3: artwork.textColor3,
        textColor4: artwork.textColor4,
      };

      set({ currentArtwork: newArtwork });

      // 색상 자동 업데이트
      const colors = get().getDisplayColors();
      set({
        backgroundColor: colors.backgroundColor,
        textColor: colors.textColor,
        secondaryTextColor: colors.secondaryTextColor,
        primaryColor: colors.accentColor,
      });
    },

    // 테마 모드 설정
    setThemeMode: (mode) => {
      set({ themeMode: mode });

      // 색상 자동 업데이트
      const colors = get().getDisplayColors();
      set({
        backgroundColor: colors.backgroundColor,
        textColor: colors.textColor,
        secondaryTextColor: colors.secondaryTextColor,
        primaryColor: colors.accentColor,
      });
    },

    // 테마 리셋
    resetTheme: () => {
      set({
        currentArtwork: null,
        themeMode: "default",
        ...DEFAULT_COLORS,
        primaryColor: DEFAULT_COLORS.accentColor,
      });
    },

    // 계산된 색상 반환
    getDisplayColors: () => {
      const { currentArtwork, themeMode } = get();

      if (!currentArtwork || themeMode === "default") {
        return DEFAULT_COLORS;
      }

      const bgColor = currentArtwork.bgColor
        ? `#${currentArtwork.bgColor}`
        : DEFAULT_COLORS.backgroundColor;

      const textColor = currentArtwork.textColor1
        ? `#${currentArtwork.textColor1}`
        : DEFAULT_COLORS.textColor;

      const secondaryTextColor = currentArtwork.textColor2
        ? `#${currentArtwork.textColor2}`
        : textColor + "99"; // 60% 투명도

      const accentColor = currentArtwork.textColor1
        ? `#${currentArtwork.textColor1}`
        : DEFAULT_COLORS.accentColor;

      return {
        backgroundColor: bgColor,
        textColor,
        secondaryTextColor,
        accentColor,
      };
    },
  }))
);

// 편의 함수들
export const getThemeColors = () => {
  return useThemeStore.getState().getDisplayColors();
};

export const setArtistTheme = (artist: any) => {
  const { setArtworkColors, setThemeMode } = useThemeStore.getState();
  setThemeMode("artist");
  setArtworkColors(artist?.attributes?.artwork);
};

export const setAlbumTheme = (album: any) => {
  const { setArtworkColors, setThemeMode } = useThemeStore.getState();
  setThemeMode("album");
  setArtworkColors(album?.attributes?.artwork);
};

export const setTrackTheme = (track: any) => {
  const { setArtworkColors, setThemeMode } = useThemeStore.getState();
  setThemeMode("track");
  setArtworkColors(track?.attributes?.artwork);
};

export const resetToDefaultTheme = () => {
  useThemeStore.getState().resetTheme();
};
