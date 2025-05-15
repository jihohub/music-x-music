import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyAlbum } from "@/types/spotify";

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
