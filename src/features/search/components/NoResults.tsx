"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SearchType } from "../queries/searchSpotify";

interface NoResultsProps {
  searchTerm: string;
  searchType: SearchType;
  isLoading?: boolean;
  delay?: number; // 표시 지연 시간 (ms)
}

export function NoResults({
  searchTerm,
  searchType,
  isLoading = false,
  delay = 1000, //  1000ms(
}: NoResultsProps) {
  const [showNoResults, setShowNoResults] = useState(false);

  // 지연 시간 후에만 결과 없음 메시지 표시
  useEffect(() => {
    let timer: NodeJS.Timeout;

    // 조건이 충족되면 타이머 설정
    if (!isLoading && searchTerm && searchTerm.trim().length >= 2) {
      timer = setTimeout(() => {
        setShowNoResults(true);
      }, delay);
    } else {
      // 검색어가 변경되거나 로딩 상태가 변경되면 상태 초기화
      setShowNoResults(false);
    }

    // 클린업 함수
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [searchTerm, isLoading, delay]);

  // 지연 시간 이전이거나 필요한 조건이 충족되지 않으면 표시하지 않음
  if (
    isLoading ||
    !searchTerm ||
    searchTerm.trim().length < 2 ||
    !showNoResults
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="text-center py-8"
    >
      {searchType === "artist" && (
        <>
          <p className="text-lg text-text-secondary">
            "{searchTerm}"에 대한 아티스트 검색 결과가 없습니다.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            다른 키워드로 검색하거나 다른 카테고리를 선택해보세요.
          </p>
        </>
      )}

      {searchType === "track" && (
        <>
          <p className="text-lg text-text-secondary">
            "{searchTerm}"에 대한 트랙 검색 결과가 없습니다.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            다른 키워드로 검색하거나 다른 카테고리를 선택해보세요.
          </p>
        </>
      )}

      {searchType === "album" && (
        <>
          <p className="text-lg text-text-secondary">
            "{searchTerm}"에 대한 앨범 검색 결과가 없습니다.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            다른 키워드로 검색하거나 다른 카테고리를 선택해보세요.
          </p>
        </>
      )}

      {searchType === "all" && (
        <>
          <p className="text-lg text-text-secondary">
            "{searchTerm}"에 대한 검색 결과가 없습니다.
          </p>
          <p className="text-sm text-text-secondary mt-2">
            다른 키워드로 검색해보세요.
          </p>
        </>
      )}
    </motion.div>
  );
}

export default NoResults;
