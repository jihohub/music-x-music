import { spotifyFetch } from "@/lib/spotify-api-client";
import { useQuery } from "@tanstack/react-query";

/**
 * 트랙 특성 정보 가져오기
 */
export async function getTrackFeatures(id: string): Promise<any> {
  try {
    const features = await spotifyFetch<any>(`/audio-features/${id}`);
    console.log(`트랙 ${id}의 특성 정보를 성공적으로 가져왔습니다.`);
    return features;
  } catch (error: any) {
    console.error(
      "트랙 특성 정보를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 트랙 특성 정보를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useTrackFeatures(id: string) {
  return useQuery<any, Error>({
    queryKey: ["trackFeatures", id],
    queryFn: () => getTrackFeatures(id),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    enabled: !!id,
  });
}
