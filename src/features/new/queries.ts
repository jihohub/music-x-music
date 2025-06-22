import { AppleMusicAlbum } from "@/types/apple-music";

/**
 * Apple Music 차트에서 인기 앨범을 가져오는 함수
 * @param limit 가져올 앨범 수 (기본값: 20)
 * @param offset 시작 오프셋 (기본값: 0)
 * @returns 인기 앨범 목록
 */
export async function getNewReleases(
  limit: number = 20,
  offset: number = 0
): Promise<AppleMusicAlbum[]> {
  try {
    // Apple Music 차트 API 사용 (인기 앨범)
    const response = await fetch(
      `/api/apple-music/catalog/us/charts?types=albums&limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error(`API 응답 오류: ${response.status}`);
    }

    const result = await response.json();

    // 차트 응답 구조에서 앨범 데이터 추출
    if (result.results?.albums?.[0]?.data) {
      console.log(
        `차트에서 앨범 ${result.results.albums[0].data.length}개를 성공적으로 가져왔습니다.`
      );
      return result.results.albums[0].data;
    }

    return [];
  } catch (error: any) {
    console.error(
      "차트 앨범 정보를 가져오는데 실패했습니다:",
      error.response?.data || error.message
    );
    throw error;
  }
}
