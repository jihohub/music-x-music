import {
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_LG,
  DEFAULT_IMAGE_SM,
} from "@/constants/images";

/**
 * 이미지 URL을 안전하게 가져오는 함수
 * URL이 유효하지 않으면 기본 플레이스홀더를 반환합니다
 *
 * @param images 이미지 배열 (Spotify API 응답 형식)
 * @param size 이미지 크기 ('sm' | 'md' | 'lg')
 * @returns 이미지 URL
 */
export function getSafeImageUrl(
  images?: { url: string; width?: number; height?: number }[] | null,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!images || images.length === 0) {
    // 크기에 따라 적절한 플레이스홀더 반환
    switch (size) {
      case "sm":
        return DEFAULT_IMAGE_SM;
      case "lg":
        return DEFAULT_IMAGE_LG;
      default:
        return DEFAULT_IMAGE;
    }
  }

  // 적절한 크기의 이미지 선택
  let imageUrl: string;

  if (size === "sm" && images.length > 2) {
    // 작은 크기는 마지막 이미지 (보통 가장 작은 이미지)
    imageUrl = images[images.length - 1].url;
  } else if (size === "lg" && images.length > 1) {
    // 큰 크기는 첫 번째 이미지 (보통 가장 큰 이미지)
    imageUrl = images[0].url;
  } else {
    // 그 외에는 중간 또는 가용한 이미지
    const index = Math.min(1, images.length - 1);
    imageUrl = images[index].url;
  }

  return imageUrl;
}
