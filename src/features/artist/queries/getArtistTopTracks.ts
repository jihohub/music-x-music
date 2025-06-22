import { AppleMusicTrack } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 아티스트의 인기 트랙을 가져오는 함수 (ID 기반)
 */
export async function getArtistTopTracks(
  artistId: string
): Promise<AppleMusicTrack[]> {
  try {
    const response = await fetch(
      `/api/apple-music/catalog/us/artists/${artistId}/view/top-songs?limit=10`
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data) {
      return [];
    }

    console.log(
      `아티스트 ${artistId}의 인기 트랙 ${result.data.length}개를 성공적으로 가져왔습니다.`
    );
    return result.data;
  } catch (error: any) {
    console.error(
      "인기 트랙을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 아티스트의 인기 트랙을 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useArtistTopTracks(artistId: string) {
  return useQuery<AppleMusicTrack[], Error>({
    queryKey: ["artistTopTracks", artistId],
    queryFn: () => getArtistTopTracks(artistId),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    enabled: !!artistId,
  });
}
