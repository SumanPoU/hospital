import { NextResponse } from "next/server"
import db from "@/lib/db"
import { withRole } from "@/lib/user/auth-middleware"

export const dynamic = "force-dynamic"

export const PATCH = withRole(["ADMIN"])(async (request, context) => {
    try {
        const params = await context.params
        const id = params?.id

        if (!id) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
        }

        const { role } = await request.json()

        if (!role) {
            return NextResponse.json({ success: false, message: "Role is required" }, { status: 400 })
        }

        const allowedRoles = ["USER", "DOCTOR", "ADMIN"]
        if (!allowedRoles.includes(role)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid role. Allowed: USER, DOCTOR, ADMIN",
                },
                { status: 400 },
            )
        }

        const user = await db.user.update({
            where: { id },
            data: { role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                updatedAt: true,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: "User role updated successfully",
                data: user,
            },
            { status: 200 },
        )
    } catch (error) {
        console.log("Error updating user role:", error)
        return NextResponse.json(
            {
                success: false,
                message: "Error updating user role",
                error: error?.message || error,
            },
            { status: 500 },
        )
    }
})
