import { NextResponse } from "next/server";
import db from "@/lib/db";
import { sendVerificationEmail } from "@/lib/user/register/email";
import { sendVerificationSMS } from "@/lib/user/register/phone";
import {
    generateVerificationCode,
    isValidEmail,
    isValidPhoneNumber
} from "@/lib/user/authHelpers";
import { TokenType } from "@/lib/enums/enums";

export const dynamic = 'force-dynamic';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, phone } = body;

        if (!email && !phone) {
            return NextResponse.json({ error: "Email or phone number is required." }, { status: 400 });
        }

        // Validate email or phone format
        if (email && !isValidEmail(email)) {
            return NextResponse.json({ error: "Invalid email format." }, { status: 400 });
        }
        if (phone && !isValidPhoneNumber(phone)) {
            return NextResponse.json({ error: "Invalid phone number format." }, { status: 400 });
        }

        // Find user by email or phone
        const user = await db.user.findFirst({
            where: {
                OR: [
                    email ? { email } : undefined,
                    phone ? { phone } : undefined
                ].filter(Boolean),
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }

        // Generate verification code and expiry
        const verificationCode = generateVerificationCode();
        const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

        // Determine token type
        const tokenType = email ? TokenType.EMAIL_VERIFICATION : TokenType.PHONE_VERIFICATION;

        // Create a new verification token record
        await db.verificationToken.create({
            data: {
                userId: user.id,
                token: verificationCode,
                type: tokenType,
                expires: expiry,
            },
        });

        // Send verification via email or SMS
        if (email) {
            await sendVerificationEmail(email, verificationCode);
        } else if (phone) {
            await sendVerificationSMS(phone, verificationCode);
        }

        return NextResponse.json({
            message: `Verification ${email ? "email" : "SMS"} sent. Please check your ${email ? "inbox" : "phone"}.`
        }, { status: 200 });

    } catch (error) {
        console.error("Resend verification code error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
