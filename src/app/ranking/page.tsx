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

// 더미 데이터
const topTracks = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    image: "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
    plays: "32,456,789",
  },
  {
    id: "2",
    title: "Hype Boy",
    artist: "NewJeans",
    image: "https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01",
    plays: "25,876,432",
  },
  {
    id: "3",
    title: "Lilac",
    artist: "아이유",
    image: "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
    plays: "12,345,678",
  },
  {
    id: "4",
    title: "Paint The Town Red",
    artist: "Doja Cat",
    image: "https://i.scdn.co/image/ab67616d0000b273e9ca8d3eb78153d4fd03161c",
    plays: "18,765,432",
  },
  {
    id: "5",
    title: "Attention",
    artist: "NewJeans",
    image: "https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01",
    plays: "24,567,890",
  },
  {
    id: "6",
    title: "Savage",
    artist: "aespa",
    image: "https://i.scdn.co/image/ab67616d0000b273ed4aaaa6c79f4a5f6b3547a8",
    plays: "21,345,678",
  },
  {
    id: "7",
    title: "Seven (feat. Latto)",
    artist: "정국",
    image: "https://i.scdn.co/image/ab67616d0000b273d40977572aa4e3d93840805c",
    plays: "19,876,543",
  },
  {
    id: "8",
    title: "Super Shy",
    artist: "NewJeans",
    image: "https://i.scdn.co/image/ab67616d0000b2736da02e4f562aa816ce5e3a70",
    plays: "18,765,432",
  },
  {
    id: "9",
    title: "Love Me Like That",
    artist: "Sam Smith",
    image: "https://i.scdn.co/image/ab67616d0000b27390fd9566e8996b6db4efac0c",
    plays: "17,654,321",
  },
  {
    id: "10",
    title: "As It Was",
    artist: "Harry Styles",
    image: "https://i.scdn.co/image/ab67616d0000b273b46f74097655d7f353caab14",
    plays: "16,543,210",
  },
];

const topArtists = [
  {
    id: "2",
    name: "The Weeknd",
    image: "https://i.scdn.co/image/ab6761610000e5ebb5f9e28219c169fd4b9e8379",
    genre: "R&B/팝",
    followers: "108,543,678",
  },
  {
    id: "3",
    name: "NewJeans",
    image: "https://i.scdn.co/image/ab6761610000e5eb4e6c9c4ed8e44ec7c30f2610",
    genre: "케이팝",
    followers: "35,765,321",
  },
  {
    id: "1",
    name: "아이유",
    image: "https://i.scdn.co/image/ab6761610000e5ebc8d92f2f625cd1c86a3566f6",
    genre: "케이팝",
    followers: "9,432,123",
  },
  {
    id: "4",
    name: "Doja Cat",
    image: "https://i.scdn.co/image/ab6761610000e5ebc5ceb05f152103b2b70f139e",
    genre: "힙합/팝",
    followers: "28,765,432",
  },
  {
    id: "5",
    name: "aespa",
    image: "https://i.scdn.co/image/ab6761610000e5ebc64f600f37fb38c287469bb7",
    genre: "케이팝",
    followers: "15,678,901",
  },
];

const topAlbums = [
  {
    id: "205",
    title: "After Hours",
    artist: "The Weeknd",
    image: "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
    year: "2020",
  },
  {
    id: "301",
    title: "NewJeans 1st EP",
    artist: "NewJeans",
    image: "https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01",
    year: "2022",
  },
  {
    id: "201",
    title: "IU 5th Album 'LILAC'",
    artist: "아이유",
    image: "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
    year: "2021",
  },
  {
    id: "401",
    title: "Scarlet",
    artist: "Doja Cat",
    image: "https://i.scdn.co/image/ab67616d0000b273e9ca8d3eb78153d4fd03161c",
    year: "2023",
  },
  {
    id: "501",
    title: "Savage - The 1st Mini Album",
    artist: "aespa",
    image: "https://i.scdn.co/image/ab67616d0000b273ed4aaaa6c79f4a5f6b3547a8",
    year: "2021",
  },
];

type RankingTab = "tracks" | "artists" | "albums";

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<RankingTab>("tracks");

  return (
    <>
      <Header title="랭킹" />
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

        {/* 트랙 랭킹 */}
        {activeTab === "tracks" && (
          <div>
            <h2 className="text-xl font-bold mb-4">인기 트랙 TOP 10</h2>
            <div className="space-y-2">
              {topTracks.map((track, index) => (
                <Link
                  href={`/track/${track.id}`}
                  key={track.id}
                  className="flex items-center gap-4 p-2 rounded-md hover:bg-card-bg transition-colors"
                >
                  <div className="w-6 text-center font-bold">{index + 1}</div>
                  <div className="relative w-12 h-12 flex-shrink-0">
                    <Image
                      src={track.image}
                      alt={track.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h3 className="font-medium text-ellipsis">{track.title}</h3>
                    <p className="text-text-secondary text-sm">
                      {track.artist}
                    </p>
                  </div>
                  <div className="text-text-secondary text-sm">
                    {track.plays}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 아티스트 랭킹 */}
        {activeTab === "artists" && (
          <div>
            <h2 className="text-xl font-bold mb-4">인기 아티스트 TOP 5</h2>
            <div className="space-y-4">
              {topArtists.map((artist, index) => (
                <Link
                  href={`/artist/${artist.id}`}
                  key={artist.id}
                  className="flex items-center gap-4 p-2 rounded-md hover:bg-card-bg transition-colors"
                >
                  <div className="w-6 text-center font-bold">{index + 1}</div>
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
                  <div className="text-text-secondary text-sm">
                    팔로워 {artist.followers}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 앨범 랭킹 */}
        {activeTab === "albums" && (
          <div>
            <h2 className="text-xl font-bold mb-4">인기 앨범 TOP 5</h2>
            <div className="grid grid-cols-2 gap-4">
              {topAlbums.map((album, index) => (
                <Link
                  href={`/album/${album.id}`}
                  key={album.id}
                  className="card"
                >
                  <div className="relative">
                    <div className="absolute top-2 left-2 z-10 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="relative aspect-square w-full overflow-hidden">
                      <Image
                        src={album.image}
                        alt={album.title}
                        fill
                        className="object-cover"
                      />
                    </div>
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
          </div>
        )}
      </div>
    </>
  );
}
