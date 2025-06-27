import {
  APPLE_MUSIC_API_BASE,
  DEFAULT_STOREFRONT,
  FEATURED_ARTIST_IDS,
  RECOMMENDED_TRACK_IDS,
} from "@/constants/apple-music";
import { AppleMusicArtist, AppleMusicTrack } from "@/types/apple-music";
import { createPrivateKey } from "crypto";
import jwt from "jsonwebtoken";

interface MainPageData {
  tracks: AppleMusicTrack[];
  artists: AppleMusicArtist[];
}

/**
 * Apple Music 개발자 토큰 생성 (서버사이드용)
 */
function generateDeveloperToken(): string {
  const privateKeyEnv = process.env.APPLE_MUSIC_PRIVATE_KEY || "";
  const keyId = process.env.APPLE_MUSIC_KEY_ID || "";
  const teamId = process.env.APPLE_MUSIC_TEAM_ID || "";

  if (!privateKeyEnv || !keyId || !teamId) {
    throw new Error("Apple Music API 자격 증명이 설정되지 않았습니다.");
  }

  // private key 처리
  const privateKeyString = privateKeyEnv.replace(/\\n/g, "\n");

  if (!privateKeyString.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error("Private key 형식이 올바르지 않습니다.");
  }

  try {
    const privateKey = createPrivateKey({
      key: privateKeyString,
      format: "pem",
      type: "pkcs8",
    });

    const token = jwt.sign({}, privateKey, {
      issuer: teamId,
      expiresIn: "180d",
      algorithm: "ES256",
      header: {
        alg: "ES256",
        kid: keyId,
      },
    });

    return token;
  } catch (jwtError) {
    throw new Error(
      `JWT 토큰 생성 실패: ${
        jwtError instanceof Error ? jwtError.message : String(jwtError)
      }`
    );
  }
}

/**
 * 서버사이드에서 메인페이지 데이터를 가져오는 함수 (SSG/SSR용)
 * Apple Music API를 직접 호출하여 빌드 시점에 데이터 생성
 */
export async function getMainPageDataServer(): Promise<MainPageData> {
  try {
    // Apple Music 개발자 토큰 생성
    const developerToken = generateDeveloperToken();

    // Apple Music API 직접 호출
    const [tracksResponse, artistsResponse] = await Promise.all([
      fetch(
        `${APPLE_MUSIC_API_BASE}/catalog/${DEFAULT_STOREFRONT}/songs?ids=${RECOMMENDED_TRACK_IDS.join(
          ","
        )}`,
        {
          headers: {
            Authorization: `Bearer ${developerToken}`,
            "Content-Type": "application/json",
          },
          cache: "force-cache", // 빌드 시점에 강제 캐시
        }
      ),
      fetch(
        `${APPLE_MUSIC_API_BASE}/catalog/${DEFAULT_STOREFRONT}/artists?ids=${FEATURED_ARTIST_IDS.join(
          ","
        )}`,
        {
          headers: {
            Authorization: `Bearer ${developerToken}`,
            "Content-Type": "application/json",
          },
          cache: "force-cache",
        }
      ),
    ]);

    // 응답 상태 확인
    if (!tracksResponse.ok || !artistsResponse.ok) {
      console.error("Apple Music API 응답 오류:", {
        tracks: tracksResponse.status,
        artists: artistsResponse.status,
        tracksText: await tracksResponse.text().catch(() => "Unable to read"),
        artistsText: await artistsResponse.text().catch(() => "Unable to read"),
      });
      return { tracks: [], artists: [] };
    }

    // JSON 데이터 병렬 파싱
    const [tracksData, artistsData] = await Promise.all([
      tracksResponse.json(),
      artistsResponse.json(),
    ]);

    const tracks = tracksData.data || [];
    const artists = artistsData.data || [];

    console.log("SSG 데이터 로드 완료:", {
      tracksCount: tracks.length,
      artistsCount: artists.length,
    });

    return { tracks, artists };
  } catch (error) {
    console.error("SSG 데이터 fetch 오류:", error);
    return { tracks: [], artists: [] };
  }
}
