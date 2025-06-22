"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { AppleMusicAlbum } from "@/types/apple-music";
import Link from "next/link";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-album.jpg";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface NewReleaseGridProps {
  albums: AppleMusicAlbum[];
  isLoading?: boolean;
  error?: string | null;
}

export const NewReleaseGrid = ({
  albums,
  isLoading = false,
  error = null,
}: NewReleaseGridProps) => {
  if (isLoading) {
    return (
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
        <div className="h-[100vh] flex items-center justify-center"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
        <p className="mb-4">{error}</p>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  if (!albums || albums.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
        <p className="mb-4">신규 앨범이 없습니다</p>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // 스크롤 중에 로드된 앨범인지 확인하기 위한 계산
  // 첫 20개는 초기 로드로 간주하고, 나머지는 무한 스크롤로 로드된 것으로 간주
  const initialLoadCount = 20;
  const isInfiniteScrolled = albums.length > initialLoadCount;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {albums.map((album) => (
          <div key={album.id}>
            <Link href={`/album/${album.id}`} className="group">
              <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getAppleMusicImageUrl(album.attributes.artwork, "md")}
                  alt={album.attributes.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="text-sm font-semibold truncate mt-2">
                {album.attributes.name}
              </h3>
              <p className="text-sm text-text-secondary truncate">
                {album.attributes.artistName}
                {album.attributes.releaseDate && (
                  <span> • {album.attributes.releaseDate.split("-")[0]}</span>
                )}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
