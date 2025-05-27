"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { SpotifyArtist } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import Link from "next/link";

interface ArtistGridProps {
  artists: SpotifyArtist[];
  limit?: number;
  showPreview?: boolean;
  onViewMore?: () => void;
}

export const ArtistGrid = ({
  artists,
  limit,
  showPreview = false,
  onViewMore,
}: ArtistGridProps) => {
  const displayArtists = limit ? artists.slice(0, limit) : artists;

  return (
    <div className="space-y-4">
      {showPreview && (
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">아티스트</h2>
          {onViewMore && (
            <Link
              href="/trend?type=artist"
              className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
              onClick={(e) => {
                if (onViewMore) {
                  e.preventDefault();
                  onViewMore();
                }
              }}
            >
              더 보기
            </Link>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {displayArtists.map((artist, index) => (
          <div key={artist.id}>
            <Link href={`/artist/${artist.id}`} className="group">
              <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                <UnoptimizedImage
                  src={getSafeImageUrl(artist.images, "md")}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  className="object-cover"
                />
              </div>
              <h3 className="mt-2 font-semibold truncate text-sm">
                {artist.name}
              </h3>
              <p className="text-sm text-text-secondary truncate">
                {artist.genres?.slice(0, 2).join(", ") || "아티스트"}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistGrid;
