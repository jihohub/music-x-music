/**
 * 숫자를 한국어 형식으로 포맷팅합니다 (천 단위 콤마)
 */
export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

/**
 * 날짜를 한국어 형식으로 포맷팅합니다 (YYYY년 MM월 DD일)
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * 시간(밀리초)를 mm:ss 형식으로 포맷팅합니다
 */
export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
