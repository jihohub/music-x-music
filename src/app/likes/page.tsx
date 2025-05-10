"use client";

import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  IoAlbumsOutline,
  IoMusicalNoteOutline,
  IoPersonOutline,
} from "react-icons/io5";

// 더미 데이터 - 좋아요한 콘텐츠
const likedTracks = [
  {
    id: "3",
    title: "Lilac",
    artist: "아이유",
    image: "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
    date: "2023-12-01",
  },
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    image: "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
    date: "2023-11-28",
  },
  {
    id: "2",
    title: "Hype Boy",
    artist: "NewJeans",
    image: "https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01",
    date: "2023-11-15",
  },
];

const likedArtists = [
  {
    id: "1",
    name: "아이유",
    image: "https://i.scdn.co/image/ab6761610000e5ebc8d92f2f625cd1c86a3566f6",
    genre: "케이팝",
    date: "2023-12-05",
  },
  {
    id: "2",
    name: "The Weeknd",
    image: "https://i.scdn.co/image/ab6761610000e5ebb5f9e28219c169fd4b9e8379",
    genre: "R&B/팝",
    date: "2023-11-20",
  },
];

const likedAlbums = [
  {
    id: "201",
    title: "IU 5th Album 'LILAC'",
    artist: "아이유",
    image: "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
    year: "2021",
    date: "2023-12-01",
  },
  {
    id: "205",
    title: "After Hours",
    artist: "The Weeknd",
    image: "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
    year: "2020",
    date: "2023-11-28",
  },
];

type LikeTab = "tracks" | "artists" | "albums";

export default function LikesPage() {
  const [activeTab, setActiveTab] = useState<LikeTab>("tracks");

  return (
    <>
      <Header title="좋아요" />
      <div className="py-6 space-y-8">
        {/* 탭 선택 */}
        <div className="flex border-b border-border-color">
          <button
            className={`flex items-center gap-2 px-4 py-3 font-medium ${
              activeTab === "tracks"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary"
            }`}
            onClick={() => setActiveTab("tracks")}
          >
            <IoMusicalNoteOutline size={20} />
            <span>트랙</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 font-medium ${
              activeTab === "artists"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary"
            }`}
            onClick={() => setActiveTab("artists")}
          >
            <IoPersonOutline size={20} />
            <span>아티스트</span>
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-3 font-medium ${
              activeTab === "albums"
                ? "text-primary border-b-2 border-primary"
                : "text-text-secondary"
            }`}
            onClick={() => setActiveTab("albums")}
          >
            <IoAlbumsOutline size={20} />
            <span>앨범</span>
          </button>
        </div>

        {/* 좋아요한 트랙 */}
        {activeTab === "tracks" && (
          <div>
            <h2 className="text-xl font-bold mb-4">좋아요한 트랙</h2>
            {likedTracks.length > 0 ? (
              <div className="space-y-2">
                {likedTracks.map((track) => (
                  <Link
                    href={`/track/${track.id}`}
                    key={track.id}
                    className="flex items-center gap-4 p-2 rounded-md hover:bg-card-bg transition-colors"
                  >
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={track.image}
                        alt={track.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-medium text-ellipsis">
                        {track.title}
                      </h3>
                      <p className="text-text-secondary text-sm">
                        {track.artist}
                      </p>
                    </div>
                    <div className="text-text-secondary text-xs">
                      {track.date}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                <p className="mb-4">좋아요한 트랙이 없습니다</p>
                <Link href="/" className="btn btn-primary">
                  음악 탐색하기
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 좋아요한 아티스트 */}
        {activeTab === "artists" && (
          <div>
            <h2 className="text-xl font-bold mb-4">좋아요한 아티스트</h2>
            {likedArtists.length > 0 ? (
              <div className="space-y-4">
                {likedArtists.map((artist) => (
                  <Link
                    href={`/artist/${artist.id}`}
                    key={artist.id}
                    className="flex items-center gap-4 p-2 rounded-md hover:bg-card-bg transition-colors"
                  >
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={artist.image}
                        alt={artist.name}
                        fill
                        className="object-cover rounded-full"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-lg">{artist.name}</h3>
                      <p className="text-text-secondary">{artist.genre}</p>
                    </div>
                    <div className="text-text-secondary text-xs">
                      {artist.date}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                <p className="mb-4">좋아요한 아티스트가 없습니다</p>
                <Link href="/" className="btn btn-primary">
                  음악 탐색하기
                </Link>
              </div>
            )}
          </div>
        )}

        {/* 좋아요한 앨범 */}
        {activeTab === "albums" && (
          <div>
            <h2 className="text-xl font-bold mb-4">좋아요한 앨범</h2>
            {likedAlbums.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {likedAlbums.map((album) => (
                  <Link
                    href={`/album/${album.id}`}
                    key={album.id}
                    className="card"
                  >
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={album.image}
                        alt={album.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-sm text-ellipsis">
                        {album.title}
                      </h3>
                      <p className="text-text-secondary text-xs">
                        {album.artist} • {album.year}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
                <p className="mb-4">좋아요한 앨범이 없습니다</p>
                <Link href="/" className="btn btn-primary">
                  음악 탐색하기
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
