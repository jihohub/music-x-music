import { getNewReleases } from "@/features/new/queries";
import { SpotifyAlbum } from "@/types/spotify";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

/**
 * 새 앨범 릴리스 데이터를 가져오는 훅
 * @param limit 한 번에 가져올 앨범 수
 */
export function useNewReleases(limit: number = 20) {
  return useQuery<SpotifyAlbum[]>({
    queryKey: ["newReleases", limit],
    queryFn: () => getNewReleases(limit),
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
}

/**
 * 무한 스크롤을 지원하는 새 앨범 릴리스 데이터를 가져오는 훅
 * @param limit 한 번에 가져올 앨범 수
 */
export function useInfiniteNewReleases(limit: number = 20) {
  return useInfiniteQuery<SpotifyAlbum[]>({
    queryKey: ["infiniteNewReleases", limit],
    queryFn: async ({ pageParam = 0 }) => {
      return getNewReleases(limit, Number(pageParam));
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // 더 가져올 데이터가 있을 때만 다음 페이지 요청
      if (lastPage.length < limit) {
        return undefined;
      }

      // 실제 로드된 아이템 수 계산
      let loadedItemsCount = 0;
      allPages.forEach((page) => {
        loadedItemsCount += page.length;
      });

      return loadedItemsCount;
    },
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}
