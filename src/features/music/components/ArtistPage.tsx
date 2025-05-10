"use client";

import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/lib/spotify-api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  IoHeartOutline,
  IoMusicalNotesOutline,
  IoPlayCircleOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

interface ArtistPageProps {
  artist: SpotifyArtist;
  topTracks: SpotifyTrack[];
  albums: SpotifyAlbum[];
  isLoading?: boolean;
  error?: string | null;
}

export function ArtistPage({
  artist,
  topTracks,
  albums,
  isLoading = false,
  error = null,
}: ArtistPageProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  // 팔로우 토글
  const toggleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <div className="pb-12">
        {/* 아티스트 배너 및 프로필 영역 */}
        <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 container px-4 pb-6">
            <div className="flex items-end gap-6">
              <div
                className="relative rounded-full overflow-hidden shadow-2xl"
                style={{
                  width: "160px",
                  height: "160px",
                  minWidth: "160px",
                  minHeight: "160px",
                  maxWidth: "160px",
                  maxHeight: "160px",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                <div className="absolute inset-0 ring-1 ring-white/10" />
              </div>
              <div className="flex-grow">
                <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse" />
              </div>
            </div>
          </div>
        </section>

        {/* 컨텐츠 영역 */}
        <div className="container px-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 및 중앙 컬럼 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 인기 트랙 */}
              <div className="bg-card-bg rounded-lg p-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
                <div className="h-[300px] bg-gray-200 rounded animate-pulse" />
              </div>

              {/* 앨범 및 싱글 */}
              <div className="bg-card-bg rounded-lg p-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
                <div className="h-[400px] bg-gray-200 rounded animate-pulse" />
              </div>
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="space-y-6">
              {/* 아티스트 정보 */}
              <div className="bg-card-bg rounded-lg p-4">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
                <div className="h-[200px] bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">
          {error || "아티스트를 찾을 수 없습니다"}
        </h1>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // 이미지가 없는 경우 기본 이미지 URL
  const artistImage =
    artist.images && artist.images.length > 0
      ? artist.images[0].url
      : "https://via.placeholder.com/300";

  // 배너 이미지 - 아티스트 메인 이미지에 그라데이션 효과를 적용
  const bannerImage =
    artist.images && artist.images.length > 0
      ? artist.images[0].url
      : "https://via.placeholder.com/1200x400";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-12"
    >
      {/* 아티스트 배너 및 프로필 영역 */}
      <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
          <Image
            src={bannerImage}
            alt={artist.name}
            fill
            sizes="100vw"
            className="object-cover -z-10 opacity-50"
            quality={90}
            priority
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 container px-4 pb-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-end gap-6"
          >
            <div
              className="relative rounded-full overflow-hidden shadow-2xl group"
              style={{
                width: "160px",
                height: "160px",
                minWidth: "160px",
                minHeight: "160px",
                maxWidth: "160px",
                maxHeight: "160px",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50" />
              <div className="absolute inset-0">
                <Image
                  src={artistImage}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 768px) 160px, 256px"
                  className="object-cover object-center transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 ring-1 ring-white/10" />
            </div>
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                    {artist.name}
                  </h1>
                  {artist.genres && artist.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {artist.genres.slice(0, 3).map((genre, idx) => (
                        <span
                          key={idx}
                          className="text-sm bg-primary/20 text-primary px-3 py-1 rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={toggleFollow}
                    className={`px-6 py-2 rounded-full border ${
                      isFollowing
                        ? "bg-primary border-primary text-white"
                        : "bg-transparent border-white/30 text-white"
                    } hover:bg-primary/80 hover:border-primary transition-colors`}
                  >
                    {isFollowing ? "팔로잉" : "팔로우"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 컨텐츠 영역 */}
      <div className="container px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽 및 중앙 컬럼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 인기 트랙 */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-card-bg rounded-lg"
            >
              <h2 className="text-lg font-bold mb-3">인기 트랙</h2>
              <div>
                <div className="flex items-center gap-2 py-2 text-text-secondary text-sm">
                  <div className="w-8 text-center shrink-0">#</div>
                  <div className="flex-grow min-w-0">제목</div>
                  <div className="hidden md:block w-1/3 min-w-0">앨범</div>
                  <div className="text-right w-10 shrink-0">시간</div>
                </div>
                {topTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-2 py-2 hover:bg-gray-700/10 transition-colors group"
                  >
                    <div className="w-8 text-center text-text-secondary shrink-0">
                      <span className="group-hover:hidden">{index + 1}</span>
                      <button className="hidden group-hover:block mx-auto">
                        <IoPlayCircleOutline size={18} />
                      </button>
                    </div>
                    <div className="w-10 h-10 shrink-0">
                      <Image
                        src={
                          track.album?.images?.[0]?.url ||
                          "https://via.placeholder.com/40"
                        }
                        alt={track.album?.name || "앨범 이미지"}
                        width={40}
                        height={40}
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <Link
                        href={`/track/${track.id}`}
                        className="hover:text-primary block line-clamp-2"
                      >
                        {track.name}
                      </Link>
                    </div>
                    <div className="hidden md:block w-1/3 min-w-0">
                      <Link
                        href={`/album/${track.album?.id}`}
                        className="text-text-secondary hover:text-primary block truncate"
                      >
                        {track.album?.name}
                      </Link>
                    </div>
                    <div className="text-text-secondary text-right w-10 shrink-0">
                      {Math.floor(track.duration_ms / 60000)}:
                      {((track.duration_ms % 60000) / 1000)
                        .toFixed(0)
                        .padStart(2, "0")}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            {/* 앨범 및 싱글 */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-card-bg rounded-lg"
            >
              <h2 className="text-lg font-bold mb-3">앨범 및 싱글</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {albums.map((album) => (
                  <Link
                    href={`/album/${album.id}`}
                    key={album.id}
                    className="group"
                  >
                    <div className="relative aspect-square bg-card-bg rounded-md overflow-hidden">
                      <Image
                        src={
                          album.images && album.images.length > 0
                            ? album.images[0].url
                            : "https://via.placeholder.com/300"
                        }
                        alt={album.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium mt-2 truncate">{album.name}</h3>
                    <p className="text-sm text-text-secondary">
                      {album.release_date.split("-")[0]} • {album.total_tracks}
                      곡
                    </p>
                  </Link>
                ))}
              </div>
            </motion.section>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="space-y-6">
            {/* 아티스트 정보 */}
            <motion.section
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-card-bg rounded-lg"
            >
              <h2 className="text-lg font-bold mb-3">아티스트 정보</h2>
              <div className="space-y-3">
                {artist.genres && artist.genres.length > 0 && (
                  <div className="flex items-start gap-3">
                    <IoMusicalNotesOutline
                      className="text-primary mt-1"
                      size={18}
                    />
                    <div>
                      <h3 className="font-medium">장르</h3>
                      <p className="text-text-secondary">
                        {artist.genres.slice(0, 3).join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {artist.followers && (
                  <div className="flex items-start gap-3">
                    <IoHeartOutline className="text-primary mt-1" size={18} />
                    <div>
                      <h3 className="font-medium">팔로워</h3>
                      <p className="text-text-secondary">
                        {artist.followers.total.toLocaleString()}명
                      </p>
                    </div>
                  </div>
                )}

                {artist.popularity && (
                  <div className="flex items-start gap-3">
                    <IoTrendingUpOutline
                      className="text-primary mt-1"
                      size={18}
                    />
                    <div>
                      <h3 className="font-medium">인기도</h3>
                      <p className="text-text-secondary">
                        {artist.popularity}%
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
