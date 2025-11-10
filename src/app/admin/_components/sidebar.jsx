"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  User,
  ChevronDown,
  ChevronRight,
  LogOut,
  Crown,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Badge } from "@/components/ui/badge";
import { sidebarData } from "./sidebar-data";



export function AdminSidebar({ user, userRole, ...props }) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth?tab=login" });
  };

  const isParentActive = (item) => {
    if (item.isCollapsible && item.items) {
      return item.items.some((subItem) => pathname === subItem.url);
    }
    return pathname === item.url;
  };

  const shouldBeOpen = (item) => {
    if (item.isCollapsible && item.items) {
      return item.items.some((subItem) => pathname === subItem.url);
    }
    return false;
  };

  return (
    <Sidebar variant="inset" className="border-r-0" {...props}>
      <SidebarHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
                  <LayoutDashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">Admin Panel</span>
                  <div className="flex items-center gap-1">
                    <Crown className="size-3 text-amber-600" />
                    <span className="truncate text-xs font-medium text-amber-600">
                      Admin
                    </span>
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {sidebarData.navMain.map((section) => (
          <SidebarGroup key={section.title} className="py-2">
            <SidebarGroupLabel className="text-xs font-bold text-muted-foreground/80 uppercase px-2 mb-2">
              {section.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {section.items.map((item) => {
                  if (item.isCollapsible && item.items) {
                    return (
                      <Collapsible
                        key={item.title}
                        asChild
                        defaultOpen={shouldBeOpen(item)}
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton isActive={isParentActive(item)}>
                              <item.icon className="size-4" />
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto size-4" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub className="ml-4 mt-1 space-y-1">
                              {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={pathname === subItem.url}
                                  >
                                    <a
                                      href={subItem.url}
                                      className="flex items-center gap-2"
                                    >
                                      <subItem.icon className="size-4" />
                                      <span>{subItem.title}</span>
                                    </a>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  } else {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.url}
                        >
                          <a
                            href={item.url}
                            className="flex items-center gap-2"
                          >
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </a>
                        </SidebarMenuButton>
                        {item.badge && (
                          <SidebarMenuBadge className="bg-primary/10 text-primary text-xs font-medium">
                            {item.badge}
                          </SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>
                    );
                  }
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t bg-gradient-to-r from-muted/30 to-muted/50 p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <div className="relative">
                    <Avatar className="h-8 w-8 rounded-lg border-2 border-primary/20">
                      <AvatarImage
                        src={
                          user?.user?.image ||
                          "/placeholder.svg?height=32&width=32"
                        }
                        alt={user?.user?.name || "User"}
                      />
                      <AvatarFallback className="rounded-lg bg-primary/10 font-bold text-primary">
                        {user?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="grid flex-1 text-left text-sm">
                    <span className="truncate font-semibold">
                      {user?.user?.name || "User"}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user?.user?.email || "user@example.com"}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4 text-muted-foreground" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg border shadow-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <a href="/admin/account" className="flex items-center gap-2">
                    <User className="size-4" />
                    Account Settings
                  </a>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
