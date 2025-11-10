"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminSidebar } from "./_components/sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Loader2, Menu } from "lucide-react";
import { sidebarData } from "./_components/sidebar-data";

// ✅ Uses sidebarData
const getBreadcrumbs = (pathname) => {
  const breadcrumbs = [{ label: "Admin", href: "/admin" }];

  sidebarData.navMain.forEach((group) => {
    group.items.forEach((item) => {
      if (pathname.startsWith(item.url)) {
        breadcrumbs.push({ label: item.title, href: item.url });
      }
    });
  });

  return breadcrumbs;
};

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  const breadcrumbs = getBreadcrumbs(pathname);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.replace("/auth?tab=login");
      return;
    }

    if (!["ADMIN"].includes(session.user.role)) {
      router.replace("/access-denied");
      return;
    }

    setIsLoading(false);
  }, [session, status, router]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-background/80 backdrop-blur-sm border shadow-2xl">
          <Loader2 className="relative h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-semibold text-foreground nunito-text">
            Loading Admin Panel
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <SidebarProvider>
      <AdminSidebar user={session} userRole={session.user.role} />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 items-center gap-2 border-b bg-background/95 backdrop-blur">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1 h-8 w-8" />
            <Separator orientation="vertical" className="mr-2 h-4" />

            <Breadcrumb className="flex-1">
              <BreadcrumbList className="nunito-text">
                {breadcrumbs.map((c, index) => (
                  <div key={c.href} className="flex items-center">
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{c.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={c.href}>
                          {c.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                ))}
              </BreadcrumbList>
            </Breadcrumb>

            <div className="md:hidden flex items-center gap-2 text-xs text-muted-foreground nunito-text">
              <Menu className="h-4 w-4" />
              <span>{session.user.role}</span>
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 pt-6 lg:p-6">
          <div className="min-h-[calc(100vh-8rem)] flex-1 rounded-xl border shadow-sm">
            <div className="container max-w-7xl mx-auto p-6 lg:p-8 h-full">
              <div className="text-nunito!">{children}</div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
