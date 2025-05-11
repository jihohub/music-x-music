"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
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
  );
}
