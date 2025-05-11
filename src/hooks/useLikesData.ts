import {
  getLikedAlbums,
  getLikedArtists,
  getLikedTracks,
} from "@/features/likes/queries";
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";
import { useQuery } from "@tanstack/react-query";

/**
 * 좋아요한 아티스트 데이터를 가져오는 훅
 */
export function useLikedArtists() {
  return useQuery<SpotifyArtist[]>({
    queryKey: ["likedArtists"],
    queryFn: getLikedArtists,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
}

/**
 * 좋아요한 트랙 데이터를 가져오는 훅
 */
export function useLikedTracks() {
  return useQuery<SpotifyTrack[]>({
    queryKey: ["likedTracks"],
    queryFn: getLikedTracks,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
}

/**
 * 좋아요한 앨범 데이터를 가져오는 훅
 */
export function useLikedAlbums() {
  return useQuery<SpotifyAlbum[]>({
    queryKey: ["likedAlbums"],
    queryFn: getLikedAlbums,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
}
