import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifySearchResult,
  SpotifyTrack,
} from "@/lib/spotify-api";
import axios from "axios";

// 실제 스포티파이 아티스트 ID (James Hype, SZA, 아이브, 켄드릭 라마)
const FEATURED_ARTIST_IDS = [
  "43BxCL6t4c73BQnIJtry5v", // James Hype
  "7tYKF4w9nC0nq9CsPZTHyP", // SZA
  "6RHTUrRF63xao58xh9FXYJ", // 아이브
  "4oLeXFyACqeem2VImYeBFe", // Fred Again..
  "25uiPmTg16RbhZWAqwLBy5", // Charli XCX
  "45dkTj5sMRSjrmBSBeiHym", // Tate McRae
];

// 실제 스포티파이 트랙 ID
const RECOMMENDED_TRACK_IDS = [
  "3sU1L9okYWbN61oHZNQTfh", // Don't Wake Me Up - James Hype
  "4iZ4pt7kvcaH6Yo8UoZ4s2", // Snooze - SZA
  "6JjydtOl3rysvM2prpCBaf", // HEYA - 아이브
  "6NRvZuFXn2ixp8YdzUvG5n", // Leave Me Like This - Skrillex
  "32VIrOsJmwvqRm4rWFBCsi", // Shiver - John Summit
  "1tOEEEM8DFyZq3CxSHeq5f", // Kammy (like i do) - Fred again..
];

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

// 스포티파이 클라이언트 자격증명에서 토큰 획득
let cachedAccessToken: string | null = null;
let tokenExpirationTime: number | null = null;

/**
 * 스포티파이 API 액세스 토큰을 가져옵니다.
 * Client Credentials 방식으로 인증합니다.
 */
