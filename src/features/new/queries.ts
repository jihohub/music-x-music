import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyAlbum } from "@/types/spotify";

/**
 * 새로 출시된 앨범 데이터를 가져오는 함수
 * @param limit 가져올 앨범 수 (기본값: 20)
 * @param offset 시작 오프셋 (기본값: 0)
 * @returns 신규 앨범 목록
 */
export async function getNewReleases(
  limit: number = 20,
  offset: number = 0
): Promise<SpotifyAlbum[]> {
  try {
    const response = await spotifyFetch<{
      albums: {
        items: SpotifyAlbum[];
        total: number;
        limit: number;
        offset: number;
      };
    }>(`/browse/new-releases?limit=${limit}&offset=${offset}&country=KR`);

    return response.albums.items;
  } catch (error: any) {
    console.error(
      "새 앨범 정보를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
