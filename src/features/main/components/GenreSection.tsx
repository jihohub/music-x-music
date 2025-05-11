"use client";

import Link from "next/link";
import React from "react";

// 장르 데이터
const genres = [
  { id: "pop", name: "팝", color: "#E8115B" },
  { id: "hiphop", name: "힙합", color: "#F230AA" },
  { id: "kpop", name: "케이팝", color: "#1DB954" },
  { id: "rnb", name: "R&B", color: "#BA5DE8" },
  { id: "indie", name: "인디", color: "#148A08" },
  { id: "rock", name: "록", color: "#BC5900" },
  { id: "electronic", name: "일렉트로닉", color: "#509BF5" },
  { id: "classical", name: "클래식", color: "#7D4B32" },
];

export const GenreSection: React.FC = () => {
  return (
    <section>
      <div className="flex-between mb-4">
        <h2 className="text-xl font-bold">장르</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {genres.map((genre) => (
          <Link
            href={`/genre/${genre.id}`}
            key={genre.id}
            className="rounded-md p-4 h-24 flex items-center justify-center"
            style={{ backgroundColor: genre.color }}
          >
            <span className="text-white font-bold text-lg">{genre.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
