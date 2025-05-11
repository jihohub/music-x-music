import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyArtist } from "@/types/spotify";

/**
 * 아티스트 ID로 아티스트 정보를 가져오는 함수
 */
export async function getArtistById(id: string): Promise<SpotifyArtist> {
  try {
    const artist = await spotifyFetch<SpotifyArtist>(`/artists/${id}`);
    console.log(`아티스트 정보를 성공적으로 가져왔습니다: ${artist.name}`);
    return artist;
  } catch (error: any) {
    console.error(
      `아티스트 ID: ${id}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}
