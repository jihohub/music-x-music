import { AppleMusicAlbum } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 앨범 정보를 가져오는 함수 (ID 기반)
 * Apple Music의 실제 앨범 ID를 사용합니다.
 */
export async function getAlbumById(albumId: string): Promise<AppleMusicAlbum> {
  try {
    const response = await fetch(
      `/api/apple-music/catalog/us/albums/${albumId}`
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      throw new Error(`앨범을 찾을 수 없습니다: ${albumId}`);
    }

    const appleMusicAlbum = result.data[0];

    console.log(
      `앨범 정보를 성공적으로 가져왔습니다: ${appleMusicAlbum.attributes.name}`
    );

    // 트랙 정보가 있다면 로깅
    if (
      appleMusicAlbum.relationships?.tracks?.data &&
      appleMusicAlbum.relationships.tracks.data.length > 0
    ) {
      console.log(
        `앨범 트랙 개수: ${appleMusicAlbum.relationships.tracks.data.length}`
      );
      const firstTrack = appleMusicAlbum.relationships.tracks.data[0];
      console.log(`첫 번째 트랙 정보:`, firstTrack);
    }

    return appleMusicAlbum;
  } catch (error: any) {
    console.error(
      `앨범 ID: ${albumId}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 앨범 정보를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useAlbumById(albumId: string) {
  return useQuery<AppleMusicAlbum, Error>({
    queryKey: ["album", albumId],
    queryFn: () => getAlbumById(albumId),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    enabled: !!albumId,
  });
}
