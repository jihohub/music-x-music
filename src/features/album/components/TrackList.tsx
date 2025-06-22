"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { useAlbumTracks } from "@/features/album/queries";
import { useMusicPlayer } from "@/providers/MusicPlayerProvider";
import { AppleMusicAlbum, AppleMusicTrack } from "@/types/apple-music";
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
  textColor1?: string;
  textColor2?: string;
}

export const TrackList = ({
  album,
  textColor1 = "#ffffff",
  textColor2 = "#ffffff",
}: TrackListProps) => {
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

  const { playTrack } = useMusicPlayer();

  if (isLoading && tracks.length === 0) {
    return (
      <div className="p-4 text-center" style={{ color: textColor2 }}>
        트랙 로딩 중...
      </div>
    );
  }

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="space-y-4">
        {tracks.map((track: AppleMusicTrack, index: number) => (
          <div
            key={`album-track-${track.id}`}
            className="group flex items-center gap-3 rounded-lg hover:bg-white/5 transition-colors"
          >
            <button
              onClick={() => {
                playTrack(track);
              }}
              className="relative w-12 h-12 rounded-2xl overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0"
            >
              <div className="w-12 h-12 shrink-0">
                <UnoptimizedImage
                  src={albumImage}
                  alt={album.attributes.name}
                  width={48}
                  height={48}
                  className="rounded-2xl"
                />
              </div>
            </button>
            <button
              onClick={() => {
                playTrack(track);
              }}
              className="flex-1 min-w-0 text-left"
            >
              <h3
                className="font-medium text-sm truncate group-hover:opacity-80 transition-colors"
                style={{ color: textColor1 }}
              >
                {track.attributes.name}
              </h3>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
