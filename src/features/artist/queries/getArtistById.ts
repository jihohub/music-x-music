import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyArtist } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 아티스트 ID로 아티스트 정보를 가져오는 함수
 */
export async function getArtistById(id: string): Promise<SpotifyArtist> {
  try {
    const artist = await spotifyFetch<SpotifyArtist>(`/artists/${id}`);
    console.log(`아티스트 정보를 성공적으로 가져왔습니다: ${artist.name}`);
    return artist;
  } catch (error: any) {
    console.error(
      `아티스트 ID: ${id}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 아티스트 정보를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useArtistById(id: string) {
  return useQuery<SpotifyArtist, Error>({
    queryKey: ["artist", id],
    queryFn: () => getArtistById(id),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
