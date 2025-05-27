"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { SpotifyAlbum } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import Link from "next/link";

interface AlbumResultsProps {
  albums: SpotifyAlbum[];
  showMoreLink?: boolean;
  onShowMore?: () => void;
}

export const AlbumResults = ({
  albums,
  showMoreLink = false,
  onShowMore,
}: AlbumResultsProps) => {
  if (albums.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">앨범</h2>
        {showMoreLink && (
          <Link
            href="/search?type=album"
            className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
            onClick={(e) => {
              if (onShowMore) {
                e.preventDefault();
                onShowMore();
              }
            }}
          >
            더 보기
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {albums.map((album) => (
          <Link href={`/album/${album.id}`} key={album.id} className="group">
            <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
              <UnoptimizedImage
                src={getSafeImageUrl(album.images, "md")}
                alt={album.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                className="object-cover"
              />
            </div>
            <div className="mt-2">
              <h3 className="font-semibold truncate">{album.name}</h3>
            </div>
            <p className="text-sm text-text-secondary truncate">
              {album.artists.map((a) => a.name).join(", ")}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlbumResults;
