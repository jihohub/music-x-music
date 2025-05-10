"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoArrowBackOutline, IoHomeOutline } from "react-icons/io5";

export default function Header({ title }: { title?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-opacity-90 bg-background border-b border-border-color">
      <div className="container h-16 flex justify-between items-center px-4">
        <div className="w-12">
          {!isHome && (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
              aria-label="뒤로 가기"
            >
              <IoArrowBackOutline size={20} />
            </button>
          )}
        </div>

        <h1 className="text-lg font-bold text-center flex-1">
          {title || "음악 스타일"}
        </h1>

        <div className="w-12 flex justify-end">
          {!isHome && (
            <Link
              href="/"
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
              aria-label="홈으로 가기"
            >
              <IoHomeOutline size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
