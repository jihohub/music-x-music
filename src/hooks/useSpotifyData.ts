"use client";

import { getFeaturedArtists, getRecommendedTracks } from "@/features/music/api";
import { SpotifyArtist, SpotifyTrack } from "@/lib/spotify-api";
import { useQuery } from "@tanstack/react-query";

/**
 * 인기 아티스트 데이터를 가져오는 훅
 */
export function useFeaturedArtists() {
  return useQuery({
    queryKey: ["featuredArtists"],
    queryFn: getFeaturedArtists,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
}

/**
 * 추천 트랙 데이터를 가져오는 훅
 */
export function useRecommendedTracks() {
  return useQuery({
    queryKey: ["recommendedTracks"],
    queryFn: getRecommendedTracks,
    staleTime: 5 * 60 * 1000, // 5분 동안 캐시 유지
  });
}

/**
 * 특정 아티스트 정보를 찾는 함수
 */
export function findArtistById(
  artists: SpotifyArtist[],
  artistId: string
): SpotifyArtist | undefined {
  return artists.find((artist) => artist.id === artistId);
}

/**
 * 특정 트랙 정보를 찾는 함수
 */
export function findTrackById(
  tracks: SpotifyTrack[],
  trackId: string
): SpotifyTrack | undefined {
  return tracks.find((track) => track.id === trackId);
}
