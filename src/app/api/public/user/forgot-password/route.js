import { NextResponse } from "next/server";
import db from "@/lib/db";
import {
    isValidEmail,
    isValidPhoneNumber,
    generateVerificationCode,
} from "@/lib/user/authHelpers";
import { TokenType } from "@/lib/enums/enums";
import { sendPasswordResetVerificationEmail } from "@/lib/user/register/email";
import { sendPasswordResetVerificationSMS } from "@/lib/user/register/phone";

export const dynamic = "force-dynamic";

export async function POST(request) {
    try {
        const { email, phone } = await request.json();

        if (!email && !phone) {
            return NextResponse.json(
                { error: "Email or phone is required." },
                { status: 400 }
            );
        }

        let user;

        // Validate and fetch user
        if (email) {
            if (!isValidEmail(email)) {
                return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
            }

            user = await db.user.findUnique({ where: { email } });

            if (!user?.emailVerified) {
                return NextResponse.json(
                    { error: "Email is not verified or user does not exist." },
                    { status: 403 }
                );
            }
        } else if (phone) {
            if (!isValidPhoneNumber(phone)) {
                return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
            }

            user = await db.user.findUnique({ where: { phone } });

            if (!user?.phoneVerified) {
                return NextResponse.json(
                    { error: "Phone is not verified or user does not exist." },
                    { status: 403 }
                );
            }
        }

        if (!user || user.isDeleted) {
            return NextResponse.json(
                { error: "User not found or is deleted." },
                { status: 404 }
            );
        }

        const now = new Date();

        // Clean up expired tokens
        await db.verificationToken.deleteMany({
            where: {
                userId: user.id,
                type: TokenType.PASSWORD_RESET,
                expires: { lt: now },
            },
        });

        // Check for existing valid token
        const existingToken = await db.verificationToken.findFirst({
            where: {
                userId: user.id,
                type: TokenType.PASSWORD_RESET,
                expires: { gt: now },
            },
        });

        if (existingToken) {
            const secondsLeft = Math.ceil((existingToken.expires.getTime() - now.getTime()) / 1000);
            return NextResponse.json(
                {
                    error: `A verification code was already sent. Please wait ${secondsLeft} seconds before requesting a new one.`,
                },
                { status: 429 }
            );
        }

        // Generate and store new token
        const verificationCode = generateVerificationCode(); // 6-digit alphanumeric
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

        await db.verificationToken.create({
            data: {
                userId: user.id,
                token: verificationCode,
                type: TokenType.PASSWORD_RESET,
                expires: expiry,
            },
        });

        // Send the code
        if (email) {
            await sendPasswordResetVerificationEmail(email, verificationCode);
        } else if (phone) {
            await sendPasswordResetVerificationSMS(phone, verificationCode);
        }

        return NextResponse.json(
            {
                message: `Verification code sent to your ${email ? "email" : "phone"}.`,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Password reset error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
