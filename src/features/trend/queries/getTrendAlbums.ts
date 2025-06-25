import { TREND_ALBUM_IDS } from "@/constants/apple-music";
import { saveAlbumColorsToStore } from "@/lib/apple-music-api-client";
import { AppleMusicAlbum } from "@/types/apple-music";
import { useQuery } from "@tanstack/react-query";

/**
 * 트렌드 페이지에 표시할 앨범 데이터를 가져오는 함수
 */
export async function getTrendAlbums(): Promise<AppleMusicAlbum[]> {
  try {
    // Apple Music ID들을 콤마로 연결
    const ids = TREND_ALBUM_IDS.join(",");

    const response = await fetch(
      `/api/apple-music/catalog/us/albums?ids=${ids}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trend albums");
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return [];
    }

    const albums = data.data;

    // 트렌드 앨범에서 색상 정보를 스토어에 저장
    if (typeof window !== "undefined" && albums.length > 0) {
      saveAlbumColorsToStore(albums);
    }

    // Apple Music 데이터를 직접 반환
    return albums;
  } catch (error) {
    console.error("Error fetching trend albums:", error);
    return [];
  }
}

/**
 * React Query를 사용하여 트렌드 앨범 데이터를 가져오는 훅
 * 캐싱 기능 제공으로 중복 요청 방지 및 성능 개선
 */
export function useTrendAlbums() {
  return useQuery({
    queryKey: ["trend-albums"],
    queryFn: getTrendAlbums,
    staleTime: 1000 * 60 * 30, // 30분
  });
}
