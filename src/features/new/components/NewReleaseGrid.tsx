"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { SpotifyAlbum } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import Link from "next/link";

interface NewReleaseGridProps {
  albums: SpotifyAlbum[];
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div
              className="aspect-square overflow-hidden rounded-sm bg-card-bg relative w-full"
              style={{ backgroundColor: "var(--skeleton-bg)" }}
            />
            <div className="mt-2.5">
              <div
                className="h-[1.125rem] rounded w-[85%]"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-[0.875rem] mt-1 rounded w-[65%]"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          </div>
        ))}
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
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {albums.map((album, index) => {
        // 무한 스크롤로 로드된 앨범의 경우 애니메이션 지연 줄이기
        const isNewlyLoaded = isInfiniteScrolled && index >= albums.length - 20;
        const delayValue = isNewlyLoaded
          ? Math.min(0.02 * (index % 20), 0.1)
          : 0;

        return (
          <div key={album.id}>
            <Link href={`/album/${album.id}`} className="group">
              <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getSafeImageUrl(album.images, "md")}
                  alt={album.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-2">
                <h3 className="font-semibold truncate">{album.name}</h3>
              </div>
              <p className="text-sm text-text-secondary truncate">
                {album.artists?.map((a) => a.name).join(", ")}
              </p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
