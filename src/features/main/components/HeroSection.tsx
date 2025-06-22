"use client";

export const HeroSection = () => {
  return (
    <div className="text-center">
      {/* 로고 아이콘 */}
      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 rounded-xl flex items-center justify-center mx-auto mb-8 border border-slate-200/50">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 32 32">
          <g stroke="#475569" strokeWidth="2.5" strokeLinecap="round">
            <line x1="10" y1="10" x2="22" y2="22" />
            <line x1="22" y1="10" x2="10" y2="22" />
          </g>
        </svg>
      </div>

      {/* 메인 텍스트 */}
      <h1 className="text-2xl md:text-3xl font-light text-white mb-3 tracking-wide">
        MUSIC X MUSIC
      </h1>
      <p className="text-white/60 text-base font-light max-w-md mx-auto">
        새로운 아티스트를 발견하고 좋아하는 음악을 탐색하세요
      </p>
    </div>
  );
};
