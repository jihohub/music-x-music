"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface UnoptimizedImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

/**
 * unoptimized 옵션이 적용된 Image 컴포넌트
 * Next.js의 기본 이미지 최적화 대신 외부 이미지 최적화에 의존합니다.
 */
export const UnoptimizedImage = ({
  src,
  alt,
  fallbackSrc,
  className,
  ...props
}: UnoptimizedImageProps) => {
  const [imgSrc, setImgSrc] = useState<string>(src as string);
  const [isError, setIsError] = useState(false);

  const handleError = () => {
    if (!isError && fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
    setIsError(true);
  };

  // null이나 undefined인 경우 기본 이미지 사용
  if (!imgSrc) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 ${className}`}
      >
        <span className="text-gray-400 text-xs">이미지 없음</span>
      </div>
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt || ""}
      className={className}
      unoptimized={true}
      onError={handleError}
      {...props}
    />
  );
};

export default UnoptimizedImage;
