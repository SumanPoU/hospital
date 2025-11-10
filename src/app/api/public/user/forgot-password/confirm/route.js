import { NextResponse } from "next/server";
import db from "@/lib/db";
import bcryptjs from "bcryptjs";
import {
    isValidEmail,
    isValidPhoneNumber,
    isStrongPassword
} from "@/lib/user/authHelpers";
import { TokenType } from "@/lib/enums/enums";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const { email, phone, code, newPassword, confirmPassword } = await request.json();

        if ((!email && !phone) || !code || !newPassword || !confirmPassword) {
            return NextResponse.json({
                error: "Email or phone, code, new password, and confirmation are required."
            }, { status: 400 });
        }

        if (email && !isValidEmail(email)) {
            return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
        }

        if (phone && !isValidPhoneNumber(phone)) {
            return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
        }

        if (newPassword !== confirmPassword) {
            return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
        }

        if (!isStrongPassword(newPassword)) {
            return NextResponse.json({
                error: "Password must be at least 6 characters and include uppercase, lowercase, number, and special character."
            }, { status: 400 });
        }

        // Get user by email or phone
        const user = await db.user.findFirst({
            where: {
                OR: [
                    email ? { email } : undefined,
                    phone ? { phone } : undefined
                ].filter(Boolean)
            }
        });

        if (!user || user.isDeleted) {
            return NextResponse.json({ error: "User not found or is deleted." }, { status: 404 });
        }

        const now = new Date();

        const tokenEntry = await db.verificationToken.findFirst({
            where: {
                userId: user.id,
                token: code,
                type: TokenType.PASSWORD_RESET,
                expires: { gt: now }
            }
        });

        if (!tokenEntry) {
            return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
        }

        // Hash and update password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        await db.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword
            }
        });

        // Delete used token
        await db.verificationToken.delete({
            where: { id: tokenEntry.id }
        });

        return NextResponse.json({ message: "Password has been successfully reset." }, { status: 200 });
    } catch (error) {
        console.error("Password reset confirmation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
