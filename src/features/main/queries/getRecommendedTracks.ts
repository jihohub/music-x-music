import { RECOMMENDED_TRACK_IDS } from "@/constants/apple-music";
import { AppleMusicTrack } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 추천 트랙 정보를 가져오는 함수 (Apple Music ID 사용)
 */
export async function getRecommendedTracks(): Promise<AppleMusicTrack[]> {
  try {
    // Apple Music ID들을 콤마로 연결
    const ids = RECOMMENDED_TRACK_IDS.join(",");
    const url = `/api/apple-music/catalog/us/songs?ids=${ids}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch recommended tracks");
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [];
    }

    // Apple Music 데이터를 그대로 반환
    return data.data;
  } catch (error) {
    console.error("추천 트랙 가져오기 오류:", error);
    return [];
  }
}

/**
 * 추천 트랙을 가져오는 React Query hook
 */
export function useRecommendedTracks() {
  return useQuery({
    queryKey: ["recommended-tracks"],
    queryFn: getRecommendedTracks,
    staleTime: 1000 * 60 * 30, // 30분
  });
}
