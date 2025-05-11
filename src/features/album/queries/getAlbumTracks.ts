import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyTrack } from "@/types/spotify";

/**
 * 앨범의 트랙 가져오기
 */
export async function getAlbumTracks(
  id: string,
  limit = 50
): Promise<{ items: SpotifyTrack[] }> {
  try {
    const response = await spotifyFetch<{ items: SpotifyTrack[] }>(
      `/albums/${id}/tracks?limit=${limit}`
    );
    console.log(`앨범 ${id}의 트랙을 성공적으로 가져왔습니다.`);
    return response;
  } catch (error: any) {
    console.error(
      "앨범 트랙을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
