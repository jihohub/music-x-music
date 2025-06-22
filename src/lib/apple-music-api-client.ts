import {
  APPLE_MUSIC_API_BASE,
  DEFAULT_STOREFRONT,
} from "@/constants/apple-music";
import axios from "axios";
import jwt from "jsonwebtoken";

/**
 * Apple Music 개발자 토큰 생성
 */
function generateDeveloperToken(): string {
  const privateKey =
    process.env.APPLE_MUSIC_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";
  const keyId = process.env.APPLE_MUSIC_KEY_ID || "";
  const teamId = process.env.APPLE_MUSIC_TEAM_ID || "";

  if (!privateKey || !keyId || !teamId) {
    throw new Error("Apple Music API 자격 증명이 설정되지 않았습니다.");
  }

  return jwt.sign({}, privateKey, {
    issuer: teamId,
    expiresIn: "180d",
    algorithm: "ES256",
    header: {
      alg: "ES256",
      kid: keyId,
    },
  });
}

/**
 * Apple Music API 요청 함수
 */
export async function appleMusicFetch<T>(
  endpoint: string,
  params?: Record<string, string | number>
): Promise<T> {
  try {
    const token = generateDeveloperToken();
    const url = `${APPLE_MUSIC_API_BASE}${endpoint}`;

    console.log(`Apple Music API 요청: ${url}`);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      params: {
        storefront: DEFAULT_STOREFRONT,
        ...params,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Apple Music API 요청 실패:", error);
    throw error;
  }
}

/**
 * Apple Music 검색 API
 */
export async function searchAppleMusic<T>(
  query: string,
  types: string[] = ["songs", "artists", "albums"],
  limit: number = 25
): Promise<T> {
  return appleMusicFetch<T>("/search", {
    term: query,
    types: types.join(","),
    limit,
  });
}

/**
 * Apple Music 차트 API
 */
export async function getAppleMusicCharts<T>(
  types: string[] = ["songs", "albums"],
  genre?: string
): Promise<T> {
  const endpoint = genre
    ? `/catalog/${DEFAULT_STOREFRONT}/charts`
    : `/catalog/${DEFAULT_STOREFRONT}/charts`;
  return appleMusicFetch<T>(endpoint, {
    types: types.join(","),
    genre: genre || "20", // 20은 일반 팝 장르
    limit: 20,
  });
}

/**
 * Apple Music 특정 트랙/앨범/아티스트 조회
 */
export async function getAppleMusicResource<T>(
  type: "songs" | "albums" | "artists",
  id: string
): Promise<T> {
  return appleMusicFetch<T>(`/catalog/${DEFAULT_STOREFRONT}/${type}/${id}`);
}

/**
 * Apple Music 다중 리소스 조회
 */
export async function getAppleMusicResources<T>(
  type: "songs" | "albums" | "artists",
  ids: string[]
): Promise<T> {
  return appleMusicFetch<T>(`/catalog/${DEFAULT_STOREFRONT}/${type}`, {
    ids: ids.join(","),
  });
}

// 상수 재익스포트 - 주석처리
// export {
//   FEATURED_ARTIST_NAMES,
//   RECOMMENDED_TRACK_SEARCHES,
//   TREND_ALBUM_SEARCHES,
//   TREND_ARTIST_NAMES,
//   TREND_TRACK_SEARCHES,
// } from "@/constants/apple-music";
