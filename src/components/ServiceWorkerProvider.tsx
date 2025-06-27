"use client";

import { registerSW } from "@/utils/registerSW";
import { useEffect } from "react";

/**
 * Service Worker 등록 컴포넌트
 * 클라이언트 사이드에서만 실행되어야 하므로 별도 컴포넌트로 분리
 */
export default function ServiceWorkerProvider() {
  useEffect(() => {
    registerSW();
  }, []);

  return null;
}
