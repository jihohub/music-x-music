"use client";

import { TrackPage } from "@/features/track/TrackPage";
import { useTrackById } from "@/features/track/queries";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // React Query 훅을 사용할 수 없으므로 별도 컴포넌트로 분리
  return <TrackPageWrapper id={id} />;
}

function TrackPageWrapper({ id }: { id: string }) {
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
