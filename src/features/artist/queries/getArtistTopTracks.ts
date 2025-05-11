import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyTrack } from "@/types/spotify";

/**
 * 아티스트의 인기 트랙을 가져오는 함수
 */
export async function getArtistTopTracks(id: string): Promise<SpotifyTrack[]> {
  try {
    const response = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
      `/artists/${id}/top-tracks?market=KR`
    );
    console.log(`아티스트 ${id}의 인기 트랙을 성공적으로 가져왔습니다.`);
    return response.tracks;
  } catch (error: any) {
    console.error(
      "인기 트랙을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
