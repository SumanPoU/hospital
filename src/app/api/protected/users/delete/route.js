import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { withRole } from "@/lib/user/auth-middleware";

export const dynamic = "force-dynamic";

// Only ADMIN can delete users
export const PATCH = withRole(["ADMIN"])(async (req) => {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        // Soft delete user
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { isDeleted: true },
            select: { id: true, name: true, email: true, isDeleted: true },
        });

        return NextResponse.json({
            success: true,
            message: "User deleted successfully",
            data: updatedUser,
        });
    } catch (error) {
        console.error("Delete user error:", error);
        return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
});
