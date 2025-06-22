"use client";

import Link from "next/link";

// 미니멀한 장르 데이터
const genres = [
  { id: "pop", name: "Pop", gradient: "from-slate-600/60 to-slate-700/60" },
  {
    id: "hiphop",
    name: "Hip Hop",
    gradient: "from-slate-600/60 to-slate-700/60",
  },
  { id: "kpop", name: "K-Pop", gradient: "from-slate-600/60 to-slate-700/60" },
  { id: "rnb", name: "R&B", gradient: "from-slate-600/60 to-slate-700/60" },
  { id: "indie", name: "Indie", gradient: "from-slate-600/60 to-slate-700/60" },
  { id: "rock", name: "Rock", gradient: "from-slate-600/60 to-slate-700/60" },
  {
    id: "electronic",
    name: "Electronic",
    gradient: "from-slate-600/60 to-slate-700/60",
  },
  {
    id: "classical",
    name: "Classical",
    gradient: "from-slate-600/60 to-slate-700/60",
  },
];

export const GenreSection = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {genres.map((genre) => (
        <Link
          href={`/search?q=${encodeURIComponent(genre.name)}`}
          key={genre.id}
          className={`backdrop-blur-sm bg-gradient-to-br ${genre.gradient} border border-white/10 rounded-xl p-4 h-20 flex items-center justify-center hover:bg-white/10 transition-all duration-200 group`}
        >
          <span className="text-white font-medium text-sm text-center">
            {genre.name}
          </span>
        </Link>
      ))}
    </div>
  );
};
