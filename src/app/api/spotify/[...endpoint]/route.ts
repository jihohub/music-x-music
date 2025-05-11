import { authOptions, refreshUserAccessToken } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";

/**
 * 스포티파이 API 프록시 라우트
 * 클라이언트 사이드에서 직접 스포티파이 API를 호출하는 대신
 * 이 API 라우트를 통해 요청합니다.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string[] }> }
) {
  try {
    // params Promise 해결
    const resolvedParams = await params;

    // 엔드포인트 조합 (/artists, /tracks 등)
    const endpoint = `/${resolvedParams.endpoint.join("/")}`;

    // 요청 URL에서 쿼리 파라미터 가져오기
    const url = new URL(request.url);
    const queryString = url.search;

    console.log(`스포티파이 API 요청: ${endpoint}${queryString}`);

    // 세션에서 액세스 토큰을 가져옵니다.
    const session = await getServerSession(authOptions);

    console.log("세션 정보:", {
      isAuthenticated: !!session,
      hasAccessToken: !!session?.accessToken,
      tokenFirstChars: session?.accessToken
        ? `${session.accessToken.substring(0, 10)}...`
        : "none",
    });

    let accessToken = session?.accessToken;

    // 액세스 토큰이 없는 경우 401 에러를 반환합니다.
    // 클라이언트 측에서 이 오류를 캐치하여 더미 데이터로 대체합니다.
    if (!accessToken) {
      console.log("토큰 없음 - 401 응답");
      return NextResponse.json(
        { error: "인증 정보가 없습니다." },
        { status: 401 }
      );
    }

    // 스포티파이 API 요청 (토큰 만료 시 재시도 로직 포함)
    async function makeRequestWithTokenRefreshOnFail() {
      // 스포티파이 API 요청
      console.log("스포티파이 API 호출 시작");
      let response = await fetch(
        `${SPOTIFY_API_BASE}${endpoint}${queryString}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("스포티파이 API 응답:", {
        status: response.status,
        statusText: response.statusText,
      });

      // 토큰 만료 오류인 경우(401) 토큰 재발급 후 재시도
      if (response.status === 401 && session) {
        console.log("액세스 토큰이 만료되었습니다. 토큰을 새로 발급합니다.");

        try {
          // 액세스 토큰 갱신 시도
          const refreshedToken = await refreshUserAccessToken(session);

          if (refreshedToken) {
            console.log("토큰 재발급 성공, 새 토큰으로 재시도합니다.");
            accessToken = refreshedToken;

            // 새 토큰으로 API 재요청
            response = await fetch(
              `${SPOTIFY_API_BASE}${endpoint}${queryString}`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            console.log("재시도 결과:", {
              status: response.status,
              statusText: response.statusText,
            });
          }
        } catch (refreshError) {
          console.error("토큰 재발급 실패:", refreshError);
        }
      }

      return response;
    }

    // 토큰 재발급 로직을 포함한 API 요청 실행
    const response = await makeRequestWithTokenRefreshOnFail();

    // 스포티파이 API 응답이 에러인 경우
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error("스포티파이 API 오류 응답:", errorData);
      } catch (e) {
        errorData = { error: `API 요청 실패: ${response.status}` };
        console.error("스포티파이 API 응답 파싱 오류:", e);
      }
      return NextResponse.json(errorData, { status: response.status });
    }

    // 스포티파이 API 응답이 성공인 경우
    const data = await response.json();
    console.log("스포티파이 API 성공 응답:", {
      responseSize: JSON.stringify(data).length,
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("스포티파이 API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
