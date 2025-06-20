"use client";

import PlayButton from "@/components/PlayButton";
import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import { AppleMusicTrack } from "@/types/apple-music";
import Link from "next/link";

// Apple Music 이미지 URL 생성 함수
function getAppleMusicImageUrl(
  artwork?: any,
  size: "sm" | "md" | "lg" = "md"
): string {
  if (!artwork?.url) {
    return "/images/placeholder-track.jpg";
  }

  const sizeMap = {
    sm: "300x300",
    md: "640x640",
    lg: "1200x1200",
  };

  return artwork.url.replace("{w}x{h}", sizeMap[size]);
}

interface TrackHeaderProps {
  track: AppleMusicTrack;
}

export const TrackHeader = ({ track }: TrackHeaderProps) => {
  // 이미지 URL 가져오기
  const albumImage = getAppleMusicImageUrl(track.attributes.artwork, "md");
  const bannerImage = getAppleMusicImageUrl(track.attributes.artwork, "lg");

  return (
    <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
        <UnoptimizedImage
          src={bannerImage}
          alt={track.attributes.albumName || "앨범 이미지"}
          fill
          sizes="100vw"
          className="object-cover -z-10 opacity-50"
          priority
        />
      </div>

      <div className="absolute bottom-0 left-0 right-0 container px-4 pb-6">
        <div className="flex items-end gap-6">
          <div
            className="relative overflow-hidden aspect-square rounded-sm"
            style={{
              width: "160px",
              height: "160px",
              minWidth: "160px",
              minHeight: "160px",
              maxWidth: "160px",
              maxHeight: "160px",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
            <div className="absolute inset-0">
              <UnoptimizedImage
                src={albumImage}
                alt={track.attributes.albumName || "앨범 이미지"}
                fill
                sizes="(max-width: 768px) 160px, 256px"
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 ring-1 ring-white/10" />
          </div>
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
                  {track.attributes.name}
                </h1>
                <div className="flex flex-wrap gap-2 mt-3">
                  {track.relationships?.artists?.data?.[0] ? (
                    <Link
                      href={`/artist/${track.relationships.artists.data[0].id}`}
                      className="text-sm sm:text-base md:text-lg hover:text-primary"
                    >
                      {track.attributes.artistName}
                    </Link>
                  ) : (
                    <span className="text-sm sm:text-base md:text-lg">
                      {track.attributes.artistName}
                    </span>
                  )}
                </div>
                {track.relationships?.albums?.data?.[0] ? (
                  <Link
                    href={`/album/${track.relationships.albums.data[0].id}`}
                    className="text-xs sm:text-sm md:text-md mt-2 hover:text-primary block"
                  >
                    {track.attributes.albumName}
                  </Link>
                ) : (
                  <span className="text-xs sm:text-sm md:text-md mt-2 block">
                    {track.attributes.albumName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <PlayButton
                  track={track}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
