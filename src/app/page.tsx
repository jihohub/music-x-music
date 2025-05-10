import FeaturedArtists from "@/features/music/components/FeaturedArtists";
import RecommendedTracks from "@/features/music/components/RecommendedTracks";
import Link from "next/link";

// 임시 데이터 (스포티파이 API 연동 전까지 사용)
const featuredArtists = [
  {
    id: "1",
    name: "James Hype",
    image: "https://i.scdn.co/image/ab6761610000e5eb0e8990808a36ee10a89c2756",
    genre: "하우스/댄스",
  },
  {
    id: "2",
    name: "SZA",
    image: "https://i.scdn.co/image/ab6761610000e5ebc63ded1952c1e47780b09fe5",
    genre: "R&B/팝",
  },
  {
    id: "3",
    name: "아이브",
    image: "https://i.scdn.co/image/ab6761610000e5eb57913ecbbd75d133fd2acc3a",
    genre: "케이팝",
  },
  {
    id: "4",
    name: "켄드릭 라마",
    image: "https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022",
    genre: "힙합",
  },
];

const recommendedTracks = [
  {
    id: "1",
    title: "Ferrari",
    artist: "James Hype, Miggy Dela Rosa",
    image: "https://i.scdn.co/image/ab67616d0000b2739b2c42d86a2266bc4f94c94e",
  },
  {
    id: "2",
    title: "Kill Bill",
    artist: "SZA",
    image: "https://i.scdn.co/image/ab67616d0000b273a5e77225cdcfb7e7bba54ddf",
  },
  {
    id: "3",
    title: "Kitsch",
    artist: "아이브",
    image: "https://i.scdn.co/image/ab67616d0000b273cec64a92b0d3909299e8bc0a",
  },
  {
    id: "4",
    title: "Blessing Me",
    artist: "James Hype, Pia Mia",
    image: "https://i.scdn.co/image/ab67616d0000b273a7fe308f6d0238841a93c477",
  },
  {
    id: "5",
    title: "I Hate U",
    artist: "SZA",
    image: "https://i.scdn.co/image/ab67616d0000b2739eb49afd8e36bbdfa06f1c34",
  },
  {
    id: "6",
    title: "N95",
    artist: "켄드릭 라마",
    image: "https://i.scdn.co/image/ab67616d0000b273fec947f99a5c3597cfa05676",
  },
];

// 장르 데이터는 정적으로 유지
const genres = [
  { id: "pop", name: "팝", color: "#E8115B" },
  { id: "hiphop", name: "힙합", color: "#F230AA" },
  { id: "kpop", name: "케이팝", color: "#1DB954" },
  { id: "rnb", name: "R&B", color: "#BA5DE8" },
  { id: "indie", name: "인디", color: "#148A08" },
  { id: "rock", name: "록", color: "#BC5900" },
  { id: "electronic", name: "일렉트로닉", color: "#509BF5" },
  { id: "classical", name: "클래식", color: "#7D4B32" },
];

export default function Home() {
  return (
    <div className="py-6 space-y-8">
      {/* 헤로 섹션 */}
      <section className="mb-8">
        <div className="rounded-lg bg-gradient-to-r from-primary to-primary-hover p-6">
          <h2 className="text-2xl font-bold mb-2">안녕하세요!</h2>
          <p className="mb-4">오늘은 어떤 음악을 들으시겠어요?</p>
          <Link
            href="/search"
            className="btn btn-secondary bg-white text-primary"
          >
            음악 찾기
          </Link>
        </div>
      </section>

      {/* 인기 아티스트 */}
      <section>
        <div className="flex-between mb-4">
          <h2 className="text-xl font-bold">인기 아티스트</h2>
          <Link href="/artists" className="text-primary text-sm font-medium">
            더보기
          </Link>
        </div>
        <FeaturedArtists />
      </section>

      {/* 추천 트랙 */}
      <section>
        <div className="flex-between mb-4">
          <h2 className="text-xl font-bold">추천 트랙</h2>
          <Link href="/tracks" className="text-primary text-sm font-medium">
            더보기
          </Link>
        </div>
        <RecommendedTracks />
      </section>

      {/* 장르 */}
      <section>
        <div className="flex-between mb-4">
          <h2 className="text-xl font-bold">장르</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {genres.map((genre) => (
            <Link
              href={`/genre/${genre.id}`}
              key={genre.id}
              className="rounded-md p-4 h-24 flex items-center justify-center"
              style={{ backgroundColor: genre.color }}
            >
              <span className="text-white font-bold text-lg">{genre.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
