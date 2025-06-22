import { TREND_ARTIST_IDS } from "@/constants/apple-music";
import { AppleMusicArtist } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 트렌드 페이지에 표시할 아티스트 데이터를 가져오는 함수
 */
export async function getTrendArtists(): Promise<AppleMusicArtist[]> {
  try {
    // Apple Music ID들을 콤마로 연결
    const ids = TREND_ARTIST_IDS.join(",");

    const response = await fetch(
      `/api/apple-music/catalog/us/artists?ids=${ids}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trend artists");
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [];
    }

    // Apple Music 데이터를 직접 반환
    return data.data;
  } catch (error) {
    console.error("Error fetching trend artists:", error);
    return [];
  }
}

/**
 * React Query를 사용하여 트렌드 아티스트 데이터를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useTrendArtists() {
  return useQuery({
    queryKey: ["trend-artists"],
    queryFn: getTrendArtists,
    staleTime: 1000 * 60 * 30, // 30분
  });
}
