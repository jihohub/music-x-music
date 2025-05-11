"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] px-4 text-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-6">DJSETLIST</h1>
          <p className="text-text-secondary mb-8">
            스포티파이 계정으로 로그인하여 맞춤형 음악 추천을 받아보세요.
          </p>
        </div>

        <button
          onClick={() => signIn("spotify", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center py-3 px-4 rounded-full bg-primary hover:bg-primary-hover text-white font-medium transition-colors"
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png"
            width={24}
            height={24}
            alt="Spotify"
            className="mr-2"
          />
          스포티파이로 로그인
        </button>

        <div className="mt-6 text-sm text-text-tertiary">
          로그인하면 DJSETLIST의{" "}
          <a href="#" className="text-primary hover:underline">
            서비스 약관
          </a>{" "}
          및{" "}
          <a href="#" className="text-primary hover:underline">
            개인정보 처리방침
          </a>
          에 동의하게 됩니다.
        </div>
      </div>
    </div>
  );
}
