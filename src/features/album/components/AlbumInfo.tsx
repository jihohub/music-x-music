"use client";

import { AppleMusicAlbum } from "@/types/apple-music";
import {
  IoCalendarOutline,
  IoMusicalNotesOutline,
  IoTimeOutline,
} from "react-icons/io5";

interface AlbumInfoProps {
  album: AppleMusicAlbum;
  textColor1?: string;
  textColor2?: string;
}

export const AlbumInfo = ({
  album,
  textColor1 = "#ffffff",
  textColor2 = "#ffffff",
}: AlbumInfoProps) => {
  const totalDuration = Math.floor(
    (album.relationships?.tracks?.data?.reduce(
      (acc, track) => acc + track.attributes.durationInMillis,
      0
    ) || 0) / 60000
  );

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl">
      <div className="space-y-6">
        {/* 릴리즈 정보 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
            <IoCalendarOutline className="text-primary" size={18} />
          </div>
          <div className="flex-1">
            <p
              className="text-xs uppercase tracking-wide font-medium opacity-60 mb-1"
              style={{ color: textColor2 }}
            >
              릴리즈
            </p>
            <p className="font-medium text-lg" style={{ color: textColor1 }}>
              {album.attributes.releaseDate}
            </p>
          </div>
        </div>

        {/* 구분선 */}
        <div className="h-px bg-white/10"></div>

        {/* 트랙 수 정보 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
            <IoMusicalNotesOutline className="text-primary" size={18} />
          </div>
          <div className="flex-1">
            <p
              className="text-xs uppercase tracking-wide font-medium opacity-60 mb-1"
              style={{ color: textColor2 }}
            >
              트랙 수
            </p>
            <p className="font-medium text-lg" style={{ color: textColor1 }}>
              {album.attributes.trackCount}곡
            </p>
          </div>
        </div>

        {/* 총 재생 시간 정보 */}
        {totalDuration > 0 && (
          <>
            {/* 구분선 */}
            <div className="h-px bg-white/10"></div>

            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
                <IoTimeOutline className="text-primary" size={18} />
              </div>
              <div className="flex-1">
                <p
                  className="text-xs uppercase tracking-wide font-medium opacity-60 mb-1"
                  style={{ color: textColor2 }}
                >
                  총 재생 시간
                </p>
                <p
                  className="font-medium text-lg"
                  style={{ color: textColor1 }}
                >
                  {totalDuration}분
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
