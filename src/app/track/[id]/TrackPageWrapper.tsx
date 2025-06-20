"use client";

import { TrackPage } from "@/features/track/TrackPage";
import { useTrackById } from "@/features/track/queries";

export function TrackPageWrapper({ id }: { id: string }) {
  const { data: track, isLoading, error } = useTrackById(id);

  // artists 정보는 track에서 추출
  const artists = track ? [{ name: track.attributes.artistName }] : [];

  return (
    <TrackPage
      track={track || null}
      artists={artists}
      isLoading={isLoading}
      error={error?.message || null}
    />
  );
}
