import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifySearchResult,
  SpotifyTrack,
} from "@/types/spotify";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { SearchType } from "../queries/searchSpotify";
import {
  useBasicSearchQuery,
  useInfiniteSearchQuery,
} from "../queries/useSearchQuery";

/**
 * 검색 페이지의 모든 로직을 관리하는 커스텀 훅
 */
export function useSearchLogic(
  initialQuery = "",
  initialType: SearchType = "all"
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>(initialType);
  const [debouncedTerm, setDebouncedTerm] = useState(initialQuery);

  // 한 번에 가져올 결과 수
  const PAGE_SIZE = 20;

  // 검색 타입에 따라 다른 쿼리 훅 사용
  const isSpecificTypeSearch = searchType !== "all";

  // 입력값 디바운싱
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 기본 검색 쿼리 (타입이 'all'인 경우)
  const {
    data: basicSearchData,
    isFetching: isBasicFetching,
    isError: isBasicError,
    error: basicError,
  } = useBasicSearchQuery({
    query: debouncedTerm,
    enabled: searchType === "all" && debouncedTerm.trim().length >= 2,
  });

  // 무한 스크롤 타입 검색 쿼리
  const {
    data: infiniteSearchData,
    fetchNextPage,
    hasNextPage,
    isFetching: isInfiniteFetching,
    isFetchingNextPage,
    isError: isInfiniteError,
    error: infiniteError,
  } = useInfiniteSearchQuery({
    query: debouncedTerm,
    type: searchType,
    enabled: searchType !== "all" && debouncedTerm.trim().length >= 2,
  });

  // 검색 결과 및 상태 통합
  const searchResults = isSpecificTypeSearch
    ? infiniteSearchData
    : basicSearchData;
  const isFetching = isSpecificTypeSearch
    ? isInfiniteFetching
    : isBasicFetching;
  const isError = isSpecificTypeSearch ? isInfiniteError : isBasicError;
  const error = isSpecificTypeSearch ? infiniteError : basicError;

  // 결과 페이지들을 단일 배열로 변환
  const allTracks: SpotifyTrack[] = [];
  const allArtists: SpotifyArtist[] = [];
  const allAlbums: SpotifyAlbum[] = [];

  if (searchResults) {
    if (isSpecificTypeSearch && "pages" in searchResults) {
      // 무한 스크롤 결과 처리
      const pagesData = searchResults as InfiniteData<SpotifySearchResult>;
      pagesData.pages.forEach((page: SpotifySearchResult) => {
        if (page.tracks?.items) {
          allTracks.push(...page.tracks.items);
        }
        if (page.artists?.items) {
          allArtists.push(...page.artists.items);
        }
        if (page.albums?.items) {
          allAlbums.push(...page.albums.items);
        }
      });
    } else if (!isSpecificTypeSearch) {
      // 기본 검색 결과 처리
      const basicData = searchResults as SpotifySearchResult;
      if (basicData.tracks?.items) {
        allTracks.push(...basicData.tracks.items);
      }
      if (basicData.artists?.items) {
        allArtists.push(...basicData.artists.items);
      }
      if (basicData.albums?.items) {
        allAlbums.push(...basicData.albums.items);
      }
    }
  }

  // URL 업데이트 함수
  const updateSearchParams = useCallback(
    (term: string, type: SearchType = searchType) => {
      if (term.trim().length > 1) {
        // 검색어와 타입이 모두 있는 경우
        const params = new URLSearchParams();
        params.set("q", term);

        // 전체 검색이 아닌 경우에만 type 파라미터 추가
        if (type !== "all") {
          params.set("type", type);
        }

        router.push(`/search?${params.toString()}`);
      } else if (term.trim() === "") {
        // 검색어가 없는 경우 기본 검색 페이지로
        router.push("/search");
      }
    },
    [router, searchType]
  );

  // 인기 검색어
  const popularSearches = [
    "Coldplay",
    "르세라핌",
    "Skrillex",
    "Ariana Grande",
    "Kendrick Lamar",
    "Stray Kids",
    "The Weeknd",
    "Justin Bieber",
  ];

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  // 검색어 초기화
  const clearSearch = () => {
    setSearchTerm("");

    // React Query 캐시 초기화
    queryClient.removeQueries({ queryKey: ["search"] });
    queryClient.removeQueries({ queryKey: ["infiniteSearch"] });

    router.push("/search");
  };

  // 인기 검색어 클릭
  const handlePopularSearchClick = (term: string) => {
    setSearchTerm(term);
    updateSearchParams(term);
  };

  // 검색 폼 제출 핸들러
  const handleSearchSubmit = () => {
    if (searchTerm.trim().length >= 2) {
      updateSearchParams(searchTerm);
    } else if (searchTerm.trim() === "") {
      clearSearch();
    }
  };

  // 검색 유형 변경 핸들러
  const handleTypeChange = (type: SearchType) => {
    setSearchType(type);
    updateSearchParams(searchTerm, type);
  };

  // 장르 클릭
  const handleGenreClick = (genre: string) => {
    setSearchTerm(genre);
    updateSearchParams(genre);
  };

  // URL 쿼리 파라미터 변경 감지
  useEffect(() => {
    if (initialQuery) {
      setSearchTerm(initialQuery);
    } else {
      // 쿼리 파라미터가 없는 경우 검색어 초기화
      setSearchTerm("");
    }
    setSearchType(initialType);
  }, [initialQuery, initialType]);

  // 페이지 로드 시 초기화 로직
  useEffect(() => {
    // URL에 검색어가 없는 경우 초기 상태로 리셋
    if (!initialQuery || initialQuery.trim() === "") {
      setSearchTerm("");
    }
  }, [initialQuery]);

  // 검색어 변경 시 URL 업데이트 (디바운스 적용)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== initialQuery) {
        updateSearchParams(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, initialQuery, updateSearchParams]);

  // 검색 결과가 있는지 확인
  const hasResults =
    allTracks.length > 0 || allArtists.length > 0 || allAlbums.length > 0;

  // 선택된 유형에 따라 표시할 결과 결정
  const shouldShowArtists = searchType === "all" || searchType === "artist";
  const shouldShowTracks = searchType === "all" || searchType === "track";
  const shouldShowAlbums = searchType === "all" || searchType === "album";

  return {
    // 상태
    searchTerm,
    searchType,
    allTracks,
    allArtists,
    allAlbums,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
    hasResults,
    hasNextPage,

    // 검색 결과 표시 조건
    shouldShowArtists,
    shouldShowTracks,
    shouldShowAlbums,

    // 핸들러
    handleSearchChange,
    clearSearch,
    handlePopularSearchClick,
    handleSearchSubmit,
    handleTypeChange,
    handleGenreClick,

    // 무한 스크롤 핸들러
    fetchNextPage,

    // 기타
    popularSearches,
    initialQuery,
  };
}
