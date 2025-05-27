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
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <div className="relative max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="relative bg-card-bg rounded-full border border-gray-200/10 px-4 py-2.5 shadow-sm"
      >
        <div className="flex items-center">
          <IoSearchOutline
            size={18}
            className="text-text-secondary mr-2.5 flex-shrink-0"
          />
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent w-full py-1 text-text-primary focus:outline-none placeholder-text-secondary/70 font-medium tracking-wide text-base md:text-sm"
            placeholder="곡, 아티스트, 앨범 검색..."
            value={searchTerm}
            onChange={onSearchChange}
            autoComplete="off"
            spellCheck="false"
          />
          {searchTerm && (
            <button
              type="button"
              className="flex items-center justify-center ml-2 h-5 w-5 rounded-full bg-gray-400/30 text-white flex-shrink-0"
              onClick={onClearSearch}
              aria-label="검색어 지우기"
            >
              <IoCloseCircleOutline size={14} />
            </button>
          )}
        </div>
      </form>
      <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 w-[90%] h-1.5 bg-black/20 blur-md rounded-full" />
    </div>
  );
};

export default SearchBar;
