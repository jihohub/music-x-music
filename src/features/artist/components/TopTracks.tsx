"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { SpotifyTrack } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import Link from "next/link";

interface TopTracksProps {
  tracks: SpotifyTrack[];
}

export const TopTracks = ({ tracks }: TopTracksProps) => {
  return (
    <section className="bg-card-bg rounded-lg py-5">
      <h2 className="text-lg font-bold mb-4">인기 트랙</h2>
      <div>
        <div className="flex items-center gap-2 py-2 text-text-secondary text-sm">
          <div className="w-8 text-center shrink-0">#</div>
          <div className="flex-grow min-w-0">제목</div>
          <div className="hidden md:block w-1/4 min-w-0">앨범</div>
          <div className="text-right w-10 shrink-0">시간</div>
        </div>
        {tracks.map((track, index) => (
          <div
            key={track.id}
            className="flex items-center gap-2 py-2 hover:bg-gray-700/10 transition-colors group"
          >
            <div className="w-8 text-center text-text-secondary shrink-0">
              <span>{index + 1}</span>
            </div>
            <div className="w-10 h-10 shrink-0">
              <UnoptimizedImage
                src={getSafeImageUrl(track.album?.images, "sm")}
                alt={track.album?.name || "앨범 이미지"}
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
            <div className="flex-grow min-w-0">
              <Link
                href={`/track/${track.id}`}
                className="hover:text-primary line-clamp-2"
              >
                {track.name}
              </Link>
            </div>
            <div className="hidden md:block w-1/4 min-w-0">
              <Link
                href={`/album/${track.album?.id}`}
                className="line-clamp-2 text-text-secondary hover:text-primary"
              >
                {track.album?.name}
              </Link>
            </div>
            <div className="text-text-secondary text-right w-10 shrink-0">
              {Math.floor(track.duration_ms / 60000)}:
              {((track.duration_ms % 60000) / 1000).toFixed(0).padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
