import { AppleMusicSearchResult } from "@/types/apple-music";

/**
 * Apple Music에서 검색하는 함수
 */
export async function searchAppleMusic(
  query: string,
  types: string = "songs,albums,artists",
  limit: number = 12
): Promise<AppleMusicSearchResult> {
  try {
    if (!query.trim()) {
      return {
        artists: { data: [] },
        albums: { data: [] },
        songs: { data: [] },
      };
    }

    const url = `/api/apple-music/catalog/us/search?term=${encodeURIComponent(
      query
    )}&types=${types}&limit=${limit}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to search Apple Music: ${response.status}`);
    }

    const data = await response.json();

    // Apple Music 검색 결과를 그대로 반환
    return (
      data.results || {
        artists: { data: [] },
        albums: { data: [] },
        songs: { data: [] },
      }
    );
  } catch (error) {
    console.error("Apple Music 검색 오류:", error);
    return {
      artists: { data: [] },
      albums: { data: [] },
      songs: { data: [] },
    };
  }
}

/**
 * Apple Music에서 다음 페이지를 가져오는 함수 (무한스크롤용)
 */
export async function searchAppleMusicWithOffset(
  query: string,
  types: string = "songs,albums,artists",
  offset: number = 0,
  limit: number = 12
): Promise<AppleMusicSearchResult> {
  try {
    if (!query.trim()) {
      return {
        artists: { data: [] },
        albums: { data: [] },
        songs: { data: [] },
      };
    }

    const url = `/api/apple-music/catalog/us/search?term=${encodeURIComponent(
      query
    )}&types=${types}&limit=${limit}&offset=${offset}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to search Apple Music: ${response.status}`);
    }

    const data = await response.json();

    // Apple Music 검색 결과를 그대로 반환
    return (
      data.results || {
        artists: { data: [] },
        albums: { data: [] },
        songs: { data: [] },
      }
    );
  } catch (error) {
    console.error("Apple Music 검색 오류:", error);
    return {
      artists: { data: [] },
      albums: { data: [] },
      songs: { data: [] },
    };
  }
}
