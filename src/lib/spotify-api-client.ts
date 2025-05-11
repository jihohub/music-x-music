import { SPOTIFY_API_BASE } from "@/constants/spotify";
import { TokenManager } from "@/lib/spotify-token-refresh";
import axios from "axios";

// TokenManager 인스턴스 생성
const tokenManager = new TokenManager(
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ||
    process.env.SPOTIFY_CLIENT_ID ||
    "",
  process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET ||
    process.env.SPOTIFY_CLIENT_SECRET ||
    ""
);

/**
 * 스포티파이 API 요청 함수
 */
export async function spotifyFetch<T>(endpoint: string): Promise<T> {
  return await tokenManager.makeRequest(async (token) => {
    const url = `${SPOTIFY_API_BASE}${endpoint}`;
    console.log(`스포티파이 API 요청: ${url}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  });
}

// 상수 재익스포트
export {
  FEATURED_ARTIST_IDS,
  RECOMMENDED_TRACK_IDS,
} from "@/constants/spotify";
