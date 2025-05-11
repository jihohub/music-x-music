"use client";

import React from "react";
import RecommendedTracks from "./RecommendedTracks";

export const RecommendedTracksSection: React.FC = () => {
  return (
    <section>
      <div className="flex-between mb-4">
        <h2 className="text-xl font-bold">추천 트랙</h2>
        {/* <Link href="/tracks" className="text-primary text-sm font-medium">
          더보기
        </Link> */}
      </div>
      <RecommendedTracks />
    </section>
  );
};
