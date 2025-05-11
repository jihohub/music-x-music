"use client";

import React from "react";
import FeaturedArtists from "./FeaturedArtists";

export const FeaturedArtistsSection: React.FC = () => {
  return (
    <section>
      <div className="flex-between mb-4">
        <h2 className="text-xl font-bold">인기 아티스트</h2>
        {/* <Link href="/artists" className="text-primary text-sm font-medium">
          더보기
        </Link> */}
      </div>
      <FeaturedArtists />
    </section>
  );
};
