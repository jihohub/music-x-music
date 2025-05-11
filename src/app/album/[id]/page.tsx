"use client";

import Header from "@/components/Header";
import { getAlbumById, getArtistById } from "@/features/music/api";
import { SpotifyAlbum, SpotifyArtist } from "@/lib/spotify-api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  IoCalendarOutline,
  IoMusicalNotesOutline,
  IoPlayCircleOutline,
  IoTimeOutline,
} from "react-icons/io5";

export default function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const albumId = resolvedParams.id;
  const [album, setAlbum] = useState<SpotifyAlbum | null>(null);
  const [artist, setArtist] = useState<SpotifyArtist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function fetchAlbumData() {
      try {
        setLoading(true);
        const albumData = await getAlbumById(albumId);
        setAlbum(albumData);

        // 앨범의 첫 번째 아티스트 정보 가져오기
        if (albumData.artists && albumData.artists.length > 0) {
          try {
            const artistData = await getArtistById(albumData.artists[0].id);
            setArtist(artistData);
          } catch (artistError) {
            console.error(
              "아티스트 정보를 가져오는데 실패했습니다:",
              artistError
            );
          }
        }

        setError(null);
      } catch (err) {
        console.error("앨범 정보를 가져오는데 실패했습니다:", err);
        setError("앨범 정보를 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchAlbumData();
  }, [albumId]);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  if (loading) {
    return (
      <>
        <Header title="앨범 로딩 중..." />
        <div className="py-6">
          {/* 앨범 헤더 스켈레톤 */}
          <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
              <div
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          </section>

          {/* 트랙 목록 스켈레톤 */}
          <div className="container px-4 mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-card-bg rounded-lg py-5">
                  <div
                    className="h-6 rounded w-1/4 mb-4 animate-pulse"
                    style={{ backgroundColor: "var(--skeleton-bg)" }}
                  />
                  <div
                    className="h-[300px] rounded animate-pulse"
                    style={{ backgroundColor: "var(--skeleton-bg)" }}
                  />
                </div>
              </div>

              {/* 앨범 정보 스켈레톤 */}
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
      </>
    );
  }

  if (error || !album) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">
          {error || "앨범을 찾을 수 없습니다"}
        </h1>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // 앨범 이미지가 없는 경우 기본 이미지 사용
  const albumImage =
    album.images && album.images.length > 0
      ? album.images[0].url
      : "https://via.placeholder.com/300";

  return (
    <>
      <Header title={album.name} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-6"
      >
        {/* 앨범 배너 및 정보 영역 */}
        <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
            <Image
              src={albumImage}
              alt={album.name}
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
              <div className="relative shadow-2xl group">
                <div
                  className="relative aspect-square rounded-lg overflow-hidden"
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
                  <Image
                    src={albumImage}
                    alt={album.name}
                    fill
                    sizes="160px"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 ring-1 ring-white/10" />
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
                      {album.name}
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {album.artists.map((albumArtist, index) => (
                        <Link
                          key={albumArtist.id}
                          href={`/artist/${albumArtist.id}`}
                          className="text-lg text-white hover:text-primary drop-shadow-md"
                        >
                          {albumArtist.name}
                          {index < album.artists.length - 1 && ", "}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 컨텐츠 영역 */}
        <div className="container px-4 mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 및 중앙 컬럼 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 트랙 목록 */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-card-bg rounded-lg py-5"
              >
                <h2 className="text-lg font-bold mb-4">트랙 목록</h2>
                <div>
                  <div className="flex items-center gap-2 py-2 text-text-secondary text-sm">
                    <div className="w-8 text-center shrink-0">#</div>
                    <div className="flex-grow min-w-0">제목</div>
                    <div className="hidden md:block w-1/3 min-w-0">
                      아티스트
                    </div>
                    <div className="text-right w-10 shrink-0">시간</div>
                  </div>
                  {album.tracks?.items.map((track, index) => (
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
                            album.images?.[0]?.url ||
                            "https://via.placeholder.com/40"
                          }
                          alt={album.name}
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
                        <div className="text-text-secondary truncate">
                          {track.artists.map((artist, index) => (
                            <React.Fragment key={artist.id}>
                              <Link
                                href={`/artist/${artist.id}`}
                                className="hover:text-primary"
                              >
                                {artist.name}
                              </Link>
                              {index < track.artists.length - 1 && (
                                <span className="mx-1">, </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
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
            </div>

            {/* 오른쪽 컬럼 */}
            <div className="space-y-6">
              {/* 앨범 정보 */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-card-bg rounded-lg py-5"
              >
                <h2 className="text-lg font-bold mb-4">앨범 정보</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <IoCalendarOutline
                      className="text-primary mt-1"
                      size={18}
                    />
                    <div>
                      <h3 className="font-medium">릴리즈</h3>
                      <p className="text-text-secondary">
                        {album.release_date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <IoMusicalNotesOutline
                      className="text-primary mt-1"
                      size={18}
                    />
                    <div>
                      <h3 className="font-medium">트랙 수</h3>
                      <p className="text-text-secondary">
                        {album.total_tracks}곡
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <IoTimeOutline className="text-primary mt-1" size={18} />
                    <div>
                      <h3 className="font-medium">총 재생 시간</h3>
                      <p className="text-text-secondary">
                        {Math.floor(
                          (album.tracks?.items?.reduce(
                            (acc, track) => acc + track.duration_ms,
                            0
                          ) || 0) / 60000
                        )}
                        분
                      </p>
                    </div>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
