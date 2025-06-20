"use client";

import Link from "next/link";

interface ArtistInfoProps {
  artists: { id?: string; name: string }[];
}

export const ArtistInfo = ({ artists }: ArtistInfoProps) => {
  if (artists.length === 0) return null;

  return (
    <section className="bg-card-bg rounded-lg py-5">
      <h2 className="text-lg font-bold mb-4">아티스트 정보</h2>
      <div className="space-y-3">
        {artists.map((artist, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="h-12 flex items-center">
              {artist.id ? (
                <Link
                  href={`/artist/${artist.id}`}
                  className="font-medium hover:text-primary"
                >
                  {artist.name}
                </Link>
              ) : (
                <span className="font-medium">{artist.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
