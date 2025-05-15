import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyAlbum } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 앨범 정보를 가져오는 함수
 */
export async function getAlbumById(id: string): Promise<SpotifyAlbum> {
  try {
    const album = await spotifyFetch<SpotifyAlbum>(`/albums/${id}`);
    console.log(`앨범 정보를 성공적으로 가져왔습니다: ${album.name}`);

    // 트랙 정보 로깅
    if (album.tracks && album.tracks.items && album.tracks.items.length > 0) {
      console.log(`앨범 트랙 개수: ${album.tracks.items.length}`);
      const firstTrack = album.tracks.items[0];
      console.log(`첫 번째 트랙 정보:`, firstTrack);
    }

    return album;
  } catch (error: any) {
    console.error(
      `앨범 ID: ${id}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * React Query를 사용하여 앨범 정보를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useAlbumById(id: string) {
  return useQuery<SpotifyAlbum, Error>({
    queryKey: ["album", id],
    queryFn: () => getAlbumById(id),
    staleTime: 30 * 60 * 1000, // 30분 동안 캐시 유지
    gcTime: 60 * 60 * 1000, // 1시간 동안 캐시 데이터 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
