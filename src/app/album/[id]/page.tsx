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
  IoHeart,
  IoHeartOutline,
  IoMusicalNotesOutline,
  IoPlayCircleOutline,
  IoShareSocialOutline,
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
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4">앨범 정보를 불러오는 중...</p>
      </div>
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
        {/* 앨범 헤더 */}
        <div className="container px-4">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row gap-6 md:items-center"
          >
            <div className="flex justify-center w-full md:w-auto">
              <div className="relative aspect-square w-full max-w-[300px] md:max-w-[400px] h-[300px] md:h-[400px] shadow-lg rounded-md overflow-hidden">
                <Image
                  src={albumImage}
                  alt={album.name}
                  fill
                  sizes="(max-width: 768px) 80vw, 400px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            <div className="flex-grow space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{album.name}</h1>
                <div className="flex items-center mt-2">
                  {album.artists.map((artist, index) => (
                    <React.Fragment key={artist.id}>
                      <Link
                        href={`/artist/${artist.id}`}
                        className="text-xl text-primary hover:underline"
                      >
                        {artist.name}
                      </Link>
                      {index < album.artists.length - 1 && (
                        <span className="mx-1">, </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <p className="text-md text-text-secondary mt-1">
                  {album.release_date} • {album.total_tracks}곡
                </p>
              </div>

              <div className="flex items-center gap-4 mt-4">
                <button className="btn btn-primary rounded-full px-6 py-3 flex items-center gap-2">
                  <IoPlayCircleOutline size={24} />
                  <span>재생</span>
                </button>
                <button
                  className="btn btn-ghost rounded-full p-3"
                  onClick={toggleLike}
                  aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                >
                  {isLiked ? (
                    <IoHeart size={24} className="text-primary" />
                  ) : (
                    <IoHeartOutline size={24} />
                  )}
                </button>
                <button
                  className="btn btn-ghost rounded-full p-3"
                  aria-label="공유하기"
                >
                  <IoShareSocialOutline size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="container px-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 왼쪽 및 중앙 컬럼 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 트랙 목록 */}
              <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-card-bg rounded-lg"
              >
                <h2 className="text-lg font-bold mb-3">트랙 목록</h2>
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
                className="bg-card-bg rounded-lg"
              >
                <h2 className="text-lg font-bold mb-3">앨범 정보</h2>
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
