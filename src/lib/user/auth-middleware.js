import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { verifyToken } from "../jwt"

// NextAuth-based authentication middleware
export function withNextAuth(handler) {
    return async (request, context) => {
        try {
            const token = await getToken({
                req: request,
                secret: process.env.NEXTAUTH_SECRET,
            })

            if (!token) {
                return NextResponse.json({ error: "Authentication required" }, { status: 401 })
            }

            // Attach user info to request
            request.user = {
                id: token.id,
                name: token.name,
                email: token.email,
                role: token.role,
                image: token.image,
            }

            return handler(request, context)
        } catch (error) {
            console.error("Authentication error:", error)
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
        }
    }
}

// JWT-based authentication middleware (for custom tokens)
export function withAuth(handler) {
    return async (request, context) => {
        try {
            const authHeader = request.headers.get("authorization")

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return NextResponse.json({ error: "Access token required" }, { status: 401 })
            }

            const accessToken = authHeader.substring(7)
            const decoded = verifyToken(accessToken)

            if (!decoded) {
                return NextResponse.json({ error: "Invalid or expired access token" }, { status: 401 })
            }

            // Remove password before attaching user info to request
            const { password, ...userWithoutPassword } = decoded
            request.user = userWithoutPassword

            return handler(request, context)
        } catch (error) {
            console.error("JWT Authentication error:", error)
            return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
        }
    }
}

// Role-based middleware for NextAuth
export function withNextAuthRole(roles) {
    return (handler) =>
        withNextAuth(async (request, context) => {
            if (!roles.includes(request.user.role)) {
                return NextResponse.json(
                    {
                        error: "Insufficient permissions",
                        required: roles,
                        current: request.user.role,
                    },
                    { status: 403 },
                )
            }
            return handler(request, context)
        })
}

// Role-based middleware for JWT
export function withRole(roles) {
    return (handler) =>
        withAuth(async (request, context) => {
            const userRole = request.headers.get("x-user-role")

            if (!userRole || !roles.includes(userRole)) {
                return NextResponse.json(
                    {
                        error: "Insufficient permissions",
                        required: roles,
                        current: userRole,
                    },
                    { status: 403 }
                )
            }

            return handler(request, context)
        })
}
// Alternative: More flexible role checking - FIXED
export function withRoles(...roles) {
    return (handler) =>
        withAuth(async (request, context) => {
            const userRole = request.user.role

            if (!roles.includes(userRole)) {
                return NextResponse.json(
                    {
                        error: "Insufficient permissions",
                        required: roles,
                        current: userRole,
                    },
                    { status: 403 },
                )
            }

            return handler(request, context)
        })
}

// Admin-only middleware
export const withAdmin = withNextAuthRole(["admin"])
export const withAdminOrEditor = withNextAuthRole(["ADMIN", "EDITOR"])

// JWT versions
export const withAuthAdmin = withRole(["admin"])
export const withAuthAdminOrEditor = withRole(["ADMIN", "EDITOR"])

// Permission-based middleware for NextAuth
export function withNextAuthPermissions(permissions) {
    return (handler) =>
        withNextAuth(async (request, context) => {
            const userPermissions = request.user.permissions || []
            const hasPermission = permissions.every((permission) => userPermissions.includes(permission))

            if (!hasPermission) {
                return NextResponse.json(
                    {
                        error: "Insufficient permissions",
                        required: permissions,
                        current: userPermissions,
                    },
                    { status: 403 },
                )
            }

            return handler(request, context)
        })
}
