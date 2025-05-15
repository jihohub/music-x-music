import { FEATURED_ARTIST_IDS } from "@/constants/spotify";
import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyArtist } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 특정 아티스트 정보를 가져오는 함수
 */
export async function getFeaturedArtists(): Promise<SpotifyArtist[]> {
  try {
    // 여러 아티스트를 한 번에 가져오는 API 호출
    const ids = FEATURED_ARTIST_IDS.join(",");
    const response = await spotifyFetch<{ artists: SpotifyArtist[] }>(
      `/artists?ids=${ids}`
    );

    console.log(
      `아티스트 ${FEATURED_ARTIST_IDS.length}명의 정보를 성공적으로 가져왔습니다.`
    );
    return response.artists;
  } catch (error: any) {
    console.error(
      "아티스트 정보를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 인기 아티스트 데이터를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useFeaturedArtists() {
  return useQuery<SpotifyArtist[], Error>({
    queryKey: ["featuredArtists"],
    queryFn: getFeaturedArtists,
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
