import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyArtist } from "@/types/spotify";

/**
 * 관련 아티스트 가져오기
 */
export async function getRelatedArtists(id: string): Promise<SpotifyArtist[]> {
  try {
    const response = await spotifyFetch<{ artists: SpotifyArtist[] }>(
      `/artists/${id}/related-artists`
    );
    console.log(`아티스트 ${id}의 관련 아티스트를 성공적으로 가져왔습니다.`);
    return response.artists;
  } catch (error: any) {
    console.error(
      "관련 아티스트를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
