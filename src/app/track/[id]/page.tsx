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
        <div className="py-6">
          {/* 트랙 헤더 스켈레톤 */}
          <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
              <div
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: "var(--skeleton-bg)" }}
              />
            </div>
          </section>

          {/* 트랙 상세 정보 스켈레톤 */}
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 왼쪽 컬럼: 아티스트 정보 스켈레톤 */}
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

              {/* 오른쪽 컬럼: 트랙 정보 스켈레톤 */}
              <div className="space-y-6">
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
        className="py-6"
      >
        {/* 트랙 헤더 */}
        <section className="relative h-[40vh] min-h-[300px] max-h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background">
            <Image
              src={albumImage}
              alt={track.album?.name || "앨범 이미지"}
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
                    alt={track.album?.name || "앨범 이미지"}
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
                      {track.name}
                    </h1>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {track.artists.map((trackArtist, index) => (
                        <Link
                          key={trackArtist.id}
                          href={`/artist/${trackArtist.id}`}
                          className="text-lg text-white hover:text-primary drop-shadow-md"
                        >
                          {trackArtist.name}
                          {index < track.artists.length - 1 && ", "}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={`/album/${track.album?.id}`}
                      className="text-md text-white/80 mt-2 hover:text-primary"
                    >
                      {track.album?.name}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="container">
          {/* 트랙 정보 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            {/* 트랙 레이아웃 변경 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 왼쪽 컬럼: 아티스트 정보 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 아티스트 정보 섹션 */}
                {artists.length > 0 && (
                  <div className="bg-card-bg rounded-lg py-5">
                    <h2 className="text-lg font-bold mb-4">아티스트 정보</h2>
                    <div className="space-y-3">
                      {artists.map((artist) => (
                        <div
                          key={artist.id}
                          className="flex items-center gap-3"
                        >
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
              </div>

              {/* 오른쪽 컬럼: 트랙 정보 */}
              <div className="space-y-6">
                <div className="bg-card-bg rounded-lg py-5">
                  <h2 className="text-lg font-bold mb-4">트랙 정보</h2>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <IoMusicalNotesOutline
                        className="text-primary mt-1"
                        size={18}
                      />
                      <div>
                        <h3 className="font-medium">앨범</h3>
                        <p className="text-text-secondary">
                          <Link
                            href={`/album/${track.album?.id}`}
                            className="hover:text-primary"
                          >
                            {track.album?.name}
                          </Link>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <IoCalendarOutline
                        className="text-primary mt-1"
                        size={18}
                      />
                      <div>
                        <h3 className="font-medium">릴리즈</h3>
                        <p className="text-text-secondary">
                          {track.album?.release_date || "알 수 없음"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <IoTimeOutline className="text-primary mt-1" size={18} />
                      <div>
                        <h3 className="font-medium">재생 시간</h3>
                        <p className="text-text-secondary">
                          {Math.floor(track.duration_ms / 60000)}:
                          {((track.duration_ms % 60000) / 1000)
                            .toFixed(0)
                            .padStart(2, "0")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <IoTrendingUpOutline
                        className="text-primary mt-1"
                        size={18}
                      />
                      <div>
                        <h3 className="font-medium">인기도</h3>
                        <p className="text-text-secondary">
                          {track.popularity || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
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
