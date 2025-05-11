import {
  TREND_ALBUM_IDS,
  TREND_ARTIST_IDS,
  TREND_TRACK_IDS,
} from "@/constants/spotify";
import { spotifyFetch } from "@/lib/spotify-api-client";
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/types/spotify";

/**
 * 좋아요 페이지에 표시할 아티스트 데이터를 가져오는 함수
 * (임시로 트렌드 페이지와 동일한 데이터를 사용)
 */
export async function getLikedArtists(): Promise<SpotifyArtist[]> {
  // 아티스트 ID 목록을 쉼표로 구분된 문자열로 변환
  const artistIds = TREND_ARTIST_IDS.join(",");
  const response = await spotifyFetch<{ artists: SpotifyArtist[] }>(
    `/artists?ids=${artistIds}`
  );
  return response.artists;
}

/**
 * 좋아요 페이지에 표시할 트랙 데이터를 가져오는 함수
 * (임시로 트렌드 페이지와 동일한 데이터를 사용)
 */
export async function getLikedTracks(): Promise<SpotifyTrack[]> {
  // 트랙 ID 목록을 쉼표로 구분된 문자열로 변환
  const trackIds = TREND_TRACK_IDS.join(",");
  const response = await spotifyFetch<{ tracks: SpotifyTrack[] }>(
    `/tracks?ids=${trackIds}`
  );
  return response.tracks;
}

/**
 * 좋아요 페이지에 표시할 앨범 데이터를 가져오는 함수
 * (임시로 트렌드 페이지와 동일한 데이터를 사용)
 */
export async function getLikedAlbums(): Promise<SpotifyAlbum[]> {
  // 앨범 ID 목록을 쉼표로 구분된 문자열로 변환
  const albumIds = TREND_ALBUM_IDS.join(",");
  const response = await spotifyFetch<{ albums: SpotifyAlbum[] }>(
    `/albums?ids=${albumIds}`
  );
  return response.albums;
}
