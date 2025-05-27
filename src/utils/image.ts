import {
  DEFAULT_IMAGE,
  DEFAULT_IMAGE_LG,
  DEFAULT_IMAGE_SM,
} from "@/constants/images";

/**
 * 이미지 URL을 안전하게 가져오는 함수
 * URL이 유효하지 않으면 기본 플레이스홀더를 반환합니다
 * 스포티파이 이미지 객체 배열에서 적절한 크기의 이미지를 선택합니다
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

  // 이미지 크기 정렬 (너비 기준 내림차순)
  const sortedImages = [...images].sort((a, b) => {
    const widthA = a.width || 0;
    const widthB = b.width || 0;
    return widthB - widthA;
  });

  // 크기별 이미지 선택
  if (size === "sm") {
    // 작은 크기: 너비가 200 이하인 가장 큰 이미지 또는 가장 작은 이미지 선택
    const smallImage = sortedImages.find((img) => (img.width || 0) <= 200);
    return smallImage
      ? smallImage.url
      : sortedImages[sortedImages.length - 1].url;
  } else if (size === "lg") {
    // 큰 크기: 가장 큰 이미지 선택
    return sortedImages[0].url;
  } else {
    // 중간 크기: 너비가 300~500 사이인 이미지 또는 중간 크기의 이미지 선택
    const mediumImage = sortedImages.find((img) => {
      const width = img.width || 0;
      return width >= 300 && width <= 500;
    });

    if (mediumImage) {
      return mediumImage.url;
    }

    // 중간 크기가 없으면 배열 중간 요소 선택
    const middleIndex = Math.floor(sortedImages.length / 2);
    return sortedImages[middleIndex].url;
  }
}
