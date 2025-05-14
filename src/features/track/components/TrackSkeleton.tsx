"use client";

export const TrackSkeleton = () => {
  return (
    <div className="py-6">
      {/* 트랙 헤더 스켈레톤 */}
      <section className="relative bg-background">
        <div className="container px-4 pb-6">
          <div
            className="h-[160px] rounded animate-pulse"
            style={{ backgroundColor: "var(--skeleton-bg)" }}
          />
        </div>
      </section>

      {/* 컨텐츠 영역 */}
      <div className="container px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 컬럼: 아티스트 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card-bg rounded-lg py-5">
              <div
                className="h-6 rounded w-1/4 mb-4 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-[100px] rounded animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          </div>

          {/* 오른쪽 컬럼: 트랙 정보 */}
          <div className="space-y-6">
            <div className="bg-card-bg rounded-lg py-5">
              <div
                className="h-6 rounded w-1/4 mb-4 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              <div
                className="h-[200px] rounded animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
