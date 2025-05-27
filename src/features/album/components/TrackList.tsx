"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { useAlbumTracks } from "@/features/album/queries";
import { SpotifyAlbum, SpotifyTrack } from "@/types/spotify";
import { getSafeImageUrl } from "@/utils/image";
import Link from "next/link";

interface TrackListProps {
  album: SpotifyAlbum;
}

export const TrackList = ({ album }: TrackListProps) => {
  const albumImage = getSafeImageUrl(album.images, "sm");

  // 앨범 트랙을 React Query로 가져오기 - 앨범 내 트랙이 있으면 해당 데이터를 우선 사용
  const { data: tracksData, isLoading } = useAlbumTracks(album.id, 50);

  // 앨범 객체 내의, API 응답으로 가져온 트랙 데이터 합치기 (둘 중 더 많은 데이터 사용)
  const tracks =
    album.tracks?.items && album.tracks.items.length > 0
      ? album.tracks.items // 앨범 객체 내 트랙 데이터 사용
      : tracksData?.items || []; // API로 가져온 트랙 데이터 사용

  if (isLoading && tracks.length === 0) {
    return (
      <section className="bg-card-bg rounded-lg py-5">
        <h2 className="text-lg font-bold mb-4">트랙 목록</h2>
        <div className="p-4 text-center text-text-secondary">
          트랙 로딩 중...
        </div>
      </section>
    );
  }

  return (
    <section className="bg-card-bg rounded-lg py-5">
      <h2 className="text-lg font-bold mb-4">트랙 목록</h2>
      <div>
        <div className="flex items-center gap-2 py-2 text-text-secondary text-sm">
          <div className="w-8 text-center shrink-0">#</div>
          <div className="flex-grow min-w-0">제목</div>
          <div className="hidden md:block w-1/4 min-w-0">아티스트</div>
          <div className="text-right w-10 shrink-0">시간</div>
        </div>
        {tracks.map((track: SpotifyTrack, index: number) => (
          <div
            key={track.id}
            className="flex items-center gap-2 py-2 hover:bg-gray-700/10 transition-colors group"
          >
            <div className="w-8 text-center text-text-secondary shrink-0">
              <span>{index + 1}</span>
            </div>
            <div className="w-10 h-10 shrink-0">
              <UnoptimizedImage
                src={albumImage}
                alt={album.name}
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
            <div className="hidden md:block w-1/4 text-text-secondary line-clamp-1 min-w-0">
              {track.artists.map((artist, idx) => (
                <span key={artist.id}>
                  <Link
                    href={`/artist/${artist.id}`}
                    className="hover:text-primary"
                  >
                    {artist.name}
                  </Link>
                  {idx < track.artists.length - 1 && ", "}
                </span>
              ))}
            </div>
            <div className="text-right w-10 text-text-secondary shrink-0">
              {Math.floor(track.duration_ms / 60000)}:
              {(Math.floor(track.duration_ms / 1000) % 60)
                .toString()
                .padStart(2, "0")}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
