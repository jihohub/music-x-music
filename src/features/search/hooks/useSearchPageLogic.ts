import {
  SpotifyAlbum,
  SpotifyArtist,
  SpotifySearchResult,
  SpotifyTrack,
} from "@/types/spotify";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SearchType } from "../queries/searchSpotify";
import {
  useBasicSearchQuery,
  useInfiniteSearchQuery,
} from "../queries/useSearchQuery";

// 검색 결과 처리 함수
const processSearchResults = (
  searchResults:
    | SpotifySearchResult
    | InfiniteData<SpotifySearchResult>
    | undefined,
  isSpecificTypeSearch: boolean
) => {
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

  return { allTracks, allArtists, allAlbums };
};

// 인기 검색어 목록
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
  const [scrollPosition, setScrollPosition] = useState(0);

  // 한 번에 가져올 결과 수
  const PAGE_SIZE = 20;

  // 검색 타입에 따라 다른 쿼리 훅 사용
  const isSpecificTypeSearch = searchType !== "all";

  // 기본 검색 (타입이 'all'인 경우) - 무한 스크롤 없음
  const {
    data: basicSearchData,
    isLoading: isBasicLoading,
    isFetching: isBasicFetching,
    isError: isBasicError,
    error: basicError,
  } = useBasicSearchQuery({
    query: queryParam,
    enabled: !isSpecificTypeSearch && queryParam.trim().length >= 2,
    pageSize: PAGE_SIZE,
  });

  // 무한 스크롤 검색 (특정 타입 선택 시)
  const {
    data: infiniteSearchData,
    fetchNextPage,
    hasNextPage,
    isFetching: isInfiniteFetching,
    isFetchingNextPage,
    isError: isInfiniteError,
    error: infiniteError,
  } = useInfiniteSearchQuery({
    query: queryParam,
    type: typeParam,
    enabled: isSpecificTypeSearch && queryParam.trim().length >= 2,
    pageSize: PAGE_SIZE,
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

  // 결과 처리
  const { allTracks, allArtists, allAlbums } = processSearchResults(
    searchResults,
    isSpecificTypeSearch
  );

  // 스크롤 위치 저장 및 무한 스크롤 처리
  useEffect(() => {
    const handleScroll = () => {
      // 페이지를 로드하거나, 다음 페이지를 페칭할 때의 스크롤 위치를 저장
      if (scrollContainerRef.current && !isFetchingNextPage) {
        setScrollPosition(window.scrollY);

        // 무한 스크롤 처리
        if (isSpecificTypeSearch && hasNextPage && !isFetchingNextPage) {
          // 스크롤이 페이지 하단에 닿았는지 확인
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const scrollTop = window.scrollY;

          // 하단에서 10% 이내에 도달했을 때 다음 페이지 로드
          const scrollThreshold = 0.9;
          const reachedThreshold =
            scrollTop + windowHeight >= documentHeight * scrollThreshold;

          if (reachedThreshold) {
            console.log("스크롤 이벤트를 통한 다음 페이지 로드", {
              scrollTop,
              windowHeight,
              documentHeight,
              threshold: documentHeight * scrollThreshold,
            });

            fetchNextPage().catch((error) =>
              console.error("다음 페이지 로드 오류:", error)
            );
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isSpecificTypeSearch]);

  // 스크롤 위치 복원 - 페이지 전환 후에만 적용
  useEffect(() => {
    // 페이지 전환 후 한 번만 실행되도록 타이머 사용
    // 스크롤 위치가 0보다 크고, 로딩 중이 아닐 때만 복원
    if (scrollPosition > 0 && !isFetching && !isFetchingNextPage) {
      const timeoutId = setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: "auto", // smooth 대신 auto를 사용하여 즉시 스크롤
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [searchType, searchTerm, isFetching, isFetchingNextPage, scrollPosition]);

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

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  // 검색어 초기화
  const clearSearch = () => {
    setSearchTerm("");
    setScrollPosition(0);

    // React Query 캐시 초기화
    queryClient.removeQueries({ queryKey: ["search"] });
    queryClient.removeQueries({ queryKey: ["infiniteSearch"] });

    router.push("/search");
  };

  // 인기 검색어 클릭
  const handlePopularSearchClick = (term: string) => {
    if (term !== searchTerm) {
      setSearchTerm(term);
      setScrollPosition(0);
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
      // 검색 유형이 변경될 때는 스크롤 위치 초기화
      setScrollPosition(0);
      setSearchType(type);
      updateSearchParams(searchTerm, type);
    }
  };

  // 장르 클릭
  const handleGenreClick = (genre: string) => {
    setSearchTerm(genre);
    setScrollPosition(0);
    updateSearchParams(genre);
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
      setScrollPosition(0);
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

  // 검색 결과가 있는지 확인
  const hasResults =
    allTracks.length > 0 || allArtists.length > 0 || allAlbums.length > 0;

  // 선택된 유형에 따라 표시할 결과 결정
  const shouldShowArtists = searchType === "all" || searchType === "artist";
  const shouldShowTracks = searchType === "all" || searchType === "track";
  const shouldShowAlbums = searchType === "all" || searchType === "album";

  // 무한 스크롤 다음 페이지 로드 함수
  const handleFetchNextPage = useCallback(() => {
    if (!isFetchingNextPage && hasNextPage) {
      console.log("다음 페이지 로드 시작", {
        type: searchType,
        currentItems:
          searchType === "artist"
            ? allArtists.length
            : searchType === "track"
            ? allTracks.length
            : allAlbums.length,
      });

      fetchNextPage()
        .then(() => {
          console.log("다음 페이지 로드 완료");
        })
        .catch((error) => {
          console.error("다음 페이지 로드 오류:", error);
        });
    } else {
      console.log("다음 페이지 로드 조건 미충족", {
        isFetchingNextPage,
        hasNextPage,
      });
    }
  }, [
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    searchType,
    allArtists.length,
    allTracks.length,
    allAlbums.length,
  ]);

  return {
    // 상태
    searchTerm,
    searchType,
    scrollContainerRef,
    allTracks,
    allArtists,
    allAlbums,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
    hasResults,
    hasNextPage,

    // 선택 상태
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
    fetchNextPage: handleFetchNextPage,

    // 유틸리티
    popularSearches,
  };
}
