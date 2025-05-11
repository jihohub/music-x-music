import { SpotifySearchResult } from "@/types/spotify";
import { spotifyFetch } from "@/lib/spotify-api-client";

/**
 * 스포티파이 검색 API를 사용해 트랙, 아티스트, 앨범을 검색하는 함수
 */
export async function searchSpotify(
  query: string
): Promise<SpotifySearchResult> {
  try {
    const response = await spotifyFetch<SpotifySearchResult>(
      `/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=5`
    );
    console.log(`검색 결과를 성공적으로 가져왔습니다: ${query}`);
    return response;
  } catch (error: any) {
    console.error(
      "검색 중 오류가 발생했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
