export function registerSW() {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW 등록 성공:", registration);
        })
        .catch((error) => {
          console.log("SW 등록 실패:", error);
        });
    });
  }
}
