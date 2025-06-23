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
          {/* 새로운 헤더 스켈레톤 */}
          <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden animate-pulse">
            {/* 블러된 배경 스켈레톤 */}
            <div className="absolute inset-0 bg-gray-300 opacity-30"></div>

            {/* 블러 효과 */}
            <div className="absolute inset-0 backdrop-blur-3xl bg-white/5"></div>

            {/* 본 이미지 영역 스켈레톤 */}
            <div
              className="absolute left-0 right-0 top-20 bottom-0 rounded-t-3xl overflow-hidden bg-gray-400 opacity-40"
              style={{
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
              }}
            >
              {/* 텍스트 오버레이 영역 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                {/* 앨범명 스켈레톤 */}
                <div className="h-8 md:h-10 bg-gray-300 rounded opacity-60 mb-2 w-56"></div>

                {/* 아티스트명 태그 스켈레톤 */}
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-300 rounded-full opacity-50 w-24"></div>
                </div>
              </div>
            </div>
          </div>
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
