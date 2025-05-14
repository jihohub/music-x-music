import { getNewReleases } from "@/features/new/queries";
import { SpotifyAlbum } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

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
