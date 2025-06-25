import {
  saveAlbumColorsToStore,
  saveArtistColorsToStore,
  saveTrackColorsToStore,
} from "@/lib/apple-music-api-client";
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

    const result = data.results || {
      artists: { data: [] },
      albums: { data: [] },
      songs: { data: [] },
    };

    // 검색 결과에서 색상 정보를 스토어에 저장
    if (typeof window !== "undefined") {
      // 클라이언트 사이드에서만 실행
      if (result.songs?.data?.length > 0) {
        saveTrackColorsToStore(result.songs.data);
      } else if (result.artists?.data?.length > 0) {
        saveArtistColorsToStore(result.artists.data);
      } else if (result.albums?.data?.length > 0) {
        saveAlbumColorsToStore(result.albums.data);
      }
    }

    return result;
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

    const result = data.results || {
      artists: { data: [] },
      albums: { data: [] },
      songs: { data: [] },
    };

    // 검색 결과에서 색상 정보를 스토어에 저장 (오프셋 결과는 저장하지 않음 - 스크롤 시마다 색상이 바뀌는 것을 방지)

    return result;
  } catch (error) {
    console.error("Apple Music 검색 오류:", error);
    return {
      artists: { data: [] },
      albums: { data: [] },
      songs: { data: [] },
    };
  }
}
