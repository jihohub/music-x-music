"use client";

import Header from "@/components/Header";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IoCalendarOutline,
  IoHeart,
  IoHeartOutline,
  IoMusicalNotesOutline,
  IoPlayCircleOutline,
  IoShareSocialOutline,
  IoTimeOutline,
} from "react-icons/io5";

// 임시 데이터 (스포티파이 API 연동 전까지 사용)
const tracks = {
  "101": {
    id: "101",
    title: "라일락",
    artist: "아이유",
    artistId: "1",
    album: "IU 5th Album 'LILAC'",
    albumId: "201",
    image: "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
    duration: "3:35",
    releaseDate: "2021-03-25",
    plays: "12,345,678",
    features: ["Pop", "K-Pop"],
    lyrics: `나리는 꽃가루에 눈이 따끔해 (아야)\n눈물이 고여도 꾹 참을래\n내 마음 한켠 비밀스런 오르골에 넣어두고서\n영원히 되감을 순간이니까\n\n우리 둘의 마지막 페이지를 잘 부탁해\n어느 작별이 이보다 완벽할까\n Love me only till this spring\n\n오 라일락 꽃이 지는 날 Good bye\n이런 결말이 어울려 \n안녕 꽃잎 같은 안녕\n하이얀 우리 봄날의 climax\n아 얼마나 기쁜일이야\n\n... (중략) ...`,
    similarTracks: [
      {
        id: "102",
        title: "밤편지",
        artist: "아이유",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739c4a5ee6b0a18b7ae73926d2",
      },
      {
        id: "103",
        title: "Celebrity",
        artist: "아이유",
        image:
          "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
      },
      {
        id: "104",
        title: "좋은 날",
        artist: "아이유",
        image:
          "https://i.scdn.co/image/ab67616d0000b2731e8981172836d5a4eabd50bc",
      },
    ],
  },
  "106": {
    id: "106",
    title: "Blinding Lights",
    artist: "The Weeknd",
    artistId: "2",
    album: "After Hours",
    albumId: "205",
    image: "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
    duration: "3:20",
    releaseDate: "2020-03-20",
    plays: "32,456,789",
    features: ["Synth-pop", "Dance-pop"],
    lyrics: `Yeah\n\nI've been tryna call\nI've been on my own for long enough\nMaybe you can show me how to love, maybe\nI'm going through withdrawals\nYou don't even have to do too much\nYou can turn me on with just a touch, baby\n\nI look around and Sin City's cold and empty (oh)\nNo one's around to judge me (oh)\nI can't see clearly when you're gone\n\nI said, ooh, I'm blinded by the lights\nNo, I can't sleep until I feel your touch\nI said, ooh, I'm drowning in the night\nOh, when I'm like this, you're the one I trust\n\n... (중략) ...`,
    similarTracks: [
      {
        id: "107",
        title: "Save Your Tears",
        artist: "The Weeknd",
        image:
          "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
      },
      {
        id: "108",
        title: "Starboy",
        artist: "The Weeknd",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739317f85a5f5eff5a4850c192",
      },
      {
        id: "109",
        title: "Die For You",
        artist: "The Weeknd",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739317f85a5f5eff5a4850c192",
      },
    ],
  },
  "1": {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    artistId: "2",
    album: "After Hours",
    albumId: "205",
    image: "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
    duration: "3:20",
    releaseDate: "2020-03-20",
    plays: "32,456,789",
    features: ["Synth-pop", "Dance-pop"],
    lyrics: `Yeah\n\nI've been tryna call\nI've been on my own for long enough\nMaybe you can show me how to love, maybe\nI'm going through withdrawals\nYou don't even have to do too much\nYou can turn me on with just a touch, baby\n\nI look around and Sin City's cold and empty (oh)\nNo one's around to judge me (oh)\nI can't see clearly when you're gone\n\nI said, ooh, I'm blinded by the lights\nNo, I can't sleep until I feel your touch\nI said, ooh, I'm drowning in the night\nOh, when I'm like this, you're the one I trust\n\n... (중략) ...`,
    similarTracks: [
      {
        id: "107",
        title: "Save Your Tears",
        artist: "The Weeknd",
        image:
          "https://i.scdn.co/image/ab67616d0000b2732f7f8273a666e35383bacc65",
      },
      {
        id: "108",
        title: "Starboy",
        artist: "The Weeknd",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739317f85a5f5eff5a4850c192",
      },
      {
        id: "109",
        title: "Die For You",
        artist: "The Weeknd",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739317f85a5f5eff5a4850c192",
      },
    ],
  },
  "2": {
    id: "2",
    title: "Hype Boy",
    artist: "NewJeans",
    artistId: "3",
    album: "NewJeans 1st EP 'New Jeans'",
    albumId: "301",
    image: "https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01",
    duration: "2:59",
    releaseDate: "2022-08-01",
    plays: "25,876,432",
    features: ["K-Pop", "Dance"],
    lyrics: `(Hype boy) 너만 원해 Hype boy\n내가 전해 Hype boy\n널 따라가 Hype boy\n뭐라도 될 Hype boy\n\n너라는 책의 내용 속에\n행간을 읽고 싶어\n널 담은 건 백 퍼센 나의 취향\n다 알아 맞혀\n\n... (중략) ...`,
    similarTracks: [
      {
        id: "5",
        title: "Attention",
        artist: "NewJeans",
        image:
          "https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01",
      },
      {
        id: "201",
        title: "OMG",
        artist: "NewJeans",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739c4a5ee6b0a18b7ae73926d2",
      },
      {
        id: "202",
        title: "Ditto",
        artist: "NewJeans",
        image:
          "https://i.scdn.co/image/ab67616d0000b273d016d39658cfa0a13bf71d59",
      },
    ],
  },
  "3": {
    id: "3",
    title: "Lilac",
    artist: "아이유",
    artistId: "1",
    album: "IU 5th Album 'LILAC'",
    albumId: "201",
    image: "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
    duration: "3:35",
    releaseDate: "2021-03-25",
    plays: "12,345,678",
    features: ["Pop", "K-Pop"],
    lyrics: `나리는 꽃가루에 눈이 따끔해 (아야)\n눈물이 고여도 꾹 참을래\n내 마음 한켠 비밀스런 오르골에 넣어두고서\n영원히 되감을 순간이니까\n\n우리 둘의 마지막 페이지를 잘 부탁해\n어느 작별이 이보다 완벽할까\n Love me only till this spring\n\n오 라일락 꽃이 지는 날 Good bye\n이런 결말이 어울려 \n안녕 꽃잎 같은 안녕\n하이얀 우리 봄날의 climax\n아 얼마나 기쁜일이야\n\n... (중략) ...`,
    similarTracks: [
      {
        id: "102",
        title: "밤편지",
        artist: "아이유",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739c4a5ee6b0a18b7ae73926d2",
      },
      {
        id: "103",
        title: "Celebrity",
        artist: "아이유",
        image:
          "https://i.scdn.co/image/ab67616d0000b273b658330eca5deefbe3f050c0",
      },
      {
        id: "104",
        title: "좋은 날",
        artist: "아이유",
        image:
          "https://i.scdn.co/image/ab67616d0000b2731e8981172836d5a4eabd50bc",
      },
    ],
  },
  "4": {
    id: "4",
    title: "Paint The Town Red",
    artist: "Doja Cat",
    artistId: "4",
    album: "Scarlet",
    albumId: "401",
    image: "https://i.scdn.co/image/ab67616d0000b273e9ca8d3eb78153d4fd03161c",
    duration: "3:50",
    releaseDate: "2023-09-22",
    plays: "18,765,432",
    features: ["Hip-Hop", "Pop"],
    lyrics: `It's the one and only, it's the OD\nI'm the heavyweight champion, ring the alarm\nBitches want smoke, I'm the OG\nI'm the hardest in the game, this where I belong\n\nSo many hits, can't remember them all\nWhile you're working at your 9 to 5, I'm working on the charts\nCaught all the stars, went to Mars\nBought out the block, went to war, and still won't battle-scar\n\n... (중략) ...`,
    similarTracks: [
      {
        id: "401",
        title: "Woman",
        artist: "Doja Cat",
        image:
          "https://i.scdn.co/image/ab67616d0000b273c4f7c9bb327875dd3428742a",
      },
      {
        id: "402",
        title: "Say So",
        artist: "Doja Cat",
        image:
          "https://i.scdn.co/image/ab67616d0000b273d42a57a0b3ab2201c35380b8",
      },
      {
        id: "403",
        title: "Kiss Me More",
        artist: "Doja Cat",
        image:
          "https://i.scdn.co/image/ab67616d0000b273908280d9807127e185b71d52",
      },
    ],
  },
  "5": {
    id: "5",
    title: "Attention",
    artist: "NewJeans",
    artistId: "3",
    album: "NewJeans 1st EP 'New Jeans'",
    albumId: "301",
    image: "https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01",
    duration: "3:00",
    releaseDate: "2022-07-22",
    plays: "24,567,890",
    features: ["K-Pop", "Dance"],
    lyrics: `You and me 내 맘이 보이지\nYou and me 투명하게 보이지\n(That's a big no-no)\n\nYou and me 경고하고 있어\nYou and me 이대로 두지 않기로 해\n\nYou want my attention\nYou want my attention\nYou want my attention\nYou got it\n\n... (중략) ...`,
    similarTracks: [
      {
        id: "2",
        title: "Hype Boy",
        artist: "NewJeans",
        image:
          "https://i.scdn.co/image/ab67616d0000b273d70036292d54f29e8b68ec01",
      },
      {
        id: "201",
        title: "OMG",
        artist: "NewJeans",
        image:
          "https://i.scdn.co/image/ab67616d0000b2739c4a5ee6b0a18b7ae73926d2",
      },
      {
        id: "202",
        title: "Ditto",
        artist: "NewJeans",
        image:
          "https://i.scdn.co/image/ab67616d0000b273d016d39658cfa0a13bf71d59",
      },
    ],
  },
  "6": {
    id: "6",
    title: "Savage",
    artist: "aespa",
    artistId: "5",
    album: "Savage - The 1st Mini Album",
    albumId: "501",
    image: "https://i.scdn.co/image/ab67616d0000b273ed4aaaa6c79f4a5f6b3547a8",
    duration: "3:40",
    releaseDate: "2021-10-05",
    plays: "21,345,678",
    features: ["K-Pop", "Dance"],
    lyrics: `Oh my gosh\n네 손길 내 귓가에 닿을 때\n난 미칠 것만 같아 중독된 듯이\n더 원해 갈수록\n\nGet me get me now\nGet me get me now (Zu zu zu zu)\n\n기분은 천국 위\nToo nice 날 위한 거니\n완전히 넘어가\nI'm a Savage\n\n... (중략) ...`,
    similarTracks: [
      {
        id: "501",
        title: "Next Level",
        artist: "aespa",
        image:
          "https://i.scdn.co/image/ab67616d0000b273a1d8b7c5b5752172469a5ecb",
      },
      {
        id: "502",
        title: "Black Mamba",
        artist: "aespa",
        image:
          "https://i.scdn.co/image/ab67616d0000b273c5cd9e88cf7506c24a73d661",
      },
      {
        id: "503",
        title: "Girls",
        artist: "aespa",
        image:
          "https://i.scdn.co/image/ab67616d0000b273c937b4a6af1821721a1e18d2",
      },
    ],
  },
};

