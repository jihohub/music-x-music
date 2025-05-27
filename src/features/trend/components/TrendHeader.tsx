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
    <div className="mb-4">
      <div className="flex justify-center">
        <div className="inline-flex gap-4 px-1">
          {tabItems.map((tab) => (
            <Link
              key={tab.id}
              href={tab.href}
              className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-primary font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={(e) => {
                e.preventDefault();
                handleTypeChange(tab.id as TrendTab);
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full h-px bg-gray-200 mt-0.5"></div>
    </div>
  );
}
