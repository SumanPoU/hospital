// app/(home)/auth/page.tsx
import { Suspense } from "react";
import AuthPage from "./_components/AuthComponents";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
}
