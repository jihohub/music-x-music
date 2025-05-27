"use client";

import UnoptimizedImage from "@/components/common/UnoptimizedImage";
import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";
import { DEFAULT_IMAGE_SM } from "@/constants/images";
import Link from "next/link";
import {
  IoCalendarOutline,
  IoMailOutline,
  IoSettingsOutline,
} from "react-icons/io5";

export default function ProfilePage() {
  // 임시 프로필 데이터
  const profile = {
    name: "릭오",
    username: "ricko",
    image: DEFAULT_IMAGE_SM, // 기본 프로필 이미지
    email: "ricko@gmail.com",
    joinDate: "2025년 1월 1일",
    stats: {
      following: 32,
      followers: 531,
      playlists: 12,
    },
  };

  return (
    <>
      <Header title="프로필" />
      <div className="py-6 space-y-8">
        {/* 프로필 헤더 */}
        <section className="flex flex-col items-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden mb-4">
            <UnoptimizedImage
              src={profile.image}
              alt={profile.name}
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
          <p className="text-text-secondary mb-2">@{profile.username}</p>

          <div className="flex justify-center gap-8 w-full mt-4">
            <div className="text-center">
              <p className="font-bold">{profile.stats.following}</p>
              <p className="text-text-secondary text-sm">팔로잉</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{profile.stats.followers}</p>
              <p className="text-text-secondary text-sm">팔로워</p>
            </div>
            <div className="text-center">
              <p className="font-bold">{profile.stats.playlists}</p>
              <p className="text-text-secondary text-sm">플레이리스트</p>
            </div>
          </div>
        </section>

        {/* 설정 섹션 */}
        <section className="bg-card-bg rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border-color">
            <h2 className="text-lg font-bold">설정</h2>
          </div>

          <div className="divide-y divide-border-color">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <IoMailOutline size={20} className="text-text-secondary" />
                <span>{profile.email}</span>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <IoCalendarOutline size={20} className="text-text-secondary" />
                <span>가입일: {profile.joinDate}</span>
              </div>
            </div>

            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <IoSettingsOutline size={20} className="text-text-secondary" />
                <span>다크 모드</span>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </section>

        {/* 앱 정보 */}
        <section className="bg-card-bg rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border-color">
            <h2 className="text-lg font-bold">앱 정보</h2>
          </div>

          <div className="divide-y divide-border-color">
            <Link href="#" className="p-4 flex justify-between items-center">
              <span>개인정보 처리방침</span>
            </Link>

            <Link href="#" className="p-4 flex justify-between items-center">
              <span>서비스 이용약관</span>
            </Link>

            <div className="p-4 flex justify-between items-center">
              <span>버전</span>
              <span className="text-text-secondary">1.0.0</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
