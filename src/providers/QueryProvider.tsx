"use client";

import { getMainPageData } from "@/features/main/queries/getMainPageData";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect, useState } from "react";

const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5분
        gcTime: 1000 * 60 * 30, // 30분
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => createQueryClient());

  // 앱 시작시 메인페이지 데이터 prefetch
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["main-page-data"],
      queryFn: getMainPageData,
      staleTime: 1000 * 60 * 30, // 30분
    });
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
