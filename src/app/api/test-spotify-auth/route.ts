import { testSpotifyAuth } from "@/lib/spotify-api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 스포티파이 인증 테스트 실행
    const result = await testSpotifyAuth();

    // 결과 반환
    return NextResponse.json(result);
  } catch (error) {
    console.error("스포티파이 인증 테스트 중 오류:", error);
    return NextResponse.json(
      { success: false, error: "인증 테스트 실패" },
      { status: 500 }
    );
  }
}
