"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendTab } from "../TrendPage";

const tabItems = [
  { id: "all", label: "전체", href: "/trend" },
  { id: "artist", label: "아티스트", href: "/trend?type=artist" },
  { id: "track", label: "트랙", href: "/trend?type=track" },
  { id: "album", label: "앨범", href: "/trend?type=album" },
] as const;

interface TrendHeaderProps {
  activeTab: TrendTab;
}

export default function TrendHeader({ activeTab }: TrendHeaderProps) {
  const router = useRouter();

  const handleTypeChange = (type: TrendTab) => {
    // URL 변경 및 페이지 이동
    const url = type === "all" ? "/trend" : `/trend?type=${type}`;
    router.push(url);
  };

  return (
    <div
      className="fixed left-6 right-6 z-40 flex justify-center
          top-8 md:top-24"
    >
      <div className="relative">
        {/* 리퀴드글래스 배경 */}
        <div
          className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-black/15 border border-white/10 shadow-2xl rounded-full"
          style={{
            boxShadow:
              "0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/15 rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/5 rounded-full"></div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="relative px-2.5 py-1.5">
          <div className="flex gap-1">
            {tabItems.map((tab) => (
              <Link
                key={tab.id}
                href={tab.href}
                className={`relative py-1 px-2 font-medium text-xs transition-all duration-200 ${
                  activeTab === tab.id
                    ? "text-white font-semibold"
                    : "text-white/70 hover:text-white/90"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handleTypeChange(tab.id as any);
                }}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
