import {
  APPLE_MUSIC_API_BASE,
  DEFAULT_STOREFRONT,
} from "@/constants/apple-music";
import { createPrivateKey } from "crypto";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

/**
 * Apple Music 개발자 토큰 생성
 */
function generateDeveloperToken(): string {
  const privateKeyEnv = process.env.APPLE_MUSIC_PRIVATE_KEY || "";
  const keyId = process.env.APPLE_MUSIC_KEY_ID || "";
  const teamId = process.env.APPLE_MUSIC_TEAM_ID || "";

  console.log("환경 변수 체크:", {
    hasPrivateKey: !!privateKeyEnv,
    hasKeyId: !!keyId,
    hasTeamId: !!teamId,
    privateKeyLength: privateKeyEnv.length,
    privateKeyStart: privateKeyEnv.substring(0, 50),
  });

  if (!privateKeyEnv || !keyId || !teamId) {
    throw new Error("Apple Music API 자격 증명이 설정되지 않았습니다.");
  }

  // private key 처리: 환경 변수에서 \\n을 실제 줄바꿈으로 변환
  const privateKeyString = privateKeyEnv.replace(/\\n/g, "\n");

  // private key가 BEGIN/END 태그로 둘러싸여 있는지 확인
  if (!privateKeyString.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error(
      "Private key 형식이 올바르지 않습니다. BEGIN PRIVATE KEY 태그가 필요합니다."
    );
  }

  try {
    console.log("Private key 변환 시도...");
    // crypto 모듈을 사용하여 문자열을 KeyObject로 변환
    const privateKey = createPrivateKey({
      key: privateKeyString,
      format: "pem",
      type: "pkcs8",
    });

    console.log("JWT 토큰 생성 시도...");
    const token = jwt.sign({}, privateKey, {
      issuer: teamId,
      expiresIn: "180d",
      algorithm: "ES256",
      header: {
        alg: "ES256",
        kid: keyId,
      },
    });

    console.log("JWT 토큰 생성 성공");
    return token;
  } catch (jwtError) {
    console.error("JWT 토큰 생성 실패:", jwtError);
    throw new Error(
      `JWT 토큰 생성 실패: ${
        jwtError instanceof Error ? jwtError.message : String(jwtError)
      }`
    );
  }
}

/**
 * Apple Music API 프록시 라우트
 * 클라이언트 사이드에서 직접 Apple Music API를 호출하는 대신
 * 이 API 라우트를 통해 요청합니다.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ endpoint: string[] }> }
) {
  try {
    // params Promise 해결
    const resolvedParams = await params;

    // 엔드포인트 조합
    const endpoint = resolvedParams.endpoint.join("/");

    // 요청 URL에서 쿼리 파라미터 가져오기
    const url = new URL(request.url);
    const queryParams = new URLSearchParams(url.search);

    // storefront 파라미터 처리
    const storefront = queryParams.get("storefront") || DEFAULT_STOREFRONT;
    queryParams.delete("storefront"); // URL에서 제거 (경로에 포함되므로)

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    // Apple Music API의 올바른 경로 구성
    let apiUrl: string;
    if (endpoint === "search") {
      // 검색 API: /v1/catalog/{storefront}/search
      apiUrl = `${APPLE_MUSIC_API_BASE}/catalog/${storefront}/search${queryString}`;
    } else if (endpoint.startsWith("catalog/")) {
      // 카탈로그 API: /v1/catalog/{storefront}/...
      apiUrl = `${APPLE_MUSIC_API_BASE}/${endpoint}${queryString}`;
    } else {
      // 기타 API
      apiUrl = `${APPLE_MUSIC_API_BASE}/${endpoint}${queryString}`;
    }

    console.log(`Apple Music API 요청: ${apiUrl}`);

    try {
      // Apple Music 개발자 토큰 생성
      const developerToken = generateDeveloperToken();

      // Apple Music API 요청
      console.log("Apple Music API 호출 시작");
      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${developerToken}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Apple Music API 응답:", {
        status: response.status,
        statusText: response.statusText,
      });

      // Apple Music API 응답이 에러인 경우
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
          console.error("Apple Music API 오류 응답:", errorData);
        } catch (e) {
          errorData = { error: `API 요청 실패: ${response.status}` };
          console.error("Apple Music API 응답 파싱 오류:", e);
        }
        return NextResponse.json(errorData, { status: response.status });
      }

      // Apple Music API 응답이 성공인 경우
      const data = await response.json();
      console.log("Apple Music API 성공 응답:", {
        responseSize: JSON.stringify(data).length,
      });
      return NextResponse.json(data);
    } catch (tokenError) {
      console.error("Apple Music 토큰 생성 오류:", tokenError);
      return NextResponse.json(
        { error: "Apple Music API 자격 증명 오류입니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Apple Music API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
