"use client";

import { motion } from "framer-motion";

interface GenreBrowserProps {
  onGenreClick: (genre: string) => void;
}

export const GenreBrowser = ({ onGenreClick }: GenreBrowserProps) => {
  const genres = [
    { id: "kpop", name: "케이팝", color: "from-green-400 to-green-600" },
    { id: "pop", name: "팝", color: "from-pink-400 to-pink-600" },
    { id: "hiphop", name: "힙합", color: "from-purple-400 to-purple-600" },
    { id: "rnb", name: "R&B", color: "from-blue-400 to-blue-600" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <h2 className="text-xl font-bold mb-4">장르 및 분위기</h2>
      <div className="grid grid-cols-2 gap-3">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className={`rounded-lg p-4 h-24 flex items-center justify-center bg-gradient-to-r ${genre.color} cursor-pointer hover:shadow-lg transition-shadow`}
            onClick={() => onGenreClick(genre.name)}
          >
            <span className="text-white font-bold text-lg">{genre.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default GenreBrowser;
