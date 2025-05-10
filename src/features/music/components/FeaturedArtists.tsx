"use client";

import { getFeaturedArtists } from "@/features/music/api";
import { SpotifyArtist } from "@/lib/spotify-api";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function FeaturedArtists() {
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

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="group bg-card-bg rounded-lg overflow-hidden">
            <div className="relative aspect-square w-full overflow-hidden">
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            </div>
            <div className="h-[64px] p-3">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-text-secondary py-8">{error}</div>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {artists.map((artist) => (
        <Link
          href={`/artist/${artist.id}`}
          key={artist.id}
          className="group bg-card-bg rounded-lg overflow-hidden hover:bg-gray-700/10 transition-colors"
        >
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={artist.images?.[0]?.url || "https://via.placeholder.com/300"}
              alt={artist.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover transition-transform group-hover:scale-105"
            />
          </div>
          <div className="p-3">
            <h3 className="font-medium text-sm line-clamp-1">{artist.name}</h3>
            <p className="text-text-secondary text-xs line-clamp-1 mt-1">
              {artist.genres?.slice(0, 2).join(", ") || "아티스트"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
