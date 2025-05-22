import { TREND_ALBUM_IDS } from "@/constants/spotify";
import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyAlbum } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 트렌드 페이지에 표시할 앨범 데이터를 가져오는 함수
 */
export async function getTrendAlbums(): Promise<SpotifyAlbum[]> {
  try {
    // 앨범 ID 목록을 쉼표로 구분된 문자열로 변환
    const albumIds = TREND_ALBUM_IDS.join(",");
    const response = await spotifyFetch<{ albums: SpotifyAlbum[] }>(
      `/albums?ids=${albumIds}`
    );
    console.log(
      `트렌드 앨범 ${TREND_ALBUM_IDS.length}개의 정보를 성공적으로 가져왔습니다.`
    );
    return response.albums;
  } catch (error: any) {
    console.error(
      "트렌드 앨범 정보를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 트렌드 앨범 데이터를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useTrendAlbums() {
  return useQuery<SpotifyAlbum[], Error>({
    queryKey: ["trendAlbums"],
    queryFn: getTrendAlbums,
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
