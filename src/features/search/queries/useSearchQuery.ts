import {
  SearchType,
  searchSpotify,
} from "@/features/search/queries/searchSpotify";
import { SpotifySearchResult } from "@/types/spotify";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

interface UseSearchQueryProps {
  query: string;
  type: SearchType;
  enabled?: boolean;
  pageSize?: number;
}

// 일반 검색 (타입이 'all'인 경우) - 무한 스크롤 없음
export function useBasicSearchQuery({
  query,
  enabled = true,
  pageSize = 20,
}: Omit<UseSearchQueryProps, "type">) {
  return useQuery<SpotifySearchResult, Error>({
    queryKey: ["search", query, "all"],
    queryFn: async () => {
      return searchSpotify(query, "all", 0, pageSize);
    },
    staleTime: 5 * 60 * 1000, // 5분
    enabled: enabled && query.trim().length >= 2,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// 무한 스크롤 검색 (타입이 'artist', 'track', 'album'인 경우)
export function useInfiniteSearchQuery({
  query,
  type,
  enabled = true,
  pageSize = 20,
}: UseSearchQueryProps) {
  return useInfiniteQuery<SpotifySearchResult, Error>({
    queryKey: ["infiniteSearch", query, type],
    queryFn: async ({ pageParam = 0 }) => {
      return searchSpotify(query, type, Number(pageParam), pageSize);
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 타입별 결과 가져오기
      let items: any[] = [];
      let total = 0;

      if (type === "track" && lastPage.tracks) {
        items = lastPage.tracks.items;
        total = lastPage.tracks.total;
      } else if (type === "artist" && lastPage.artists) {
        items = lastPage.artists.items;
        total = lastPage.artists.total;
      } else if (type === "album" && lastPage.albums) {
        items = lastPage.albums.items;
        total = lastPage.albums.total;
      }

      // 현재 페이지에 항목이 없으면 더 이상 로드하지 않음
      if (items.length === 0) {
        return undefined;
      }

      // 실제 로드된 아이템 수 계산 (빈 페이지가 있을 수 있으므로 실제 항목 수 계산)
      let loadedItemsCount = 0;
      allPages.forEach((page) => {
        if (type === "track" && page.tracks) {
          loadedItemsCount += page.tracks.items.length;
        } else if (type === "artist" && page.artists) {
          loadedItemsCount += page.artists.items.length;
        } else if (type === "album" && page.albums) {
          loadedItemsCount += page.albums.items.length;
        }
      });

      // 아직 로드할 항목이 있으면 다음 페이지 오프셋 반환
      if (loadedItemsCount < total) {
        // 다음 페이지의 오프셋은 현재까지 로드된 실제 항목 수
        return loadedItemsCount;
      }

      // 더 이상 로드할 항목이 없으면 undefined 반환
      return undefined;
    },
    enabled: enabled && query.trim().length >= 2 && type !== "all",
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
