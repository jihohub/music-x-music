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
    <div className="flex flex-wrap justify-center gap-3 p-4">
      {popularSearches.slice(0, 12).map((term, index) => (
        <button
          key={index}
          className="group relative px-4 py-2.5 rounded-2xl overflow-hidden
                     backdrop-blur-xl bg-gradient-to-br from-white/15 via-white/8 to-white/5
                     border border-white/25 hover:border-white/40
                     shadow-lg hover:shadow-xl
                     hover:scale-105 hover:-translate-y-0.5
                     transition-all duration-400 ease-out
                     hover:brightness-110"
          style={{
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.18) 0%, 
                rgba(255, 255, 255, 0.08) 50%, 
                rgba(255, 255, 255, 0.12) 100%
              ),
              linear-gradient(45deg, 
                rgba(255, 182, 193, 0.15) 0%, 
                rgba(221, 160, 221, 0.15) 25%, 
                rgba(173, 216, 230, 0.15) 50%, 
                rgba(255, 218, 185, 0.15) 75%, 
                rgba(240, 230, 140, 0.15) 100%
              )
            `,
            boxShadow: `
              0 8px 25px -8px rgba(0, 0, 0, 0.2),
              0 0 0 1px rgba(255, 255, 255, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.25),
              0 0 20px rgba(255, 255, 255, 0.08)
            `,
          }}
          onClick={() => onSearchClick(term)}
        >
          {/* 메인 글래스 레이어 */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.03] rounded-2xl"></div>

          {/* 상단 하이라이트 */}
          <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/15 to-transparent rounded-t-2xl"></div>

          {/* 호버 시 나타나는 파스텔 글로우 */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r 
                          from-pink-300/20 via-purple-300/20 via-blue-300/20 to-yellow-300/20 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-400
                          blur-sm"
          ></div>

          {/* 회전하는 파스텔 테두리 효과 */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-400"
            style={{
              background: `conic-gradient(from 0deg, 
                   rgba(255, 182, 193, 0.25) 0deg, 
                   rgba(221, 160, 221, 0.25) 90deg, 
                   rgba(173, 216, 230, 0.25) 180deg, 
                   rgba(255, 218, 185, 0.25) 270deg, 
                   rgba(255, 182, 193, 0.25) 360deg)`,
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              padding: "1px",
            }}
          ></div>

          {/* 텍스트 */}
          <span
            className="relative z-10 text-white font-medium text-xs tracking-wide
                           drop-shadow-md group-hover:drop-shadow-lg
                           transition-all duration-300"
          >
            {term}
          </span>

          {/* 내부 반짝임 효과 */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
                          bg-gradient-to-tr from-transparent via-white/8 to-transparent
                          transition-opacity duration-600"
          ></div>
        </button>
      ))}
    </div>
  );
};

export default PopularSearches;
