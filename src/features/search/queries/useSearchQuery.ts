import {
  searchAppleMusic,
  searchAppleMusicWithOffset,
} from "@/features/search/queries/searchAppleMusic";
import { AppleMusicSearchResult } from "@/types/apple-music";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

// 일반 검색 - Apple Music API 사용
export function useBasicSearchQuery(query: string, enabled: boolean = true) {
  return useQuery<AppleMusicSearchResult>({
    queryKey: ["search", query, "all"],
    queryFn: () => searchAppleMusic(query, "songs,albums,artists", 12), // limit 12로 변경
    staleTime: 5 * 60 * 1000, // 5분
    enabled: enabled && query.trim().length >= 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// 타입별 검색 - Apple Music API 사용
export function useSearchQuery(
  query: string,
  types: string = "songs,albums,artists"
) {
  return useQuery<AppleMusicSearchResult>({
    queryKey: ["search", query, types],
    queryFn: () => searchAppleMusic(query, types, 12), // limit 12로 변경
    enabled: !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// 무한스크롤 검색 - Apple Music API 사용
export function useInfiniteSearchQuery(
  query: string,
  types: string = "songs,albums,artists",
  enabled: boolean = true
) {
  return useInfiniteQuery({
    queryKey: ["infinite-search", query, types],
    queryFn: ({ pageParam = 0 }) =>
      searchAppleMusicWithOffset(query, types, pageParam, 12),
    getNextPageParam: (lastPage, allPages) => {
      // Apple Music API는 12개씩 페이지 제공
      const currentOffset = (allPages.length - 1) * 12;
      const nextOffset = currentOffset + 12;

      // 검색된 타입에 따라 결과 개수 확인
      let currentPageResults = 0;
      if (lastPage.artists?.data)
        currentPageResults += lastPage.artists.data.length;
      if (lastPage.albums?.data)
        currentPageResults += lastPage.albums.data.length;
      if (lastPage.songs?.data)
        currentPageResults += lastPage.songs.data.length;

      // 디버깅용 로그 - 개발 모드에서만
      if (process.env.NODE_ENV === "development") {
        console.log("getNextPageParam Debug:", {
          currentOffset,
          nextOffset,
          currentPageResults,
          hasNextPage: currentPageResults === 12,
          lastPageData: {
            artists: lastPage.artists?.data?.length || 0,
            albums: lastPage.albums?.data?.length || 0,
            songs: lastPage.songs?.data?.length || 0,
          },
        });
      }

      // 현재 페이지에서 12개 미만이면 더 이상 페이지가 없음
      return currentPageResults === 12 ? nextOffset : undefined;
    },
    initialPageParam: 0,
    enabled: enabled && !!query && query.trim().length > 0,
    staleTime: 1000 * 60 * 5, // 5분
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
