import { NextResponse } from "next/server";
import db from "@/lib/db";
import { withRole } from "@/lib/user/auth-middleware";

export const dynamic = "force-dynamic";

export const GET = withRole(["ADMIN"])(async (request) => {
  try {
    const users = await db.user.findMany({
      where: {
        isDeleted: false,   // ✅ Exclude deleted users
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        phoneVerified: true,
        isDeleted: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      { success: true, message: "Users fetched successfully", data: users, total: users.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get all users error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
