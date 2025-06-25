import { FEATURED_ARTIST_IDS } from "@/constants/apple-music";
import { saveArtistColorsToStore } from "@/lib/apple-music-api-client";
import { AppleMusicArtist } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 특정 아티스트 정보를 가져오는 함수 (Apple Music API 사용)
 */
export async function getFeaturedArtists(): Promise<AppleMusicArtist[]> {
  try {
    // Apple Music ID들을 콤마로 연결
    const ids = FEATURED_ARTIST_IDS.join(",");

    const response = await fetch(
      `/api/apple-music/catalog/us/artists?ids=${ids}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch featured artists");
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [];
    }

    const artists = data.data;

    // 인기 아티스트에서 색상 정보를 스토어에 저장
    if (typeof window !== "undefined" && artists.length > 0) {
      saveArtistColorsToStore(artists);
    }

    // Apple Music 데이터를 그대로 반환
    return artists;
  } catch (error) {
    console.error("Error fetching featured artists:", error);
    return [];
  }
}

/**
 * 추천 아티스트를 가져오는 React Query hook
 */
export function useFeaturedArtists() {
  return useQuery({
    queryKey: ["featured-artists"],
    queryFn: getFeaturedArtists,
    staleTime: 1000 * 60 * 30, // 30분
  });
}
