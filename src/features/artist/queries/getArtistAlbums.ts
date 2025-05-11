import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyAlbum } from "@/types/spotify";

/**
 * 아티스트의 앨범을 가져오는 함수
 */
export async function getArtistAlbums(id: string): Promise<SpotifyAlbum[]> {
  try {
    const response = await spotifyFetch<{ items: SpotifyAlbum[] }>(
      `/artists/${id}/albums?limit=10&include_groups=album,single`
    );
    console.log(`아티스트 ${id}의 앨범을 성공적으로 가져왔습니다.`);
    return response.items;
  } catch (error: any) {
    console.error(
      "앨범을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
