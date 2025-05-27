"use client";

export type TrendTab = "all" | "artists" | "tracks" | "albums";

interface TabSelectorProps {
  activeTab: TrendTab;
  onChange: (tab: TrendTab) => void;
}

export const TabSelector = ({ activeTab, onChange }: TabSelectorProps) => {
  return (
    <div className="mb-6">
      <div className="flex justify-center">
        <div className="inline-flex gap-4 px-1">
          <button
            onClick={() => onChange("all")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "all"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            전체
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => onChange("artists")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "artists"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            아티스트
            {activeTab === "artists" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => onChange("tracks")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "tracks"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            트랙
            {activeTab === "tracks" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => onChange("albums")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "albums"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            앨범
            {activeTab === "albums" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200 mt-0.5"></div>
    </div>
  );
};
