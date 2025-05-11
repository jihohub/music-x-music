"use client";

import { getFeaturedArtists } from "@/features/main/queries";
import { SpotifyArtist } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export const FeaturedArtists = () => {
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtists() {
      try {
        setLoading(true);
        const data = await getFeaturedArtists();
        setArtists(data);
        setError(null);
      } catch (err) {
        console.error("아티스트 정보를 가져오는데 실패했습니다:", err);
        setError("아티스트 정보를 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchArtists();
  }, []);

  return (
    <section>
      <div className="flex-between mb-4">
        <h2 className="text-xl font-bold">인기 아티스트</h2>
        {/* <Link href="/artists" className="text-primary text-sm font-medium">
          더보기
        </Link> */}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="group bg-card-bg rounded-lg overflow-hidden"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <div
                  className="absolute inset-0 animate-pulse"
                  style={{ backgroundColor: "var(--skeleton-bg)" }}
                />
              </div>
              <div className="h-[64px] p-3">
                <div
                  className="h-4 rounded w-3/4 mb-2 animate-pulse"
                  style={{ backgroundColor: "var(--skeleton-bg)" }}
                />
                <div
                  className="h-3 rounded w-1/2 animate-pulse"
                  style={{ backgroundColor: "var(--skeleton-bg)" }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-text-secondary py-8">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {artists.map((artist) => (
            <Link
              href={`/artist/${artist.id}`}
              key={artist.id}
              className="group bg-card-bg rounded-lg overflow-hidden hover:bg-gray-700/10 transition-colors"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={getSafeImageUrl(artist.images, "lg")}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">
                  {artist.name}
                </h3>
                <p className="text-text-secondary text-xs line-clamp-1 mt-1">
                  {artist.genres?.slice(0, 2).join(", ") || "아티스트"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedArtists;
