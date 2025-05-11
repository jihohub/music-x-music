import { spotifyFetch } from "@/lib/spotify-api-client";

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
