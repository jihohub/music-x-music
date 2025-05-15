import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyTrack } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 아티스트의 인기 트랙을 가져오는 함수
 */
export async function getArtistTopTracks(id: string): Promise<SpotifyTrack[]> {
  try {
    const response = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
      `/artists/${id}/top-tracks?market=KR`
    );
    console.log(`아티스트 ${id}의 인기 트랙을 성공적으로 가져왔습니다.`);
    return response.tracks;
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
export function useArtistTopTracks(id: string) {
  return useQuery<SpotifyTrack[], Error>({
    queryKey: ["artistTopTracks", id],
    queryFn: () => getArtistTopTracks(id),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
