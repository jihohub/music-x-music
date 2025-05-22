"use client";

export const ArtistSkeleton = () => {
  return (
    <div className="py-6">
      {/* 아티스트 헤더 스켈레톤 */}
      <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
        {/* 헤더 영역 전체를 네모로 표시 */}
        <div
          className="absolute inset-0 animate-pulse"
          style={{ backgroundColor: "var(--skeleton-bg)" }}
        />
      </section>

      {/* 컨텐츠 영역 */}
      <div className="container px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 및 중앙 컬럼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 인기 트랙 */}
            <div className="bg-card-bg rounded-lg py-5">
              {/* 제목 영역 */}
              <div
                className="h-6 rounded w-24 mb-4 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              {/* 트랙 목록 영역 전체를 네모로 표시 */}
              <div
                className="h-[250px] rounded animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>

            {/* 앨범 및 싱글 */}
            <div className="bg-card-bg rounded-lg py-5">
              {/* 제목 영역 */}
              <div
                className="h-6 rounded w-24 mb-4 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              {/* 앨범 목록 영역 전체를 네모로 표시 */}
              <div
                className="h-[350px] rounded animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            {/* 아티스트 정보 */}
            <div className="bg-card-bg rounded-lg py-5">
              {/* 제목 영역 */}
              <div
                className="h-6 rounded w-28 mb-4 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
              {/* 아티스트 정보 영역 전체를 네모로 표시 */}
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
