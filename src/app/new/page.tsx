import Header from "@/components/Header";
import { NewPage } from "@/features/new/NewPage";
import { Suspense } from "react";

export default function NewPageRoute() {
  return (
    <>
      <Header title="신곡" />
      <Suspense fallback={null}>
        <NewPage />
      </Suspense>
    </>
  );
}
