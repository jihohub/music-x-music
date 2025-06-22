"use client";

import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";

      // 스크롤 변화량이 충분할 때만 방향 업데이트 (노이즈 방지)
      if (Math.abs(scrollY - lastScrollY) > 10) {
        setScrollDirection(direction);
        setLastScrollY(scrollY > 0 ? scrollY : 0);
      }
    };

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", updateScrollDirection);

    return () => {
      // 클린업
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [lastScrollY]);

  return scrollDirection;
}
