import axios from "axios";

/**
 * 토큰 만료 시 자동으로 새 토큰을 발급받아 API 요청을 재시도하는 유틸리티 함수
 * @param apiCall 실행할 API 호출 함수
 * @param token 초기 액세스 토큰
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

/**
 * 클라이언트 자격 증명 토큰 관리용 클래스
 * 토큰 캐싱과 자동 갱신을 처리
 */
export class TokenManager {
  private cachedToken: string | null = null;
  private expirationTime: number | null = null;
  private clientId: string;
  private clientSecret: string;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  /**
   * 액세스 토큰을 가져옵니다. 캐시된 토큰이 유효하면 재사용하고,
   * 그렇지 않으면 새 토큰을 발급받습니다.
   */
  async getToken(): Promise<string> {
    // 캐시된 토큰이 있고 만료되지 않았으면 그대로 사용
    if (
      this.cachedToken &&
      this.expirationTime &&
      Date.now() < this.expirationTime
    ) {
      console.log("캐시된 액세스 토큰 사용");
      return this.cachedToken;
    }

    console.log("새 액세스 토큰 요청 중...");

    try {
      if (!this.clientId || !this.clientSecret) {
        throw new Error("클라이언트 ID 또는 시크릿이 없습니다");
      }

      // 인증 헤더 생성
      const authString = Buffer.from(
        `${this.clientId}:${this.clientSecret}`
      ).toString("base64");

      // 토큰 요청
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
        // 토큰 캐싱
        this.cachedToken = tokenResponse.data.access_token;
        // 만료 시간 설정 (약간의 버퍼를 두기 위해 5초 일찍 만료되도록 설정)
        this.expirationTime =
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
      throw new Error("인증 실패");
    }
  }

  /**
   * 토큰을 무효화합니다.
   * 다음 getToken 호출 시 새 토큰을 요청합니다.
   */
  invalidateToken(): void {
    this.cachedToken = null;
    this.expirationTime = null;
    console.log("토큰 무효화됨");
  }

  /**
   * API 요청을 토큰 자동 갱신과 함께 실행합니다.
   */
  async makeRequest<T>(requestFn: (token: string) => Promise<T>): Promise<T> {
    const token = await this.getToken();

    // 토큰 갱신 콜백
    const refreshToken = async (): Promise<string> => {
      this.invalidateToken();
      return await this.getToken();
    };

    return await withTokenRefresh(requestFn, token, refreshToken);
  }
}
