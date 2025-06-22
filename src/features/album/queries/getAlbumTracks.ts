import { AppleMusicTrack } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 앨범의 트랙 가져오기 (ID 기반)
 */
export async function getAlbumTracks(
  albumId: string
): Promise<AppleMusicTrack[]> {
  try {
    // URL 디코딩
    const decodedAlbumId = decodeURIComponent(albumId);

    // 앨범 ID로 트랙 검색
    const response = await fetch(
      `/api/apple-music/catalog/us/albums/${encodeURIComponent(
        decodedAlbumId
      )}/tracks`
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data) {
      return [];
    }

    console.log(
      `앨범 ${decodedAlbumId}의 트랙 ${result.data.length}개를 성공적으로 가져왔습니다.`
    );

    // 트랙 정보 로깅
    if (result.data.length > 0) {
      console.log(`getAlbumTracks: 트랙 개수: ${result.data.length}`);
      console.log(`getAlbumTracks: 첫 번째 트랙 정보:`, result.data[0]);
    }

    return result.data;
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
export function useAlbumTracks(albumId: string) {
  return useQuery<AppleMusicTrack[], Error>({
    queryKey: ["albumTracks", albumId],
    queryFn: () => getAlbumTracks(albumId),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    enabled: !!albumId,
  });
}