async function getAccessToken(): Promise<string> {
  try {
    // 캐시된 토큰이 있고 만료되지 않았으면 그대로 사용
    if (
      cachedAccessToken &&
      tokenExpirationTime &&
      Date.now() < tokenExpirationTime
    ) {
      console.log("캐시된 액세스 토큰 사용");
      return cachedAccessToken;
    }

    console.log("새 액세스 토큰 요청 중...");

    const client_id =
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID ||
      process.env.SPOTIFY_CLIENT_ID;
    const client_secret =
      process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET ||
      process.env.SPOTIFY_CLIENT_SECRET;

    console.log("인증 정보:", {
      hasClientId: !!client_id,
      hasClientSecret: !!client_secret,
    });

    if (!client_id || !client_secret) {
      throw new Error("스포티파이 클라이언트 ID 또는 시크릿이 없습니다");
    }

    // 인증 헤더 생성 - 이전 버퍼 생성 방식 수정
    const authString = Buffer.from(`${client_id}:${client_secret}`).toString(
      "base64"
    );

    // 토큰 요청 디버그
    console.log("토큰 요청 헤더:", {
      authHeader: `Basic ${authString.substring(0, 10)}...`,
      contentType: "application/x-www-form-urlencoded",
    });

    // axios로 직접 클라이언트 자격 증명 요청
    const tokenResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }).toString(),
      {
        headers: {
          Authorization: `Basic ${authString}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("토큰 응답:", tokenResponse.data);

    if (tokenResponse.data && tokenResponse.data.access_token) {
      // 토큰 캐싱
      cachedAccessToken = tokenResponse.data.access_token;
      // 만료 시간 설정 (약간의 버퍼를 두기 위해 5초 일찍 만료되도록 설정)
      tokenExpirationTime =
        Date.now() + (tokenResponse.data.expires_in - 5) * 1000;

      console.log("새 액세스 토큰 획득 성공");
      return tokenResponse.data.access_token;
    } else {
      throw new Error("토큰 응답에 access_token이 없습니다");
    }
  } catch (error: any) {
    console.error(
      "액세스 토큰 획득 실패:",
      error.response?.data || error.message
    );
    throw new Error("스포티파이 인증 실패");
  }
}

/**
 * 스포티파이 API 요청 함수
 */
async function spotifyFetch<T>(endpoint: string): Promise<T> {
  try {
    // 액세스 토큰 획득
    const accessToken = await getAccessToken();

    const url = `${SPOTIFY_API_BASE}${endpoint}`;
    console.log(`스포티파이 API 요청: ${url}`);

    // API 요청
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      `스포티파이 API 요청 실패:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 특정 아티스트 정보를 가져오는 함수
 */
export async function getFeaturedArtists(): Promise<SpotifyArtist[]> {
  try {
    // 여러 아티스트를 한 번에 가져오는 API 호출
    const ids = FEATURED_ARTIST_IDS.join(",");
    const response = await spotifyFetch<{ artists: SpotifyArtist[] }>(
      `/artists?ids=${ids}`
    );

    console.log(
      `아티스트 ${FEATURED_ARTIST_IDS.length}명의 정보를 성공적으로 가져왔습니다.`
    );
    return response.artists;
  } catch (error: any) {
    console.error(
      "아티스트 정보를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 추천 트랙 정보를 가져오는 함수
 */
export async function getRecommendedTracks(): Promise<SpotifyTrack[]> {
  try {
    // 여러 트랙을 한 번에 가져오는 API 호출
    const ids = RECOMMENDED_TRACK_IDS.join(",");
    const response = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
      `/tracks?ids=${ids}`
    );

    console.log(
      `트랙 ${RECOMMENDED_TRACK_IDS.length}개의 정보를 성공적으로 가져왔습니다.`
    );
    return response.tracks;
  } catch (error: any) {
    console.error(
      "추천 트랙을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 아티스트 ID로 아티스트 정보를 가져오는 함수
 */
export async function getArtistById(id: string): Promise<SpotifyArtist> {
  try {
    const artist = await spotifyFetch<SpotifyArtist>(`/artists/${id}`);
    console.log(`아티스트 정보를 성공적으로 가져왔습니다: ${artist.name}`);
    return artist;
  } catch (error: any) {
    console.error(
      `아티스트 ID: ${id}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 트랙 ID로 트랙 정보를 가져오는 함수
 */
export async function getTrackById(id: string): Promise<SpotifyTrack> {
  try {
    const track = await spotifyFetch<SpotifyTrack>(`/tracks/${id}`);
    console.log(`트랙 정보를 성공적으로 가져왔습니다: ${track.name}`);
    return track;
  } catch (error: any) {
    console.error(
      `트랙 ID: ${id}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

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

/**
 * 스포티파이 인증 테스트를 위한 API 함수
 */
export async function testSpotifyAuth() {
  try {
    // 액세스 토큰 획득 테스트
    const accessToken = await getAccessToken();

    // 간단한 API 호출 테스트 (James Hype 아티스트 정보)
    const artistResponse = await spotifyFetch<SpotifyArtist>(
      `/artists/${FEATURED_ARTIST_IDS[0]}`
    );

    return {
      success: true,
      message: "스포티파이 API 인증 및 요청 성공!",
      artist: {
        name: artistResponse.name,
        genres: artistResponse.genres,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "스포티파이 API 인증 또는 요청 실패",
    };
  }
}

// 앨범 정보 가져오기
export async function getAlbumById(id: string): Promise<SpotifyAlbum> {
  try {
    const album = await spotifyFetch<SpotifyAlbum>(`/albums/${id}`);
    console.log(`앨범 정보를 성공적으로 가져왔습니다: ${album.name}`);
    return album;
  } catch (error: any) {
    console.error(
      `앨범 ID: ${id}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

// 아티스트의 인기 트랙 가져오기
export async function getArtistTopTracks(id: string): Promise<SpotifyTrack[]> {
  try {
    const response = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
      `/artists/${id}/top-tracks?market=KR`
    );
    console.log(`아티스트 ${id}의 인기 트랙을 성공적으로 가져왔습니다.`);
    return response.tracks;
  } catch (error: any) {
    console.error(
      "인기 트랙을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// 아티스트의 앨범 가져오기
export async function getArtistAlbums(id: string): Promise<SpotifyAlbum[]> {
  try {
    const response = await spotifyFetch<{ items: SpotifyAlbum[] }>(
      `/artists/${id}/albums?limit=10&include_groups=album,single`
    );
    console.log(`아티스트 ${id}의 앨범을 성공적으로 가져왔습니다.`);
    return response.items;
  } catch (error: any) {
    console.error(
      "앨범을 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

// 관련 아티스트 가져오기
export async function getRelatedArtists(id: string): Promise<SpotifyArtist[]> {
  const response = await fetch(
    `${SPOTIFY_API_BASE}/artists/${id}/related-artists`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SPOTIFY_ACCESS_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("관련 아티스트를 가져오는데 실패했습니다.");
  }

  const data = await response.json();
  return data.artists;
}
