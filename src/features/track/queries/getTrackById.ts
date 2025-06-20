import { AppleMusicTrack } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 트랙 정보를 가져오는 함수 (ID 기반)
 * Apple Music의 실제 트랙 ID를 사용합니다.
 */
export async function getTrackById(trackId: string): Promise<AppleMusicTrack> {
  try {
    const response = await fetch(
      `/api/apple-music/catalog/us/songs/${trackId}`
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const result = await response.json();

    if (!result.data || result.data.length === 0) {
      throw new Error(`트랙을 찾을 수 없습니다: ${trackId}`);
    }

    const appleMusicTrack = result.data[0];

    console.log(
      `트랙 정보를 성공적으로 가져왔습니다: ${appleMusicTrack.attributes.name}`
    );

    return appleMusicTrack;
  } catch (error: any) {
    console.error(
      `트랙 ID: ${trackId}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 트랙 정보를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useTrackById(trackId: string) {
  return useQuery<AppleMusicTrack, Error>({
    queryKey: ["track", trackId],
    queryFn: () => getTrackById(trackId),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    enabled: !!trackId,
  });
}
