import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifySearchResult,
  SpotifyTrack,
} from "@/lib/spotify-api";
import { TokenManager } from "@/lib/spotify-token-refresh";
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
async function spotifyFetch<T>(endpoint: string): Promise<T> {
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
 * 아티스트의 인기 트랙을 가져오는 함수
 */
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

/**
 * 아티스트의 앨범을 가져오는 함수
 */
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
 * 앨범 정보를 가져오는 함수
 */
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

/**
 * 관련 아티스트 가져오기
 */
export async function getRelatedArtists(id: string): Promise<SpotifyArtist[]> {
  try {
    const response = await spotifyFetch<{ artists: SpotifyArtist[] }>(
      `/artists/${id}/related-artists`
    );
    console.log(`아티스트 ${id}의 관련 아티스트를 성공적으로 가져왔습니다.`);
    return response.artists;
  } catch (error: any) {
    console.error(
      "관련 아티스트를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
