"use client";

interface AlbumSkeletonProps {
  bgColor?: string;
  textColor?: string;
}

export const AlbumSkeleton = ({
  bgColor = "#0f0f10",
  textColor = "#ffffff",
}: AlbumSkeletonProps) => {
  return (
    <div
      className="min-h-screen pb-32 md:pb-8 transition-colors duration-500"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="md:pt-16">
          {/* 헤더 영역 - 실제와 동일한 구조 */}
          <section className="px-4 pt-8" style={{ backgroundColor: bgColor }}>
            <div className="relative mx-auto">
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl animate-pulse">
                {/* 실제와 동일한 내부 구조 - 높이 확보용 */}
                <div className="flex items-center gap-6 md:gap-8">
                  {/* 이미지 영역 */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 md:w-32 md:h-32 rounded-2xl"></div>
                  </div>

                  {/* 텍스트 정보 영역 */}
                  <div className="flex-1 min-w-0">
                    <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 leading-tight">
                      &nbsp;
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 text-sm font-medium rounded-full">
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="px-4">
          {/* 탭 영역 - 실제와 동일한 구조 */}
          <div className="mt-2 mb-6 flex justify-center">
            <div className="relative">
              <div
                className="absolute inset-0 backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-black/15 border border-white/10 shadow-2xl rounded-full animate-pulse"
                style={{
                  boxShadow:
                    "0 20px 40px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-black/15 rounded-full"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-white/5 rounded-full"></div>
              </div>

              <div className="relative px-2.5 py-1.5">
                <div className="flex gap-1">
                  <span className="relative py-1 px-2 font-medium text-xs opacity-0">
                    트랙
                  </span>
                  <span className="relative py-1 px-2 font-medium text-xs opacity-0">
                    정보
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 리스트 영역 - 큰 글래스모피즘 컨테이너만 */}
          <div className="mt-4">
            <div
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 shadow-2xl animate-pulse"
              style={{ minHeight: "400px" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};
