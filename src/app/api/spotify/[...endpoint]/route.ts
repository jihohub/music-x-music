import { authOptions } from "@/lib/auth";
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

    const accessToken = session?.accessToken;

    // 액세스 토큰이 없는 경우 401 에러를 반환합니다.
    // 클라이언트 측에서 이 오류를 캐치하여 더미 데이터로 대체합니다.
    if (!accessToken) {
      console.log("토큰 없음 - 401 응답");
      return NextResponse.json(
        { error: "인증 정보가 없습니다." },
        { status: 401 }
      );
    }

    // 스포티파이 API 요청
    console.log("스포티파이 API 호출 시작");
    const response = await fetch(
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
