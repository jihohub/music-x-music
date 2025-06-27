"use client";

import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { AppleMusicTrack } from "@/types/apple-music";
import {
  getAppleMusicImageSrcSet,
  getOptimizedAppleMusicImageUrl,
} from "@/utils/image";

interface RecommendedTracksProps {
  tracks: AppleMusicTrack[];
  isLoading: boolean;
}

export const RecommendedTracks = ({
  tracks,
  isLoading,
}: RecommendedTracksProps) => {
  const { playTrack } = useMusicPlayer();

  return (
    <section>
      <h2 className="text-xl font-bold mb-4 text-white">추천 트랙</h2>

      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-4 bg-white/5 rounded animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && tracks.length === 0 && (
        <div className="text-center text-white/60 py-8">
          추천 트랙을 불러올 수 없습니다
        </div>
      )}

      {!isLoading && tracks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {tracks.map((track, index) => (
            <div
              key={`recommended-track-${track.id}`}
              className="group relative"
            >
              <button
                onClick={() => {
                  playTrack(track);
                }}
                className="w-full text-left"
              >
                <div className="overflow-hidden rounded-2xl aspect-square relative bg-card-bg">
                  <img
                    src={getOptimizedAppleMusicImageUrl(
                      track.attributes.artwork,
                      {
                        containerWidth: 200, // 실제 렌더링 크기에 맞춤
                        useDevicePixelRatio: true,
                        maxSize: 640,
                      }
                    )}
                    srcSet={getAppleMusicImageSrcSet(track.attributes.artwork)}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16.66vw"
                    alt={track.attributes.name}
                    className="aspect-square rounded-2xl w-full h-full object-cover transition-opacity duration-300"
                    loading={index < 6 ? "eager" : "lazy"} // 첫 6개는 즉시 로드
                    style={{
                      contentVisibility: "auto",
                      containIntrinsicSize: "200px 200px",
                    }}
                  />
                </div>
              </button>

              <button
                onClick={() => {
                  playTrack(track);
                }}
                className="w-full text-left mt-2"
              >
                <h3 className="font-semibold text-sm truncate leading-tight text-white group-hover:text-white/80 transition-colors">
                  {track.attributes.name}
                </h3>
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default RecommendedTracks;
