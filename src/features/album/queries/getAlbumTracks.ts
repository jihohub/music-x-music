import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyTrack } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 앨범의 트랙 가져오기
 */
export async function getAlbumTracks(
  id: string,
  limit = 50
): Promise<{ items: SpotifyTrack[] }> {
  try {
    const response = await spotifyFetch<{ items: SpotifyTrack[] }>(
      `/albums/${id}/tracks?limit=${limit}`
    );
    console.log(`앨범 ${id}의 트랙을 성공적으로 가져왔습니다.`);

    // 트랙 정보 로깅
    if (response.items && response.items.length > 0) {
      console.log(`getAlbumTracks: 트랙 개수: ${response.items.length}`);
      console.log(`getAlbumTracks: 첫 번째 트랙 정보:`, response.items[0]);
    }

    return response;
  } catch (error: any) {
    console.error(
      "앨범 트랙을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 앨범의 트랙을 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useAlbumTracks(id: string, limit = 50) {
  return useQuery<{ items: SpotifyTrack[] }, Error>({
    queryKey: ["albumTracks", id, limit],
    queryFn: () => getAlbumTracks(id, limit),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
