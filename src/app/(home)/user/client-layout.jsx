// app/user/client-layout.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Menu, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import { toast } from "react-toastify";

const tabs = [
    { id: "details", label: "Details", icon: User, path: "/user" },
];

export default function UserDashboardLayoutClient({ children }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { data: session } = useSession();

    // Determine active tab
    const currentTab = searchParams.get("tab") || "";
    const activeTab = currentTab || tabs.find((t) => t.path === pathname)?.id;

    // Logout function
    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: "/auth?tab=login" });
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Failed to logout. Please try again.");
        }
    };

    const handleTabChange = (tab) => {
        setSidebarOpen(false);
        router.push(tab.path);
    };

    const SidebarContent = () => (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-foreground">Account</h2>
                <p className="text-sm text-muted-foreground">Manage your profile</p>
            </div>

            {/* Tabs */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <li key={tab.id}>
                                <button
                                    onClick={() => handleTabChange(tab)}
                                    className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 ${isActive
                                            ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {tab.label}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
                <Button
                    onClick={handleLogout}
                    variant="destructive"
                    className="w-full flex items-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-background source-serif-text">
            <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Mobile Header + Sidebar */}
                    <div className="md:hidden flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-foreground">My Account</h1>
                        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Menu className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-80 p-0">
                                <SidebarContent />
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block md:w-64 lg:w-72 xl:w-80 h-fit bg-card shadow-sm rounded-xl border flex-shrink-0 sticky top-6">
                        <SidebarContent />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-card rounded-xl shadow-sm p-6 min-h-[400px]">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
