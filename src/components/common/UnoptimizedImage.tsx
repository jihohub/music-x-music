"use client";

import Image, { ImageProps } from "next/image";
import { FC } from "react";

/**
 * unoptimized 옵션이 적용된 Image 컴포넌트
 * Next.js의 기본 이미지 최적화 대신 외부 이미지 최적화에 의존합니다.
 */
const UnoptimizedImage: FC<ImageProps> = (props) => {
  return <Image {...props} unoptimized />;
};

export default UnoptimizedImage;
