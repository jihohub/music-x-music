"use client";

import Header from "@/components/Header";
import { searchSpotify } from "@/features/music/api";
import { SpotifyAlbum, SpotifyArtist, SpotifyTrack } from "@/lib/spotify-api";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline, IoSearchOutline } from "react-icons/io5";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [artists, setArtists] = useState<SpotifyArtist[]>([]);
  const [albums, setAlbums] = useState<SpotifyAlbum[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 인기 검색어
  const popularSearches = [
    "NewJeans",
    "아이유",
    "The Weeknd",
    "Doja Cat",
    "aespa",
    "FIFTY FIFTY",
    "케이팝",
    "힙합",
    "일렉트로닉",
    "R&B",
  ];

  // 검색 함수
  const performSearch = async (term: string) => {
    if (term.trim().length < 2) {
      setTracks([]);
      setArtists([]);
      setAlbums([]);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await searchSpotify(term);

      // 검색 결과 설정
      setTracks(results.tracks?.items || []);
      setArtists(results.artists?.items || []);
      setAlbums(results.albums?.items || []);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
      setSearchError("검색 중 오류가 발생했습니다. 다시 시도해주세요.");
      setTracks([]);
      setArtists([]);
      setAlbums([]);
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
  };

  // 검색어 초기화
  const clearSearch = () => {
    setSearchTerm("");
    setTracks([]);
    setArtists([]);
    setAlbums([]);
    setSearchError(null);
  };

  // 인기 검색어 클릭
  const handlePopularSearchClick = (term: string) => {
    setSearchTerm(term);
    performSearch(term);
  };

  // 검색 실행 (디바운스 적용)
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 검색 결과가 있는지 확인
  const hasResults =
    tracks.length > 0 || artists.length > 0 || albums.length > 0;

  // 이미지가 없을 경우 기본 이미지 URL
  const defaultImage = "https://via.placeholder.com/300";

  return (
    <>
      <Header title="검색" />
      <div className="py-6 space-y-6 px-4">
        {/* 검색 입력 필드 */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <IoSearchOutline size={20} className="text-text-secondary" />
          </div>
          <input
            type="text"
            className="bg-card-bg w-full py-3 pl-10 pr-10 rounded-full text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="곡, 아티스트, 앨범 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={clearSearch}
            >
              <IoCloseCircleOutline size={20} className="text-text-secondary" />
            </button>
          )}
        </div>

        {/* 로딩 상태 */}
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center py-4"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">검색 중...</span>
          </motion.div>
        )}

        {/* 검색 오류 */}
        {searchError && (
          <div className="bg-red-500 bg-opacity-20 text-red-200 p-4 rounded-lg">
            {searchError}
          </div>
        )}

        {/* 검색 결과 */}
        {!isSearching && hasResults && (
          <div className="space-y-8">
            {/* 아티스트 검색 결과 */}
            {artists.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold">아티스트</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {artists.slice(0, 4).map((artist) => (
                    <Link
                      href={`/artist/${artist.id}`}
                      key={artist.id}
                      className="group"
                    >
                      <div className="overflow-hidden rounded-lg aspect-square relative bg-card-bg">
                        <Image
                          src={
                            artist.images && artist.images.length > 0
                              ? artist.images[0].url
                              : defaultImage
                          }
                          alt={artist.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="mt-2 font-semibold truncate">
                        {artist.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate">
                        아티스트
                      </p>
                    </Link>
                  ))}
                </div>
                {artists.length > 4 && (
                  <div className="flex justify-end">
                    <button className="text-primary hover:underline text-sm">
                      더 보기
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 트랙 검색 결과 */}
            {tracks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold">트랙</h2>
                <div className="space-y-2">
                  {tracks.slice(0, 5).map((track) => (
                    <Link
                      href={`/track/${track.id}`}
                      key={track.id}
                      className="flex items-center gap-4 p-3 rounded-md hover:bg-card-bg transition-colors"
                    >
                      <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={
                            track.album?.images && track.album.images.length > 0
                              ? track.album.images[0].url
                              : defaultImage
                          }
                          alt={track.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h3 className="font-semibold truncate">{track.name}</h3>
                        <p className="text-text-secondary text-sm truncate">
                          {track.artists.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                {tracks.length > 5 && (
                  <div className="flex justify-end">
                    <button className="text-primary hover:underline text-sm">
                      더 보기
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* 앨범 검색 결과 */}
            {albums.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="space-y-4"
              >
                <h2 className="text-xl font-bold">앨범</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {albums.slice(0, 4).map((album) => (
                    <Link
                      href={`/album/${album.id}`}
                      key={album.id}
                      className="group"
                    >
                      <div className="overflow-hidden rounded-md aspect-square relative bg-card-bg">
                        <Image
                          src={
                            album.images && album.images.length > 0
                              ? album.images[0].url
                              : defaultImage
                          }
                          alt={album.name}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="mt-2 font-semibold truncate">
                        {album.name}
                      </h3>
                      <p className="text-sm text-text-secondary truncate">
                        {album.artists.map((a) => a.name).join(", ")}
                      </p>
                    </Link>
                  ))}
                </div>
                {albums.length > 4 && (
                  <div className="flex justify-end">
                    <button className="text-primary hover:underline text-sm">
                      더 보기
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        )}

        {/* 검색 결과가 없고 로딩 중이 아닐 때 */}
        {!isSearching && !hasResults && !searchTerm && (
          <div className="space-y-6">
            {/* 인기 검색어 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">인기 검색어</h2>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term, index) => (
                  <button
                    key={index}
                    className="bg-card-bg px-4 py-2 rounded-full hover:bg-opacity-70 transition-colors"
                    onClick={() => handlePopularSearchClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* 장르 브라우징 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h2 className="text-xl font-bold mb-4">장르 및 분위기</h2>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-lg p-4 h-24 flex items-center justify-center bg-gradient-to-r from-green-400 to-green-600 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePopularSearchClick("K-Pop")}
                >
                  <span className="text-white font-bold text-lg">케이팝</span>
                </div>
                <div
                  className="rounded-lg p-4 h-24 flex items-center justify-center bg-gradient-to-r from-pink-400 to-pink-600 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePopularSearchClick("Pop")}
                >
                  <span className="text-white font-bold text-lg">팝</span>
                </div>
                <div
                  className="rounded-lg p-4 h-24 flex items-center justify-center bg-gradient-to-r from-purple-400 to-purple-600 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePopularSearchClick("Hip Hop")}
                >
                  <span className="text-white font-bold text-lg">힙합</span>
                </div>
                <div
                  className="rounded-lg p-4 h-24 flex items-center justify-center bg-gradient-to-r from-blue-400 to-blue-600 cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => handlePopularSearchClick("R&B")}
                >
                  <span className="text-white font-bold text-lg">R&B</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* 검색 결과가 없고 검색어가 있는 경우 */}
        {!isSearching && !hasResults && searchTerm && !searchError && (
          <div className="text-center py-8">
            <p className="text-lg text-text-secondary">
              "{searchTerm}"에 대한 검색 결과가 없습니다.
            </p>
            <p className="text-sm text-text-secondary mt-2">
              다른 키워드로 검색해보세요.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
