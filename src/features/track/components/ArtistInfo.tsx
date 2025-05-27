"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { SpotifyArtist } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import Link from "next/link";

interface ArtistInfoProps {
  artists: SpotifyArtist[];
}

export const ArtistInfo = ({ artists }: ArtistInfoProps) => {
  if (artists.length === 0) return null;

  return (
    <section className="bg-card-bg rounded-lg py-5">
      <h2 className="text-lg font-bold mb-4">아티스트 정보</h2>
      <div className="space-y-3">
        {artists.map((artist) => (
          <div key={artist.id} className="flex items-center gap-3">
            <Link
              href={`/artist/${artist.id}`}
              className="block relative w-12 h-12 rounded-sm overflow-hidden flex-shrink-0"
              style={{ borderRadius: "4px" }}
            >
              <UnoptimizedImage
                src={getSafeImageUrl(artist.images, "sm")}
                alt={artist.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </Link>
            <div className="h-12 flex items-center">
              <Link
                href={`/artist/${artist.id}`}
                className="font-medium hover:text-primary"
              >
                {artist.name}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
