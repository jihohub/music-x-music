"use client";

import { AppleMusicArtist } from "@/types/apple-music";
import { IoMusicalNotesOutline } from "react-icons/io5";

interface ArtistInfoProps {
  artist: AppleMusicArtist;
}

export const ArtistInfo = ({ artist }: ArtistInfoProps) => {
  return (
    <section className="bg-card-bg rounded-lg py-5">
      <h2 className="text-lg font-bold mb-4">아티스트 정보</h2>
      <div className="space-y-3">
        {artist.attributes.genreNames &&
          artist.attributes.genreNames.length > 0 && (
            <div className="flex items-start gap-3">
              <IoMusicalNotesOutline className="text-primary mt-1" size={18} />
              <div>
                <h3 className="font-medium">장르</h3>
                <p className="text-text-secondary">
                  {/* 모바일에서는 첫 번째 장르만 표시 */}
                  <span className="md:hidden">
                    {artist.attributes.genreNames[0]}
                  </span>
                  {/* 데스크톱에서는 최대 3개 장르 표시 */}
                  <span className="hidden md:inline">
                    {artist.attributes.genreNames.slice(0, 3).join(", ")}
                  </span>
                </p>
              </div>
            </div>
          )}

        {/* Apple Music에는 follower 정보가 없으므로 제거 */}

        {/* Apple Music에는 popularity 정보가 없으므로 제거 */}
      </div>
    </section>
  );
};
