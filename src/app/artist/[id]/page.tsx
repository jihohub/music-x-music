"use client";

import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// 임시 데이터 (스포티파이 API 연동 전까지 사용)
const artists = {
  "1": {
    id: "1",
    name: "아이유",
    image: "https://i.scdn.co/image/ab6761610000e5ebc8d92f2f625cd1c86a3566f6",
    bannerImage:
      "https://i.scdn.co/image/ab676186000010160a38e2c76eaf75ed83ca383f",
    monthlyListeners: "9,432,123",
    bio: '이지은(Lee Ji-eun), 예명 아이유(IU)는 대한민국의 가수, 작곡가, 배우입니다. 2008년에 데뷔하여 "좋은 날", "밤편지", "삐삐", "라일락" 등의 히트곡을 발표했습니다.',
    popularTracks: [
      {
        id: "101",
        title: "라일락",
        album: "IU 5th Album 'LILAC'",
        plays: "12,345,678",
        image:
          "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
      },
      {
        id: "102",
        title: "밤편지",
        album: "Palette",
        plays: "11,234,567",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739c4a5ee6b0a18b7ae73926d2",
      },
      {
        id: "103",
        title: "Celebrity",
        album: "IU 5th Album 'LILAC'",
        plays: "10,987,654",
        image:
          "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
      },
      {
        id: "104",
        title: "좋은 날",
        album: "Real",
        plays: "9,876,543",
        image:
          "https://i.scdn.co/image/ab67616d0000b2731e8981172836d5a4eabd50bc",
      },
      {
        id: "105",
        title: "블루밍",
        album: "Love poem",
        plays: "8,765,432",
        image:
          "https://i.scdn.co/image/ab67616d0000b273550458ffb3b2e0a4e5de00d3",
      },
    ],
    albums: [
      {
        id: "201",
        title: "IU 5th Album 'LILAC'",
        year: "2021",
        image:
          "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
      },
      {
        id: "202",
        title: "Love poem",
        year: "2019",
        image:
          "https://i.scdn.co/image/ab67616d0000b273550458ffb3b2e0a4e5de00d3",
      },
      {
        id: "203",
        title: "Palette",
        year: "2017",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739c4a5ee6b0a18b7ae73926d2",
      },
      {
        id: "204",
        title: "CHAT-SHIRE",
        year: "2015",
        image:
          "https://i.scdn.co/image/ab67616d0000b273a23e4d4fa7e0169f08aaae7f",
      },
    ],
  },
  "2": {
    id: "2",
    name: "The Weeknd",
    image: "https://i.scdn.co/image/ab6761610000e5ebb5f9e28219c169fd4b9e8379",
    bannerImage:
      "https://i.scdn.co/image/ab67618600001016a698536f5f79998375996d9a",
    monthlyListeners: "108,543,678",
    bio: 'The Weeknd은 캐나다의 가수, 작곡가, 프로듀서입니다. 본명은 Abel Makkonen Tesfaye이며, "Blinding Lights", "Starboy", "Save Your Tears" 등의 히트곡으로 잘 알려져 있습니다.',
    popularTracks: [
      {
        id: "106",
        title: "Blinding Lights",
        album: "After Hours",
        plays: "32,456,789",
        image:
          "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
      },
      {
        id: "107",
        title: "Save Your Tears",
        album: "After Hours",
        plays: "28,765,432",
        image:
          "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
      },
      {
        id: "108",
        title: "Starboy",
        album: "Starboy",
        plays: "27,654,321",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739317f85a5f5eff5a4850c192",
      },
      {
        id: "109",
        title: "Die For You",
        album: "Starboy",
        plays: "25,432,109",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739317f85a5f5eff5a4850c192",
      },
      {
        id: "110",
        title: "The Hills",
        album: "Beauty Behind The Madness",
        plays: "23,456,789",
        image:
          "https://i.scdn.co/image/ab67616d0000b2737fcead687e99583072cc217b",
      },
    ],
    albums: [
      {
        id: "205",
        title: "After Hours",
        year: "2020",
        image:
          "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
      },
      {
        id: "206",
        title: "Starboy",
        year: "2016",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739317f85a5f5eff5a4850c192",
      },
      {
        id: "207",
        title: "Beauty Behind The Madness",
        year: "2015",
        image:
          "https://i.scdn.co/image/ab67616d0000b2737fcead687e99583072cc217b",
      },
      {
        id: "208",
        title: "Dawn FM",
        year: "2022",
        image:
          "https://i.scdn.co/image/ab67616d0000b273539fdca4290e275543a89fb5",
      },
    ],
  },
};

export default function ArtistPage({ params }: { params: { id: string } }) {
  const pathname = usePathname();
  const artist = artists[params.id as keyof typeof artists];

  useEffect(() => {
    // 여기에 스포티파이 API 호출 코드가 들어갈 예정
  }, [params.id]);

  if (!artist) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">아티스트를 찾을 수 없습니다</h1>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header title={artist.name} />
      <div className="py-6 space-y-8">
        {/* 아티스트 헤더 */}
        <section className="relative">
          <div className="relative w-full h-64 overflow-hidden">
            <Image
              src={artist.bannerImage}
              alt={artist.name}
              fill
              className="object-cover"
              quality={100}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background opacity-90"></div>
          </div>

          <div className="container relative -mt-24 flex items-end gap-6 px-4">
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-background">
              <Image
                src={artist.image}
                alt={artist.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold mb-1">{artist.name}</h1>
              <p className="text-text-secondary">
                월간 청취자 {artist.monthlyListeners}명
              </p>
            </div>
          </div>
        </section>

        {/* 인기 트랙 */}
        <section className="container px-4">
          <h2 className="text-xl font-bold mb-4">인기 트랙</h2>
          <div className="space-y-2">
            {artist.popularTracks.map((track, index) => (
              <Link
                href={`/track/${track.id}`}
                key={track.id}
                className="flex items-center gap-4 p-2 rounded-md hover:bg-card-bg transition-colors"
              >
                <div className="text-text-secondary w-6 text-center">
                  {index + 1}
                </div>
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
                    {track.plays} 회
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 아티스트 소개 */}
        <section className="container px-4">
          <h2 className="text-xl font-bold mb-3">소개</h2>
          <p className="text-text-secondary">{artist.bio}</p>
        </section>

        {/* 디스코그래피 */}
        <section className="container px-4">
          <h2 className="text-xl font-bold mb-4">디스코그래피</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {artist.albums.map((album) => (
              <Link href={`/album/${album.id}`} key={album.id} className="card">
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
                  <p className="text-text-secondary text-xs">{album.year}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
