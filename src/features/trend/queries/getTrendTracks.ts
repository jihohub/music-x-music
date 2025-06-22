import { TREND_TRACK_IDS } from "@/constants/apple-music";
import { AppleMusicTrack } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 트렌드 페이지에 표시할 트랙 데이터를 가져오는 함수
 */
export async function getTrendTracks(): Promise<AppleMusicTrack[]> {
  try {
    // Apple Music ID들을 콤마로 연결
    const ids = TREND_TRACK_IDS.join(",");

    const response = await fetch(
      `/api/apple-music/catalog/us/songs?ids=${ids}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trend tracks");
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [];
    }

    // Apple Music 데이터를 직접 반환
    return data.data;
  } catch (error) {
    console.error("Error fetching trend tracks:", error);
    return [];
  }
}

/**
 * React Query를 사용하여 트렌드 트랙 데이터를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useTrendTracks() {
  return useQuery({
    queryKey: ["trend-tracks"],
    queryFn: getTrendTracks,
    staleTime: 1000 * 60 * 30, // 30분
  });
}
