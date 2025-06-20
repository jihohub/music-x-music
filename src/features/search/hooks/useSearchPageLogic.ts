import {
  useBasicSearchQuery,
  useInfiniteSearchQuery,
} from "@/features/search/queries/useSearchQuery";
import {
  AppleMusicAlbum,
  AppleMusicArtist,
  AppleMusicSearchResult,
  AppleMusicTrack,
} from "@/types/apple-music";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export type SearchType = "all" | "artist" | "track" | "album";

// 검색 결과 처리 함수
const processSearchResults = (
  searchResults: AppleMusicSearchResult | undefined
) => {
  const allTracks: AppleMusicTrack[] = searchResults?.songs?.data || [];
  const allArtists: AppleMusicArtist[] = searchResults?.artists?.data || [];
  const allAlbums: AppleMusicAlbum[] = searchResults?.albums?.data || [];

  return { allTracks, allArtists, allAlbums };
};

// 무한 검색 결과 처리 함수
const processInfiniteSearchResults = (pages: AppleMusicSearchResult[]) => {
  const allTracks = pages.flatMap((page) => page.songs?.data || []);
  const allArtists = pages.flatMap((page) => page.artists?.data || []);
  const allAlbums = pages.flatMap((page) => page.albums?.data || []);

  return { allTracks, allArtists, allAlbums };
};

// 인기 검색어 목록
const popularSearches = [
  "Taylor Swift",
  "BTS",
  "NewJeans",
  "IVE",
  "aespa",
  "BLACKPINK",
  "Dua Lipa",
  "The Weeknd",
  "Billie Eilish",
  "Coldplay",
  "르세라핌",
  "Skrillex",
  "Ariana Grande",
  "Kendrick Lamar",
  "Stray Kids",
  "The Weeknd",
  "Justin Bieber",
];

export function useSearchPageLogic() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // URL에서 검색어 및 유형 가져오기
  const queryParam = searchParams.get("q") || "";
  const typeParam = (searchParams.get("type") || "all") as SearchType;

  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [searchType, setSearchType] = useState<SearchType>(typeParam);

  // 검색 타입에 따라 다른 쿼리 실행
  const isSpecificTypeSearch = searchType !== "all";

  // 기본 검색 (타입이 'all'인 경우)
  const {
    data: basicSearchData,
    isFetching: isBasicFetching,
    isError: isBasicError,
    error: basicError,
  } = useBasicSearchQuery(
    queryParam,
    !isSpecificTypeSearch && queryParam.trim().length >= 2
  );

  // 특정 타입 검색 (무한스크롤)
  const searchTypes = isSpecificTypeSearch
    ? typeParam === "artist"
      ? "artists"
      : typeParam === "track"
      ? "songs"
      : typeParam === "album"
      ? "albums"
      : "songs,albums,artists"
    : "songs,albums,artists";

  // 개별 탭에서는 무한스크롤 사용
  const {
    data: infiniteSearchData,
    isFetching: isInfiniteFetching,
    isError: isInfiniteError,
    error: infiniteError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteSearchQuery(
    queryParam,
    searchTypes,
    isSpecificTypeSearch && queryParam.trim().length >= 2
  );

  // 검색 결과 및 상태 통합
  const searchResults = isSpecificTypeSearch
    ? undefined // 무한스크롤에서는 다른 방식으로 처리
    : basicSearchData;
  const isFetching = isSpecificTypeSearch
    ? isInfiniteFetching
    : isBasicFetching;
  const isError = isSpecificTypeSearch ? isInfiniteError : isBasicError;
  const error = isSpecificTypeSearch ? infiniteError : basicError;

  // 결과 처리
  const { allTracks, allArtists, allAlbums } = isSpecificTypeSearch
    ? processInfiniteSearchResults(infiniteSearchData?.pages || [])
    : processSearchResults(searchResults);

  // 전체 탭 디버깅용 로그
  if (!isSpecificTypeSearch && searchResults) {
    console.log("전체 탭 검색 결과:", {
      queryParam,
      rawResults: {
        artists: searchResults.artists?.data?.length || 0,
        albums: searchResults.albums?.data?.length || 0,
        songs: searchResults.songs?.data?.length || 0,
      },
      processedResults: {
        allArtists: allArtists.length,
        allAlbums: allAlbums.length,
        allTracks: allTracks.length,
      },
    });
  }

  // 디버깅용 로그 (무한스크롤 상태)
  if (isSpecificTypeSearch) {
    console.log("Infinite Search Debug:", {
      queryParam,
      searchTypes,
      isSpecificTypeSearch,
      pagesCount: infiniteSearchData?.pages?.length || 0,
      hasNextPage,
      isFetchingNextPage,
      totalResults: {
        allTracks: allTracks.length,
        allArtists: allArtists.length,
        allAlbums: allAlbums.length,
      },
    });
  }

  // 검색 결과가 있는지 확인
  const hasResults =
    allTracks.length > 0 || allArtists.length > 0 || allAlbums.length > 0;

  // 선택된 유형에 따라 표시할 결과 결정
  const shouldShowArtists = searchType === "all" || searchType === "artist";
  const shouldShowTracks = searchType === "all" || searchType === "track";
  const shouldShowAlbums = searchType === "all" || searchType === "album";

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

    router.push("/search");
  };

  // 인기 검색어 클릭
  const handlePopularSearchClick = (term: string) => {
    if (term !== searchTerm) {
      setSearchTerm(term);
      updateSearchParams(term);
    }
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
    if (type !== searchType) {
      setSearchType(type);
      updateSearchParams(searchTerm, type);
    }
  };

  // URL 쿼리 파라미터 변경 감지
  useEffect(() => {
    if (queryParam) {
      setSearchTerm(queryParam);
    } else {
      // 쿼리 파라미터가 없는 경우 검색어 초기화
      setSearchTerm("");
    }
    setSearchType(typeParam);
  }, [queryParam, typeParam]);

  // 페이지 로드 시 초기화 로직
  useEffect(() => {
    // URL에 검색어가 없는 경우 초기 상태로 리셋
    if (!queryParam || queryParam.trim() === "") {
      setSearchTerm("");
    }
  }, [queryParam]);

  // 검색어 변경 시 URL 업데이트 (디바운스 적용)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== queryParam) {
        updateSearchParams(searchTerm);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, queryParam, updateSearchParams]);

  return {
    // 상태
    searchTerm,
    searchType,
    scrollContainerRef,
    allTracks,
    allArtists,
    allAlbums,
    isFetching,
    isError,
    error,
    hasResults,

    // 선택 상태
    shouldShowArtists,
    shouldShowTracks,
    shouldShowAlbums,

    // 무한스크롤 관련
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSpecificTypeSearch,

    // 핸들러
    handleSearchChange,
    clearSearch,
    handlePopularSearchClick,
    handleSearchSubmit,
    handleTypeChange,

    // 유틸리티
    popularSearches,
  };
}
