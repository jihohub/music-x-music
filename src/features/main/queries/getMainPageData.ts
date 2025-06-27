import {
  FEATURED_ARTIST_IDS,
  RECOMMENDED_TRACK_IDS,
} from "@/constants/apple-music";
import {
  saveArtistColorsToStore,
  saveTrackColorsToStore,
} from "@/lib/apple-music-api-client";
import { AppleMusicArtist, AppleMusicTrack } from "@/types/apple-music";

interface MainPageData {
  tracks: AppleMusicTrack[];
  artists: AppleMusicArtist[];
}

/**
 * 메인페이지 데이터를 병렬로 가져오는 통합 함수
 * 추천 트랙과 추천 아티스트를 동시에 로딩하여 성능 개선
 */
export async function getMainPageData(): Promise<MainPageData> {
  try {
    // 병렬로 API 호출
    const [tracksResponse, artistsResponse] = await Promise.all([
      fetch(
        `/api/apple-music/catalog/us/songs?ids=${RECOMMENDED_TRACK_IDS.join(
          ","
        )}`
      ),
      fetch(
        `/api/apple-music/catalog/us/artists?ids=${FEATURED_ARTIST_IDS.join(
          ","
        )}`
      ),
    ]);

    // 응답 상태 확인
    if (!tracksResponse.ok || !artistsResponse.ok) {
      throw new Error("Failed to fetch main page data");
    }

    // JSON 데이터 병렬 파싱
    const [tracksData, artistsData] = await Promise.all([
      tracksResponse.json(),
      artistsResponse.json(),
    ]);

    const tracks = tracksData.data || [];
    const artists = artistsData.data || [];

    // 색상 정보를 스토어에 저장 (클라이언트 사이드에서만)
    if (typeof window !== "undefined") {
      if (tracks.length > 0) {
        saveTrackColorsToStore(tracks);
      }
      if (artists.length > 0) {
        saveArtistColorsToStore(artists);
      }
    }

    return { tracks, artists };
  } catch (error) {
    console.error("Error fetching main page data:", error);
    return { tracks: [], artists: [] };
  }
}
