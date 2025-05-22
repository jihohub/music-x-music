"use client";

import Header from "@/components/Header";
import { TrackPage } from "@/features/track/TrackPage";
import { useTrackById } from "@/features/track/queries";
import React from "react";

export default function TrackPageRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const trackId = resolvedParams.id;

  // React Query 훅을 사용하여 트랙 데이터 가져오기
  const {
    data: track,
    isLoading: isTrackLoading,
    error: trackError,
  } = useTrackById(trackId);

  // 로딩 및 에러 상태 처리
  const isLoading = isTrackLoading;
  const error = trackError ? "트랙 정보를 가져오는데 실패했습니다." : null;

  return (
    <>
      <Header title={isLoading ? "트랙 로딩 중..." : track?.name || "트랙"} />
      <TrackPage
        track={track || null}
        artists={track?.artists || []}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
