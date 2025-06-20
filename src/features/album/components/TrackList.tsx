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
      <div className="space-y-1">
        {tracks.map((track: AppleMusicTrack, index: number) => (
          <Link
            key={track.id}
            href={`/track/${track.id}`}
            className="flex items-center gap-3 p-2 hover:bg-gray-700/10 transition-colors group cursor-pointer rounded-md"
          >
            <div className="w-12 h-12 shrink-0">
              <UnoptimizedImage
                src={albumImage}
                alt={album.attributes.name}
                width={48}
                height={48}
                className="rounded-md"
              />
            </div>
            <div className="flex-grow min-w-0">
              <div className="font-medium hover:text-primary line-clamp-1 text-sm">
                {track.attributes.name}
              </div>
              <div className="text-text-secondary text-sm line-clamp-1 mt-0.5">
                {track.attributes.artistName}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
