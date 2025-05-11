import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyAlbum } from "@/types/spotify";

/**
 * 앨범 정보를 가져오는 함수
 */
export async function getAlbumById(id: string): Promise<SpotifyAlbum> {
  try {
    const album = await spotifyFetch<SpotifyAlbum>(`/albums/${id}`);
    console.log(`앨범 정보를 성공적으로 가져왔습니다: ${album.name}`);
    return album;
  } catch (error: any) {
    console.error(
      `앨범 ID: ${id}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}
