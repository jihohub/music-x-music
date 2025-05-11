import axios from "axios";

const SPOTIFY_BASE_URL = "https://api.spotify.com/v1";

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  images?: SpotifyImage[];
  genres?: string[];
  popularity?: number;
  followers?: {
    total: number;
    href: string | null;
  };
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images?: SpotifyImage[];
  artists: SpotifyArtist[];
  release_date: string;
  total_tracks: number;
  tracks?: {
    items: SpotifyTrack[];
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album?: SpotifyAlbum;
  duration_ms: number;
  preview_url?: string;
  popularity?: number;
}

export interface SpotifySearchResult {
  tracks?: {
    items: SpotifyTrack[];
  };
  artists?: {
    items: SpotifyArtist[];
  };
  albums?: {
    items: SpotifyAlbum[];
  };
}

/**
 * 스포티파이 API 클라이언트
 */
export class SpotifyApi {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async fetch<T>(endpoint: string): Promise<T> {
    try {
      console.log(`SpotifyApi 클래스를 통한 API 요청: ${endpoint}`);
      console.log(`사용 중인 토큰: ${this.accessToken.substring(0, 10)}...`);

      const response = await axios.get(`${SPOTIFY_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log(`요청 성공: ${endpoint}`, {
        status: response.status,
        dataSize: JSON.stringify(response.data).length,
      });

      return response.data;
    } catch (error) {
      console.error(`SpotifyApi 요청 오류: ${endpoint}`, error);
      throw error;
    }
  }

  /**
   * 현재 사용자의 프로필 정보를 가져옵니다.
   */
  async getMe() {
    return this.fetch<{ id: string; display_name: string; images: any[] }>(
      "/me"
    );
  }

  /**
   * 사용자의 상위 아티스트를 가져옵니다.
   */
  async getTopArtists(limit = 10) {
    const response = await this.fetch<{ items: SpotifyArtist[] }>(
      `/me/top/artists?limit=${limit}`
    );
    return response.items;
  }

  /**
   * 사용자의 상위 트랙을 가져옵니다.
   */
  async getTopTracks(limit = 10) {
    const response = await this.fetch<{ items: SpotifyTrack[] }>(
      `/me/top/tracks?limit=${limit}`
    );
    return response.items;
  }

  /**
   * 추천 트랙을 가져옵니다.
   */
  async getRecommendations(options: {
    seed_artists?: string[];
    seed_tracks?: string[];
    seed_genres?: string[];
    limit?: number;
  }) {
    const { seed_artists, seed_tracks, seed_genres, limit = 10 } = options;

    let query = `?limit=${limit}`;
    if (seed_artists?.length)
      query += `&seed_artists=${seed_artists.join(",")}`;
    if (seed_tracks?.length) query += `&seed_tracks=${seed_tracks.join(",")}`;
    if (seed_genres?.length) query += `&seed_genres=${seed_genres.join(",")}`;

    const response = await this.fetch<{ tracks: SpotifyTrack[] }>(
      `/recommendations${query}`
    );
    return response.tracks;
  }

  /**
   * 아티스트 정보를 가져옵니다.
   */
  async getArtist(artistId: string) {
    return this.fetch<SpotifyArtist>(`/artists/${artistId}`);
  }

  /**
   * 트랙 정보를 가져옵니다.
   */
  async getTrack(trackId: string) {
    return this.fetch<SpotifyTrack>(`/tracks/${trackId}`);
  }
}

/**
 * 스포티파이 API 인증 테스트를 위한 함수
 * 이 함수는 서버 측에서만 실행됩니다.
 */
export async function testSpotifyAuth() {
  try {
    // 클라이언트 자격 증명 획득 (client credentials flow)
    console.log("스포티파이 인증 테스트 시작");

    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error(
        "SPOTIFY_CLIENT_ID 또는 SPOTIFY_CLIENT_SECRET이 설정되지 않았습니다."
      );
      return { success: false, error: "Missing credentials" };
    }

    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64"
    );

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

    if (tokenResponse.data && tokenResponse.data.access_token) {
      console.log("액세스 토큰 획득 성공!", {
        tokenFirstChars: `${tokenResponse.data.access_token.substring(
          0,
          10
        )}...`,
        expiresIn: tokenResponse.data.expires_in,
      });

      // 토큰으로 간단한 API 요청 테스트
      const spotifyApi = new SpotifyApi(tokenResponse.data.access_token);
      try {
        // 특정 아티스트 정보 가져오기
        const artist = await spotifyApi.getArtist("43BxCL6t4c73BQnIJtry5v"); // James Hype
        console.log("아티스트 정보 획득 성공!", {
          name: artist.name,
          genres: artist.genres,
        });

        return {
          success: true,
          message: "스포티파이 API 인증 및 요청 성공!",
        };
      } catch (apiError) {
        console.error("API 요청 실패:", apiError);
        return {
          success: false,
          error: "토큰은 획득했으나 API 요청 실패",
        };
      }
    } else {
      console.error("토큰 획득 실패:", tokenResponse.data);
      return {
        success: false,
        error: "Failed to obtain access token",
      };
    }
  } catch (error: any) {
    console.error("인증 테스트 중 오류 발생:", error);
    return {
      success: false,
      error: error?.message || "Unknown error",
    };
  }
}

/**
 * 토큰 만료 시 자동으로 새 토큰을 발급받아 API 요청을 재시도하는 유틸리티 함수
 * @param apiCall 실행할 API 호출 함수
 * @param getNewToken 새 토큰을 발급받는 함수
 * @returns API 호출 결과
 */
export async function withTokenRefresh<T>(
  apiCall: (token: string) => Promise<T>,
  token: string,
  getNewToken: () => Promise<string>
): Promise<T> {
  try {
    // 첫 번째 시도
    return await apiCall(token);
  } catch (error) {
    // 오류가 AxiosError이며 401(Unauthorized) 상태 코드인 경우
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.log("액세스 토큰이 만료되었습니다. 토큰을 새로 발급합니다.");

      try {
        // 새 액세스 토큰 요청
        const newToken = await getNewToken();
        console.log("새 토큰 발급 성공, 요청을 재시도합니다.");

        // 새 토큰으로 API 재호출
        return await apiCall(newToken);
      } catch (refreshError) {
        console.error("토큰 재발급 실패:", refreshError);
        throw refreshError;
      }
    }

    // 다른 오류는 그대로 던짐
    throw error;
  }
}
