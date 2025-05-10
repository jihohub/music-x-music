import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import SpotifyProvider from "next-auth/providers/spotify";

const scopes = [
  "user-read-email",
  "user-read-private",
  "user-top-read",
  "user-library-read",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ");

/**
 * 토큰 새로고침 함수
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log("토큰 갱신 시도:", { refreshToken: !!token.refreshToken });

    const url = "https://accounts.spotify.com/api/token";
    const params = new URLSearchParams({
      client_id: process.env.SPOTIFY_CLIENT_ID as string,
      client_secret: process.env.SPOTIFY_CLIENT_SECRET as string,
      grant_type: "refresh_token",
      refresh_token: token.refreshToken as string,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error("토큰 갱신 실패:", refreshedTokens);
      throw refreshedTokens;
    }

    console.log("토큰 갱신 성공:", {
      newTokenReceived: !!refreshedTokens.access_token,
      expiresIn: refreshedTokens.expires_in,
    });

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // 새 토큰이 없으면 기존 토큰 유지
    };
  } catch (error) {
    console.error("토큰 갱신 오류:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID as string,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
      authorization: {
        params: { scope: scopes },
      },
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async jwt({ token, account }) {
      // 처음 로그인할 때 토큰에 access_token 저장
      if (account) {
        console.log("초기 로그인 - 토큰 저장:", {
          hasAccessToken: !!account.access_token,
          hasRefreshToken: !!account.refresh_token,
          expiresAt: account.expires_at,
        });

        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = (account.expires_at as number) * 1000;
      }

      // 토큰이 만료되지 않았으면 그대로 반환
      if (token.expiresAt && Date.now() < (token.expiresAt as number)) {
        console.log("토큰 유효함:", {
          expiresAt: new Date(token.expiresAt as number).toISOString(),
          now: new Date().toISOString(),
        });
        return token;
      }

      console.log("토큰 만료됨. 갱신 필요:", {
        expiresAt: token.expiresAt
          ? new Date(token.expiresAt as number).toISOString()
          : "unknown",
        now: new Date().toISOString(),
      });

      // 토큰 갱신
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      // 세션에 accessToken 추가
      session.accessToken = token.accessToken;

      console.log("세션 업데이트:", {
        hasAccessToken: !!session.accessToken,
        tokenError: token.error,
      });

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
