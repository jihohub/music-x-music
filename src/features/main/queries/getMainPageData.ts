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
  console.log("🔄 메인페이지 데이터 로딩 시작...");

  try {
    // 브라우저에서 절대 URL 사용
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

    console.log("📡 API 호출 중...", { baseUrl });

    // 병렬로 API 호출
    const [tracksResponse, artistsResponse] = await Promise.all([
      fetch(
        `${baseUrl}/api/apple-music/catalog/us/songs?ids=${RECOMMENDED_TRACK_IDS.join(
          ","
        )}`
      ),
      fetch(
        `${baseUrl}/api/apple-music/catalog/us/artists?ids=${FEATURED_ARTIST_IDS.join(
          ","
        )}`
      ),
    ]);

    console.log("📨 API 응답 받음", {
      tracksOk: tracksResponse.ok,
      artistsOk: artistsResponse.ok,
    });

    // 응답 상태 확인
    if (!tracksResponse.ok || !artistsResponse.ok) {
      console.error("❌ API 응답 에러:", {
        tracksStatus: tracksResponse.status,
        artistsStatus: artistsResponse.status,
      });
      throw new Error("Failed to fetch main page data");
    }

    // JSON 데이터 병렬 파싱
    const [tracksData, artistsData] = await Promise.all([
      tracksResponse.json(),
      artistsResponse.json(),
    ]);

    const tracks = tracksData.data || [];
    const artists = artistsData.data || [];

    console.log("✅ 메인페이지 데이터 로딩 완료", {
      tracksCount: tracks.length,
      artistsCount: artists.length,
    });

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
    console.error("❌ 메인페이지 데이터 로딩 실패:", error);
    throw error; // 에러를 다시 throw하여 React Query에서 error 상태로 처리
  }
}
