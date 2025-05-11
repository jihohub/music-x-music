import { SpotifyTrack } from "@/types/spotify";
import { spotifyFetch } from "@/lib/spotify-api-client";

/**
 * 트랙 ID로 트랙 정보를 가져오는 함수
 */
export async function getTrackById(id: string): Promise<SpotifyTrack> {
  try {
    const track = await spotifyFetch<SpotifyTrack>(`/tracks/${id}`);
    console.log(`트랙 정보를 성공적으로 가져왔습니다: ${track.name}`);
    return track;
  } catch (error: any) {
    console.error(
      `트랙 ID: ${id}의 정보를 가져오는데 실패했습니다:`,
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 트랙 분석 정보 가져오기
 */
export async function getTrackAnalysis(id: string): Promise<any> {
  try {
    const analysis = await spotifyFetch<any>(`/audio-analysis/${id}`);
    console.log(`트랙 ${id}의 분석 정보를 성공적으로 가져왔습니다.`);
    return analysis;
  } catch (error: any) {
    console.error(
      "트랙 분석 정보를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * 트랙 특성 정보 가져오기
 */
export async function getTrackFeatures(id: string): Promise<any> {
  try {
    const features = await spotifyFetch<any>(`/audio-features/${id}`);
    console.log(`트랙 ${id}의 특성 정보를 성공적으로 가져왔습니다.`);
    return features;
  } catch (error: any) {
    console.error(
      "트랙 특성 정보를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
