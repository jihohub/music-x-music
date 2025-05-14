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

    // 트랙의 explicit 필드 확인
    if (response.items && response.items.length > 0) {
      console.log(`getAlbumTracks: 트랙 개수: ${response.items.length}`);
      console.log(`getAlbumTracks: 첫 번째 트랙 정보:`, response.items[0]);
      console.log(
        `getAlbumTracks: 첫 번째 트랙 explicit 값:`,
        response.items[0].explicit
      );

      // explicit 트랙 개수 확인
      const explicitTracks = response.items.filter((track) => track.explicit);
      console.log(`getAlbumTracks: Explicit 트랙 수: ${explicitTracks.length}`);
      if (explicitTracks.length > 0) {
        explicitTracks.forEach((track, index) => {
          console.log(`Explicit 트랙 ${index + 1}: ${track.name}`);
        });
      }
    }

    return response;
  } catch (error: any) {
    console.error(
      "앨범 트랙을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
