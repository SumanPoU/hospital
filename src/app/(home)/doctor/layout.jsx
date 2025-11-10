// app/user/page.tsx or wherever your page is
import { Suspense } from "react";
import UserDashboardLayoutClient from "./client-layout";

export default function PageWrapper({ children }) {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserDashboardLayoutClient>{children}</UserDashboardLayoutClient>
    </Suspense>
  );
}
