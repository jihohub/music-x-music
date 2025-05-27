"use client";

interface PopularSearchesProps {
  popularSearches: string[];
  onSearchClick: (term: string) => void;
}

export const PopularSearches = ({
  popularSearches,
  onSearchClick,
}: PopularSearchesProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">인기 검색어</h2>
      <div className="flex flex-wrap gap-2">
        {popularSearches.map((term, index) => (
          <button
            key={index}
            className="bg-card-bg px-4 py-2 rounded-full hover:bg-opacity-70 transition-colors"
            onClick={() => onSearchClick(term)}
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearches;
