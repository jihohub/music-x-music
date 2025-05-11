"use client";

import Header from "@/components/Header";
import {
  useLikedAlbums,
  useLikedArtists,
  useLikedTracks,
} from "@/hooks/useLikesData";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type LikeTab = "all" | "tracks" | "artists" | "albums";

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState<LikeTab>("all");

  // API 데이터 가져오기
  const {
    data: trackData,
    isLoading: isLoadingTracks,
    error: trackError,
  } = useLikedTracks();

  const {
    data: artistData,
    isLoading: isLoadingArtists,
    error: artistError,
  } = useLikedArtists();

  const {
    data: albumData,
    isLoading: isLoadingAlbums,
    error: albumError,
  } = useLikedAlbums();

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

  // 탭 변경 핸들러
  const handleTypeChange = (type: LikeTab) => {
    setActiveTab(type);
  };

  return (
    <>
      <Header title="좋아요" />
      <div className="py-6 space-y-6 px-4">
        {/* 탭 선택 - 검색 페이지와 동일한 스타일 */}
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

        {/* 에러 상태 */}
        {error && (
          <div className="text-center py-20 text-error">
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <p className="text-sm mt-2">{error.toString()}</p>
          </div>
        )}

        {/* 전체 탭 - 각 카테고리별 미리보기 */}
        {activeTab === "all" && !isLoading && !error && (
          <motion.div
            className="space-y-16"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* 아티스트 섹션 */}
            {artistData && artistData.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">아티스트</h2>
                  <button
                    onClick={() => handleTypeChange("artists")}
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
                      <div className="overflow-hidden rounded-full aspect-square relative bg-card-bg">
                        <Image
                          src={
                            artist.images?.[0]?.url || "/images/placeholder.png"
                          }
                          alt={artist.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="mt-2 font-semibold truncate text-center">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate text-center">
                        {artist.genres?.slice(0, 2).join(", ") || "아티스트"}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 트랙 섹션 */}
            {trackData && trackData.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">트랙</h2>
                  <button
                    onClick={() => handleTypeChange("tracks")}
                    className="text-primary hover:text-primary/80 hover:underline text-sm font-medium px-3 py-1 rounded-full transition-all duration-200"
                  >
                    더 보기
                  </button>
                </div>
                <div className="space-y-2">
                  {trackData.slice(0, 5).map((track) => (
                    <Link
                      href={`/track/${track.id}`}
                      key={track.id}
                      className="flex items-center gap-4 p-3 rounded-md hover:bg-card-bg transition-colors"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={
                            track.album?.images?.[0]?.url ||
                            "/images/placeholder.png"
                          }
                          alt={track.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-ellipsis">
                          {track.name}
                        </h3>
                        <p className="text-text-secondary text-sm">
                          {track.artists.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 앨범 섹션 */}
            {albumData && albumData.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">앨범</h2>
                  <button
                    onClick={() => handleTypeChange("albums")}
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
                      className="card"
                    >
                      <div className="relative aspect-square w-full overflow-hidden">
                        <Image
                          src={
                            album.images?.[0]?.url || "/images/placeholder.png"
                          }
                          alt={album.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-ellipsis">
                          {album.name}
                        </h3>
                        <p className="text-text-secondary text-xs">
                          {album.artists.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 데이터가 없는 경우 */}
            {(!artistData || artistData.length === 0) &&
              (!trackData || trackData.length === 0) &&
              (!albumData || albumData.length === 0) && (
                <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                  <p className="mb-4">좋아요한 콘텐츠가 없습니다</p>
                  <Link href="/" className="btn btn-primary">
                    음악 탐색하기
                  </Link>
                </div>
              )}
          </motion.div>
        )}

        {/* 좋아요한 트랙 */}
        {activeTab === "tracks" && !isLoading && !error && trackData && (
          <>
            {trackData.length > 0 ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold">트랙</h2>
                <div className="space-y-2">
                  {trackData.map((track) => (
                    <Link
                      href={`/track/${track.id}`}
                      key={track.id}
                      className="flex items-center gap-4 p-2 rounded-md hover:bg-card-bg transition-colors"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={
                            track.album?.images?.[0]?.url ||
                            "/images/placeholder.png"
                          }
                          alt={track.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-ellipsis">
                          {track.name}
                        </h3>
                        <p className="text-text-secondary text-sm">
                          {track.artists.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-text-secondary"
              >
                <p className="mb-4">좋아요한 트랙이 없습니다</p>
                <Link href="/" className="btn btn-primary">
                  음악 탐색하기
                </Link>
              </motion.div>
            )}
          </>
        )}

        {/* 좋아요한 아티스트 */}
        {activeTab === "artists" && !isLoading && !error && artistData && (
          <>
            {artistData.length > 0 ? (
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
                      <div className="overflow-hidden rounded-full aspect-square relative bg-card-bg">
                        <Image
                          src={
                            artist.images?.[0]?.url || "/images/placeholder.png"
                          }
                          alt={artist.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover rounded-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="mt-2 font-semibold truncate text-center">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate text-center">
                        {artist.genres?.slice(0, 2).join(", ") || "아티스트"}
                      </p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-text-secondary"
              >
                <p className="mb-4">좋아요한 아티스트가 없습니다</p>
                <Link href="/" className="btn btn-primary">
                  음악 탐색하기
                </Link>
              </motion.div>
            )}
          </>
        )}

        {/* 좋아요한 앨범 */}
        {activeTab === "albums" && !isLoading && !error && albumData && (
          <>
            {albumData.length > 0 ? (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold">앨범</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {albumData.map((album) => (
                    <Link
                      href={`/album/${album.id}`}
                      key={album.id}
                      className="card"
                    >
                      <div className="relative aspect-square w-full overflow-hidden">
                        <Image
                          src={
                            album.images?.[0]?.url || "/images/placeholder.png"
                          }
                          alt={album.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-sm text-ellipsis">
                          {album.name}
                        </h3>
                        <p className="text-text-secondary text-xs">
                          {album.artists.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center justify-center py-16 text-text-secondary"
              >
                <p className="mb-4">좋아요한 앨범이 없습니다</p>
                <Link href="/" className="btn btn-primary">
                  음악 탐색하기
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </>
  );
}
