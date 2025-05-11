"use client";

import Header from "@/components/Header";
import { getArtistById, getTrackById } from "@/features/music/api";
import { TrackPage } from "@/features/track/components/TrackPage";
import { SpotifyArtist, SpotifyTrack } from "@/lib/spotify-api";
import React, { useEffect, useState } from "react";

export default function TrackPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const trackId = resolvedParams.id;
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  // 트랙 정보 가져오기
  useEffect(() => {
    async function fetchTrackData() {
      try {
        setLoading(true);
        const trackData = await getTrackById(trackId);
        setTrack(trackData);

        // 트랙의 모든 아티스트 정보 가져오기
        if (trackData.artists && trackData.artists.length > 0) {
          try {
            const artistPromises = trackData.artists.map((artist) =>
              getArtistById(artist.id)
            );
            const artistData = await Promise.all(artistPromises);
            setArtists(artistData);
          } catch (artistError) {
            console.error(
              "아티스트 정보를 가져오는데 실패했습니다:",
              artistError
            );
          }
        }

        setError(null);
      } catch (err) {
        console.error("트랙 정보를 가져오는데 실패했습니다:", err);
        setError("트랙 정보를 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchTrackData();
  }, [trackId]);

  return (
    <>
      <Header title={loading ? "트랙 로딩 중..." : track?.name || "트랙"} />
      <TrackPage
        track={track}
        artists={artists}
        isLoading={loading}
        error={error}
      />
    </>
  );
}