export default function TrackPage({ params }: { params: { id: string } }) {
  const [isLiked, setIsLiked] = useState(false);
  const track = tracks[params.id as keyof typeof tracks];

  useEffect(() => {
    // 여기에 스포티파이 API 호출 코드가 들어갈 예정
    console.log("현재 트랙 ID:", params.id);
  }, [params.id]);

  if (!track) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h1 className="text-2xl font-bold mb-4">트랙을 찾을 수 없습니다</h1>
        <p className="mb-4 text-text-secondary">요청하신 ID: {params.id}</p>
        <Link href="/" className="btn btn-primary">
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <>
      <Header title={track.title} />
      <div className="py-6 space-y-8">
        {/* 트랙 헤더 */}
        <section className="container px-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative w-64 h-64 shadow-lg">
              <Image
                src={track.image}
                alt={track.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col items-center sm:items-start">
              <h1 className="text-3xl font-bold mb-2">{track.title}</h1>
              <Link
                href={`/artist/${track.artistId}`}
                className="text-xl text-primary mb-4 hover:underline"
              >
                {track.artist}
              </Link>

              <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1 text-text-secondary text-sm">
                  <IoMusicalNotesOutline size={18} />
                  <span>{track.album}</span>
                </div>
                <div className="flex items-center gap-1 text-text-secondary text-sm">
                  <IoTimeOutline size={18} />
                  <span>{track.duration}</span>
                </div>
                <div className="flex items-center gap-1 text-text-secondary text-sm">
                  <IoCalendarOutline size={18} />
                  <span>{track.releaseDate}</span>
                </div>
              </div>

              <div className="flex gap-4 mt-2">
                <button className="btn btn-primary flex items-center gap-2">
                  <IoPlayCircleOutline size={20} />
                  재생
                </button>
                <button
                  onClick={toggleLike}
                  className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
                  aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                >
                  {isLiked ? (
                    <IoHeart size={24} className="text-primary" />
                  ) : (
                    <IoHeartOutline size={24} />
                  )}
                </button>
                <button
                  className="p-2 rounded-full hover:bg-opacity-10 hover:bg-gray-500 transition-colors"
                  aria-label="공유하기"
                >
                  <IoShareSocialOutline size={24} />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {track.features.map((feature, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 rounded-full bg-card-bg text-text-secondary"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 가사 */}
        <section className="container px-4">
          <h2 className="text-xl font-bold mb-4">가사</h2>
          <div className="bg-card-bg rounded-lg p-4 whitespace-pre-line">
            {track.lyrics}
          </div>
        </section>

        {/* 비슷한 트랙 */}
        <section className="container px-4">
          <h2 className="text-xl font-bold mb-4">이런 노래는 어떠세요?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {track.similarTracks.map((similar) => (
              <Link
                href={`/track/${similar.id}`}
                key={similar.id}
                className="card"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={similar.image}
                    alt={similar.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-ellipsis">
                    {similar.title}
                  </h3>
                  <p className="text-text-secondary text-xs">
                    {similar.artist}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
