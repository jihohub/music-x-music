"use client";

import Header from "@/components/Header";
import { SpotifyLogo } from "@/components/SpotifyLogo";
import {
  useTrendAlbums,
  useTrendArtists,
  useTrendTracks,
} from "@/hooks/useTrendData";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type TrendTab = "all" | "tracks" | "artists" | "albums";

// useSearchParams를 사용하는 부분을 분리한 클라이언트 컴포넌트
function TrendTabSelector({
  activeTab,
  onChange,
}: {
  activeTab: TrendTab;
  onChange: (tab: TrendTab) => void;
}) {
  const searchParams = useSearchParams();

  // URL에서 탭 파라미터 가져오기
  const typeParam = (searchParams.get("type") || "all") as TrendTab;

  // URL 파라미터 변경 감지 - 초기 로드 시에만 실행
  useEffect(() => {
    // 초기 로드 시 URL 파라미터에서 탭 설정
    onChange(typeParam);
  }, [typeParam, onChange]);

  // 탭 변경 핸들러
  const handleTypeChange = (type: TrendTab) => {
    onChange(type);

    // URL 파라미터 업데이트 (히스토리 API 사용)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (type === "all") {
        url.searchParams.delete("type");
      } else {
        url.searchParams.set("type", type);
      }

      window.history.pushState({}, "", url.toString());
    }
  };

  return (
    <div className="mb-4">
      <div className="flex justify-center">
        <div className="inline-flex gap-4 px-1">
          <button
            onClick={() => handleTypeChange("all")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "all"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            전체
            {activeTab === "all" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => handleTypeChange("artists")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "artists"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            아티스트
            {activeTab === "artists" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => handleTypeChange("tracks")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "tracks"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            트랙
            {activeTab === "tracks" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => handleTypeChange("albums")}
            className={`relative py-2 px-4 font-medium text-sm transition-all duration-200 ${
              activeTab === "albums"
                ? "text-primary font-semibold"
                : "text-gray-500 hover:text-gray-800"
            }`}
          >
            앨범
            {activeTab === "albums" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full"></div>
            )}
          </button>
        </div>
      </div>
      <div className="w-full h-px bg-gray-200 mt-0.5"></div>
    </div>
  );
}

export default function TrendPage() {
  const [activeTab, setActiveTab] = useState<TrendTab>("all");

  // API 데이터 가져오기
  const {
    data: trackData,
    isLoading: isLoadingTracks,
    error: trackError,
  } = useTrendTracks();

  const {
    data: artistData,
    isLoading: isLoadingArtists,
    error: artistError,
  } = useTrendArtists();

  const {
    data: albumData,
    isLoading: isLoadingAlbums,
    error: albumError,
  } = useTrendAlbums();

  // 현재 탭에 따른 로딩 상태
  const isLoading =
    (activeTab === "tracks" && isLoadingTracks) ||
    (activeTab === "artists" && isLoadingArtists) ||
    (activeTab === "albums" && isLoadingAlbums) ||
    (activeTab === "all" &&
      (isLoadingTracks || isLoadingArtists || isLoadingAlbums));

  // 현재 탭에 따른 에러 상태
  const error =
    (activeTab === "tracks" && trackError) ||
    (activeTab === "artists" && artistError) ||
    (activeTab === "albums" && albumError) ||
    (activeTab === "all" && (trackError || artistError || albumError));

  return (
    <>
      <Header title="트렌드" />
      <div className="py-6 space-y-6 px-4">
        {/* 탭 선택 - Suspense로 감싸서 useSearchParams 사용 */}
        <Suspense fallback={<div className="mb-4 h-10" />}>
          <TrendTabSelector activeTab={activeTab} onChange={setActiveTab} />
        </Suspense>

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-20 text-error">
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <p className="text-sm mt-2">{error.toString()}</p>
          </div>
        )}

        {/* 전체 탭 - 각 카테고리별 미리보기 */}
        {activeTab === "all" && !error && (
          <motion.div
            className="space-y-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 아티스트 섹션 */}
            {artistData && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">아티스트</h2>
                  <button
                    onClick={() => setActiveTab("artists")}
                    className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
                  >
                    더 보기
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {artistData.slice(0, 4).map((artist) => (
                    <Link
                      href={`/artist/${artist.id}`}
                      key={artist.id}
                      className="group"
                    >
                      <SpotifyLogo />
                      <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                        <Image
                          src={
                            artist.images?.[0]?.url || "/images/placeholder.png"
                          }
                          alt={artist.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-2 font-semibold truncate text-sm">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate">
                        {artist.genres?.slice(0, 2).join(", ") || "아티스트"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 트랙 섹션 */}
            {trackData && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">트랙</h2>
                  <button
                    onClick={() => setActiveTab("tracks")}
                    className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
                  >
                    더 보기
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {trackData.slice(0, 4).map((track) => (
                    <Link
                      href={`/track/${track.id}`}
                      key={track.id}
                      className="group"
                    >
                      <SpotifyLogo />
                      <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                        <Image
                          src={
                            track.album?.images?.[0]?.url ||
                            "/images/placeholder.png"
                          }
                          alt={track.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-2 font-semibold truncate text-sm">
                        {track.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate">
                        {track.artists.map((artist) => artist.name).join(", ")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 앨범 섹션 */}
            {albumData && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">앨범</h2>
                  <button
                    onClick={() => setActiveTab("albums")}
                    className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
                  >
                    더 보기
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {albumData.slice(0, 4).map((album) => (
                    <Link
                      href={`/album/${album.id}`}
                      key={album.id}
                      className="group"
                    >
                      <SpotifyLogo />
                      <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                        <Image
                          src={
                            album.images?.[0]?.url || "/images/placeholder.png"
                          }
                          alt={album.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover"
                        />
                      </div>
                      <h3 className="mt-2 font-semibold truncate text-sm">
                        {album.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate">
                        {album.artists.map((a) => a.name).join(", ")}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 트랙 트렌드 */}
        {activeTab === "tracks" && !isLoading && !error && trackData && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold">트랙</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trackData.map((track) => (
                <Link
                  href={`/track/${track.id}`}
                  key={track.id}
                  className="group"
                >
                  <SpotifyLogo />
                  <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                    <Image
                      src={
                        track.album?.images?.[0]?.url ||
                        "/images/placeholder.png"
                      }
                      alt={track.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-2 font-semibold truncate text-sm">
                    {track.name}
                  </h3>
                  <p className="text-sm text-text-secondary truncate">
                    {track.artists.map((a) => a.name).join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* 아티스트 트렌드 */}
        {activeTab === "artists" && !isLoading && !error && artistData && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold">아티스트</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {artistData.map((artist) => (
                <Link
                  href={`/artist/${artist.id}`}
                  key={artist.id}
                  className="group"
                >
                  <SpotifyLogo />
                  <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                    <Image
                      src={artist.images?.[0]?.url || "/images/placeholder.png"}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-2 font-semibold truncate text-sm">
                    {artist.name}
                  </h3>
                  <p className="text-sm text-text-secondary truncate">
                    {artist.genres?.slice(0, 2).join(", ") || "아티스트"}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* 앨범 트렌드 */}
        {activeTab === "albums" && !isLoading && !error && albumData && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold">앨범</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {albumData.map((album) => (
                <Link
                  href={`/album/${album.id}`}
                  key={album.id}
                  className="group"
                >
                  <SpotifyLogo />
                  <div className="overflow-hidden rounded-sm aspect-square relative bg-card-bg">
                    <Image
                      src={album.images?.[0]?.url || "/images/placeholder.png"}
                      alt={album.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="mt-2 font-semibold truncate text-sm">
                    {album.name}
                  </h3>
                  <p className="text-sm text-text-secondary truncate">
                    {album.artists.map((a) => a.name).join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
