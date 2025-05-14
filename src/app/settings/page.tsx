"use client";

import Header from "@/components/Header";
import ThemeToggle from "@/components/ThemeToggle";
import { IoSettingsOutline } from "react-icons/io5";

export default function SettingsPage() {
  return (
    <>
      <Header title="설정" />
      <div className="py-6 space-y-8">
        {/* 설정 섹션 */}
        <section className="bg-card-bg rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border-color">
            <h2 className="text-lg font-bold">설정</h2>
          </div>

          <div className="divide-y divide-border-color">
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
            {/* <Link href="#" className="p-4 flex justify-between items-center">
              <span>개인정보 처리방침</span>
            </Link>

            <Link href="#" className="p-4 flex justify-between items-center">
              <span>서비스 이용약관</span>
            </Link> */}

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
