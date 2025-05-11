import {
  getTrendAlbums,
  getTrendArtists,
  getTrendTracks,
} from "@/features/trend/queries";
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 트렌드 아티스트 데이터를 가져오는 훅
 */
export function useTrendArtists() {
  return useQuery<SpotifyArtist[]>({
    queryKey: ["trendArtists"],
    queryFn: getTrendArtists,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
}

/**
 * 트렌드 트랙 데이터를 가져오는 훅
 */
export function useTrendTracks() {
  return useQuery<SpotifyTrack[]>({
    queryKey: ["trendTracks"],
    queryFn: getTrendTracks,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
}

/**
 * 트렌드 앨범 데이터를 가져오는 훅
 */
export function useTrendAlbums() {
  return useQuery<SpotifyAlbum[]>({
    queryKey: ["trendAlbums"],
    queryFn: getTrendAlbums,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
}
