import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 트랙 ID로 트랙 정보를 가져오는 함수
 */
export async function getTrackById(id: string): Promise<SpotifyTrack> {
  try {
    // 트랙 기본 정보 가져오기
    const track = await spotifyFetch<SpotifyTrack>(`/tracks/${id}`);
    console.log(`트랙 정보를 성공적으로 가져왔습니다: ${track.name}`);

    // 아티스트 ID 목록 추출
    const artistIds = track.artists.map((artist) => artist.id);

    if (artistIds.length > 0) {
      // 여러 아티스트 정보를 한 번에 가져오기
      const fullArtists = await spotifyFetch<{ artists: SpotifyArtist[] }>(
        `/artists?ids=${artistIds.join(",")}`
      );

      // 아티스트 정보 업데이트 (이미지 포함)
      if (fullArtists.artists && fullArtists.artists.length > 0) {
        track.artists = fullArtists.artists;
      }
    }

    return track;
  } catch (error: any) {
    console.error(
      `트랙 ID: ${id}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 트랙 정보를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useTrackById(id: string) {
  return useQuery<SpotifyTrack, Error>({
    queryKey: ["track", id],
    queryFn: () => getTrackById(id),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
    enabled: !!id,
  });
}
