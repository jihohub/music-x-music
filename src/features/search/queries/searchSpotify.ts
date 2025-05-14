import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifySearchResult } from "@/types/spotify";

export type SearchType = "all" | "artist" | "track" | "album";

/**
 * 스포티파이 검색 API를 사용해 트랙, 아티스트, 앨범을 검색하는 함수
 * @param query 검색어
 * @param type 검색 타입 (all, artist, track, album)
 * @param offset 검색 결과 시작 위치
 * @param limit 검색 결과 개수
 * @returns 검색 결과
 */
export async function searchSpotify(
  query: string,
  type: SearchType = "all",
  offset: number = 0,
  limit: number = 20
): Promise<SpotifySearchResult> {
  try {
    // 검색 타입에 따라 요청 타입 조정
    let searchType = "track,artist,album";
    if (type === "artist") searchType = "artist";
    else if (type === "track") searchType = "track";
    else if (type === "album") searchType = "album";

    const response = await spotifyFetch<SpotifySearchResult>(
      `/search?q=${encodeURIComponent(
        query
      )}&type=${searchType}&offset=${offset}&limit=${limit}`
    );

    // 디버깅: API 응답에서 트랙 개수 로깅
    if (response.tracks && response.tracks.items) {
      console.log(
        `검색어 "${query}" 트랙 API 응답 개수:`,
        response.tracks.items.length
      );
      console.log(`검색어 "${query}" 트랙 총 개수:`, response.tracks.total);
    }

    return response;
  } catch (error: any) {
    console.error(
      "검색 중 오류가 발생했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
