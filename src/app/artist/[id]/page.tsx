"use client";

import Header from "@/components/Header";
import { ArtistPage } from "@/features/artist/components/ArtistPage";
import {
  getArtistAlbums,
  getArtistById,
  getArtistTopTracks,
} from "@/features/music/api";
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/lib/spotify-api";
import React, { useEffect, useState } from "react";

export default function ArtistPageContainer({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const artistId = resolvedParams.id;
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtistData() {
      try {
        setLoading(true);
        const [artistData, topTracksData, albumsData] = await Promise.all([
          getArtistById(artistId),
          getArtistTopTracks(artistId),
          getArtistAlbums(artistId),
        ]);

        setArtist(artistData);
        setTopTracks(topTracksData);
        setAlbums(albumsData);
        setError(null);
      } catch (err) {
        console.error("아티스트 정보를 가져오는데 실패했습니다:", err);
        setError("아티스트 정보를 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchArtistData();
  }, [artistId]);

  return (
    <>
      <Header title={artist?.name || ""} />
      <ArtistPage
        artist={artist as SpotifyArtist}
        topTracks={topTracks}
        albums={albums}
        isLoading={loading}
        error={error}
      />
    </>
  );
}
