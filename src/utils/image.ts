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

// Apple Music 이미지 최적화 유틸리티

interface ImageSizeOptions {
  /** 컨테이너 너비 (px) */
  containerWidth?: number;
  /** 디바이스 픽셀 비율 고려 여부 */
  useDevicePixelRatio?: boolean;
  /** 최대 이미지 크기 제한 */
  maxSize?: number;
}

/**
 * Apple Music API 이미지 URL을 최적화된 사이즈로 생성
 * 컨테이너 크기와 디바이스 픽셀 비율을 고려하여 적절한 이미지 사이즈 결정
 */
export function getOptimizedAppleMusicImageUrl(
  artwork?: any,
  options: ImageSizeOptions = {}
): string {
  if (!artwork?.url) {
    return "/images/placeholder.jpg";
  }

  const {
    containerWidth = 300,
    useDevicePixelRatio = true,
    maxSize = 1200,
  } = options;

  // 디바이스 픽셀 비율 고려
  const devicePixelRatio = useDevicePixelRatio
    ? typeof window !== "undefined"
      ? window.devicePixelRatio || 1
      : 1
    : 1;

  // 필요한 실제 이미지 크기 계산
  let targetSize = Math.ceil(containerWidth * devicePixelRatio);

  // 최대 크기 제한
  targetSize = Math.min(targetSize, maxSize);

  // Apple Music API는 특정 사이즈들을 지원하므로 가장 가까운 크기로 반올림
  const supportedSizes = [
    100, 200, 300, 400, 500, 600, 640, 800, 1000, 1200, 1400, 1600,
  ];
  const optimalSize =
    supportedSizes.find((size) => size >= targetSize) ||
    supportedSizes[supportedSizes.length - 1];

  return artwork.url.replace("{w}x{h}", `${optimalSize}x${optimalSize}`);
}

/**
 * 반응형 srcSet 생성 (여러 해상도 지원)
 */
export function getAppleMusicImageSrcSet(artwork?: any): string {
  if (!artwork?.url) return "";

  const sizes = [300, 640, 1200];
  return sizes
    .map(
      (size) => `${artwork.url.replace("{w}x{h}", `${size}x${size}`)} ${size}w`
    )
    .join(", ");
}

/**
 * 레거시 사이즈 매핑 (기존 코드 호환성)
 */
export function getAppleMusicImageUrl(
  artwork?: any,
  size: "xs" | "sm" | "md" | "lg" | "xl" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder.jpg";
  }

  const sizeMap = {
    xs: "100x100", // 아주 작은 썸네일
    sm: "300x300", // 작은 썸네일
    md: "640x640", // 일반 표시용
    lg: "1200x1200", // 고해상도
    xl: "1600x1600", // 최고해상도
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}
