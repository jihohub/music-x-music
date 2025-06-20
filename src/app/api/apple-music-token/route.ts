import { createPrivateKey } from "crypto";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/**
 * Apple Music 개발자 토큰 생성
 */
function generateDeveloperToken(): string {
  const privateKeyEnv = process.env.APPLE_MUSIC_PRIVATE_KEY || "";
  const keyId = process.env.APPLE_MUSIC_KEY_ID || "";
  const teamId = process.env.APPLE_MUSIC_TEAM_ID || "";

  if (!privateKeyEnv || !keyId || !teamId) {
    throw new Error("Apple Music API 자격 증명이 설정되지 않았습니다.");
  }

  const privateKeyString = privateKeyEnv.replace(/\\n/g, "\n");

  if (!privateKeyString.includes("-----BEGIN PRIVATE KEY-----")) {
    throw new Error("Private key 형식이 올바르지 않습니다.");
  }

  const privateKey = createPrivateKey({
    key: privateKeyString,
    format: "pem",
    type: "pkcs8",
  });

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
 * Apple Music 개발자 토큰을 반환하는 API
 */
export async function GET() {
  try {
    const token = generateDeveloperToken();
    return NextResponse.json({ token });
  } catch (error) {
    console.error("토큰 생성 실패:", error);
    return NextResponse.json(
      { error: "토큰 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
