"use client";

import { useEffect, useRef } from "react";
import { IoCloseCircleOutline, IoSearchOutline } from "react-icons/io5";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearSearch: () => void;
  onSubmit?: () => void;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  onSubmit,
}: SearchBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // 컴포넌트가 마운트되고 500ms 후에 자동으로 포커스 (iOS와 유사한 UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && searchTerm.trim().length >= 2) {
      onSubmit();
    }
  };

  // 검색 버튼 클릭 핸들러
  const handleSearchButtonClick = () => {
    if (onSubmit && searchTerm.trim().length >= 2) {
      onSubmit();
    }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
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

        {/* 검색 입력 컨텐츠 */}
        <div className="relative px-4 py-2.5 md:px-6 md:py-4">
          <div className="flex items-center">
            <button
              type="button"
              className={`mr-2.5 md:mr-3 flex-shrink-0 p-1 rounded-full transition-all duration-200 ${
                searchTerm.trim().length >= 2
                  ? "text-white hover:bg-white/20 cursor-pointer"
                  : "text-white/50 cursor-not-allowed"
              }`}
              onClick={handleSearchButtonClick}
              disabled={searchTerm.trim().length < 2}
              aria-label="검색"
            >
              <IoSearchOutline size={18} className="md:size-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              className="bg-transparent w-full py-1.5 md:py-2 text-white focus:outline-none placeholder-white/60 font-medium tracking-wide text-sm md:text-base"
              placeholder="곡, 아티스트, 앨범 검색..."
              value={searchTerm}
              onChange={onSearchChange}
              autoComplete="off"
              spellCheck="false"
            />
            {searchTerm && (
              <button
                type="button"
                className="flex items-center justify-center ml-3 h-6 w-6 rounded-full bg-white/20 text-white/80 flex-shrink-0 hover:bg-white/30 transition-all duration-200"
                onClick={onClearSearch}
                aria-label="검색어 지우기"
              >
                <IoCloseCircleOutline size={16} />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
