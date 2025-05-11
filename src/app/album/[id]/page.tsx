"use client";

import Header from "@/components/Header";
import { AlbumPage } from "@/features/album/AlbumPage";
import { getAlbumById } from "@/features/album/queries";
import { getArtistById } from "@/features/artist/queries";
import { SpotifyAlbum, SpotifyArtist } from "@/types/spotify";
import React, { useEffect, useState } from "react";

export default function AlbumPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const albumId = resolvedParams.id;
  const [album, setAlbum] = useState<SpotifyAlbum | null>(null);
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function fetchAlbumData() {
      try {
        setLoading(true);
        const albumData = await getAlbumById(albumId);
        setAlbum(albumData);

        // 앨범의 첫 번째 아티스트 정보 가져오기
        if (albumData.artists && albumData.artists.length > 0) {
          try {
            const artistData = await getArtistById(albumData.artists[0].id);
            setArtist(artistData);
          } catch (artistError) {
            console.error(
              "아티스트 정보를 가져오는데 실패했습니다:",
              artistError
            );
          }
        }

        setError(null);
      } catch (err) {
        console.error("앨범 정보를 가져오는데 실패했습니다:", err);
        setError("앨범 정보를 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumData();
  }, [albumId]);

  return (
    <>
      <Header title={loading ? "앨범 로딩 중..." : album?.name || "앨범"} />
      <AlbumPage album={album} isLoading={loading} error={error} />
    </>
  );
}
