"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { useAlbumTracks } from "@/features/album/queries";
import { AppleMusicAlbum, AppleMusicTrack } from "@/types/apple-music";
import Link from "next/link";
import { useParams } from "next/navigation";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-album.jpg";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface TrackListProps {
  album: AppleMusicAlbum;
}

export const TrackList = ({ album }: TrackListProps) => {
  const albumImage = getAppleMusicImageUrl(album.attributes.artwork, "sm");
  const params = useParams();
  const albumId = Array.isArray(params.id) ? params.id[0] : params.id;

  // 앨범 트랙을 React Query로 가져오기 - ID 기반
  const { data: tracksData = [], isLoading } = useAlbumTracks(albumId || "");

  // 앨범 객체 내의, API 응답으로 가져온 트랙 데이터 합치기 (둘 중 더 많은 데이터 사용)
  const tracks =
    album.relationships?.tracks?.data &&
    album.relationships.tracks.data.length > 0
      ? album.relationships.tracks.data // 앨범 객체 내 트랙 데이터 사용
      : tracksData; // API로 가져온 트랙 데이터 사용

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
          <div className="w-10 shrink-0"></div>
          <div className="flex-grow min-w-0">제목</div>
          <div className="hidden md:block w-1/4 min-w-0">아티스트</div>
          <div className="text-right w-10 shrink-0">시간</div>
        </div>
        {tracks.map((track: AppleMusicTrack, index: number) => (
          <Link
            key={track.id}
            href={`/track/${track.id}`}
            className="flex items-center gap-2 py-2 hover:bg-gray-700/10 transition-colors group cursor-pointer"
          >
            <div className="w-8 text-center text-text-secondary shrink-0">
              <span>{index + 1}</span>
            </div>
            <div className="w-10 h-10 shrink-0">
              <UnoptimizedImage
                src={albumImage}
                alt={album.attributes.name}
                width={40}
                height={40}
                className="rounded-md"
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="hover:text-primary line-clamp-2">
                {track.attributes.name}
              </div>
            </div>
            <div className="hidden md:block w-1/4 text-text-secondary line-clamp-1 min-w-0">
              {album.relationships?.artists?.data?.[0] ? (
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/artist/${album.relationships?.artists?.data?.[0]?.id}`;
                  }}
                  className="hover:text-primary cursor-pointer"
                >
                  {track.attributes.artistName}
                </span>
              ) : (
                <span className="text-text-secondary">
                  {track.attributes.artistName}
                </span>
              )}
            </div>
            <div className="text-right w-10 text-text-secondary shrink-0">
              {Math.floor(track.attributes.durationInMillis / 60000)}:
              {(Math.floor(track.attributes.durationInMillis / 1000) % 60)
                .toString()
                .padStart(2, "0")}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
