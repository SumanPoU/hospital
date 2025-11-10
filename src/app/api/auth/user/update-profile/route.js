import { NextResponse } from "next/server";
import db from "@/lib/db";
import { verifyToken } from "@/lib/jwt"; // Make sure you have this helper

export const dynamic = "force-dynamic";

/**
 * PUT /api/auth/user/update-profile
 * Updates a user's name, phone, or avatar.
 */
export async function PUT(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = await verifyToken(token);

    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { name, phone, avatar } = await request.json();

    const user = await db.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: name ?? user.name,
        phone: phone ?? user.phone,
        avatar: avatar ?? user.avatar,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
