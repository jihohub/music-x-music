"use client";

import Header from "@/components/Header";
import { getArtistById, getTrackById } from "@/features/music/api";
import { SpotifyArtist, SpotifyTrack } from "@/lib/spotify-api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  IoCalendarOutline,
  IoMusicalNotesOutline,
  IoTimeOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

// 임시 데이터 삭제

export default function TrackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const trackId = resolvedParams.id;
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  // const [similarTracks, setSimilarTracks] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  // 트랙 정보 가져오기
  useEffect(() => {
    async function fetchTrackData() {
      try {
        setLoading(true);
        const trackData = await getTrackById(trackId);
        setTrack(trackData);

        // 트랙의 모든 아티스트 정보 가져오기
        if (trackData.artists && trackData.artists.length > 0) {
          try {
            const artistPromises = trackData.artists.map((artist) =>
              getArtistById(artist.id)
            );
            const artistData = await Promise.all(artistPromises);
            setArtists(artistData);
          } catch (artistError) {
            console.error(
              "아티스트 정보를 가져오는데 실패했습니다:",
              artistError
            );
          }
        }

        setError(null);
      } catch (err) {
        console.error("트랙 정보를 가져오는데 실패했습니다:", err);
        setError("트랙 정보를 가져오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchTrackData();
  }, [trackId]);

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  if (loading) {
    return (
      <>
        <Header title="트랙 로딩 중..." />
        <div className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          {/* 트랙 헤더 스켈레톤 */}
          <div className="relative bg-gradient-to-b from-primary/20 to-transparent">
            <div className="py-6">
              <div className="flex flex-col md:flex-row gap-6 md:items-center">
                {/* 앨범 이미지 스켈레톤 */}
                <div className="flex justify-center w-full md:w-auto md:mx-auto">
                  <div className="relative aspect-square w-full max-w-[300px] md:max-w-[400px] h-[300px] md:h-[400px] shadow-lg rounded-md overflow-hidden">
                    <div
                      className="absolute inset-0 animate-pulse"
                      style={{ backgroundColor: "var(--skeleton-bg)" }}
                    />
                  </div>
                </div>

                {/* 트랙 정보 스켈레톤 */}
                <div className="flex-grow space-y-4 md:max-w-md">
                  <div className="mt-3 md:mt-0">
                    <div
                      className="h-8 w-3/4 rounded animate-pulse mb-3"
                      style={{ backgroundColor: "var(--skeleton-bg)" }}
                    />
                    <div
                      className="h-6 w-1/2 rounded animate-pulse"
                      style={{ backgroundColor: "var(--skeleton-bg)" }}
                    />
                    <div
                      className="h-4 w-1/3 rounded animate-pulse mt-3"
                      style={{ backgroundColor: "var(--skeleton-bg)" }}
                    />
                  </div>

                  {/* 버튼 스켈레톤 제거 */}
                </div>
              </div>
            </div>
          </div>

          {/* 트랙 상세 정보 스켈레톤 */}
          <div className="mt-6">
            <div className="max-w-3xl mx-auto w-full space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div className="bg-card-bg rounded-lg" key={i}>
                    <div
                      className="h-6 w-2/3 rounded animate-pulse mb-2 ml-3 mt-3"
                      style={{ backgroundColor: "var(--skeleton-bg)" }}
                    />
                    <div
                      className="h-4 w-1/2 rounded animate-pulse ml-3 mb-3"
                      style={{ backgroundColor: "var(--skeleton-bg)" }}
                    />
                  </div>
                ))}
              </div>

              <div className="bg-card-bg rounded-lg p-4">
                <div
                  className="h-6 w-1/3 rounded animate-pulse mb-4 ml-1"
                  style={{ backgroundColor: "var(--skeleton-bg)" }}
                />
                <div className="mt-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full animate-pulse flex-shrink-0"
                      style={{ backgroundColor: "var(--skeleton-bg)" }}
                    />
                    <div className="h-12 flex items-center">
                      <div
                        className="h-5 w-24 rounded animate-pulse"
                        style={{ backgroundColor: "var(--skeleton-bg)" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error || !track) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">
          {error || "트랙을 찾을 수 없습니다"}
        </h1>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // 앨범 이미지가 없는 경우 기본 이미지 사용
  const albumImage =
    track.album?.images && track.album?.images.length > 0
      ? track.album.images[0].url
      : "https://via.placeholder.com/300";

  // 아티스트 이름 추출
  const artistNames = track.artists.map((artist) => artist.name).join(", ");

  return (
    <>
      <Header title={track.name} />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto"
      >
        {/* 트랙 헤더 */}
        <div className="relative bg-gradient-to-b from-primary/20 to-transparent">
          {/* 파형 애니메이션 주석 처리 
          <div className="absolute inset-0 opacity-10">
            <div className="flex items-end justify-center h-full">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 mx-0.5 bg-white rounded-full opacity-80"
                  style={{
                    height: `${
                      10 + Math.sin(i * 0.3) * 15 + Math.random() * 20
                    }px`,
                    animation: `waveAnimation ${
                      0.8 + Math.random() * 0.5
                    }s ease-in-out infinite alternate`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>
          */}

          <div className="py-6">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col md:flex-row gap-6 md:items-center"
            >
              <div className="flex justify-center w-full md:w-auto md:mx-auto">
                <div className="relative aspect-square w-full max-w-[300px] md:max-w-[400px] h-[300px] md:h-[400px] shadow-lg rounded-md overflow-hidden">
                  <Image
                    src={
                      track.album?.images?.[0]?.url ||
                      "https://via.placeholder.com/400"
                    }
                    alt={track.album?.name || "앨범 이미지"}
                    fill
                    sizes="(max-width: 768px) 80vw, 400px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              <div className="flex-grow space-y-4 md:max-w-md">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {track.name}
                  </h1>
                  <div className="flex items-center mt-2">
                    {track.artists.map((artist, index) => (
                      <React.Fragment key={artist.id}>
                        <Link
                          href={`/artist/${artist.id}`}
                          className="text-xl text-primary hover:underline"
                        >
                          {artist.name}
                        </Link>
                        {index < track.artists.length - 1 && (
                          <span className="mx-1">, </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <p className="text-md text-text-secondary mt-1">
                    앨범:{" "}
                    <Link
                      href={`/album/${track.album?.id}`}
                      className="hover:underline"
                    >
                      {track.album?.name}
                    </Link>
                  </p>
                </div>

                {/* 재생, 좋아요, 공유 버튼 주석 처리
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
                */}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-6">
          <div className="max-w-3xl mx-auto w-full space-y-6">
            {/* 트랙 정보 */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              {/* 트랙 속성 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card-bg rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <IoMusicalNotesOutline
                      className="mr-2 text-primary"
                      size={18}
                    />
                    <span className="font-medium">앨범</span>
                  </div>
                  <p className="truncate">
                    <Link
                      href={`/album/${track.album?.id}`}
                      className="hover:text-primary"
                    >
                      {track.album?.name}
                    </Link>
                  </p>
                </div>

                <div className="bg-card-bg rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <IoCalendarOutline
                      className="mr-2 text-primary"
                      size={18}
                    />
                    <span className="font-medium">릴리즈</span>
                  </div>
                  <p>{track.album?.release_date || "알 수 없음"}</p>
                </div>

                <div className="bg-card-bg rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <IoTimeOutline className="mr-2 text-primary" size={18} />
                    <span className="font-medium">재생 시간</span>
                  </div>
                  <p>
                    {Math.floor(track.duration_ms / 60000)}:
                    {((track.duration_ms % 60000) / 1000)
                      .toFixed(0)
                      .padStart(2, "0")}
                  </p>
                </div>

                <div className="bg-card-bg rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <IoTrendingUpOutline
                      className="mr-2 text-primary"
                      size={18}
                    />
                    <span className="font-medium">인기도</span>
                  </div>
                  <p>{track.popularity || 0}</p>
                </div>
              </div>

              {/* 아티스트 정보 섹션 */}
              {artists.length > 0 && (
                <div className="bg-card-bg rounded-lg p-4">
                  <h2 className="text-lg font-bold mb-3">아티스트 정보</h2>
                  <div className="space-y-3">
                    {artists.map((artist) => (
                      <div key={artist.id} className="flex items-center gap-3">
                        <Link
                          href={`/artist/${artist.id}`}
                          className="block relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                        >
                          <Image
                            src={
                              artist.images && artist.images.length > 0
                                ? artist.images[0].url
                                : "https://via.placeholder.com/300"
                            }
                            alt={artist.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </Link>
                        <div className="h-12 flex items-center">
                          <Link
                            href={`/artist/${artist.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {artist.name}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 오디오 플레이어 섹션 주석 처리
              <div className="bg-card-bg rounded-lg p-4">
                <h2 className="text-lg font-bold mb-3">미리 들어보기</h2>
                <div className="flex items-center gap-3">
                  <button className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                    <IoPlayCircleOutline size={24} className="text-white" />
                  </button>
                  <div className="flex-grow">
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: "30%" }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1 text-text-secondary">
                      <span>0:00</span>
                      <span>3:42</span>
                    </div>
                  </div>
                </div>
              </div>
              */}
            </motion.div>

            {/* 추천 트랙 섹션 주석 처리
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-1"
            >
              <div className="sticky top-20">
                <h2 className="text-lg font-bold mb-4">비슷한 트랙</h2>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-2 hover:bg-card-bg rounded-md transition-colors"
                    >
                      <div className="relative w-10 h-10 flex-shrink-0">
                        <Image
                          src={albumImage}
                          alt="관련 트랙"
                          fill
                          sizes="40px"
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          비슷한 트랙 {item}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {artistNames}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            */}
          </div>
        </div>

        {/* 트랙 인사이트 섹션 주석 처리
        <div className="container px-4 mt-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-card-bg rounded-lg p-6"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <IoSparkles className="text-primary" />
              <span>트랙 인사이트</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-text-secondary">장르</h3>
                <div className="flex flex-wrap gap-2">
                  {artist?.genres?.slice(0, 3).map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  )) || <span className="text-text-secondary">정보 없음</span>}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-text-secondary">BPM</h3>
                <p>128</p>
              </div>
              <div>
                <h3 className="font-medium text-text-secondary">키</h3>
                <p>C# 마이너</p>
              </div>
            </div>
          </motion.div>
        </div>
        */}
      </motion.div>

      {/* CSS 애니메이션 */}
      <style jsx global>{`
        @keyframes waveAnimation {
          0% {
            height: 10px;
          }
          100% {
            height: 35px;
          }
        }
      `}</style>
    </>
  );
}
