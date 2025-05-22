import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyAlbum } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 아티스트의 앨범을 가져오는 함수
 */
export async function getArtistAlbums(id: string): Promise<SpotifyAlbum[]> {
  try {
    const response = await spotifyFetch<{ items: SpotifyAlbum[] }>(
      `/artists/${id}/albums?limit=10&include_groups=album,single`
    );
    console.log(`아티스트 ${id}의 앨범을 성공적으로 가져왔습니다.`);
    return response.items;
  } catch (error: any) {
    console.error(
      "앨범을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 아티스트의 앨범을 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useArtistAlbums(id: string) {
  return useQuery<SpotifyAlbum[], Error>({
    queryKey: ["artistAlbums", id],
    queryFn: () => getArtistAlbums(id),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
