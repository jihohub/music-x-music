"use client";

import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoCloseCircleOutline, IoSearchOutline } from "react-icons/io5";

// 검색 결과 타입 정의
type SearchResult = {
  id: string;
  type: "track" | "artist" | "album";
  name: string;
  image: string;
  description: string;
};

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // 인기 검색어
  const popularSearches = [
    "NewJeans",
    "아이유",
    "The Weeknd",
    "Doja Cat",
    "aespa",
    "팝",
    "케이팝",
    "힙합",
    "R&B",
    "일렉트로닉",
  ];

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 1) {
      setIsSearching(true);

      // 임시 검색 로직 (실제로는 API 호출)
      setTimeout(() => {
        // 더미 데이터로 검색 결과 생성
        const dummyResults: SearchResult[] = [
          {
            id: "1",
            type: "track",
            name: `${term} - Blinding Lights`,
            image:
              "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
            description: "The Weeknd",
          },
          {
            id: "2",
            type: "artist",
            name: `${term} Artist`,
            image:
              "https://i.scdn.co/image/ab6761610000e5ebc8d92f2f625cd1c86a3566f6",
            description: "아티스트",
          },
          {
            id: "3",
            type: "album",
            name: `${term} Album`,
            image:
              "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
            description: "2023 • 앨범",
          },
        ];

        setResults(dummyResults);
        setIsSearching(false);
      }, 500);
    } else {
      setResults([]);
      setIsSearching(false);
    }
  };

  // 검색어 초기화
  const clearSearch = () => {
    setSearchTerm("");
    setResults([]);
  };

  return (
    <>
      <Header title="검색" />
      <div className="py-6 space-y-6">
        {/* 검색 입력 필드 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearchOutline size={20} className="text-text-secondary" />
          </div>
          <input
            type="text"
            className="bg-card-bg w-full py-3 pl-10 pr-10 rounded-full text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="곡, 아티스트, 앨범 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={clearSearch}
            >
              <IoCloseCircleOutline size={20} className="text-text-secondary" />
            </button>
          )}
        </div>

        {/* 검색 결과 */}
        {results.length > 0 ? (
          <div className="space-y-2">
            <h2 className="text-xl font-bold mb-4">검색 결과</h2>
            {results.map((result) => (
              <Link
                href={`/${result.type}/${result.id}`}
                key={`${result.type}-${result.id}`}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-card-bg transition-colors"
              >
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={result.image}
                    alt={result.name}
                    fill
                    className={`object-cover ${
                      result.type === "artist" ? "rounded-full" : "rounded"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-medium">{result.name}</h3>
                  <p className="text-text-secondary text-sm">
                    {result.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          !isSearching && (
            <div className="space-y-6">
              {/* 인기 검색어 */}
              <div>
                <h2 className="text-xl font-bold mb-4">인기 검색어</h2>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, index) => (
                    <button
                      key={index}
                      className="bg-card-bg px-4 py-2 rounded-full hover:bg-opacity-70 transition-colors"
                      onClick={() => setSearchTerm(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* 장르 브라우징 */}
              <div>
                <h2 className="text-xl font-bold mb-4">장르 및 분위기</h2>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/genre/kpop"
                    className="rounded-lg p-4 h-24 flex items-center justify-center bg-green-500"
                  >
                    <span className="text-white font-bold text-lg">케이팝</span>
                  </Link>
                  <Link
                    href="/genre/pop"
                    className="rounded-lg p-4 h-24 flex items-center justify-center bg-pink-500"
                  >
                    <span className="text-white font-bold text-lg">팝</span>
                  </Link>
                  <Link
                    href="/genre/hiphop"
                    className="rounded-lg p-4 h-24 flex items-center justify-center bg-purple-500"
                  >
                    <span className="text-white font-bold text-lg">힙합</span>
                  </Link>
                  <Link
                    href="/genre/rnb"
                    className="rounded-lg p-4 h-24 flex items-center justify-center bg-blue-500"
                  >
                    <span className="text-white font-bold text-lg">R&B</span>
                  </Link>
                </div>
              </div>
            </div>
          )
        )}

        {/* 로딩 상태 */}
        {isSearching && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse text-text-secondary">검색 중...</div>
          </div>
        )}
      </div>
    </>
  );
}
