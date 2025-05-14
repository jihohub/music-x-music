"use client";

import { SpotifyBadge } from "@/components/SpotifyBadge";
import { useNewReleases } from "@/hooks/useNewReleases";
import { NewReleaseGrid } from "./components/NewReleaseGrid";

export function NewPage() {
  // 기본 신규 릴리스 (최대 20개)
  const { data: newReleases, isLoading, error } = useNewReleases(20);

  if (isLoading) {
    return (
      <div className="py-6 px-4">
        <NewReleaseGrid albums={[]} isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-6 px-4">
        <NewReleaseGrid
          albums={[]}
          error="새 앨범 정보를 가져오는데 실패했습니다."
        />
      </div>
    );
  }

  return (
    <div className="py-6 px-4 space-y-6">
      <div className="space-y-6">
        {newReleases && (
          <>
            <NewReleaseGrid albums={newReleases} />
            <div className="flex justify-center mt-8">
              <SpotifyBadge href="https://open.spotify.com/genre/new-releases-page" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
