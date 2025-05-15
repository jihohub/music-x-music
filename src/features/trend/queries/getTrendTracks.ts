import { TREND_TRACK_IDS } from "@/constants/spotify";
import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyTrack } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 트렌드 페이지에 표시할 트랙 데이터를 가져오는 함수
 */
export async function getTrendTracks(): Promise<SpotifyTrack[]> {
  try {
    // 트랙 ID 목록을 쉼표로 구분된 문자열로 변환
    const trackIds = TREND_TRACK_IDS.join(",");
    const response = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
      `/tracks?ids=${trackIds}`
    );
    console.log(
      `트렌드 트랙 ${TREND_TRACK_IDS.length}개의 정보를 성공적으로 가져왔습니다.`
    );
    return response.tracks;
  } catch (error: any) {
    console.error(
      "트렌드 트랙 정보를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 트렌드 트랙 데이터를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useTrendTracks() {
  return useQuery<SpotifyTrack[], Error>({
    queryKey: ["trendTracks"],
    queryFn: getTrendTracks,
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
