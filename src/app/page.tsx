import MainPage from "@/features/main/MainPage";
import { getMainPageDataServer } from "@/features/main/queries/getMainPageDataServer";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";

// SSG: 빌드 시점에 데이터 미리 가져오기 (성능 향상)
export default async function Home() {
  const queryClient = new QueryClient();

  // 빌드 시점에 메인페이지 데이터 prefetch
  try {
    await queryClient.prefetchQuery({
      queryKey: ["main-page-data"],
      queryFn: getMainPageDataServer,
      staleTime: Infinity, // SSG이므로 무한대로 설정
    });

    console.log("SSG 빌드 완료: 메인페이지 데이터 생성됨");
  } catch (error) {
    console.error("SSG 데이터 prefetch 실패 (CSR로 폴백):", error);
    // 에러가 발생해도 빈 페이지는 제공하되, 클라이언트에서 다시 로딩
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MainPage />
    </HydrationBoundary>
  );
}

// ISR: 1시간마다 재생성 (데이터가 변경될 가능성 고려)
export const revalidate = 3600;
