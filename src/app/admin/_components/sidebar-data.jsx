import {
  LayoutDashboard,
  Users,
} from "lucide-react";

export const sidebarData = {
  navMain: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/admin",
          icon: LayoutDashboard,
          badge: "New",
        },
      ],
    },
    {
      title: "User Management",
      items: [
        {
          title: "Users",
          url: "/admin/users",
          icon: Users,
        },
      ],
    },
  ],
};