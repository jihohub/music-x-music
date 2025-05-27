"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="animate-pulse h-8 w-8 rounded-full bg-gray-200"></div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-hover transition-colors"
      >
        로그인
      </Link>
    );
  }

  // 사용자가 로그인한 경우
  return (
    <div className="flex items-center gap-2">
      {session.user?.image ? (
        <UnoptimizedImage
          src={session.user.image}
          alt={session.user.name || "사용자"}
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
          {session.user?.name?.[0] || "U"}
        </div>
      )}

      <div className="relative group">
        <button className="text-sm font-medium">
          {session.user?.name || "사용자"}
        </button>

        <div className="absolute right-0 mt-2 w-48 bg-card-bg rounded-md shadow-lg overflow-hidden z-10 invisible group-hover:visible">
          <div className="p-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm rounded-md hover:bg-opacity-10 hover:bg-primary"
            >
              프로필
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-4 py-2 text-sm text-red-500 rounded-md hover:bg-opacity-10 hover:bg-red-500"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
