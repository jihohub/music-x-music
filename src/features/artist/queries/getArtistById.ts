import { AppleMusicArtist } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 아티스트 정보를 가져오는 함수 (ID 기반)
 * Apple Music의 실제 아티스트 ID를 사용합니다.
 */
export async function getArtistById(
  artistId: string
): Promise<AppleMusicArtist> {
  try {
    const response = await fetch(
      `/api/apple-music/catalog/us/artists/${artistId}`
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      throw new Error(`아티스트를 찾을 수 없습니다: ${artistId}`);
    }

    const appleMusicArtist = result.data[0];

    console.log(
      `아티스트 정보를 성공적으로 가져왔습니다: ${appleMusicArtist.attributes.name}`
    );
    return appleMusicArtist;
  } catch (error: any) {
    console.error(
      `아티스트 ID: ${artistId}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 아티스트 정보를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useArtistById(artistId: string) {
  return useQuery<AppleMusicArtist, Error>({
    queryKey: ["artist", artistId],
    queryFn: () => getArtistById(artistId),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    enabled: !!artistId,
  });
}
