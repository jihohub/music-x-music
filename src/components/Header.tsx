"use client";

import { usePathname, useRouter } from "next/navigation";
import { IoArrowBackOutline, IoHomeOutline } from "react-icons/io5";

export default function Header({ title }: { title?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-opacity-90 bg-background border-b border-border-color"
      style={{
        paddingTop: "var(--safe-area-inset-top)",
        paddingLeft: "var(--safe-area-inset-left)",
        paddingRight: "var(--safe-area-inset-right)",
      }}
    >
      <div className="container h-16 flex justify-between items-center px-4">
        <div className="w-12">
          {!isHome ? (
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
              aria-label="뒤로 가기"
            >
              <IoArrowBackOutline size={20} />
            </button>
          ) : null}
        </div>

        <h1 className="text-lg font-bold text-center flex-1">
          {title || "DJSETLIST"}
        </h1>

        <div className="w-12">
          {!isHome ? (
            <button
              onClick={() => router.push("/")}
              className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
              aria-label="홈으로 가기"
            >
              <IoHomeOutline size={20} />
            </button>
          ) : null}
          {/* <UserProfile /> */}
        </div>
      </div>
    </header>
  );
}
